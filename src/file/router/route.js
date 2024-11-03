import { BASE_URL } from '../../CONSTANTS/constant.js'
import { Router } from 'express'
import { uploadFile } from '../../middleware/upload.js'
import { encryptFiles, decryptFiles } from '../controller/controller.js'

const router = Router()

router.post(`${BASE_URL}/encrypt-file`, uploadFile , encryptFiles )

router.get(`${BASE_URL}/decrypt-file/:namefile`, decryptFiles)

export { router }