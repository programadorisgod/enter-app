import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'path'
import { savedFileDatabaseService } from '../services/file.js'

// Clave secreta
const secretKey = process.env.SECRET_KEY

export const savedFileDatabase = async ({
    messageId,
    filePath,
    fileName,
    userId,
}) => {
    try {
        const result = await savedFileDatabaseService({
            messageId,
            filePath,
            fileName,
            userId,
        })

        return result
    } catch (error) {
        return {
            error: true,
            message: 'error saving file',
        }
    }
}

export const encryptFiles = async (req, res) => {
    try {
        const files = req.files

        if (!files || files.length === 0) {
            return res
                .status(400)
                .json({ message: 'No se ha subido ningún archivo' })
        }

        // Procesar cada archivo en `req.files`
        const encriptados = await Promise.all(
            files.map(async (file) => {
                const iv = crypto.randomBytes(16) // Crear un IV único para cada archivo
                const cipher = crypto.createCipheriv(
                    'aes-256-cbc',
                    Buffer.from(secretKey, 'hex'),
                    iv
                )

                const uploadedFilePath = path.join(process.cwd(), file.path)

                // Definir ruta de salida para el archivo encriptado
                const encryptedFilePath = path.join(
                    process.cwd(),
                    `encrypted-files/${file.originalname}.enc`
                )

                return new Promise((resolve, reject) => {
                    // Crear streams
                    const input = fs.createReadStream(uploadedFilePath)
                    const output = fs.createWriteStream(encryptedFilePath)

                    // Escribir IV al inicio del archivo encriptado
                    output.write(iv)

                    // Encriptar el archivo
                    input.pipe(cipher).pipe(output)

                    output.on('finish', () => {
                        resolve(path.basename(encryptedFilePath))
                    })

                    input.on('error', (err) =>
                        reject(
                            `❌ Error al leer el archivo ${file.originalname}: ${err}`
                        )
                    )
                    output.on('error', (err) =>
                        reject(
                            `❌ Error al escribir el archivo ${file.originalname}: ${err}`
                        )
                    )
                })
            })
        )
        res.status(200).json({
            message: 'Archivos encriptados exitosamente',
            encriptados,
        })
    } catch (error) {
        console.error('❌ Error durante la encriptación:', error)
        res.status(500).json({ message: 'Error al encriptar los archivos' })
    }
}

export const decryptFiles = async (req, res) => {
    try {
        // Dividir los nombres de archivos separados por comas
        const files = req.params.namefile.split(',')

        if (!files || files.length === 0) {
            return res.status(400).json({
                message: 'No se han proporcionado archivos para desencriptar',
            })
        }

        const decryptedFiles = await Promise.all(
            files.map(
                (file) =>
                    new Promise((resolve, reject) => {
                        // Definir rutas del archivo encriptado y desencriptado
                        const encryptedFilePath = path.join(
                            process.cwd(),
                            'encrypted-files',
                            file.trim()
                        )
                        const decryptedFilePath = path.join(
                            process.cwd(),
                            'decrypted-files',
                            `decrypted-${file.replace('.enc', '').trim()}`
                        )

                        // Crear stream de entrada
                        const input = fs.createReadStream(encryptedFilePath)
                        const iv = Buffer.alloc(16)
                        let isFirstChunk = true
                        const chunks = []

                        input.on('data', (chunk) => {
                            if (isFirstChunk) {
                                // Extraer IV de los primeros 16 bytes
                                chunk.copy(iv, 0, 0, 16)
                                if (chunk.length > 16) {
                                    chunks.push(chunk.slice(16))
                                }
                                isFirstChunk = false

                                // Crear decipher con el IV
                                const decipher = crypto.createDecipheriv(
                                    'aes-256-cbc',
                                    Buffer.from(secretKey, 'hex'),
                                    iv
                                )
                                const output =
                                    fs.createWriteStream(decryptedFilePath)

                                console.log(
                                    `🔑 IV leído para ${file} y desencriptación iniciada`
                                )

                                // Procesar los datos almacenados
                                if (chunks.length > 0) {
                                    chunks.forEach((storedChunk) => {
                                        output.write(
                                            decipher.update(storedChunk)
                                        )
                                    })
                                }

                                // Continuar con el resto del stream
                                input.pipe(decipher).pipe(output)

                                output.on('finish', () => {
                                    console.log(
                                        `✅ Archivo ${file} desencriptado exitosamente`
                                    )
                                    resolve(path.basename(decryptedFilePath))
                                })

                                output.on('error', (err) => {
                                    console.error(
                                        `❌ Error al escribir el archivo desencriptado para ${file}:`,
                                        err
                                    )
                                    reject(err)
                                })
                            } else {
                                chunks.push(chunk)
                            }
                        })

                        input.on('error', (err) => {
                            console.error(
                                `❌ Error al leer el archivo encriptado para ${file}:`,
                                err
                            )
                            reject(err)
                        })
                    })
            )
        )

        // Responder con los nombres de los archivos desencriptados
        res.status(200).json({
            message: 'Archivos desencriptados exitosamente',
            files: decryptedFiles,
        })
    } catch (error) {
        console.error('❌ Error durante la desencriptación:', error)
        res.status(500).json({ message: 'Error durante la desencriptación' })
    }
}
