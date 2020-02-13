<template>
  <div>
    <h1>Market Depth</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <MarketDepthChart :exchanges="exchanges"></MarketDepthChart>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MarketDepthChart from '../components/MarketDepthChart.vue'

export default {
  name: 'MarketDepth',

  components: {
    MarketDepthChart,
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
