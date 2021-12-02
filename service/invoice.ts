import roundTo from 'round-to'
import randomstring from 'randomstring'
import validator from 'validator'
import { getRepository } from 'typeorm'

import config from '../config'
import Xmr from './xmr'
import XmrMock from './xmr-mock'
import { Invoice } from './orm'

const xmr =
  config.crypto.mock || process.env.NODE_ENV === 'test'
    ? XmrMock.getInstance()
    : Xmr.getInstance()

export const newInvoice = async (
  amount: number,
  description: string,
  refund: string
) => {
  amount = roundTo(amount, 8)
  if (amount <= 0) {
    return { status: 400, response: 'Amount must be larger than 0' }
  }
  if (
    refund &&
    !(
      refund.match(/^[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}$/) ||
      refund.match(/^4[0-9AB][1-9A-HJ-NP-Za-km-z]{104}$/)
    )
  ) {
    return { status: 400, response: 'Invalid refund address format' }
  }
  const { paymentId, address } = await xmr.newAddress()
  if (!address) {
    return { status: 500, response: 'Xmr address generation error' }
  }
  const id = randomstring.generate(16)
  await getRepository(Invoice)
    .createQueryBuilder()
    .insert()
    .values({
      id,
      amount: amount.toString(),
      address,
      description,
      paymentId,
      refund,
      expiry: () =>
        `DATETIME(CURRENT_TIMESTAMP, "+${config.util.invoiceExpiry} seconds")`,
    })
    .execute()

  return { status: 200, response: { id, address } }
}

export const invoiceInfo = async (id: string) => {
  if (!validator.isLength(id, { min: 16, max: 16 })) {
    return { status: 400, response: 'Invalid invoice id format' }
  }
  const invoice = await getRepository(Invoice)
    .createQueryBuilder()
    .where({ id })
    .select(['status', 'amount', 'address', 'refund', 'expiry', 'description'])
    .getRawOne()
  if (!invoice) {
    return { status: 400, response: 'Invoice does not exist' }
  }
  return { status: 200, response: invoice }
}
