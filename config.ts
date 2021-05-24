const connection = {
  baseUrl: 'http://localhost:3000', // base url of the api, change this to fit your domain name
  port: 3000, // port for monero merchant to listen on
}

const crypto = {
  mock: false, // whether to use stub wallet, for testing use
  host: '127.0.0.1', // Monero wallet RPC hostname
  port: '18082', // Monero wallet RPC port
  minConfirmations: 2, // minimum number of confirmations to consider as received
}

const util = {
  invoiceExpiry: 6 * 60 * 60 // time (seconds) until invoice expires
}

export default { connection, crypto, util }
