import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
import 'leaflet/dist/leaflet.css'
const debugMenu = require('debug-menu');
debugMenu.install();

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./assets/icons/baseline-place-24px.svg'),
  iconUrl: require('./assets/icons/baseline-place-24px.svg'),
  shadowUrl: require('./assets/icons/blank.png'),
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
