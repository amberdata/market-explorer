# Trading Platform Example

This project aims at:
- showcasing some of the capabilities of Amberdata's Blockchain and Market Data API
- serving as a starter project for how to use the APIs & websockets
- starting conversations, generating new ideas and trying new features 

## Build Setup

Install dependencies

    npm install --no-optional

Serve with hot reload at localhost:8080

    npm run dev

Once the web application has been started, it will be available at:

    http://localhost:8080

Build for production with minification

    npm run build

Configuration (environment variables):
- API_KEY: this is your API key - you can obtain one at https://amberdata.io/pricing  

For example:

    API_KEY=<your_api_key_here> npm run dev


## Features

All features (for the exception of one) are live, meaning they request live data from Amberdata's Data API, either via REST endpoints or websockets.

Thanks to that, all dashboards are automatically updated when new data comes in.

### Market Data Summary

![Summary](src/assets/documentation/summary.png?raw=true "Summary")

This is the main dashboard, which provides a quick summary of all the market data supported features:
- which exchanges are available
- with their respective pairs and metrics

More often than not, users are interested in a specific pair, not an exchange directly, and this is when the second tab called "Pairs" comes in handy. 

![Summary (pairs)](src/assets/documentation/summary_pairs.png?raw=true "Summary (pairs)")

Notice that:
- not all exchanges support all pairs (in fact, quite often a pair is only supported by one exchange)
- not all exchanges support all the metrics (some do not support tickers, or OHLCV for example)

### OHLCV

This is the main dashboard to visualize price data for each (supported) pair.  This includes the standard features:
- open, high, low, close and volume
- ability to zoom in to take a closer look at a specific point in time
- daily, hourly and minutely timeframes are supported

![OHLCV (daily)](src/assets/documentation/ohlcv_daily.png?raw=true "OHLCV (daily)")
![OHLCV (hourly)](src/assets/documentation/ohlcv_hourly.png?raw=true "OHLCV (hourly)")

### Market Depth

![Market Depth](src/assets/documentation/market_depth.png?raw=true "Market Depth")

This chart is updated every minute - the next iteration will be integrated with websockets and be full real-time.

### Blockchain Data

The most interesting feature here is the token transfers analysis.  This chart aims at looking at any pending token transfers, ie token transfers which have not been finalized yet.

When compared to the ratio of token transfers which have been confirmed on the blockchain, this can be used as a predictive tool, for example:
- an imminent increase of token transfers could indicate a liquidation event, most likely to have an impact on the token price  
- as would a sudden drop in token transfers

Of course, not all tokens are create equals, and different behaviors can be observed:
![Token Transfers](src/assets/documentation/blockchain_token_transfers.png?raw=true "Token Transfers")
![Token Transfers](src/assets/documentation/blockchain_token_transfers_2.png?raw=true "Token Transfers")

### Arbitrage

In this section, we try to identify arbitrage opportunities.  Note that these are very simple, and used for showcasing the capabilities of the API, but are nowhere intended to be used in a professional setting.

![Arbitrage](src/assets/documentation/arbitrage.png?raw=true "Arbitrage")

Unusual bid-ask spread are highlighted in red.
Arbitrage opportunities are highlighted in blue - the heuristic used the is 1% (or more) of the range difference between all the prices of the a pair.   

## Conclusion

We hope this project achieved some (if not all!) of the goals mentioned at the beginning, and as always we are looking forward to your comments and feedback!

Things on our list:
- Burn and mint events
- Best Bid Offers
- Triangular Arbitrage
- ...

And looking forward to whatever it is that you will build on top of Amberdata's APIs !!!

# Resources

- [Contributing](./CONTRIBUTING.md)

# Licensing

This project is licensed under the [Apache Licence 2.0](./LICENSE).
