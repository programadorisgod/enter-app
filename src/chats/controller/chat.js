import { getChatService, getChatsService } from '../service/chat.js'

export const getChats = async (req, res, next) => {
    const { userId } = req.params
    try {
        const chats = await getChatsService({ userId })
        if (chats instanceof Error) next(chats)

        res.status(200).json({ chats })
    } catch (error) {
        next(error)
    }
}

export const getChat = async (req, res, next) => {
    const { userId, userReceiverId } = req.params
    try {
        const chat = await getChatService({ userId, userReceiverId })
        if (chat instanceof Error) next(chat)
        res.status(200).json(chat)
    } catch (error) {
        next(error)
    }
}
