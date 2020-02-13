// -------------------------------------------------------------------------------------------------

import axios from 'axios'

// -------------------------------------------------------------------------------------------------

const API_KEY = process.env.API_KEY || '';
const API_URL = process.env.API_URL || 'https://web3api.io';
const API_TIMEOUT = process.env.API_TIMEOUT || 5000; // 5s
const API_VERSION = process.env.API_VERSION || 'api/v2';

// -------------------------------------------------------------------------------------------------

function _url(path, parameters) {
  return parameters
    ? `${API_URL}/${API_VERSION}/${path}?${parameters}`
    : `${API_URL}/${API_VERSION}/${path}`
}

async function _download(path, parameters, timeout = API_TIMEOUT) {
  let numTries = 0;

  while (numTries < 3) {
    try {
      console.log(`[HTTP >>>] ${_url(path, parameters)}...`);
      const result = await axios({
        url: _url(path, parameters),
        method: 'GET',
        headers: { 'content-type': 'application/json', 'x-api-key': API_KEY },
        timeout,
      });
      console.log(`[HTTP <<<]`, result);
      return result
    } catch (e) {
      numTries += 1;
      if (numTries >= 3) throw e;
    }
  }
}

// -------------------------------------------------------------------------------------------------

export async function getAddressTokenTransfers(address, size) {
  return _download(`/addresses/${address}/token-transfers`, size ? `size=${size}` : null)
}

export async function getAddressTransactions(address, size) {
  return _download(`/addresses/${address}/transactions`, size ? `size=${size}` : null)
}

// -------------------------------------------------------------------------------------------------

export async function getLastBlocks(size) {
  return _download('blocks', size ? `size=${size}` : null)
}

// -------------------------------------------------------------------------------------------------

export async function getMarketExchanges(timeout) {
  // return { data: { payload: { binance: { ada_bnb: { ohlc: true } }, gdax: { btc_usd: { ohlc: true } } } } }
  return _download('market/exchanges', null, timeout)
}

export async function getMarketOrders({ exchange, pair, timeout }) {
  return _download(`market/orders/${pair}`, `exchange=${exchange}`, timeout)
}

export function getMarketOrdersUrl({ exchange, pair }) {
  return _url(`market/orders/${pair}`, `exchange=${exchange}`)
}

export async function getMarketOHLCV({ exchange, pair, timeout, timeInterval }) {
  return _download(
    `market/ohlcv/${pair}/historical`,
    timeInterval ? `exchange=${exchange}&timeInterval=${timeInterval}` : `exchange=${exchange}`,
    timeout,
  )
}

export async function getMarketLastTickers({ exchange, pair, timeout }) {
  return _download(`market/tickers/${pair}/latest`, `exchange=${exchange}`, timeout)
}

export async function getMarketTickers({ exchange, pair, timeout }) {
  return _download(`market/tickers/${pair}/historical`, `exchange=${exchange}`, timeout)
}

export async function getMarketTrades({ exchange, pair, timeout }) {
  return _download(`market/trades/${pair}/historical`, `exchange=${exchange}`, timeout)
}

// -------------------------------------------------------------------------------------------------

export async function getLastTransactions(size) {
  return _download('transactions', size ? `size=${size}` : null)
}

// -------------------------------------------------------------------------------------------------
