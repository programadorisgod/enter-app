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
