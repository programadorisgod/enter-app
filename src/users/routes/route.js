import {
    createUser,
    deleteUserByUsername,
    login,
    getUserByUsername,
} from '../controller/controller.js'
import { BASE_URL } from '../../CONSTANTS/constant.js'
import { Router } from 'express'

const router = Router()

router.get(`${BASE_URL}/users/:username`, getUserByUsername)
router.post(`${BASE_URL}/users/auth/login/:userId`, login)
router.post(`${BASE_URL}/users`, createUser)
router.delete(`${BASE_URL}/users/:username`, deleteUserByUsername)

export { router }
