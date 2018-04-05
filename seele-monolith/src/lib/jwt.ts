import jwt from 'jsonwebtoken'

// TODO: change to RSA for JWT
const SECRET = 'very_secret'

const assignToken = (obj) => jwt.sign(
    obj,
    SECRET,
    { expiresIn: '14d' }
)
