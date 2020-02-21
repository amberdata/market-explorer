<template>
  <div id="ohlcv">
    <!-- <div>
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
    </div> -->
    <div class="form-header">
      <div class="form-lines">
        <div class="form-line">
          <small>Asset A:</small>
          <Select v-model="pairA.exchangeSelected" @on-change="updateExchange('A')" style="width:160px">
            <Option v-for="exchange in exchangeNames" :value="exchange" :key="exchange">{{ exchange }}</Option>
          </Select>
          <Select v-model="pairA.pairSelected" @on-change="refreshData()" style="width:110px">
            <Option v-for="pair in pairNamesA" :value="pair" :key="pair">{{ pair }}</Option>
          </Select>
        </div>
        <div class="form-line">
          <small>Asset B:</small>
          <Select v-model="pairB.exchangeSelected" @on-change="updateExchange('B')" style="width:160px">
            <Option v-for="exchange in exchangeNames" :value="exchange" :key="exchange">{{ exchange }}</Option>
          </Select>
          <Select v-model="pairB.pairSelected" @on-change="refreshData()" style="width:110px">
            <Option v-for="pair in pairNamesB" :value="pair" :key="pair">{{ pair }}</Option>
          </Select>
        </div>
      </div>
      <Select v-model="timeIntervalSelected" @on-change="refreshData()" style="width:110px">
        <Option v-for="item in timeIntervals" :value="item" :key="item">{{ item }}</Option>
      </Select>
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
    name: 'ComparisonChart',

    // Reactive data
    computed: {
      exchangeNames() {
        return market.filterExchanges(this.exchanges, 'ohlc');
      },
      pairNamesA() {
        return market.filterPairs(this.exchanges, this.pairA.exchangeSelected, 'ohlc');
      },
      pairNamesB() {
        return market.filterPairs(this.exchanges, this.pairB.exchangeSelected, 'ohlc');
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

        pairA: {
          exchangeSelected: null,
          pairSelected: null,
          timeIntervals: ['days', 'hours', 'minutes'],
          startDate: '...',
          endDate: '...',
        },
        pairB: {
          exchangeSelected: null,
          pairSelected: null,
          timeIntervals: ['days', 'hours', 'minutes'],
          startDate: '...',
          endDate: '...',
        },
      }
    },
    methods: {
      updateExchange(v) {
        const type = `pair${v}`
        const set = `pairNames${v}`
        const initialPair = this[set].includes(this[type].pairSelected) ? this[type].pairSelected : this[set][0]
        this[type].pairSelected = initialPair
        this.refreshData()
      },
      refreshChart() {
        charts.refresh(this.chart)
      },
      async refreshData() {
        // Default values
        if (this.pairA.exchangeSelected === market.DEFAULT_EXCHANGE) this.pairA.exchangeSelected = this.exchangeNames[0];
        if (this.pairA.pairSelected === market.DEFAULT_PAIR) this.pairA.pairSelected = this.pairNamesA[0];
        if (this.pairB.exchangeSelected === market.DEFAULT_EXCHANGE) this.pairB.exchangeSelected = this.exchangeNames[0];
        if (this.pairB.pairSelected === market.DEFAULT_PAIR) this.pairB.pairSelected = this.pairNamesB[0];

        // Refresh data
        if (!market.isPairReady(this.pairA.exchangeSelected, this.pairA.pairSelected)) return;
        if (!this.chart) return;

        const format = 'yyyy-MM-dd hh:mm:ss';
        const pairAMetric = this.exchanges[this.pairA.exchangeSelected][this.pairA.pairSelected][market.METRIC_OHLC]
        const pairBMetric = this.exchanges[this.pairB.exchangeSelected][this.pairB.pairSelected][market.METRIC_OHLC]

        this.pairA.startDate = dateTimeToFormat({ date: pairAMetric.startDate, format });
        this.pairA.endDate = dateTimeToFormat({ date: pairAMetric.endDate, format });
        this.pairB.startDate = dateTimeToFormat({ date: pairBMetric.startDate, format });
        this.pairB.endDate = dateTimeToFormat({ date: pairBMetric.endDate, format });

        this.chart.data = [];

        const optionsA = {}
        const optionsB = {}
        const pairA = this.pairA
        const pairB = this.pairB

        // TODO: Finish adding UI for changing S/E!
        // if (this.startDate && this.startDate !== '...') options.startDate = this.startDate
        // if (this.endDate && this.endDate !== '...') options.endDate = this.endDate
        if (this.pairA.exchangeSelected) optionsA.exchange = this.pairA.exchangeSelected
        if (this.timeIntervalSelected) optionsA.timeInterval = this.timeIntervalSelected
        optionsA.endDate = +new Date()
        if (this.pairB.exchangeSelected) optionsB.exchange = this.pairB.exchangeSelected
        if (this.timeIntervalSelected) optionsB.timeInterval = this.timeIntervalSelected
        optionsB.endDate = +new Date()

        const ohlcvResA = await this.$w3d.market.getOhlcv(this.pairA.pairSelected, optionsA)
        const ohlcvDataA = optionsA.startDate || optionsA.endDate ? ohlcvResA.data[optionsA.exchange] : ohlcvResA[optionsA.exchange]
        const ohlcvResB = await this.$w3d.market.getOhlcv(this.pairB.pairSelected, optionsB)
        const ohlcvDataB = optionsB.startDate || optionsB.endDate ? ohlcvResB.data[optionsB.exchange] : ohlcvResB[optionsA.exchange]
        const combinedData = []
        if (!ohlcvDataA || !ohlcvDataB) return
        console.log('this.pairA.pairSelected', this.pairA.pairSelected)

        // combine both data sets into timestamp matched data array
        ohlcvDataA.forEach(oA => {
          ohlcvDataB.forEach(oB => {
            if (oA[0] === oB[0]) {
              combinedData.push({ date: oA[0], dateB: oB[0], pairA: oA[4], labelA: this.pairA.pairSelected || 'A', pairB: oB[4], labelB: this.pairB.pairSelected || 'B' })
            }
          })
        })

        this.chart.data = combinedData
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
      this.pairA.exchangeSelected = 'gdax' || market.DEFAULT_EXCHANGE;
      this.pairA.pairSelected = 'btc_usd' || market.DEFAULT_PAIR;
      // this.pairB.exchangeSelected = 'binance' || market.DEFAULT_EXCHANGE;
      // this.pairB.pairSelected = 'btc_usdt' || market.DEFAULT_PAIR;
      this.pairB.exchangeSelected = 'bitfinex' || market.DEFAULT_EXCHANGE;
      this.pairB.pairSelected = 'wbt_usd' || market.DEFAULT_PAIR;
    },
    mounted() {
      // Chart
      // const result = charts.createProfessionalCandlesticksChart(this.chartName);
      // this.chart = result.chart;
      // this.chart.data = [];
      const result = charts.createRangeAreaChart(this.chartName, { pairA: 'pairA', pairB: 'pairB', labelA: 'A', labelB: 'B' });
      this.chart = result.chart;

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

.form-header {
  display: flex;
  justify-content: space-between;
}
.form-lines {
  display: flex;
  flex-direction: column;
}
.form-line {
  margin-bottom: 10px;

  small {
    font-weight: bold;
    text-transform: uppercase;
    margin-right: 10px;
  }
}
</style>
