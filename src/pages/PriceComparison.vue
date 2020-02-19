<template>
  <div>
    <h1>Asset Comparison</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <ComparisonChart :exchanges="exchanges"></ComparisonChart>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ComparisonChart from '../components/OhlcvChart.vue'

export default {
  name: 'PriceComparison',

  components: {
    ComparisonChart,
  },

  computed: {
    ...mapGetters(['exchanges', 'authenticated'])
  },

  methods: {
    ...mapActions(['getExchanges'])
  },

  mounted() {
    this.getExchanges()
  },

  watch: {
    'authenticated': ['getExchanges']
  }
}
</script>

<style>
</style>
