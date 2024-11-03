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
        'INSERT INTO users (user_id, username, recovery_key, group_id, ip) values ($1, $2, $3, $4, $5)'

    const values = [userId, username, recoveryKey, null, ip]

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

export const deleteUserByUsernameService = async ({ username }) => {
    if (!username) throw new BAD_REQUEST_ERROR('username empty', 400)
    const userExist = await getUserByUsernameService({ username })

    if (userExist.result == 0) throw new NOT_FOUND_ERROR('user not found')

    const sql = 'DELETE FROM USERS WHERE username = $1'
    const values = [username]

    const userDeleted = await db.query({ sql, values })

    return userDeleted.result
}
