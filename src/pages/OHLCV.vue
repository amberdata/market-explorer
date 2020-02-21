<template>
  <div>
    <h1>OHLCV</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <!-- <Card shadow>
          <OhlcvChart :exchanges="exchanges"></OhlcvChart>
        </Card> -->
        <Card v-if="exchanges" shadow>
          <RealtimeOhlcvChart :exchanges="exchanges"></RealtimeOhlcvChart>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OhlcvChart from '../components/OhlcvChart.vue'
import RealtimeOhlcvChart from '../components/RealtimeOhlcvChart.vue'

export default {
  name: 'OHLCV',

  components: {
    OhlcvChart,
    RealtimeOhlcvChart,
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
