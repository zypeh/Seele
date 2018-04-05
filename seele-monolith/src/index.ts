const fastify = require('fastify')()
const helmet = require('fastify-helmet')

import { graphqlFastify, graphiqlFastify } from 'fastify-graphql'
import db from './database'
import api from './api'
import schema from './graphql'
import lib from './lib'

const isDev = (process.env.ENV !== 'production')

fastify.register(helmet)
fastify.register(graphqlFastify, {
    prefix: '/g',
    graphql: {
        schema,
        context: {
            db,
            lib
        },
        debug: isDev
    }
})

if (isDev)
    fastify.register(graphiqlFastify, {
        prefix: '/giql',
        graphiql: { endpointURL: '/g' }
    })

// Serving
const PORT = parseInt(process.env.PORT, 10) || 3000
db.sequelize.sync().then(async () => {
    try {
        await fastify.listen(PORT)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
