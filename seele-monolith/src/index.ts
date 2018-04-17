import * as Koa from 'koa'

import * as helmet from 'koa-helmet'

import routes from './routes'
import db from './database'

const app = new Koa()

app.use(helmet())
app.use(routes())

// Serving
db.sequelize.sync().then(async () => {
    try {
        await app.listen(parseInt(process.env.PORT, 10) || 8083)
    } catch (err) {
        // should debug here ...
        process.exit(1)
    }
})
