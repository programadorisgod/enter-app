import express, { json, urlencoded } from 'express'
import cors from 'cors'

import morgan from 'morgan'
import helmet from 'helmet'
import { CustomErrorHandle } from './middleware/error.js'
import { router } from './users/routes/route.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import path from 'node:path'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

const PORT = process.env.PORT || process?.argv[3] || 3000
const filePath = path.join(process.cwd(), '/public', 'index.html')

app.use(cors({ origin: '*' }))
app.use(json())
app.use(urlencoded({ extended: true }))
//app.use(helmet())
app.disable('x-powered-by')
app.use(morgan('dev'))

app.use(router)
app.use('/socket', express.static(filePath))

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user exit')
    })
})

app.use((_req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.use(CustomErrorHandle)

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
