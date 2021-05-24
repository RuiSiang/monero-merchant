export default class Xmr {
  private static instance: Xmr
  public static getInstance(): Xmr {
    if (!Xmr.instance) {
      Xmr.instance = new Xmr()
    }
    return Xmr.instance
  }
  public newAddress = async () => {
    return {
      address:
        '4XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      paymentId: 'XXXXXXXXXXXXXXXX',
    }
  }
  public scanPaymentId = async (paymentId: string) => {
    return { confirmed: 0.1234, unconfirmed: 1 }
  }
}
