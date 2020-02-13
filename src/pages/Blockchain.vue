<template>
  <div>
    <h1>Blockchain</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <BlockchainBlocks :exchanges="exchanges"></BlockchainBlocks>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BlockchainBlocks from '../components/BlockchainBlocks.vue'

export default {
  name: 'Blockchain',

  components: {
    BlockchainBlocks,
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
