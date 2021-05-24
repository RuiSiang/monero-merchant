import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter()

router.swagger({
  title: 'Monero Merchant',
  description: 'API Documentation',
  version: '0.0.1',
  swaggerHtmlEndpoint: '/swagger-html',
  swaggerJsonEndpoint: '/swagger-json',
  securityDefinitions: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'X-Auth-Token'
    }
  }
})
router.mapDir(__dirname)

export default router
