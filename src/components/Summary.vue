// -------------------------------------------------------------------------------------------------

<template>
  <div id="summary">
    <div class="tabs">
      <a v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]">Exchanges</a>
      <a v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]">Pairs</a>
      <a v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'active' : '' ]">Metrics</a>
      <a v-on:click="activetab=4" v-bind:class="[ activetab === 4 ? 'active' : '' ]">Time Ranges</a>
    </div>

    <div class="content">
      <div v-if="activetab === 1" class="tabcontent">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr v-for="exchange in exchangeNames">
            <td><b>{{ exchange }}</b></td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td align="right">{{ numExchangePairs(exchange) }} pair(s)</td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td>
              <select>
                <option v-for="pair in listExchangePairs(exchange)" v-bind:value="pair">{{ pair }}</option>
              </select>
            </td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td align="right">{{ numExchangeMetrics(exchange) }} metric(s)</td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td>
              <select>
                <option v-for="metric in listExchangeMetrics(exchange)" v-bind:value="metric">{{ metric }}</option>
              </select>
            </td>
          </tr>
        </table>
      </div>
      <div v-if="activetab === 2" class="tabcontent">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr v-for="pair in pairNames">
            <td><b>{{ pair }}</b></td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td align="right">{{ numPairExchanges(pair) }} exchange(s)</td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td>
              <select>
                <option v-for="exchange in listPairExchanges(pair)" v-bind:value="exchange">{{ exchange }}</option>
              </select>
            </td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td align="right">{{ numPairMetrics(pair) }} metric(s)</td>
            <td>&nbsp;&nbsp;&nbsp;</td>
            <td>
              <select>
                <option v-for="metric in listPairMetrics(pair)" v-bind:value="metric">{{ metric }}</option>
              </select>
            </td>
          </tr>
        </table>
      </div>
      <div v-if="activetab === 3" class="tabcontent">
        <div v-for="metric in metricNames">
          {{ metric }}
        </div>
      </div>
      <div v-if="activetab === 4" class="tabcontent">
        <SummaryTimeRanges :exchanges="exchanges" :pairs="pairs" :metrics="metrics"></SummaryTimeRanges>
      </div>
    </div>
  </div>
</template>

// -------------------------------------------------------------------------------------------------

<script>
import SummaryTimeRanges from './SummaryTimeRanges.vue'

export default {
  // Properties
  name: 'zummary',

  // Reactive data
  components: { SummaryTimeRanges },
  computed: {
    exchangeNames() {
      if (this.activetab === 1 && this.exchanges) return Object.keys(this.exchanges).sort();
      return ['Loading...'];
    },
    pairNames() {
      if (this.activetab === 2 && this.pairs) return Object.keys(this.pairs).sort();
      return ['Loading...'];
    },
    metricNames() {
      if (this.activetab === 3 && this.metrics) return Object.keys(this.metrics).sort();
      return ['Loading...'];
    },
  },
  data () {
    return {
      activetab: 1,
      pairs: null,
      metrics: null,
    }
  },
  methods: {
    listExchangeMetrics(exchange) {
      if (!this.exchanges || !this.exchanges[exchange]) return null;
      const metrics = {};
      Object.keys(this.exchanges[exchange]).forEach(p => {
        Object.keys(this.exchanges[exchange][p]).forEach(m => {
          metrics[m] = true;
        });
      });
      return Object.keys(metrics);
    },
    listExchangePairs(exchange) {
      return this.exchanges && this.exchanges[exchange] ? Object.keys(this.exchanges[exchange]) : null;
    },
    listPairExchanges(pair) {
      return this.pairs && this.pairs[pair] ? this.pairs[pair] : null;
    },
    listPairMetrics(pair) {
      if (!this.pairs || !this.pairs[pair]) return null;
      const metrics = {};
      this.pairs[pair].forEach(e => {
        Object.keys(this.exchanges[e][pair]).forEach(m => {
          metrics[m] = true;
        });
      });
      return Object.keys(metrics);
    },
    numExchangeMetrics(exchange) {
      const listExchangeMetrics = this.listExchangeMetrics(exchange);
      return listExchangeMetrics ? listExchangeMetrics.length : '...';
    },
    numExchangePairs(exchange) {
      const listExchangePairs = this.listExchangePairs(exchange);
      return listExchangePairs ? listExchangePairs.length : '...';
    },
    numPairExchanges(pair) {
      const listPairExchanges = this.listPairExchanges(pair);
      return listPairExchanges ? listPairExchanges.length : '...';
    },
    numPairMetrics(pair) {
      const listPairMetrics = this.listPairMetrics(pair);
      return listPairMetrics ? listPairMetrics.length : '...';
    },
    refreshData() {
      this.pairs = {};
      this.metrics = {};

      if (!this.exchanges) return;

      Object.keys(this.exchanges).forEach(e => {
        const pairs = this.exchanges[e];
        Object.keys(pairs).forEach(p => {
          if (!this.pairs[p]) this.pairs[p] = [];
          this.pairs[p].push(e);

          const metrics = pairs[p];
          Object.keys(metrics).forEach(m => {
            if (!this.metrics[m]) this.metrics[m] = [];
            this.metrics[m].push({ exchange: e, pair: p });
          })
        })
      });
    },
  },
  props: ['exchanges'],
  watch: {
    exchanges: function(newExchanges, oldExchanges) {
      if (!newExchanges) return;
      this.refreshData();
    },
  },

  // Lifecycle
  mounted() {
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
    // border: 1px solid #ccc;
    // border-radius: 10px;
    // box-shadow: 3px 3px 6px #e1e1e1
  }
</style>

// -------------------------------------------------------------------------------------------------
