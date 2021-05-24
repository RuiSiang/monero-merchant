import { ParameterizedContext } from 'koa'
import { request, summary, tags, query, prefix } from 'koa-swagger-decorator'

import { invoiceInfo } from '../../service/invoice'

const tag = tags(['Invoice Info'])

@prefix('/info')
export default class NewRouter {
  @request('get', '')
  @summary('get invoice information')
  @tag
  @query({
    id: {
      type: 'text',
      require: true,
      description: 'invoice id',
      nullable: false,
    },
  })
  async invoiceInfo(ctx: ParameterizedContext) {
    const { id } = ctx.validatedQuery
    const { status, response } = await invoiceInfo(id)
    ctx.status = status
    ctx.body = response
  }
}
