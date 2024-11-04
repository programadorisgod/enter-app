import { Router } from 'express'
import { BASE_URL } from '../../CONSTANTS/constant.js'
import { getChat, getChats } from '../controller/chat.js'

const chatRouter = Router()

chatRouter.get(`${BASE_URL}/chats/:userId`, getChats)
chatRouter.get(`${BASE_URL}/chats/:userId/:userReceiverId`, getChat)
export { chatRouter }
