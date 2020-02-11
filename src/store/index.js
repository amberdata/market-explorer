import Vue from 'vue'
import Vuex from 'vuex'

// Global Store
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: false,
  actions,
  getters,
  mutations,
  state,
})

export default store
