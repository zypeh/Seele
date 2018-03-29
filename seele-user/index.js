const Koa = require('koa');
const convert = require('koa-convert');
const body = require('koa-better-body');

app = new Koa();

app.use(convert(body()))
app.use(async (ctx, next) => {
    console.log(ctx.request);
    console.log(ctx.request.fields);
    ctx.status = 404;
    // ctx.body = { token: 'yes' }
});

app.listen(8082);
