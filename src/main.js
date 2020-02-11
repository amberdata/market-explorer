import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import store from './store'
import router from './router'
import App from './App'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import './theme/index.css'

Vue.config.productionTip = false
Vue.use(ViewUI, {})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
  router,
})
