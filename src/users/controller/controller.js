import {
    createUserService,
    deleteUserByUsernameService,
    getUserByUsernameService,
    loginService,
} from '../services/service.js'

export const createUser = async (req, res, next) => {
    const { username, ip } = req.body
    try {
        const newUser = await createUserService({ username, ip })

        if (newUser instanceof Error) {
            next(error)
        }

        res.status(201).json({ msg: newUser })
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

        res.status(200).json({ msg: userExist.data })
    } catch (error) {
        next(error)
    }
}
export const login = async (req, res, next) => {
    const { username } = req.params
    const { recoveryKey, ip } = req.body
    console.log(username, recoveryKey, ip)

    try {
        const userExist = await loginService({
            username,
            recoveryKey,
            userIp: ip,
        })

        if (userExist instanceof Error) {
            next(error)
        }

        res.status(200).json({ msg: userExist })
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

        res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}
