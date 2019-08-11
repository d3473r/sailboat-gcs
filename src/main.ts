import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import vuetify from './plugins/vuetify';
import { PortInfo } from 'serialport';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    comPorts: Array<PortInfo>(),
    heading: 0,
    pitch: 0,
    roll: 0,
    rssiPercent: 0,
    remoteRssiPercent: 0
  },
  mutations: {
    setComPorts(state, value) {
      state.comPorts = value
    },
    setHeading(state, value) {
      state.heading = value
    },
    setPitch(state, value) {
      state.pitch = value
    },
    setRoll(state, value) {
      state.roll = value
    },
    setRssiPercent(state, value) {
      state.rssiPercent = value;
    },
    setRemoteRssiPercent(state, value) {
      state.remoteRssiPercent = value;
    }
  }
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
