<template>
  <div id="arbitrage">
    <table border="0" cellspacing="0" cellpadding="2">
      <tr bgcolor="#d3d3d3">
        <th>Pair</th>
        <th>Exchange</th>
        <th>Last</th>
        <th>Spread</th>
        <th>Ask</th>
        <th>Bid</th>
      </tr>
      <tr v-bind:bgcolor="rowColor(ticker)" v-for="ticker in tickers">
        <td><b>{{ ticker.pair }}</b></td>
        <td><b>{{ ticker.exchange }}</b></td>
        <td align="right" v-bind:class="arbitrageClass(ticker)">{{ ticker.last || '...' }}</td>
        <td align="right" v-bind:class="spreadClass(ticker)">{{ spread(ticker) }}</td>
        <td align="right">{{ ticker.ask }}</td>
        <td align="right">{{ ticker.bid }}</td>
      </tr>
    </table>

    <br/>
    <button v-on:click="refreshData()">Refresh Data</button>
  </div>
</template>

<script>
import rawTickers from '../assets/tickers.json'

export default {
  name: 'arbitrage',
  props: ['exchange', 'pair'],

  // Reactive data
  data () {
    return {
      color: 0,
      colors: ['beige', 'white'],
      lastPair: null,
      tickers: {},
      tickersByPairs: {},
    }
  },
  methods: {
    arbitrageClass(ticker) {
      const tickers = this.tickersByPairs[ticker.pair];
      if (!tickers) return 'noClass';

      let minPrice = Number.MAX_VALUE;
      let maxPrice = 0;

      Object.keys(tickers).forEach(e => {
        const ticker = tickers[e];
        if (ticker.last) {
          if (ticker.last > maxPrice) maxPrice = ticker.last;
          if (ticker.last < minPrice) minPrice = ticker.last;
        }
      });

      return (maxPrice - minPrice) / maxPrice >= 0.01 ? 'arbitrage' : 'noClass'
    },
    rowColor(ticker) {
      if (this.lastPair !== ticker.pair) {
        this.lastPair = ticker.pair;
        this.color = 1 - this.color;
      }
      return this.colors[this.color];
    },
    spread(ticker) {
      return Number(ticker.ask - ticker.bid).toFixed(4)
    },
    spreadClass(ticker) {
      return this.spread(ticker) >= 1 ? 'highSpread' : 'noClass'
    },
    refreshData() {
      this.tickersByPairs = {};
      rawTickers.forEach(t => {
        if (!this.tickersByPairs[t.pair]) this.tickersByPairs[t.pair] = {};
        if (!this.tickersByPairs[t.pair][t.exchange] || t.timestamp > this.tickersByPairs[t.pair][t.exchange].timestamp) this.tickersByPairs[t.pair][t.exchange] = t;
      });

      const pairs = Object
        .keys(this.tickersByPairs)
        .filter(t => Object.keys(this.tickersByPairs[t]).length > 1)
        .sort();

      const tickers = {};
      pairs.forEach(p => {
        if (!tickers[p]) tickers[p] = [];
        Object.keys(this.tickersByPairs[p]).forEach(e => tickers[p].push(this.tickersByPairs[p][e]));
      });

      this.tickers = [];
      pairs.forEach(p => {
        const sorted = tickers[p].sort((a, b) => {
          if (a.last < b.last) return -1;
          if (a.last > b.last) return  1;
          if (a.mid  < b.mid)  return -1;
          if (a.mid  > b.mid)  return  1;
          if (a.bid  < b.bid)  return -1;
          if (a.bid  > b.bid)  return  1;
          if (a.ask  < b.ask)  return -1;
          if (a.ask  > b.ask)  return  1;
          return 0;
        });
        sorted.forEach(x => this.tickers.push(x));
      });
      console.log('this.tickers', this.tickers);
    },
  },

  mounted() {
    this.refreshData();
  },
}
</script>

<style scoped lang="scss">
  .arbitrage {
    color: dodgerblue;
  }
  .highSpread {
    color: red;
  }
  .noClass {
  }
</style>
