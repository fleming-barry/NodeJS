const supertest = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne,  userTwo, taskOne, populateDB} = require('./fixtures/db')

beforeEach(populateDB)

test('Should create a task for a user', async () => { 
    const res = await supertest(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    
    const task = await Task.findById(res.body._id)

    expect(task.completed).toBe(false)
})

test('Get all tasks for a user', async () => { 
    const res = await supertest(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(res.body.length).toBe(2)
})

test('Faile to delete if not associated', async () => { 
    const res = await supertest(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)
    
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

