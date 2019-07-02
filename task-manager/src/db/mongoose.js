const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(val) {
            if (val.toLowerCase().includes('password')) {
                throw new Error('Can not contain the word password')
            }
        }

    }
})

const u = new User({
    name: '     Donut       ',
    email: 'DONUT@EMAIL.COM',
    age: 21,
    password: '   theMOSTUNSECUREPASSWORDEVER   '

})

// u.save().then((u) => {
//     console.log(u)
// }).catch((err) => {
//     console.log('Error', err)
// })

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const t = new Task({ description: '     Azure POC    '})

t.save().then((t) => { 
    console.log(t)
}).catch((err) => { 
    console.log('Error', err)
})