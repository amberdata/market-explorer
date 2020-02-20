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
      <Button type="info" v-on:click="refreshChart()">Refresh Chart</Button>
    </div> -->
    <!-- <div v-bind:id="chartName"></div> -->
    <div ref="chartwrap"></div>
  </div>
</template>

<script>
import { createChart } from 'lightweight-charts'
import * as market from '../utils/marketHandler'
import { convertTimeInterval, dateTimeToFormat } from '../utils/timeHandler'

export default {
  // Properties
  name: 'RealtimeOhlcvChart',

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
      candleSeries: null,
      volumeSeries: null,
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
    },
    listen() {
      this.$w3d.on({ eventName: 'market:ohlcv', filters: { pair: 'btc_usd', exchange: 'kraken' }}, res => {
        const bar = {
          ...res,
          time: +new Date(res.timestamp) / 1000,
          value: res.volume,
        }
        // console.log('listen res', bar)
        this.candleSeries.update(bar)
        this.volumeSeries.update(bar)
      })

      // Needs some maths to appropriately update the latest candle!!
      // this.$w3d.on({ eventName: 'market:trades', filters: { pair: 'btc_usd' }}, res => {
      //   // console.log('res', res, res.length, res[2], res[0][2])
      //   const bar = {
      //     open: res[0][5],
      //     high: res[0][5],
      //     low: res[0][5],
      //     close: res[0][5],
      //     time: +new Date(res[0][2]) / 1000,
      //   }
      //   // console.log('trades res', res, bar)
      //   this.candleSeries.update(bar)
      // })
    },
    async getData() {
      const options = {}
      options.endDate = +new Date()
      options.exchange = 'kraken' //this.exchangeSelected ||
      options.timeInterval = 'minutes'

      const pair = 'btc_usd' // this.pairSelected ||
      const ohlcvRes = await this.$w3d.market.getOhlcv(pair, options)
      const ohlcvData = ohlcvRes.data[options.exchange]
      // console.log('ohlcvData', ohlcvData)
      if (!ohlcvData) return
      const formatted = ohlcvData.map(o => {
        return {
          // time: new Date(o[0]).toISOString(),
          time: +new Date(o[0]) / 1000,
          open: o[1],
          high: o[2],
          low: o[3],
          close: o[4],
          value: o[5],
        }
      })

      this.candleSeries = this.chart.addCandlestickSeries()
      this.candleSeries.setData(formatted)
      console.log('formatted', formatted)

      this.volumeSeries = this.chart.addHistogramSeries({
    		color: 'rgba(76, 175, 80, 0.5)',
    		priceFormat: {
    			type: 'volume',
    		},
    		priceLineVisible: false,
      	overlay: true,
      	scaleMargins: {
      		top: 0.85,
      		bottom: 0,
      	},
      })
      // this.volumeSeries = this.chart.addHistogramSeries()
      this.volumeSeries.setData(formatted)
    },
  },
  props: ['exchanges'],
  // watch: {
  //   exchanges: function(newExchanges, oldExchanges) {
  //     // const vm = this;
  //     // Vue.nextTick(() => vm.refreshData());
  //   }
  // },

  created() {
    this.exchangeSelected = market.DEFAULT_EXCHANGE;
    this.pairSelected = market.DEFAULT_PAIR;
  },
  mounted() {
    this.chart = createChart(this.$refs.chartwrap, {
      width: 700,
      height: 500,
      timeScale: {
    		timeVisible: true,
        secondsVisible: false,
    	},

      // priceScale: {
    	// 	scaleMargins: {
    	// 		top: 0.2,
    	// 		bottom: 0.2,
    	// 	},
    	// 	position: 'none',
    	// },
    	// timeScale: {
    	// 	visible: false,
    	// },
    	// crosshair: {
    	// 	horzLine: {
    	// 		visible: false,
    	// 	},
    	// 	vertLine: {
    	// 		visible: false,
    	// 	},
    	// },
    	layout: {
    		backgroundColor: '#f9f9f9',
    	},
    	grid: {
    		vertLines: {
    			color: '#f2f2f2',
    		},
    		horzLines: {
    			color: '#f2f2f2',
    		},
    	},
    })
    this.getData()

    this.listen()
  },
}
</script>

<style scoped lang="scss">
#chartdiv {
  width: 100%;
  height:600px;
}
</style>
