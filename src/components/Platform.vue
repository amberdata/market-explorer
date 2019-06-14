// -------------------------------------------------------------------------------------------------

<template>
  <div id="app" class="container">
    <!--<div>-->
      <!--<select v-model="exchangeSelected" v-on:change="onNewExchange($event)">-->
        <!--<option v-for="exchange in exchangeNames" v-bind:value="exchange">{{ exchange }}</option>-->
      <!--</select>-->
      <!--<select v-model="pairSelected" v-on:change="onNewPair($event)">-->
        <!--<option v-for="pair in pairNames" v-bind:value="pair">{{ pair }}</option>-->
      <!--</select>-->
    <!--</div>-->

    <!--<br/>-->
    <!--<br/>-->
    <!--<br/>-->

    <div class="tabs">
      <a v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]">Summary</a>
      <a v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]">OHLCV</a>
      <a v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'active' : '' ]">Market Depth</a>
      <a v-on:click="activetab=4" v-bind:class="[ activetab === 4 ? 'active' : '' ]">Blockchain Data</a>
      <a v-on:click="activetab=5" v-bind:class="[ activetab === 5 ? 'active' : '' ]">Arbitrage</a>
    </div>

    <div class="content">
      <div v-if="activetab === 1" class="tabcontent">
        <Summary :exchanges="exchanges"></Summary>
      </div>
      <div v-if="activetab === 2" class="tabcontent">
        <OHLCV :exchanges="exchanges"></OHLCV>
      </div>
      <div v-if="activetab === 3" class="tabcontent">
        <MarketDepth :exchanges="exchanges"></MarketDepth>
      </div>
      <div v-if="activetab === 4" class="tabcontent">
        <BlockchainData :exchanges="exchanges"></BlockchainData>
      </div>
      <div v-if="activetab === 5" class="tabcontent">
        <Arbitrage :exchanges="exchanges"></Arbitrage>
      </div>
    </div>

    <br/>

    <div>
      <button v-on:click="refreshData()">Refresh Exchange Data</button>
      <button v-on:click="resetWebsockets()">Restart Websockets</button>
    </div>
  </div>
</template>

// -------------------------------------------------------------------------------------------------

<script>
  import Arbitrage from './Arbitrage.vue'
  import BlockchainData from './BlockchainData.vue'
  import MarketDepth from './MarketDepth.vue'
  import OHLCV from './OHLCV.vue'
  import Summary from './Summary.vue'
  import * as api from '../common/api'
  import * as market from '../common/marketHandler'

  export default {
    // Properties
    name: 'platform',

    // Reactive data
    components: { Arbitrage, BlockchainData, MarketDepth, OHLCV, Summary },
    computed: {
      exchangeNames() {
        return market.exchangeNames(this.exchanges)
      },
      pairNames() {
        return market.pairNames(this.exchanges, this.exchangeSelected)
      }
    },
    data () {
      return {
        // Tab data
        activetab: 1,

        // Market data
        exchanges: null,
        exchangeSelected: null,
        pairSelected: null,
      }
    },
    methods: {
      onNewExchange(event) {
        this.pairSelected = this.pairNames[0];
      },
      onNewPair(event) {
        // Nothing to do
      },
      refreshData() {
        // Default values
        this.exchanges = null;
        this.exchangeSelected = market.DEFAULT_EXCHANGE;
        this.pairSelected = market.DEFAULT_PAIR;

        // Refresh data
        api
          .getMarketExchanges(10000)
          .then(exchanges => {
            if (exchanges && exchanges.data && exchanges.data.payload) {
              this.exchanges = exchanges.data.payload;
              this.exchangeSelected = this.exchangeNames[0];
              this.pairSelected = this.pairNames[0];
              this.onNewPair();
            }
          });
      },
      resetWebsockets() {
        this.$websocket.reset();
      },
    },

    // Lifecycle
    created() {
      this.refreshData();
    },
  }
</script>

// -------------------------------------------------------------------------------------------------

<style scoped lang="scss">
  /* RESET */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .container {
    /*max-width: 620px;*/
    /*min-width: 420px;*/
    margin: 40px auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9em;
    color: #888;
  }

  /* Style the tabs */
  .tabs {
    overflow: hidden;
    margin-left: 20px;
    margin-bottom: -2px; // hide bottom border
  }

  .tabs ul {
    list-style-type: none;
    margin-left: 20px;
  }

  .tabs a{
    float: left;
    cursor: pointer;
    padding: 12px 24px;
    transition: background-color 0.2s;
    border: 1px solid #ccc;
    border-right: none;
    background-color: #f1f1f1;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
  }
  .tabs a:last-child {
    border-right: 1px solid #ccc;
  }

  /* Change background color of tabs on hover */
  .tabs a:hover {
    background-color: #aaa;
    color: #fff;
  }

  /* Styling for active tab */
  .tabs a.active {
    background-color: #fff;
    color: #484848;
    border-bottom: 2px solid #fff;
    cursor: default;
  }

  /* Style the tab content */
  .tabcontent {
    padding: 30px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 3px 3px 6px #e1e1e1
  }
</style>

// -------------------------------------------------------------------------------------------------
