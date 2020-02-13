<template>
  <div id="token_transfers">
    <div>
      <select v-model="tokenSelected" v-on:change="refreshData($event)">
        <option v-for="token in tokens" v-bind:value="token">{{ token.name }} ({{ token.address }})</option>
      </select>
    </div>
    <br/>
    <div v-bind:id="chartName"></div>
    <br/>
    <button v-on:click="refreshChart()">Refresh Chart</button>
    <button v-on:click="refreshData()">Refresh Data</button>
  </div>
</template>

<script>
  import * as charts from '../utils/charts'
  import { dateTimeToISODateTime } from '../utils/timeHandler'
  import tokenTransfers from '../assets/token_transfers.json'

  export default {
    name: 'TokenTransfers',
    props: ['exchange', 'pair'],

    data () {
      return {
        // Blockchain data
        // pending_transactions: {}, // minute -> (token address, #transferred)
        // transactions: {}, // minute -> (token address, #transferred)
        tokens: ['Loading...'],
        // tokenSelected: { address: '0x0000000000085d4780b73119b644ae5ecd22b376', name: 'TrueUSD' },
        tokenSelected: { address: '0x174bfa6600bf90c885c7c01c7031389ed1461ab9', name: 'More Gold Coin' },

        // Chart data
        chart: null,
        chartName: 'chartdiv',
      }
    },
    methods: {
      createDataPoint(block, convert) {
        return {
          date: new Date(convert ? dateTimeToISODateTime({ date: block.timestamp }) : block.timestamp),
          value: Number(block[this.propertySelected]),
        }
      },
      refreshChart() {
        charts.refresh(this.chart);
      },
      refreshData() {
        const tokens = {};
        tokenTransfers.forEach(x => tokens[x.tokenAddress] = x.name || x.tokenAddress);

        this.tokens = tokens
          ? Object
            .keys(tokens)
            .map(x => ({ address: x, name: tokens[x] }))
            .sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return  1;
              if (a.address < b.address) return -1;
              if (a.address > b.address) return  1;
              return 0;
            })
          : [];

        if (!this.tokenSelected || this.tokenSelected === 'Loading...') {
          this.tokenSelected = this.tokens.length > 0 ? this.tokens[0] : '';
        }

        this.chart.data = tokenTransfers
          .filter(x => x.tokenAddress === this.tokenSelected.address)
          .map(x => ({
            date: new Date(x.date),
            open: x.totalPending || 0,
            close: x.totalConfirmed || 0,
          }))
      },
    },

    // Lifecycle
    mounted() {
      // Chart
      const result = charts.createRangeAreaChart(this.chartName);
      this.chart = result.chart;

      this.refreshData();
    },
    beforeDestroy() {
      charts.dispose(this.chart);
    },
  }
</script>

<style scoped lang="scss">
  #chartdiv {
    width: 100%;
    height: 500px;
  }
</style>
