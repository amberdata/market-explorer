<template>
  <div>
    <h1>Assets</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <h3>Token Transfers</h3>
          <TokenTransfers :exchanges="exchanges"></TokenTransfers>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TokenTransfers from '../components/TokenTransfers.vue'

export default {
  name: 'Assets',

  components: {
    TokenTransfers,
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
