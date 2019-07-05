const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
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
        unique: true,
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

    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, 'thisisasecretpassword', {
        expiresIn: '7 days'
    })
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if (!isMatch) {
        throw new Error('Unable to login!')
    }
    console.log(user)
    return user
}

// Has before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        console.log('Hashing', user.password)
    }

})

const User = mongoose.model('User', userSchema)

module.exports = User