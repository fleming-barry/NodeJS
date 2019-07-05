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
// GET /tasks?completed=true/false&skip=2&limit=2
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', Auth.auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //  populating virtual properties on mongoose model
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
         res.send(req.user.tasks)

        // const tasks = await Task.find({
        //     userId: req.user._id
        // })
        // res.send(tasks)
    } catch (e) {
        console.log(e)
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