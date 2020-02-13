<template>
  <div id="ohlcv">
    <div>
      <!-- <span>Dates: {{ startDate }} / {{ endDate }}</span> -->
      <Select v-model="exchangeSelected" @on-change="updateExchange" style="width:160px">
        <Option v-for="exchange in exchangeNames" :value="exchange" :key="exchange">{{ exchange }}</Option>
      </Select>
      <Select v-model="pairSelected" @on-change="refreshData()" style="width:110px">
        <Option v-for="pair in pairNames" :value="pair" :key="pair">{{ pair }}</Option>
      </Select>

      <Select v-model="timeIntervalSelected" @on-change="refreshData()" style="width:110px">
        <Option v-for="item in timeIntervals" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="Select date" style="width: 160px"></DatePicker>
      <Button type="info" v-on:click="refreshChart()">Refresh Chart</Button>
    </div>
    <div v-bind:id="chartName"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as charts from '../utils/charts'
  import * as market from '../utils/marketHandler'
  import { convertTimeInterval, dateTimeToFormat } from '../utils/timeHandler'

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
        defaultTimeInterval: 'days',

        // Market data
        exchangeSelected: null,
        pairSelected: null,
        timeIntervals: ['days', 'hours', 'minutes'],
        timeIntervalSelected: 'days',
        startDate: '...',
        endDate: '...',
      }
    },
    methods: {
      updateExchange() {
        this.pairSelected = this.pairNames[0]
        this.refreshData()
      },
      refreshChart() {
        charts.refresh(this.chart)
      },
      async refreshData() {
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

        const options = {}
        // TODO: Finish adding UI for changing S/E!
        if (this.exchangeSelected) options.exchange = this.exchangeSelected
        if (this.timeIntervalSelected) options.timeInterval = this.timeIntervalSelected
        // if (this.startDate && this.startDate !== '...') options.startDate = this.startDate
        // if (this.endDate && this.endDate !== '...') options.endDate = this.endDate
        options.endDate = +new Date()
        console.log('options', options)

        const ohlcvRes = await this.$w3d.market.getOhlcv(this.pairSelected, options)
        const ohlcvData = options.startDate || options.endDate ? ohlcvRes.data[options.exchange] : ohlcvRes[options.exchange]

        if (ohlcvData) {
          this.chart.data = ohlcvData.map(x => ({
            date: x[0],
            open: x[1],
            high: x[2],
            low: x[3],
            close: x[4],
            volume: x[5],
          }))
        }
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

<style scoped lang="scss">
  #chartdiv {
    width: 100%;
    height:600px;
  }
</style>
