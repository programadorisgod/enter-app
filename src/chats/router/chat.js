import { Router } from 'express'
import { BASE_URL } from '../../CONSTANTS/constant.js'
import { getChats } from '../controller/chat.js'

const chatRouter = Router()

chatRouter.get(`${BASE_URL}/chats/:userId`, getChats)

export { chatRouter }
