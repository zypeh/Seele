import jwt from 'jsonwebtoken'

// TODO: change to RSA for JWT
const SECRET = 'very_secret'

export const assignToken = (userdoc) => {
    const token: string = jwt.sign(
        {
            user: userdoc.username,
            heartbeat: '💓'
        },
        SECRET,
        {
            expiresIn: '1d'
        }
    )

    const refreshToken: string = jwt.sign(
        {
            user: userdoc.username,
            verified: userdoc.email_verified,
            name: userdoc.name,
            avatar: userdoc.avatar
        },
        SECRET,
        {
            expiresIn: '14d'
        }
    )
    return [token, refreshToken]
}

export const resolveUser = async (db, token: string): Promise<object> => {
   const payload = jwt.verify(token, SECRET, (err, payload) => {
        if (err)
            return null
        else
            return payload
    })

    if (!payload)
        return { sucess: false, info: 'Invalid JSON Web Token' }

    const user = await db.User.findOne({ where: { username: payload.user }})

    if (user)
        return {
            success: true,
            isToken: !!payload.heartbeat,
            data: user
        }
    else
        return { success: false, info: 'Invalid JSON Web Token, user not found' }
}