<template>
  <div>
    <h1>Digital Assets Overview</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <Summary :exchanges="exchanges" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Summary from '../components/Summary.vue'

export default {
  name: 'Summarys',

  components: {
    Summary,
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
