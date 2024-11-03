import { NOT_FOUND_ERROR } from 'apicustomerrors'
import { getUserByIdService } from '../../users/services/service.js'
import { Database } from '../../config/database/postgres.js'

const db = Database.getInstance()

export const saveMessage = async ({
    idUserSend,
    idUserReciver,
    message,
    date,
}) => {
    const userSend = await getUserByIdService({ userId: idUserSend })

    if (userSend.result) return 'user not found'

    const userReciver = await getUserByIdService({ userId: idUserReciver })

    if (userReciver.result) return 'user not found'

    const sql = 'SELECT contact_user_id FROM contacts WHERE user_id = $1'
    const values = [idUserSend]

    const contactAdded = await db.query({ sql, values })

    if (contactAdded.result == 0) return 'the contact has not been added'

    const sql1 =
        'INSERT INTO messages (id_user_send, id_user_receiver, group_id, message, datetime) VALUES ($1, $2, $3, $4, $5)'

    const values1 = [idUserSend, idUserReciver, null, message, date]
    const savedMessage = await db.query({ sql: sql1, values: values1 })

    if (savedMessage.result == 0) return 'Error saving message'

    return 'Saved Message'
}
