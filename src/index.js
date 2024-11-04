import express, { json, urlencoded } from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import path from 'node:path'
import morgan from 'morgan'
import helmet from 'helmet'
import { networkInterfaces } from 'node:os'

import { CustomErrorHandle } from './middleware/error.js'
import { router } from './users/routes/route.js'
import { addContactService } from './users/services/service.js'
import { saveMessage } from './chats/service/chat.js'
import { savedFile } from './users/utils/saveFile.js'
import { fileRouter } from './file/router/route.js'
import { chatRouter } from './chats/router/chat.js'
import { savedFileDatabase } from './file/controller/controller.js'

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
app.use(fileRouter)
app.use(chatRouter)
app.use('/socket', express.static(filePath))

io.on('connection', (socket) => {
    console.log('user connect', socket.id)
    socket.on('chat message', async (info) => {
        const { idUserSend, idUserReciver, message, date, fileName, fileData } =
            info

        const savedMessage = await saveMessage({
            idUserSend,
            idUserReciver,
            message,
            date,
        })

        if (savedMessage instanceof Error) {
            socket.emit({ msg: savedMessage?.message })
        }

        if (fileName && filePath) {
            const { messageId } = savedMessage

            const { filePath } = await savedFile({
                fileName,
                fileData,
            })

            const result = await savedFileDatabase({
                messageId,
                filePath,
                fileName,
                userId: idUserSend,
            })
            if (result?.error) return socket.emit('chat message', message)

            socket.emit('chat message', 'file upload')
        }

        socket.emit('chat message', message)
    })

    socket.on('add', async (data) => {
        const { userId, contactUserId } = data

        const contactAdded = await addContactService({ userId, contactUserId })

        if (contactAdded instanceof Error) {
            socket.emit({ msg: contactAdded?.message })
        }

        socket.emit('contact Added', contactAdded)
    })
    socket.on('disconnect', () => {
        console.log('user exit', socket.id)
    })
})

app.use((_req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.use(CustomErrorHandle)

if (process.env.NODE_ENV === 'development') {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`)

        // Mostrar la IP local del servidor para facilitar el acceso

        const nets = networkInterfaces()

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Saltarse las direcciones non-IPv4 y las interfaces de loopback
                if (net.family === 'IPv4' && !net.internal) {
                    console.log(
                        `Accede desde otros dispositivos usando: http://${net.address}:${PORT}`
                    )
                }
            }
        }
    })
} else {
    server.listen(PORT, () => {
        console.log('Server is running')
    })
}

process.on('uncaughtException', (err) => {
    console.log('err:', err)
})
