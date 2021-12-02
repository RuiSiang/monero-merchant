import validator from 'validator'
import { createConnection } from 'typeorm'
import 'reflect-metadata'

import config from '../config'
import { ormOptions } from '../service/orm'
import { newInvoice, invoiceInfo } from '../service/invoice'
import { scanInvoices } from '../service/cron'

beforeAll(async () => {
  try {
    await createConnection(ormOptions)
    scanInvoices.start()
  } catch (err) {
    console.log(err)
  }
})

describe('Configuration', () => {
  it('should contain required options', async () => {
    expect(config).toHaveProperty(['connection', 'baseUrl'])
    expect(config).toHaveProperty(['connection', 'port'])
    expect(config).toHaveProperty(['crypto', 'mock'])
    expect(config).toHaveProperty(['crypto', 'host'])
    expect(config).toHaveProperty(['crypto', 'port'])
    expect(config).toHaveProperty(['crypto', 'minConfirmations'])
    expect(config).toHaveProperty(['util', 'invoiceExpiry'])
  })
  it('should have valid connection options', async () => {
    expect(config.connection.baseUrl).toMatch(
      /^(http(s?):\/\/)?(([a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,3})+)|(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b))(\:()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5]))?$/
    )
    expect(
      validator.isInt(config.connection.port.toString(), { min: 0, max: 65536 })
    ).toBeTruthy()
  })
  it('should have valid crypto options', async () => {
    expect(typeof config.crypto.mock).toMatch('boolean')
    expect(config.crypto.host).toMatch(
      /^(([a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,3})+)|(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b))(\:()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5]))?$/
    )
    expect(
      validator.isInt(config.crypto.port.toString(), { min: 0, max: 65536 })
    ).toBeTruthy()
    expect(
      validator.isInt(config.crypto.minConfirmations.toString(), {
        min: 1,
        max: 10,
      })
    ).toBeTruthy()
  })
  it('should have valid util options', async () => {
    expect(
      validator.isInt(config.util.invoiceExpiry.toString(), {
        min: 60,
        max: 86400,
      })
    ).toBeTruthy()
  })
})

describe('New invoice', () => {
  it('should return valid id and address', async () => {
    const { status, response } = await newInvoice(
      0.1,
      'test description',
      '4AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    )
    expect(status).toEqual(200)
    expect(typeof response).toEqual('object')
    expect((<any>response).id).toHaveLength(16)
    expect((<any>response).address).toHaveLength(106)
  })
  it('should reject wrong address format (invalid characters)', async () => {
    const { status, response } = await newInvoice(
      0.1,
      'test description',
      '4PInvD18P456f4KJUBKPS3Rqa97LrTaeqJ5NFYmjQM6nVoz6TBv4rJ24GZk883BNo22fAKbr8BSuTjhQC6K7DsSJFa8SHDs'
    )
    expect(status).toEqual(400)
    expect(response).toEqual('Invalid refund address format')
  })
  it('should reject wrong address format (wrong subaddress length)', async () => {
    const { status, response } = await newInvoice(
      0.1,
      'test description',
      '87bnvD18P456f4KJUBKPS3Rqa97LrTaeqJ5NFYmjQM6nVoz6TBv4rJ24GZk883BNo22fAKbr8BSuTjhQC6K7DsSJFa8SHDsFa8SHDsSHDS'
    )
    expect(status).toEqual(400)
    expect(response).toEqual('Invalid refund address format')
  })
  it('should reject wrong format (wrong address length)', async () => {
    const { status, response } = await newInvoice(
      0.1,
      'test description',
      '87bnvD18P456f4KJUBKPS3Rqa97LrTaeqJ5NFYmjQM6nVoz6TBv4rJ24GZk883BNo22fAKbr8BSuTjhQC6K7DsSJFa8S'
    )
    expect(status).toEqual(400)
    expect(response).toEqual('Invalid refund address format')
  })
  it('should reject bad invoice amount', async () => {
    const { status, response } = await newInvoice(
      -1,
      'test description',
      '4AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    )
    expect(status).toEqual(400)
    expect(response).toEqual('Amount must be larger than 0')
  })
})

describe('Invoice info', () => {
  it('should return invoice inserted', async () => {
    const id = (<any>(
      await newInvoice(
        0.1,
        'test description',
        '4AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      )
    )).response.id
    const { status, response } = await invoiceInfo(id)
    expect(status).toEqual(200)
    expect(typeof response).toEqual('object')
    expect((<any>response).status).toEqual('Pending')
    expect((<any>response).amount).toEqual('0.1')
    expect((<any>response).address).toHaveLength(106)
    expect((<any>response).refund).toEqual(
      '4AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    )
    expect((<any>response).expiry).toMatch(
      /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    )
    expect((<any>response).description).toEqual('test description')
  })
  it('should return invoice inserted', async () => {
    const { status, response } = await invoiceInfo('XXXXXXXXXXXXXXXX')
    expect(status).toEqual(400)
    expect(response).toEqual('Invoice does not exist')
  })
})

describe('Invoice cron', () => {
  it('should scan wallet every 30 seconds', async () => {
    const id1 = (<any>(
      await newInvoice(
        0.1,
        'test description',
        '4AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      )
    )).response.id
    const id2 = (<any>(
      await newInvoice(
        0.5,
        'test description',
        '4AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      )
    )).response.id
    expect((await invoiceInfo(id1)).response.status).toEqual('Pending')
    expect((await invoiceInfo(id2)).response.status).toEqual('Pending')
    await new Promise((r) => setTimeout(r, 30000))
    expect((await invoiceInfo(id1)).response.status).toEqual('Received')
    expect((await invoiceInfo(id2)).response.status).toEqual('Confirming')
  }, 32000)
})
