import Vue from 'vue'

export default {
  // Generic Update
  update({ commit }, { key, value }) {
    commit('UPDATE', { key, value })
  },
  setApiKey({ commit }, apiKey) {
    localStorage.setItem('apiKey', apiKey)
    commit('UPDATE', { key: 'apiKey', value: apiKey })
  },
  loadApiKeyFromCache({ commit, dispatch, state }) {
    if (state.apiKey) return
    const apiKey = localStorage.getItem('apiKey')
    if (apiKey) {
      commit('UPDATE', { key: 'apiKey', value: apiKey })
      dispatch('setWeb3dataProvider')
    }
  },
  socketUpdate({ commit }, data) {
    commit('SOCKET_UPDATE', data)
  },
  websocketConnect({ commit }, data) {
    Vue.prototype.$w3d.connect(res => {
      commit('UPDATE', { key: 'wsActive', value: true })
    })
  },
  async setWeb3dataProvider({ state, commit, dispatch }) {
    if (window.Web3Data) {
      Vue.prototype.$w3d = new window.Web3Data(state.apiKey)

      try {
        const latest = await Vue.prototype.$w3d.block.getBlock('latest')
        if (latest) {
          // if we have data, we're authed AND we have a block:
          commit('UPDATE', { key: 'authenticated', value: true })
          commit('UPDATE', { key: 'block', value: latest })

          // connect to WS
          dispatch('websocketConnect')
        }
      } catch (e) {
        console.log('INVALID API KEY')
      }
    }
  },

  async getExchanges({ commit }) {
    if (!Vue.prototype.$w3d) return
    const { exchanges } = await Vue.prototype.$w3d.market.getFeatures(['exchanges'])

    commit('UPDATE', { key: 'exchanges', value: exchanges })
  }
}
