// -------------------------------------------------------------------------------------------------

<template>
  <div id="market_depth">
    <div>
      <select v-model="exchangeSelected" v-on:change="onNewExchange($event)">
        <option v-for="exchange in exchangeNames" v-bind:value="exchange">{{ exchange }}</option>
      </select>
      <select v-model="pairSelected" v-on:change="onNewPair($event)">
        <option v-for="pair in pairNames" v-bind:value="pair">{{ pair }}</option>
      </select>
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

  export default {
    // Properties
    name: 'market_depth',

    // Reactive data
    computed: {
      exchangeNames() {
        return market.filterExchanges(this.exchanges, market.METRIC_ORDER_BOOK);
      },
      pairNames() {
        return market.filterPairs(this.exchanges, this.exchangeSelected, market.METRIC_ORDER_BOOK);
      },
    },
    data () {
      return {
        // Chart data
        chart: null,
        chartName: 'chartdiv',

        // Market data
        exchangeSelected: null,
        pairSelected: null,
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
      refreshChart: function () {
        charts.refresh(this.chart);
      },
      refreshData() {
        // Default values
        if (this.exchangeSelected === market.DEFAULT_EXCHANGE) this.exchangeSelected = this.exchangeNames[0];
        if (this.pairSelected === market.DEFAULT_PAIR) this.pairSelected = this.pairNames[0];

        // Refresh data
        if (!market.isPairReady(this.exchangeSelected, this.pairSelected)) return;

        const result = charts.createMarketDepthChart(this.chartName, api.getMarketOrdersUrl({ exchange: this.exchangeSelected, pair: this.pairSelected }));
        this.chart = result.chart;
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
    },
    mounted() {
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
