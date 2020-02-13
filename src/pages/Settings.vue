<template>
  <div>
    <h1>Settings</h1>
    <Row style="padding: 20px 0">
      <Col span="24">
        <Card shadow>
          <h4>Amberdata API Key</h4>
          <Input v-model="key" placeholder="UAK...1234" @on-blur="updateKey" style="width: 300px" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',

  data() {
    return {
      key: '',
    }
  },

  computed: {
    ...mapGetters(['apiKey']),
  },

  methods: {
    ...mapActions(['setApiKey', 'setWeb3dataProvider']),
    updateKey() {
      this.setApiKey(this.key)
      this.setWeb3dataProvider()
    },
  },

  mounted() {
    if (this.apiKey) this.key = this.apiKey
  },
}
</script>

<style>
</style>
