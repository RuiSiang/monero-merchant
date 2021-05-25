# Monero Merchant

[![nodejs-ci](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/RuiSiang/monero-merchant/actions/workflows/nodejs-ci.yml)
[![njsscan sarif](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml/badge.svg)](https://github.com/RuiSiang/monero-merchant/actions/workflows/njsscan-analysis.yml)
[![CodeQL](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/RuiSiang/monero-merchant/actions/workflows/codeql-analysis.yml)
## About
Monero Merchant is a RESTful API based on the official Monero wallet RPC. This project is mainly for merchants who hope to accept Monero as payment, which is currently the most robust and privacy-oriented cryptocurrency with extremely low transaction fees.
## Prerequisites
+ [nodejs](https://nodejs.org/en/download/) is installed
+ [monero-wallet-rpc](https://www.getmonero.org/downloads/#cli) is running
## Installation
Clone repo and install dependencies
```
git clone https://github.com/RuiSiang/monero-merchant
npm install
```
Configure settings by editting config.ts, options are as follows
+ baseUrl: base url of the api, change this to fit your domain name
+ port: port for monero merchant to listen on
+ mock: whether to use stub wallet, for testing use
+ host: Monero wallet RPC hostname
+ port: Monero wallet RPC port
+ minConfirmations: minimum number of confirmations to consider as received
+ invoiceExpiry: time (seconds) until invoice expires

Test Config and Code Integrity
```
npm run test
```
Build and Run
```
npm run build
npm start
```
## Methods
GET /new
+ query: amount, description, refund
+ response: id, address

GET /info
+ query: id
+ response: status, amount, address, refund, expiry, description

Interactive Swagger docs at /swagger-html and /swagger-json

## Buy me a coffee
XMR address: 
8BCaS8k6ag34JwruWhNHRBFwucWgYP7UfGXEMovdgLvtevoPps1XFipK4Fw2Kh5hPvLL1dBnpD6UKXWK8v8zFeVsPAXpAZG
## Todos
+ api key authentication to add security
+ unit test method for mocking real wallet rpc to increase coverage
+ additional endpoints (new features)

Please feel free to provide suggestions and feature requests