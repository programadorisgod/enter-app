import { getUserByIdService } from '../../users/services/service.js'
import { Database } from '../../config/database/postgres.js'
import { NOT_FOUND_ERROR } from 'apicustomerrors'

const db = Database.getInstance()

export const saveMessage = async ({
    idUserSend,
    idUserReceiver,
    message,
    date,
}) => {
    const userSend = await getUserByIdService({ userId: idUserSend })

    if (userSend.result == 0) return 'user not found'

    const userReciver = await getUserByIdService({ userId: idUserReceiver })

    if (userReciver.result == 0) return 'user reciver not found'
    /*
    const sql =
        'SELECT contact_user_id FROM contacts WHERE user_id = $1 AND contact_user_id = $2'
    const values = [idUserSend, idUserReceiver]

    const contactAdded = await db.query({ sql, values })

    if (contactAdded.result == 0) return 'the contact has not been added'
*/
    const sql1 =
        'INSERT INTO messages (id_user_send, id_user_receiver, group_id, message, datetime) VALUES ($1, $2, $3, $4, $5) RETURNING *'

    const values1 = [idUserSend, idUserReceiver, null, message, date]
    const savedMessage = await db.query({ sql: sql1, values: values1 })

    if (savedMessage.result == 0) return 'Error saving message'

    return {
        message,
        messageId: savedMessage?.data?.id_message,
    }
}

export const getChatsService = async ({ userId }) => {
    const userExist = await getUserByIdService({ userId })

    if (userExist.result == 0) throw new NOT_FOUND_ERROR('user not found')

    const sql = `SELECT c.contact_user_id, u.username
                FROM contacts c
                JOIN users u
                ON c.contact_user_id = u.user_id
                WHERE c.user_id = $1`
    const values = [userId]

    const chats = await db.query({ sql, values })

    return {
        msg: chats?.data,
    }
}

export const getChatService = async ({ userId, userReceiverId }) => {
    const userSend = await getUserByIdService({ userId })

    if (userSend.result == 0) return 'user not found'

    const userContact = await getUserByIdService({ userId: userReceiverId })

    if (userContact.result == 0) return 'user receiver not found'

    const sql = `SELECT 
                        m.message, 
                        m.datetime,
                        sender.username AS sender,
                        receiver.username AS receiver
                  FROM 
                        messages m
                  JOIN 
                        users sender ON m.id_user_send = sender.user_id
                  JOIN
                        users receiver ON m.id_user_receiver = receiver.user_id
                  WHERE 
                        m.id_user_send = $1 AND m.id_user_receiver = $2
                      OR m.id_user_send = $2 AND m.id_user_receiver = $1
                  ORDER BY 
                      m.datetime ASC
                  `

    const values = [userId, userReceiverId]
    const messages = await db.query({ sql: sql, values: values })

    return {
        msg: messages.data,
    }
}
