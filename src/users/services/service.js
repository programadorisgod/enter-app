import {
    BAD_REQUEST_ERROR,
    CONFLICT_ERROR,
    NOT_FOUND_ERROR,
} from 'apicustomerrors'
import { Database } from '../../config/database/postgres.js'
import { userIdGenerator } from '../utils/encript.js'
import { generateMnemonic } from 'bip39'

const db = Database.getInstance()

export const createUserService = async ({ username = {}, ip = '' }) => {
    const userExist = await getUserByUsernameService({ username })

    if (userExist.result == 1) throw new CONFLICT_ERROR('User exits')

    const userId = userIdGenerator(username)

    if (!userId) throw new BAD_REQUEST_ERROR('username empty', 400)

    const recoveryKey = generateMnemonic()

    const sql =
        'INSERT INTO users (user_id, username, recovery_key, group_id, ip, publicKey) values ($1, $2, $3, $4, $5, $6)'

    const values = [userId, username, recoveryKey, null, ip, null]

    await db.query({ sql, values })

    return {
        username,
        recoveryKey,
        userId,
    }
}

export const getUserByUsernameService = async ({ username }) => {
    if (!username) throw new BAD_REQUEST_ERROR('username empty', 400)

    const sql = 'SELECT * FROM users WHERE username = $1'
    const values = [username]

    const user = await db.query({ sql, values })

    return user
}

export const getUserByIdService = async ({ userId }) => {
    if (!userId) throw new BAD_REQUEST_ERROR('userId empty', 400)

    const sql = 'SELECT * FROM users WHERE user_id = $1'
    const values = [userId]

    const user = await db.query({ sql, values })

    return user
}
export const loginService = async ({ username, recoveryKey, userIp }) => {
    const userExist = await getUserByUsernameService({ username })

    if (userExist.result == 0) throw new NOT_FOUND_ERROR('user not founds')

    const { recovery_key, ip } = userExist?.data

    if (recovery_key != recoveryKey || userIp != ip)
        throw new BAD_REQUEST_ERROR('Values not valid', 400)

    return {
        userId: userExist.data.user_id,
        recoveryKey: userExist.data.recovery_key,
        username: userExist.data.username,
    }
}
export const deleteUserByUsernameService = async ({ username }) => {
    if (!username) throw new BAD_REQUEST_ERROR('username empty', 400)
    const userExist = await getUserByUsernameService({ username })

    if (userExist.result == 0) return 'user not found'

    const sql = 'DELETE FROM USERS WHERE username = $1'
    const values = [username]

    const userDeleted = await db.query({ sql, values })

    return userDeleted.result
}

export const addContactService = async ({ userId, contactUserId }) => {
    if (!userId || !contactUserId) return 'Values empty'

    const userExist = await getUserByIdService({ userId })

    if (userExist.result == 0) return 'user not found'

    if (userId === contactUserId)
        return { msg: 'You cannot be your own contact' }

    const contactExist = await getUserByIdService({ userId })

    if (contactExist.result == 0) return 'the user to add does not exist'

    const sql0 = `
           SELECT contact_user_id 
           FROM contacts
           WHERE contact_user_id = $1 
           AND  user_id = $2
    `
    const values0 = [contactUserId, userId]

    const contactExistAdded = await db.query({ sql: sql0, values: values0 })

    if (contactExistAdded?.result == 1) return 'Contact exits'

    const sql =
        'INSERT INTO contacts (user_id, contact_user_id) VALUES ($1, $2) RETURNING *'
    const values = [userId, contactUserId]

    const contactAdded = await db.query({ sql, values })

    if (contactAdded.result == 1) {
        const contact = await getUserByIdService({ userId: contactUserId })

        return {
            contact_user_id: contact?.data.user_id,
            username: contact?.data?.username,
        }
    }

    return 'error'
}
