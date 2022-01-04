# Monero Merchant

[![nodejs-ci](https://github.com/RuiSiang/monero-merchant/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/RuiSiang/monero-merchant/actions/workflows/nodejs-ci.yml)
[![njsscan sarif](https://github.com/RuiSiang/monero-merchant/actions/workflows/njsscan-analysis.yml/badge.svg)](https://github.com/RuiSiang/monero-merchant/actions/workflows/njsscan-analysis.yml)
[![CodeQL](https://github.com/RuiSiang/monero-merchant/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/RuiSiang/monero-merchant/actions/workflows/codeql-analysis.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/ruisiang/monero-merchant?color=orange)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/ruisiang/monero-merchant/latest?label=docker%20image%20size)](https://hub.docker.com/r/ruisiang/monero-merchant)
[![](https://images.microbadger.com/badges/version/ruisiang/monero-merchant.svg)](https://hub.docker.com/r/ruisiang/monero-merchant)
## About
Monero Merchant is a RESTful API based on the official Monero wallet RPC. This project is mainly for merchants who hope to accept Monero as payment, which is currently the most robust and privacy-oriented cryptocurrency with extremely low transaction fees.
## Prerequisites
+ [nodejs](https://nodejs.org/en/download/) ^16.0.0 is installed
+ [monero-wallet-rpc](https://www.getmonero.org/downloads/#cli) is running
## Installation
Docker image available on [Docker Hub](https://hub.docker.com/r/ruisiang/monero-merchant)

Clone repo and install dependencies
```
git clone https://github.com/RuiSiang/monero-merchant
npm install
```
Configure settings by editting `.env.example` and renaming it to `.env`, options are as follows
+ BASE_URL: base url of the api, change this to fit your domain name
+ PORT: port for monero merchant to listen on
+ CRYPTO_MOCK: whether to use stub wallet, for testing use
+ CRYPTO_HOST: Monero wallet RPC hostname
+ CRYPTO_PORT: Monero wallet RPC port
+ MIN_CONFIRMATIONS: minimum number of confirmations to consider as received
+ INVOICE_EXPIRY: time (seconds) until invoice expires

Test Config and Code Integrity
```
npm run test
```
Build and Run
```
npm run build
npm start
```
If you wish to run monero-merchant with Docker, see docker-compose.example.yaml for more information
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
