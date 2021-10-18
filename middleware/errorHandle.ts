import { ParameterizedContext, Next } from 'koa'

export default () => async (ctx: ParameterizedContext, next: Next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof CustomError) {
      ctx.status = error.status || 400
      ctx.body = { msg: error.toString() }
    }
  }
}

class CustomError extends Error {
  public status: number
}
