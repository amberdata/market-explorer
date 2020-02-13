<template>
  <div>
    <h1>Arbitrage</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <ArbitragePairs :exchanges="exchanges"></ArbitragePairs>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArbitragePairs from '../components/ArbitragePairs.vue'

export default {
  name: 'Arbitrage',

  components: {
    ArbitragePairs,
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
