export default (fastify, opts, next) => {
    // view user
    fastify.get('/user/:id', a)
    // *owner only* view user
    fastify.post('/user/:id', a)
    // update user
    fastify.put('/user/:id', a)
    // delete user account
    fastify.post('/user/:id/delete', a)

    // view unit
    fastify.get('/unit/:id', a)
    // *owner only* view unit
    fastify.post('/unit/:id', a)
    // update unit
    fastify.put('/unit/:id', a)
    // listing request
    fastify.post('/unit/:id/post', a)

    // *admin only* publish unit
    fastify.post('/unit/:id/publish', a)
    // *admin only* view listing requests
    fastify.post('/listing', a)

    // send book request to unit
    fastify.post('/unit/:id/book', a)

    next()
}

const a = (req, resp) => resp.send({ hello: 'world' })