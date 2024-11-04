import { getChatsService } from '../service/chat.js'

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
