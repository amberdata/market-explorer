<template>
  <div id="txnins">
    <h1>Transaction Inspector</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card v-if="authenticated" shadow>
          <Row style="padding: 20px 0">
            <Col span="12">
              <h4>Transaction Hash</h4>
              <Input v-model="txnHash" @on-blur="refreshData" :placeholder="defaultHash" />
            </Col>
          </Row>
          <div v-bind:id="chartName"></div>
        </Card>
        <!-- <Card shadow>
          <Row style="padding: 20px 0">
            <Col span="12">
              <h4>Transaction Sankey</h4>
            </Col>
          </Row>
          <div v-bind:id="chartDiagram"></div>
        </Card> -->
      </Col>
    </Row>

    <Row style="padding: 20px 0">
      <Col span="24" v-if="authenticated">
        <Card v-if="txn && txn.hash" shadow>
          <h4>Transaction Call Stack</h4>
          <List :header="txn.hash" size="small">
            <ListItem :style="{paddingLeft: `${i.depth * 10}px`}" v-for="i in txnList" :key="i.messageIndex">
              <div class="">
                {{ i.depth }} {{ i.messageIndex }} - {{ i.opcode }} {{ i.value }}
              </div>
            </ListItem>
          </List>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as charts from '../utils/charts'

const defaultHash = '0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838'

export default {
  name: 'TransactionInspector',

  data() {
    return {
      txn: null,
      txnTree: [],
      txnList: [],
      defaultHash,
      txnHash: null,

      // Chart data
      chart: null,
      chartName: 'chartdiv',
      // chart2: null,
      // chartDiagram: 'chartsankey',
    }
  },

  computed: {
    ...mapGetters(['authenticated']),
  },

  methods: {
    refreshChart() {
      charts.refresh(this.chart)
    },
    async refreshData() {
      const hash = this.txnHash || this.defaultHash
      const txn = await this.$w3d.transaction.getTransaction(hash, { includeFunctions: true, includePrice: true })
      this.txn = txn
      this.txnList = txn.functions

      console.log('txn', txn)
      if (!txn || !txn.functions) {
        this.chart.data = []
        return
      }

      const formattedFunctions = txn.functions.map(f => {
        return {
          // category: f.depth,
          category: `${f.to.nameNormalized || f.to.name || f.to.address}`.slice(0,10),
          start: parseInt(f.initialGas, 10),
          end: parseInt(f.leftOverGas, 10),
          task: f.opcode,
          color: charts.getColorForString(f.opcode),
          raw: f,
        }
      })
      // console.log('formattedFunctions', formattedFunctions)

      this.chart.data = formattedFunctions || []

      // NOTE Keep trying things, but get Maximum call stack issue!
      // // .filter(s => s.value !== '0')
      // const formattedSankey = txn.functions.map(f => {
      //   return {
      //     // from: f.from.address,
      //     // to: f.to.address,
      //     // from: f.initialGas,
      //     // to: f.leftOverGas,
      //     from: `D ${f.depth}`,
      //     to: `D ${f.depth + 1}`,
      //     // value: parseInt(f.initialGas, 10) - parseInt(f.leftOverGas, 10),
      //     // value: f.value,
      //     value: 1,
      //     raw: f,
      //   }
      // })
      // console.log('formattedSankey', formattedSankey)
      //
      // this.chart2.data = formattedSankey.slice(0,30) || []
      // // this.chart2.data = formattedSankey || []
    },
  },

  mounted() {
    // Chart
    const result = charts.createGanttChart(this.chartName);
    this.chart = result.chart;
    this.chart.data = [];
    // const result2 = charts.createSankeyDiagramChart(this.chartDiagram);
    // this.chart2 = result2.chart;
    // this.chart2.data = [];

    this.refreshData();
  },

  watch: {
    'authenticated': ['refreshData']
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
