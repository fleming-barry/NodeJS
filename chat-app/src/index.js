const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json())
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New Websocket Connection')

    socket.on('join', ({
        username,
        room
    }, cb) => {
        const {
            errors,
            user
        } = addUser({
            id: socket.id,
            username,
            room
        })
        console.log(user)
        console.log(errors)
        if (errors) {
            return cb(errors)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage(user.room, `Welcome! You have joined ${user.room}`))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.room, `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        cb()
    })

    socket.on('sendMessage', (message, cb) => {
        const filter = new Filter()
        const user = getUser(socket.id)
        if (filter.isProfane(message)) {
            return cb('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        cb()
    })

    socket.on('sendLocation', ({
        latitude,
        longitude
    }, cb) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
        cb('Location shared')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.room, `${user.username} has left.`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server up on port ${port}!`)
})