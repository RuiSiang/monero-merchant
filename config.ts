const connection = {
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000', // base url of the api, change this to fit your domain name
  port: parseInt(process.env.PORT || '3000'), // port for monero merchant to listen on
}

const crypto = {
  mock: (process.env.CRYPTO_MOCK || 'false') === 'false', // whether to use stub wallet, for testing use
  host: process.env.CRYPTO_HOST || '127.0.0.1', // Monero wallet RPC hostname
  port: process.env.CRYPTO_PORT || '18082', // Monero wallet RPC port
  minConfirmations: parseInt(process.env.MIN_CONFIRMATIONS || '2'), // minimum number of confirmations to consider as received
}

const util = {
  invoiceExpiry: parseInt(process.env.INVOICE_EXPIRY || '7200'), // time (seconds) until invoice expires
}

export default { connection, crypto, util }
