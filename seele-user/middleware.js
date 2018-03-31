const compose = require('koa-compose');
const cors = require('@koa/cors');
const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook');

const { facebook } = require('./config');
const db = require('./database');

export default () => compose([ errorHandler, passport.initialize() ])

async function errorHandler(ctx, next) {
    try {
        await next()
    } catch (err) {
        let status = err.status || 500
        let message = err.message || 'Internal Error'
  
        ctx.status = status
        ctx.body = {
            success: false,
            message: message
        }
  
        if (status == 500)
            ctx.app.emit('error', err, ctx)
    }
}

passport.use(
    new FacebookStrategy(
        {
            clientID: facebook.app_id,
            clientSecret: facebook.app_secret,
            callbackURL: facebook.redirect_uri,
            profileFields: ['id', 'name', 'email', 'picture.type(large)', 'currency', 'locale'],
            enableProof: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const userFound = await db.User.findOne({ where: { email: profile._json.email }})
            if (userFound) {
                // Save the facebook response
                await userFound.update({ facebook_resp: profile._json })
                done(null, userFound)
            } else {
                // Create a new user without password
                const newUser = await db.User.create({
                    email: profile._json.email,
                    username: `${profile._json.first_name}${profile._json.id}-1`,
                    name: profile._json.first_name,
                    facebook_resp: profile,
                    avatar: profile._json.picture.data.url,
                })
                done(null, newUser)
            }
        }
    )
)