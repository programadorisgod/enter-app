import { BASE_URL } from '../../CONSTANTS/constant.js'
import { Router } from 'express'
import { uploadFile } from '../../middleware/upload.js'
import { encryptFile, decryptFile } from '../controller/controller.js'

const router = Router()

router.post(`${BASE_URL}/upload-file`, uploadFile , (req, res) => {
    res.status(200).json({ message: 'Uploaded file' })
})

router.get(`${BASE_URL}/encrypt-file`, encryptFile )

router.get(`${BASE_URL}/decrypt-file`, decryptFile)

export { router }