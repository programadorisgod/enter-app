import {
    createUserService,
    deleteUserByUsernameService,
    getUserByUsernameService,
} from '../services/service.js'

export const createUser = async (req, res, next) => {
    const { username, ip } = req.body
    try {
        const newUser = await createUserService({ username, ip })

        if (newUser instanceof Error) {
            next(error)
        }

        res.status(201).json({ message: newUser })
    } catch (error) {
        console.log('error:', error)
        next(error)
    }
}

export const getUserByUsername = async (req, res, next) => {
    let { username } = req.params
    try {
        const userExist = await getUserByUsernameService({ username })

        if (userExist instanceof Error) {
            next(error)
        }

        res.status(200).json({ message: userExist.data })
    } catch (error) {
        next(error)
    }
}

export const deleteUserByUsername = async (req, res, next) => {
    let { username } = req.params
    try {
        const result = await deleteUserByUsernameService({ username })

        if (result instanceof Error) {
            next(error)
        }

        res.status(200).json({ message: result })
    } catch (error) {
        next(error)
    }
}
