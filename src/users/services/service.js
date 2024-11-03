import { BAD_REQUEST_ERROR, CONFLICT_ERROR } from 'apicustomerrors'
import { Database } from '../../config/database/postgres.js'
import { decrypt, userIdGenerator } from '../utils/encript.js'
import { generateMnemonic } from 'bip39'

const db = Database.getInstance()

export const createUserService = async ({ username = {}, ip = '' }) => {
    const userExist = await getUserByUsernameService({ username })
    console.log(userExist)

    if (userExist == 1) throw new CONFLICT_ERROR('User exits')

    const user_id = userIdGenerator(username)

    if (!user_id) throw new BAD_REQUEST_ERROR('username empty', 400)

    const recovery_key = generateMnemonic()

    const sql =
        'INSERT INTO users (user_id, username, recovery_key, group_id, ip) values ($1, $2, $3, $4, $5)'

    const values = [user_id, username, recovery_key, null, ip]

    const newUser = await db.query({ sql, values })

    return newUser
}

export const getUserByUsernameService = async ({ username = '' }) => {
    const sql = 'SELECT username FROM users WHERE username = $1'
    const values = [username]

    const user = await db.query({ sql, values })

    return user
}
