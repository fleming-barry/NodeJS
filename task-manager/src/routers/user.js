const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({
            user: user,
            token: token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth.auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokens) => {
            return tokens.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth.auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/profile', auth.auth, async (req, res) => {
    res.send(req.user)
})

router.put('/users/profile', auth.auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid Update'
        })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/profile', auth.auth, async (req, res) => {
    try {
        await req.user.remove()
        return res.send(req.user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|tiff)$/)) {
            return cb(new Error('File must be a of type jpeg or jpg'))
        }

        cb(undefined, true)
    }
})

router.post('/users/profile/avatar', auth.auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({
        errors: [err.message]
    })
})

router.delete('/users/profile/avatar', auth.auth,  async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({
        errors: [err.message]
    })
})

router.get('/users/:id/avatar', async (req, res) => { 
    try {
        const user = await User.findById(req.params.id)
        
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router