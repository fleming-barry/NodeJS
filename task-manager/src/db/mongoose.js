const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    } 
})

const u = new User({ name: 'Barry', age: 'mike' })

u.save().then((u) => { 
    console.log(u)
}).catch((err) => { 
    console.log('Error', err)
})

const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const t = new Task({ description: 'Making a test model', completed: true })

t.save().then((t) => { 
    console.log(t)
}).catch((err) => { 
    console.log('Error', err)
})