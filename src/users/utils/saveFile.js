import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export const savedFile = async ({ fileName, fileData }) => {
    const filePath = path.join(process.cwd(), '/uploads', fileName)

    const data = Buffer.from(fileData)

    try {
        await writeFile(filePath, data)
        return {
            filePath,
        }
    } catch (error) {
        console.log('error')

        return {
            msg: 'Error saving file',
        }
    }
}
