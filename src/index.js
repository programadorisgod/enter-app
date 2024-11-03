import express, { json, urlencoded } from 'express'
import cors from 'cors'

import morgan from 'morgan'
import helmet from 'helmet'
import { CustomErrorHandle } from './middleware/error.js'
import { router } from './users/routes/route.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import path from 'node:path'
import { addContactService } from './users/services/service.js'
import { saveMessage } from './chats/service/chat.js'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

const PORT = process.env.PORT || process?.argv[3] || 3000
const filePath = path.join(process.cwd(), 'public/')

app.use(
    cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(helmet())
app.disable('x-powered-by')
app.use(morgan('dev'))

app.use(router)
app.use('/socket', express.static(filePath))

io.on('connection', (socket) => {
    console.log('user connect', socket.id)
    socket.on('chat message', async (data) => {
        const { idUserSend, idUserReciver, message, date } = data
        console.log('data', data)

        const savedMessage = await saveMessage({
            idUserSend,
            idUserReciver,
            message,
            date,
        })

        if (savedMessage instanceof Error) {
            console.log(savedMessage.message, 'merror')

            socket.emit({ message: savedMessage?.message })
        }
    })
    socket.on('add', async (data) => {
        const { userId, contactUserId } = data
        console.log(userId, contactUserId)

        const userAdded = await addContactService({ userId, contactUserId })

        if (userAdded instanceof Error) {
            socket.emit({ message: userAdded?.message })
        }

        socket.emit(userAdded)
    })
    socket.on('disconnect', () => {
        console.log('user exit', socket.id)
    })
})

app.use((_req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.use(CustomErrorHandle)

server.listen(PORT, () => {
    console.log(`Server is running on http://192.168.56.1:${PORT}`)
})

process.on('uncaughtException', (err) => {
    console.log('err:', err)
})
