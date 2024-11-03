import { createUser } from '../controller/controller.js'
import { BASE_URL } from '../../CONSTANTS/constant.js'
import { Router } from 'express'

const router = Router()

router.post(`${BASE_URL}/users`, createUser)

export { router }
