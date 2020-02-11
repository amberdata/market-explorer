// -------------------------------------------------------------------------------------------------

<template>
  <div id="summary_time_ranges">
    <select v-model="exchangeOrPairChoice" v-on:change="onNewChoice()">
      <option>exchange</option>
      <option>pair</option>
    </select>
    <select v-model="exchangeOrPairSelected" v-on:change="onNewExchangeOrPair()">
      <option v-for="exchangeOrPair in exchangeOrPairs" v-bind:value="exchangeOrPair">{{ exchangeOrPair }}</option>
    </select>
    <input type="checkbox" id="checkbox" v-model="sortByDate" v-on:change="refreshData()">
    <label for="checkbox">Sort by Date</label>
    <select v-model="metricSelected" v-on:change="onNewMetric()">
      <option>ohlc</option>
      <option>order_book</option>
      <option>order_book_best_bid_offer</option>
      <option>order_book_update</option>
      <option>ticker</option>
      <option>trade</option>
    </select>
    <div v-bind:id="chartName"></div>
  </div>
</template>

// -------------------------------------------------------------------------------------------------

<script>
  import * as charts from '../utils/charts'

  export default {
    // Properties
    name: 'summary_time_ranges',

    // Reactive data
    computed: {
      exchangeOrPairs() {
        if (this.exchangeOrPairChoice === 'exchange') return this.exchangeNames;
        if (this.exchangeOrPairChoice === 'pair'    ) return this.pairNames;
        return ['Loading...'];
      },
      exchangeNames() {
        if (this.exchanges) return Object.keys(this.exchanges).sort();
        return ['Loading...'];
      },
      pairNames() {
        if (this.pairs) return Object.keys(this.pairs).sort();
        return ['Loading...'];
      },
    },
    data () {
      return {
        // Chart data
        chart: null,
        chartName: 'chartdiv',

        // Data
        exchangeOrPairChoice: 'exchange',
        exchangeOrPairSelected: null,
        exchangeSelected: null,
        metricSelected: 'trade',
        pairSelected: null,
        sortByDate: true,
      }
    },
    methods: {
      onNewChoice() {
        this.exchangeOrPairSelected = this.exchangeOrPairs[0];
        this.onNewExchangeOrPair();
      },
      onNewExchangeOrPair() {
        this.onNewMetric();
      },
      onNewMetric() {
        this.refreshData();
      },
      refreshData() {
        switch (this.exchangeOrPairChoice) {
          case 'exchange': {
            this.chart.data = [];

            //   data.push({ category: names[i], open: open, close: close });
            const pairs = this.exchanges[this.exchangeOrPairSelected];
            if (pairs) {
              const data = [];
              Object.keys(pairs).forEach(p => {
                if (pairs[p][this.metricSelected]) {
                  data.push({
                    category: p,
                    open:  pairs[p][this.metricSelected].startDate / 1000,
                    close: pairs[p][this.metricSelected].endDate   / 1000,
                  });
                }
              });
              this.chart.data = this.sortData(data);
            }
            break;
          }

          case 'pair': {
            this.chart.data = [];

            const exchanges = this.pairs[this.exchangeOrPairSelected];
            if (exchanges) {
              const data = [];
              exchanges.forEach(e => {
                if (this.exchanges[e][this.exchangeOrPairSelected][this.metricSelected]) {
                  data.push({
                    category: e,
                    open:  this.exchanges[e][this.exchangeOrPairSelected][this.metricSelected].startDate / 1000,
                    close: this.exchanges[e][this.exchangeOrPairSelected][this.metricSelected].endDate   / 1000,
                  });
                }
              });
              this.chart.data = this.sortData(data);
            }
            break;
          }

          default:
            console.log(`Unknown type: ${this.exchangeOrPairChoice}.`);
            break;
        }

        charts.refresh(this.chart);
      },
      sortData(data) {
        if (this.sortByDate) {
          data.sort((a, b) => {
            if (a.open  < b.open ) return  1;
            if (a.open  > b.open ) return -1;
            if (a.close < b.close) return  1;
            if (a.close > b.close) return -1;
            return 0;
          });
        }
        return data;
      },
    },
    props: ['exchanges', 'pairs', 'metrics'],
    watch: {
      exchanges: function(newExchanges, oldExchanges) {
        if (!newExchanges) return;
        this.refreshData();
      },
    },

    // Lifecycle
    mounted() {
      // Chart
      const result = charts.createHorizontalDumbbellPlotChart(this.chartName);
      this.chart = result.chart;
      this.chart.data = [];

      // Data
      this.exchangeOrPairSelected = this.exchangeOrPairs[0];
      this.refreshData();
    },
    beforeDestroy() {
      charts.dispose(this.chart);
    },
  }
</script>

// -------------------------------------------------------------------------------------------------

<style scoped lang="scss">
  #chartdiv {
    width: 100%;
    height: 700px;
  }
</style>

// -------------------------------------------------------------------------------------------------
