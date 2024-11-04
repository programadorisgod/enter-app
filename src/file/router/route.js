import { BASE_URL } from '../../CONSTANTS/constant.js'
import { Router } from 'express'
import { uploadFile } from '../../middleware/upload.js'
import { encryptFiles, decryptFiles, getFiles } from '../controller/controller.js'

const fileRouter = Router()

fileRouter.post(`${BASE_URL}/encrypt-file/:userId`, uploadFile, encryptFiles)

fileRouter.get(`${BASE_URL}/decrypt-file/:namefile`, decryptFiles)

fileRouter.get(`${BASE_URL}/get-files/:userId`, getFiles)

export { fileRouter }
