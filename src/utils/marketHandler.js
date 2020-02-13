// -------------------------------------------------------------------------------------------------

export const DEFAULT_EXCHANGE = 'Loading exchanges...';
export const DEFAULT_PAIR = 'Loading pairs...';

export const NO_EXCHANGES = 'No exchanges available';
export const NO_PAIRS = 'No pairs available';

export const METRIC_OHLC = 'ohlc';
export const METRIC_ORDER_BOOK = 'order_book';

// -------------------------------------------------------------------------------------------------

export function filterExchanges(exchanges, metric, defaultExchange = DEFAULT_EXCHANGE) {
  if (!exchanges) return [defaultExchange];

  const result = Object
    .keys(exchanges)
    .filter(e => {
      return Object
          .keys(exchanges[e])
          .filter(p => Object
            .keys(exchanges[e][p])
            .filter(m => m === metric)
            .length > 0
          )
          .length > 0;
    })
    .sort();

  return result.length === 0 ? [NO_EXCHANGES] : result
}

export function filterPairs(exchanges, selectedExchange, metric, defaultPair = DEFAULT_PAIR) {
  if (!exchanges || !exchanges[selectedExchange] || !isExchangeReady(selectedExchange)) {
    return selectedExchange === NO_EXCHANGES ? [NO_PAIRS] : [defaultPair];
  }

  const result = Object
    .keys(exchanges[selectedExchange])
    .filter(p => Object
      .keys(exchanges[selectedExchange][p])
      .filter(m => m === metric)
      .length > 0
    )
    .sort();

  return result.length === 0 ? ['No pairs available'] : result
}

// -------------------------------------------------------------------------------------------------

export function isExchangeReady(selectedExchange, defaultExchange = DEFAULT_EXCHANGE) {
  return selectedExchange && selectedExchange !== defaultExchange;
}

export function isPairReady(selectedExchange, selectedPair, defaultExchange = DEFAULT_EXCHANGE, defaultPair = DEFAULT_PAIR) {
  return (
    selectedExchange && selectedExchange !== defaultExchange &&
    selectedPair     && selectedPair     !== defaultPair
  );
}

// -------------------------------------------------------------------------------------------------

export function exchangeNames(exchanges, defaultExchange = DEFAULT_EXCHANGE) {
  return exchanges
    ? Object.keys(exchanges).sort()
    : [defaultExchange];
}

export function pairNames(exchanges, selectedExchange, defaultExchange = DEFAULT_EXCHANGE, defaultPair = DEFAULT_PAIR) {
  return isExchangeReady(selectedExchange, defaultExchange)
    ? Object.keys(exchanges[selectedExchange]).sort()
    : [defaultPair];
}

// -------------------------------------------------------------------------------------------------
