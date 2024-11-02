import express from 'express'
import cors from 'cors'

import { Database } from './config/database/postgres.js'
import morgan from 'morgan'
import helmet from 'helmet'
import { BAD_REQUEST_ERROR } from 'apicustomerrors'
import { CustomErrorHandle } from './middleware/error.js'

const app = express()

const PORT = process.env.PORT || process?.argv[3] || 3000

const db = Database.getInstance()

app.use(cors({ origin: '*' }))
app.use(helmet())
app.disable('x-powered-by')
app.use(morgan('dev'))
app.use((_req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})
app.use(CustomErrorHandle)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
