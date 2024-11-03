import { createUserService } from '../services/service.js'

export const createUser = async (req, res, next) => {
    const { username, ip } = req.body
    try {
        const newUser = await createUserService({ username, ip })

        if (newUser instanceof Error) {
            const error = {
                msg: newUser.message,
                statusCode: newUser?.statusCode || 500,
            }
            next(error)
        }

        res.status(201).json({ message: newUser })
    } catch (error) {
        console.log('error:', error)
        next(error)
    }
}

export const getUserByUsername = async (username = '') => {}
