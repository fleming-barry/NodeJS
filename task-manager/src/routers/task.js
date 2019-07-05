const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const Auth = require('../middleware/auth')

router.post('/tasks', Auth.auth, async (req, res) => {

    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        userId: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', Auth.auth, async (req, res) => {
    try {
        //  populating virtual properties on mongoose model
        //  await req.user.populate('tasks').execPopulate()
        //  res.send(req.user.tasks)

        const tasks = await Task.find({
            userId: req.user._id
        })
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', Auth.auth, async (req, res) => {
    const _id = req.params.id
    try {

        const task = await Task.findOne({
            _id,
            userId: req.user._id
        })
        if (!task) {
            return res.status(400).send()
        }
        return res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/tasks/:id', Auth.auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid Update'
        })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', Auth.auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        if (!task) {
            return res.status(400).send()
        }
        return res.send(task)
    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router