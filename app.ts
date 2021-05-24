import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import { createConnection } from 'typeorm'
import 'reflect-metadata'

import config from './config'
import errorHandle from './middleware/errorHandle'
import router from './routes/index'
import { ormOptions } from './service/orm'
import { scanInvoices } from './service/cron'

const app = new Koa()

createConnection(ormOptions)
  .then(() => {
    app
      .use(cors())
      .use(bodyParser())
      .use(errorHandle())
      .use(router.routes())
      .use(router.allowedMethods())
    app.listen(config.connection.port, () => {
      console.log(`Listening on ${config.connection.port}.`)
    })
    scanInvoices.start()
  })
  .catch((err) => {
    console.log(`Initialization error: ${err}`)
  })
