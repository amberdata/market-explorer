// -------------------------------------------------------------------------------------------------

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// -------------------------------------------------------------------------------------------------

export default new Vuex.Store({
  state: {
    block: null,
    pending_transaction: null,
  },
  getters: {
    block: state => state.block,
    pending_transaction: state => state.pending_transaction,
  },
  actions: {
    update(state, message) {
      state.commit('SOCKET_UPDATE', message)
    },
  },
  mutations: {
    SOCKET_UPDATE(state, message) {
      console.log('[WS] internal event', message.type, message.result);
      switch (message.type) {
        case 'block':
          state.block = message.result;
          break;
        case 'pending_transaction':
          state.pending_transaction = message.result;
          break;
      }
    },
  },
})

// -------------------------------------------------------------------------------------------------
