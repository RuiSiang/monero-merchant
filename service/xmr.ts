import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js'

import config from '../config'

export default class Xmr {
  private static instance: Xmr
  public static getInstance(): Xmr {
    if (!Xmr.instance) {
      Xmr.instance = new Xmr()
    }
    return Xmr.instance
  }
  private xmrTransport = new HTTPTransport(
    `http://${config.crypto.host || 'localhost'}:${
      config.crypto.port || '18082'
    }/json_rpc`
  )
  private xmrClient = new Client(new RequestManager([this.xmrTransport]))
  public newAddress = async () => {
    try {
      const addressInfo = await this.xmrClient.request({
        method: 'make_integrated_address',
        params: {},
      })
      return {
        address: addressInfo.integrated_address,
        paymentId: addressInfo.payment_id,
      }
    } catch (err: any) {
      return {
        address: undefined,
        paymentId: undefined,
      }
    }
  }
  public scanPaymentId = async (paymentId: string) => {
    const xmrData = await this.xmrClient.request({
      method: 'get_payments',
      params: {
        payment_id: paymentId,
      },
    })
    let confirmed = 0,
      unconfirmed = 0
    if (xmrData.payments) {
      for (let i = 0; i < xmrData.payments.length; i++) {
        if (
          parseInt(xmrData.payments[i].unlock_time) <=
          Math.max(10 - config.crypto.minConfirmations || 8, 0)
        ) {
          confirmed += parseInt(xmrData.payments[i].amount) / 1000000000000
        }
        unconfirmed += parseInt(xmrData.payments[i].amount) / 1000000000000
      }
    }
    return { confirmed, unconfirmed }
  }
}
