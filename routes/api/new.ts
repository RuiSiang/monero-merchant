import { ParameterizedContext } from 'koa'
import { request, summary, tags, query, prefix } from 'koa-swagger-decorator'

import { newInvoice } from '../../service/invoice'

const tag = tags(['New Invoice'])

@prefix('/new')
export default class NewRouter {
  @request('get', '')
  @summary('new invoice')
  @tag
  @query({
    amount: {
      type: 'number',
      require: true,
      description: 'invoice amount (XMR)',
      nullable: true,
    },
    description: {
      type: 'string',
      require: false,
      description: 'invoice description',
      nullable: true,
    },
    refund: {
      type: 'string',
      require: false,
      description: 'refund address',
      nullable: true,
    },
  })
  async newInvoice(ctx: ParameterizedContext) {
    const { amount, description, refund } = ctx.validatedQuery
    const { status, response } = await newInvoice(amount, description, refund)
    ctx.status = status
    ctx.body = response
  }
}
