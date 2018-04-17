import Router from 'koa-router'
import compose from 'koa-compose'

import passport from 'koa-passport'
import FacebookStrategy from 'passport-facebook'
import GoogleStrategy from 'passport-google-oauth20'

import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { apolloUploadKoa } from 'apollo-upload-server'

import schema from './graphql'
import lib from './lib'
import db from './database'
import { assignToken } from './lib/jwt';

import { google, facebook } from './config'
const isDev = (process.env.ENV !== 'production')

export default () => compose([router.routes(), router.allowedMethods()])

const router = new Router()

// Facebook Oauth2.0
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook_oauth',
    passport.authenticate('facebook', { session: false }),
    async (ctx) => {
        const [token, refreshToken] = await assignToken(ctx.state.user)
        ctx.redirect(`http://localhost:4000?token=${token}&refreshToken=${refreshToken}`)
    }
)

// Google Oauth2.0
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
router.get('/google_oauth',
    passport.authenticate('google', { session: false }),
    async (ctx) => {
        const [token, refreshToken] = await assignToken(ctx.state.user)
        ctx.redirect(`http://localhost:4000?token=${token}&refreshToken=${refreshToken}`)
    }
)

// GraphQL endpoint
router.post('/g',
    apolloUploadKoa({ uploadDir: './uploads' }),
    graphqlKoa(ctx => {
        const curr_user = ctx.state.user
        return {
            schema,
            rootValue: { ctx },
            context: {
                db,
                lib
            },
            debug: isDev
        }
    })
)

if (isDev) // Only enable this route when it's development environment
    router.get('/giql', graphiqlKoa({ endpointURL: '/g' }))

passport.use(
    new FacebookStrategy(
        {
            clientID: facebook.appId,
            clientSecret: facebook.appSecret,
            callbackURL: facebook.redirectUri,
            profileFields: ['id', 'name', 'email', 'picture.type(large)', 'currency', 'locale'],
            enableProof: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const userFound = await db.User.findOne({ where: { email: profile._json.email } })
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

passport.use(
    new GoogleStrategy(
        {
            clientID: google.clientId,
            clientSecret: google.clientSecret,
            callbackURL: google.redirectUri
        },
        async (accessToken, refreshToken, profile, done) => {
            const userFound = await db.User.findOne({ where: { email: profile.emails[0].value } })
            if (userFound) {
                // Save the google api response
                await userFound.update({ google_resp: profile._json })
                done(null, userFound)
            } else {
                // Create a new user without password
                const newUser = await db.User.create({
                    email: profile.emails[0].value,
                    email_verified: profile._json.verified,
                    username: `${profile.name.givenName}${profile.id}-2`,
                    name: profile._json.displayName,
                    google_resp: profile,
                    avatar: profile._json.image.url
                })
                done(null, newUser)
            }
        }
    )
)