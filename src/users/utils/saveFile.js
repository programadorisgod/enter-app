import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export const savedFile = async ({ fileData }) => {
    const pathFile = path.join(process.cwd(), '/uploads', fileData?.name)

    const data = Buffer.from(fileData.data)

    try {
        await writeFile(pathFile, data)
        return {
            pathFile,
            fileName: fileData?.name,
        }
    } catch (error) {
        console.log('error')

        return {
            msg: 'Error saving file',
        }
    }
}
