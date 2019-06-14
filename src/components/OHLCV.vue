// -------------------------------------------------------------------------------------------------

<template>
  <div id="ohlcv">
    <div>
      <select v-model="exchangeSelected" v-on:change="onNewExchange($event)">
        <option v-for="exchange in exchangeNames" v-bind:value="exchange">{{ exchange }}</option>
      </select>
      <select v-model="pairSelected" v-on:change="onNewPair($event)">
        <option v-for="pair in pairNames" v-bind:value="pair">{{ pair }}</option>
      </select>
      <select v-model="timeIntervalSelected" v-on:change="onNewTimeInterval($event)">
        <option v-for="timeInterval in timeIntervals" v-bind:value="timeInterval">{{ timeInterval }}</option>
      </select>
      &nbsp;&nbsp;&nbsp;
      <span>Dates: {{ startDate }} / {{ endDate }}</span>
    </div>
    <div v-bind:id="chartName"></div>
    <button v-on:click="refreshChart()">Refresh Chart</button>
    <button v-on:click="refreshData()">Refresh Pair Data</button>
  </div>
</template>

// -------------------------------------------------------------------------------------------------

<script>
  import Vue from 'vue'
  import * as api from '../common/api'
  import * as charts from '../common/charts'
  import * as market from '../common/marketHandler'
  import { convertTimeInterval, dateTimeToFormat } from '../common/timeHandler'

  export default {
    // Properties
    name: 'OHLCV',

    // Reactive data
    computed: {
      exchangeNames() {
        return market.filterExchanges(this.exchanges, 'ohlc');
      },
      pairNames() {
        return market.filterPairs(this.exchanges, this.exchangeSelected, 'ohlc');
      },
    },
    data () {
      return {
        // Chart data
        chart: null,
        chartName: 'chartdiv',

        // Default messages
        defaultTimeInterval: 'daily',

        // Market data
        exchangeSelected: null,
        pairSelected: null,
        timeIntervals: [ 'daily', 'hourly', 'minutely' ],
        timeIntervalSelected: null,
        startDate: '...',
        endDate: '...',
      }
    },
    methods: {
      onNewExchange(event) {
        this.pairSelected = this.pairNames[0];
        this.refreshData();
      },
      onNewPair(event) {
        this.refreshData();
      },
      onNewTimeInterval(event) {
        this.refreshData();
      },
      refreshChart() {
        charts.refresh(this.chart);
      },
      refreshData() {
        // Default values
        if (this.exchangeSelected === market.DEFAULT_EXCHANGE) this.exchangeSelected = this.exchangeNames[0];
        if (this.pairSelected === market.DEFAULT_PAIR) this.pairSelected = this.pairNames[0];

        // Refresh data
        if (!market.isPairReady(this.exchangeSelected, this.pairSelected)) return;
        if (!this.chart) return;

        const format = 'yyyy-MM-dd hh:mm:ss';
        this.startDate = dateTimeToFormat({ date: this.exchanges[this.exchangeSelected][this.pairSelected][market.METRIC_OHLC].startDate, format });
        this.endDate   = dateTimeToFormat({ date: this.exchanges[this.exchangeSelected][this.pairSelected][market.METRIC_OHLC].endDate,   format });

        this.chart.data = [];

        api
          .getMarketOHLCV({
            exchange: this.exchangeSelected,
            pair: this.pairSelected,
            timeInterval: convertTimeInterval(this.timeIntervalSelected),
            timeout: 10000,
          })
          .then(result => {
            if (result && result.data && result.data.payload && result.data.payload.data && result.data.payload.data[this.exchangeSelected]) {
              this.chart.data = result.data.payload.data[this.exchangeSelected].map(x => ({
                date: x[0],
                open: x[1],
                high: x[2],
                low: x[3],
                close: x[4],
                volume: x[5],
              }));
            }
          });
      },
    },
    props: ['exchanges'],
    watch: {
      exchanges: function(newExchanges, oldExchanges) {
        const vm = this;
        Vue.nextTick(() => vm.refreshData());
      }
    },

    // Lifecycle
    created() {
      // Default values
      this.exchangeSelected = market.DEFAULT_EXCHANGE;
      this.pairSelected = market.DEFAULT_PAIR;
      this.timeIntervalSelected = this.defaultTimeInterval;
    },
    mounted() {
      // Chart
      const result = charts.createProfessionalCandlesticksChart(this.chartName);
      this.chart = result.chart;
      this.chart.data = [];

      // Data
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
    height:600px;
  }
</style>

// -------------------------------------------------------------------------------------------------
