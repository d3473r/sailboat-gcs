import Vue from 'vue'
import Vuex from 'vuex'
import { PortInfo } from 'serialport';
import { ReplayWaypoint } from '../models/replayWaypoint';
import { VLabel } from 'vuetify/lib';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    comPorts: Array<PortInfo>(),
    boatObject: null,
    initialized: false,
    lat: 0,
    lon: 0,
    heading: 0,
    pitch: 0,
    roll: 0,
    speed: 0,
    rssiPercent: 0,
    remoteRssiPercent: 0,
    replayWaypoints: Array<ReplayWaypoint>(),
    replayInterval: undefined,
    replayTimestamp: undefined
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
      if (state.boatObject !== null) {
        state.boatObject.setHeading(value * (Math.PI / 180))
      }
    },
    setPitch(state, value) {
      state.pitch = value
    },
    setRoll(state, value) {
      state.roll = value
    },
    setSpeed(state, value) {
      state.speed = value
      if (state.boatObject !== null) {
        state.boatObject.setSpeed(value)
      }
    },
    setRssiPercent(state, value) {
      state.rssiPercent = value;
    },
    setRemoteRssiPercent(state, value) {
      state.remoteRssiPercent = value;
    },
    setBoatObject(state, value) {
      state.boatObject = value;
    },
    setReplayWaypoints(state, value) {
      state.replayWaypoints = value;
    },
    setReplayInterval(state, value) {
      state.replayInterval = value;
    },
    setReplayTimestamp(state, value) {
      state.replayTimestamp = value;
    }
  }
})