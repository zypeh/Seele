import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export default {
    Query: {
        unit: async (_, { unitId }, { db }) => await db.Unit.findOne({ where: { unitId }}),
        unitDashboard: async () => {},
        // bookingAdminDashboard: async () => {}
    },

    Mutation: {
        /*
        register: async (_, { username, email }, {}) => true,
        login: async (_, { id }, {}) => true,

        refreshToken: async (_, { refreshToken }, { db, lib }) => {
            const userdoc = await lib.jwt.resolveUser(db, refreshToken)
            if (userdoc.success && userdoc.isToken)
                return lib.jwt.assignToken(userdoc)
            else
                return userdoc // { sucess: false, info: '...' }
        },
        */
        createUnit: async (_, { name, type, token }, { db, lib }) => {
            // verify the token
            const userdoc = await lib.jwt.resolveUser(db, token)
            if (userdoc.success && !userdoc.isToken)
                return await db.Unit.create({ name, type, owner: userdoc.data.id })
            else
                return null
        },

        updateUnit: async (_, payload, token, { db, lib }) => {
            const [userdoc, unitdoc] = await Promise.all([
                await lib.jwt.resolveUser(db, payload.token),
                await db.Unit.findOne({ where: { unitId: payload.unitId } })
            ])

            if (!userdoc || !unitdoc)
                return false

            // check if the user jwt token provided, user is existing or not,
            // check if the user jwt token is token or not,
            // check if the unit is owned by this userid from jwt token payload
            if (userdoc.success && !userdoc.isToken && userdoc.info.id === unitdoc.owner) {
                // update the unit
                const updatedUnit = await unitdoc.update(payload, { returning: true, plain: true })
                return updatedUnit.dataValues
            } else {
                return null
            }
        },

        listUnit: async (_, { unitId, token }, { lib, db }) => {
            const [userdoc, unitdoc] = await Promise.all([
                await lib.jwt.resolveUser(db, token),
                await db.Unit.findOne({ where: { unitId } })
            ])

            if (!userdoc || !unitdoc)
                return false

            // check if the user jwt token provided, user is existing or not,
            // check if the user jwt token is token or not,
            // check if the unit is owned by this userid from jwt token payload
            if (userdoc.success && !userdoc.isToken && userdoc.info.id === unitdoc.owner) {
                // send listing request
                try {
                    await db.Booking.create({ bookStatus: 'pending', requestUnit: unitdoc.id, requestFromUser: userdoc.data.id })
                    return true
                } catch (err) {
                    if (err)
                        return false
                }
            }
        },
        publishUnit: async (_, { unitId, token }, { lib, db }) => true
    },
}
    /**
     * Date parser
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'UTC number of milliseconds since midnight Jan 1 1970 as in JS date',
        parseValue(value) { return new Date(value).valueOf() },
        serialize(value) {
            if (value instanceof Date) return value.valueOf()
            return value
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) return parseInt(ast.value, 10)
            return null
        }
    })
    */
//}