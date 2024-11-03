import express, { json } from 'express'
import cors from 'cors'

import morgan from 'morgan'
import helmet from 'helmet'
import { CustomErrorHandle } from './middleware/error.js'
import { router } from './users/routes/route.js'
import { router as fileRouter } from './file/router/route.js'

const app = express()

const PORT = process.env.PORT || process?.argv[3] || 3000

app.use(cors({ origin: '*' }))
app.use(json())
app.use(helmet())
app.disable('x-powered-by')
app.use(morgan('dev'))

app.use(router)
app.use(fileRouter)

app.use((_req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.use(CustomErrorHandle)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
