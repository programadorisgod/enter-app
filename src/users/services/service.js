import { Database } from '../../config/database/postgres'

const db = Database.getInstance()
export const createUserService = async ({ username = {}, ip = '' }) => {
    const id_user = '###'
    const passwordRecovery = '###'

    const sql = 'INSERT INTO users (id_user, username,recovery_key, id_group)'
    const values = [id_user, username, passwordRecovery, ip]

    const newUser = await db.query({ sql, values })

    return newUser
}
