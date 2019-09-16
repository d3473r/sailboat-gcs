import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import vuetify from './plugins/vuetify';
import { PortInfo } from 'serialport';
import UUID from 'vue-uuid';
import 'leaflet/dist/leaflet.css'

import L from 'leaflet';

// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./assets/icons/baseline-place-24px.svg'),
  iconUrl: require('./assets/icons/baseline-place-24px.svg'),
  shadowUrl: require('./assets/icons/blank.png'),
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    comPorts: Array<PortInfo>(),
    initialized: false,
    lat: 0,
    lon: 0,
    heading: 0,
    pitch: 0,
    roll: 0,
    speed: 0,
    rssiPercent: 0,
    remoteRssiPercent: 0
  },
  mutations: {
    setComPorts(state, value) {
      state.comPorts = value
    },
    setInitialized(state) {
      state.initialized = true
    },
    setLat(state, value) {
      state.lat = value
    },
    setLon(state, value) {
      state.lon = value
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
    setSpeed(state, value) {
      state.speed = value
    },
    setRssiPercent(state, value) {
      state.rssiPercent = value;
    },
    setRemoteRssiPercent(state, value) {
      state.remoteRssiPercent = value;
    }
  }
})

// eslint-disable-next-line
Vue.use(UUID);
Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
