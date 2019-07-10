const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Task Terry',
    email: 'taskterry@example.com',
    password: '123what!!!',
    tokens: [{
        token: jwt.sign({
            _id: userTwoId
        }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Task One',
    completed: false,
    userId: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Task Two',
    completed: true,
    userId: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Task Three',
    completed: false,
    userId: userTwo._id
}

const populateDB = async () => { 
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    populateDB
    
}