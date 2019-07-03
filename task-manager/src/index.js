const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abdbdbad' }, 'thisismetestingitout', {expiresIn: '3 seconds'})
    console.log(token)

    const data = jwt.verify(token, 'thisismetestingitout')
    console.log(data)
}

myFunction()
app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})