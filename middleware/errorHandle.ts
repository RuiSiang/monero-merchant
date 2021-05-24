import { ParameterizedContext, Next } from 'koa'

export default () => async (ctx: ParameterizedContext, next: Next) => {
  try {
    await next()
  } catch (error) {
    ctx.status = error.status || 400
    ctx.body = { msg: error.toString() }
  }
}
