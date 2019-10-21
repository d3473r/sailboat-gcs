import Vue from 'vue'
import Vuex from 'vuex'
import { PortInfo } from 'serialport';
import { ReplayWaypoint } from '../models/replayWaypoint';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    comPorts: Array<PortInfo>(),
    boatObject: null,
    mapObject: null,
    initialized: false,
    boatPosition: {
      lat: 0,
      lng: 0
    },
    heading: 0,
    pitch: 0,
    roll: 0,
    speed: 0,
    rssiPercent: 0,
    remoteRssiPercent: 0,
    replayWaypoints: Array<ReplayWaypoint>(),
    replayInterval: undefined,
    replayTimestamp: undefined,
    snapOnBoat: true
  },
  mutations: {
    setComPorts(state, value) {
      state.comPorts = value
    },
    setInitialized(state) {
      state.initialized = true
    },
    setBoatPosition(state, value) {
      state.boatPosition = value;
      if (state.snapOnBoat === true) {
        state.mapObject.setCenter(value);
      }
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
    setMapObject(state, value) {
      state.mapObject = value;
    },
    setReplayWaypoints(state, value) {
      state.replayWaypoints = value;
    },
    setReplayInterval(state, value) {
      state.replayInterval = value;
    },
    setReplayTimestamp(state, value) {
      state.replayTimestamp = value;
    },
    setSnapOnBoat(state, value) {
      state.snapOnBoat = value;
    }
  }
})