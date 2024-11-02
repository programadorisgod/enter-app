import { createUserService } from '../services/service'

export const createUser = async (req, res, next) => {
    const { username, ip } = req.body
    try {
        const newUser = await createUserService({ username, ip })

        if (newUser instanceof Error) {
            const error = {
                msg: '',
                statusCode: 200,
            }
            next(error)
        }

        res.status(201).json({ message: newUser })
    } catch (error) {
        console.log('error:', error)
        next(error)
    }
}
