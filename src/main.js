// -------------------------------------------------------------------------------------------------

import Vue from 'vue'

import App from './components/Platform.vue'
import store from './store'
import websocket from './common/websockets'

Vue.prototype.$websocket = websocket;
websocket.setStore(store);

// -------------------------------------------------------------------------------------------------

new Vue({
  store,
  el: '#app',
  render: h => h(App),
}).$mount('#app');

// -------------------------------------------------------------------------------------------------
