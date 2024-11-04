import { Database } from '../../config/database/postgres.js'

const db = Database.getInstance()

export const savedFileDatabaseService = async ({
    messageId,
    filePath,
    fileName,
    userId,
}) => {
    const sql = `
        INSERT INTO files (file_name, route_file, user_id, message_id) VALUES ($1, $2, $3, $4)
        `
    const values = [fileName, filePath, userId, messageId]

    const savedFile = db.query({ sql, values })

    if (savedFile?.result == 1) return 'file saved'
}

export const getFilesService = async ({ userId }) => {
    const sql = 'SELECT * FROM files WHERE user_id = $1'
    const values = [userId]

    const files = await db.query({ sql, values })

    return files
}

export const getFileByName = async ({ file_name }) => {
    const sql = 'SELECT * FROM files WHERE file_name = $1'
    const values = [file_name]

    const file = await db.query({ sql, values })

    return file
}   
