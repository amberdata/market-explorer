<template>
  <div id="blockchain_data_blocks">
    <div>
      Property:
      <select v-model="propertySelected" v-on:change="refreshData($event)">
        <option v-for="property in propertyNames" v-bind:value="property">{{ property }}</option>
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
  // import * as api from '../common/api'
  import * as charts from '../utils/charts'
  import { dateTimeToISODateTime } from '../utils/timeHandler'
  import { addWatcherBlocks, deleteWatcher } from '../utils/websocketsHelper'

  export default {
    name: 'BlockchainBlocks',
    props: ['exchange', 'pair'],

    data () {
      return {
        // Chart data
        chart: null,
        chartName: 'chartdiv',

        // Properties
        propertySelected: 'numTransactions',
        propertyNames: ['gasLimit', 'gasUsed', 'numTransactions', 'numUncles', 'size'],

        // Websockets
        watcher: null,
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
      pushDataItem(item) {
        const vm = this
        vm.chart.addData(vm.createDataPoint(item, true), 1)
      },
      async refreshData() {
        this.chart.data = null;

        const vm = this;
        const blocks = await this.$w3d.block.getBlocks()
        vm.chart.data = blocks.map(block => vm.createDataPoint(block, false))
      },
    },

    // Lifecycle
    mounted() {
      // Chart
      const result = charts.createGradientAreaChart(this.chartName);
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
