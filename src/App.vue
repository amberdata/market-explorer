<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark">
          <div class="layout-logo">
            <img src="./assets/logo_terminal_assets.svg" alt="">
          </div>
          <div class="layout-nav">
            <Button v-if="!isAuthed" icon="md-unlock" :to="{ name: 'Settings' }" type="error" ghost>Authenticate</Button>
            <div v-else class="websocket-status">
              <Badge v-if="wsActive" status="processing" text="Connected" />
              <Badge v-else status="error" text="Disconnected" />
            </div>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="activePage" width="auto">
            <MenuItem name="1-1" :to="{ name: 'Home' }">
              <Icon type="ios-compass" />
              <span>Home</span>
            </MenuItem>
            <MenuItem name="6-1" :to="{ name: 'OHLCV' }">
              <Icon type="ios-stats" />
              <span>OHLCV</span>
            </MenuItem>
            <MenuItem name="5-1" :to="{ name: 'Market Depth' }">
              <Icon type="ios-analytics" />
              <span>Market Depth</span>
            </MenuItem>
            <MenuItem name="2-1" :to="{ name: 'Assets' }">
              <Icon type="logo-bitcoin" />
              <span>Assets</span>
            </MenuItem>
            <MenuItem name="3-1" :to="{ name: 'Arbitrage' }">
              <Icon type="md-wifi" />
              <span>Arbitrage</span>
            </MenuItem>
            <MenuItem name="4-1" :to="{ name: 'Blockchain' }">
              <Icon type="ios-albums" />
              <span>Blockchain</span>
            </MenuItem>
            <MenuItem name="8-1" :to="{ name: 'PriceComparison' }">
              <Icon type="md-git-compare" />
              <span>Asset Comparison</span>
            </MenuItem>
            <MenuItem name="9-1" :to="{ name: 'TransactionInspector' }">
              <Icon type="md-git-branch" />
              <span>Txn Inspector</span>
            </MenuItem>
            <MenuItem name="10-1" :to="{ name: 'Settings' }">
              <Icon type="ios-construct" />
              <span>Settings</span>
            </MenuItem>
          </Menu>

          <div class="poweredby-wrap">
            <a href="https://amberdata.io" target="_blank">
              <img src="./assets/amberdata_powered_logo.svg" alt="">
            </a>
          </div>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px', minHeight: 'calc(100vh - 90px)'}">
            <router-view />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',

  data() {
    return {
      activePage: '1-1',
    }
  },

  computed: {
    ...mapGetters(['apiKey', 'wsActive', 'authenticated']),
    isAuthed() {
      return this.authenticated
    },
  },

  methods: {
    ...mapActions(['loadApiKeyFromCache'])
  },

  mounted() {
    this.loadApiKeyFromCache()

    // Set the current selected menu link based on current route
    const name = this.$route.name
    switch (name) {
      case 'Home':
        this.activePage = '1-1'
        break;
      case 'Assets':
        this.activePage = '2-1'
        break;
      case 'Arbitrage':
        this.activePage = '3-1'
        break;
      case 'Blockchain':
        this.activePage = '4-1'
        break;
      case 'Market Depth':
        this.activePage = '5-1'
        break;
      case 'OHLCV':
        this.activePage = '6-1'
        break;
      case 'Summary':
        this.activePage = '7-1'
        break;
      case 'PriceComparison':
        this.activePage = '8-1'
        break;
      case 'TransactionInspector':
        this.activePage = '9-1'
        break;
      case 'Settings':
        this.activePage = '10-1'
        break;
      default:
        this.activePage = '1-1'
    }
  }
}
</script>

<style scoped>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.layout {
  background: #f9f9f9;
  position: relative;
  overflow: hidden;
}

.layout-logo {
  width: 170px;
  height: 100%;
  float: left;
  position: relative;
  display: flex;
}

.layout-logo img {
  width: 100%;
  margin: auto 0;
}

.layout-nav {
  display: flex;
  margin: 0 auto;
  margin-right: 20px;
}

.ivu-menu-horizontal {
  display: flex;
}

.ivu-layout-header {
  background: #515a6e;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
}

a.ivu-btn,
button.ivu-btn {
  margin: auto 20px;
}
</style>
<style>
.ivu-layout-sider .ivu-layout-sider-children {
  display: flex;
  flex-direction: column;
}

.poweredby-wrap {
  margin: auto 20px 20px;
}
.poweredby-wrap img {
  width: 100%;
}

.websocket-status .ivu-badge-status-text {
  color: white;
}
</style>
