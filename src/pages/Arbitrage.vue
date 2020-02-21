<template>
  <div>
    <h1>Arbitrage</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card v-if="exchanges" shadow>
          <ArbitrageList :exchanges="exchanges"></ArbitrageList>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArbitrageList from '../components/ArbitrageList.vue'

export default {
  name: 'Arbitrage',

  components: {
    ArbitrageList,
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
