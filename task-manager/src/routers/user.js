const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
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

router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.put('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid Update'
        })
    }
    try {
        const user = await User.findById(req.params.id, req.body)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(400).send()
        }

        return res.send(user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router