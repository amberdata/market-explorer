// -------------------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------------------

<script>
  import * as api from '../common/api'
  import * as charts from '../common/charts'
  import { dateTimeToISODateTime } from '../common/timeHandler'
  import { addWatcherBlocks, deleteWatcher } from '../common/websocketsHelper'

  export default {
    // Properties
    name: 'blockchain_data.blocks',

    // Reactive data
    computed: {
    },
    data () {
      return {
        // Chart data
        chart: null,
        chartName: 'chartdiv',

        // Properties
        propertySelected: 'gasUsed',
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
      refreshData() {
        this.chart.data = null;

        const vm = this;
        api
          .getLastBlocks(100)
          .then(blocks => {
            if (blocks && blocks.data && blocks.data.payload && blocks.data.payload.records) {
              vm.chart.data = blocks.data.payload.records.map(block => vm.createDataPoint(block, false));
            }
          });
      },
    },
    props: ['exchange', 'pair'],

    // Lifecycle
    mounted() {
      // Chart
      const result = charts.createGradientAreaChart(this.chartName);
      this.chart = result.chart;

      this.refreshData();

      const vm = this;
      addWatcherBlocks(this.$store, (block) => {
        vm.chart.addData(vm.createDataPoint(block, true), 1);
      })
    },
    beforeDestroy() {
      charts.dispose(this.chart);
      deleteWatcher(this.watcher);
    },
  }
</script>

// -------------------------------------------------------------------------------------------------

<style scoped lang="scss">
  #chartdiv {
    width: 100%;
    height: 500px;
  }
</style>

// -------------------------------------------------------------------------------------------------
