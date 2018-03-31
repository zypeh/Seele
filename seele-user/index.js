const Koa = require('koa');
const Router = require('koa-router');

const convert = require('koa-convert');
const passport = require('koa-passport');
const middleware = require('./middleware');
const jwt = require('./jwt');

const app = new Koa();
const router = new Router();

router.get('/auth/fb', passport.authenticate('facebook'));
router.get('/auth/fb_cb',
    passport.authenticate('facebook', { session: false }),
    async ctx => {
        const [token, refreshToken] = await jwt.assignToken(ctx.state.user);
        ctx.redirect(`http://localhost:4000?token=${token}&refreshToken=${refreshToken}`);
    }
)

app.use(middleware());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(parseInt(process.env.PORT, 10) || 8082);
