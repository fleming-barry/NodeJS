const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Tester Terrance',
    email: 'terranceTest@example.com',
    password: '123what!',
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should sign up a new user', async () => {
    const res = await supertest(app).post('/users').send({
        name: 'Pizza Pete',
        password: 'Red1234!',
        email: 'pizzapete@example.com'
    }).expect(201)

    //Check the user was inserted into the DB
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(res.body.user.name).toBe('Pizza Pete')

    expect(res.body).toMatchObject({
        user: {
            name: 'Pizza Pete',
            email: 'pizzapete@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Red1234!')
})

test('Should login existing user', async () => {
    const res = await supertest(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    expect(res.body).toMatchObject({
        user: {
            name: 'Tester Terrance',
            email: 'terrancetest@example.com'
        }
    })

    const user = await User.findById(res.body.user._id)
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('Failed login for existing user', async () => {
    await supertest(app).post('/users/login').send({
        email: userOne.email,
        password: 'badpass'
    }).expect(400)
})

test('Get profile for exist user', async () => {
    await supertest(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile', async () => {
    await supertest(app)
        .get('/users/profile')
        .send()
        .expect(401)
})

test('Should delete a user', async () => {
    const res = await supertest(app)
        .delete('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete account for unathenticated user user', async () => {
    await supertest(app)
        .delete('/users/profile')
        .send()
        .expect(401)
})

test('Should upload an avatar image', async () => {
    await supertest(app)
        .post('/users/profile/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/22633253364339.593178069ff84.png')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => { 
    const changedUser = {
        name: 'Changed Terrance',
        email: 'changedterrance@example.com'
    }
    await supertest(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(changedUser)
        .expect(200)
    const user = await User.findById(userOneId)
    
    expect(user.name).toBe(changedUser.name)
    expect(user.email).toBe(changedUser.email)
})

test('Should not update invalid user fields', async () => { 
    await supertest(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({location: 'Cleveland'})
        .expect(400)
})