const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try {
        const token = await getToken(req)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

const getToken = async (req) => { 
    return req.header('Authorization').replace('Bearer ', '')
}

module.exports = { auth, getToken }