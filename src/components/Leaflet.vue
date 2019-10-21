<template>
  <div class="leaflet-map-wrapper">
    <l-map
      class="leaflet-map"
      ref="map"
      :zoom="zoom"
      @update:zoom="zoomUpdated"
      @dragend="dragMap"
      @click="handleMapClick"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-ais v-if="mapMode === 'edit'" :lat-lng="boatPosition" :options="boatOptions">
        <l-popup content="Discovery 2" />
      </l-ais>
      <l-marker
        v-for="item in markers"
        :key="item.id"
        :lat-lng="item.latlng"
        :draggable="true"
        @drag="handleMarkerDrag($event, item.id)"
      >
        <l-popup>
          <div v-on:click="handleSaveClick">
            <v-btn color="primary" dark class="popup-button">
              Save
              <v-icon dark right>save</v-icon>
            </v-btn>
          </div>
          <div v-on:click="handleDeleteClick($event, item.id)">
            <v-btn color="red" dark class="popup-button">
              Delete
              <v-icon dark right>delete</v-icon>
            </v-btn>
          </div>
          <div v-if="showCyclic(item.id)" v-on:click="handleCyclicClick">
            <v-btn color="green" dark class="popup-button">
              Cyclic
              <v-icon dark right>refresh</v-icon>
            </v-btn>
          </div>
        </l-popup>
      </l-marker>
      <l-polyline ref="polyline" :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>
      <l-polyline
        v-if="cyclic"
        ref="polylineCycle"
        :lat-lngs="polylineCycle.latlngs"
        :color="polylineCycle.color"
      ></l-polyline>
      <div v-if="mapMode === 'replay'">
        <l-marker
          v-for="item in activeReplayWaypoints"
          :key="item.id"
          :lat-lng="item.latlng"
          :icon="replayIcon"
        ></l-marker>
      </div>
    </l-map>
    <v-icon large v-if="!snapOnBoat" class="snapOnBoat" @click="clickSnapOnBoat">mdi-crosshairs</v-icon>
    <span v-if="mapMode === 'replay'" class="replayTimestamp">{{ replayTimestampFormatted }}</span>
    <slider v-if="mapMode === 'replay'" class="slider"></slider>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import {
  LMap,
  LTileLayer,
  LPolyline,
  LMarker,
  LPopup,
  LIcon
} from "vue2-leaflet";
import FileSaver from "file-saver";
import { error } from "util";
import Slider from "./Slider.vue";
import Vue2LeafletTracksymbol from "../assets/js/Vue2LeafletTracksymbol";
import { Modes } from "../models/modes";
import { ReplayWaypoint } from "../models/replayWaypoint";
import { isBefore, format } from "date-fns";
const uuidv4 = require("uuid/v4");

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-polyline", LPolyline);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);
Vue.component("l-icon", LIcon);
Vue.component("l-ais", Vue2LeafletTracksymbol);
Vue.component("slider", Slider);

@Component
export default class Leaflet extends Vue {
  @Prop(String) readonly mapMode?: Modes;
  url = "https://{s}.tile.osm.org/{z}/{x}/{y}.png";
  zoom = 14;
  polyline = {
    uuids: [],
    latlngs: [],
    color: "blue"
  };
  polylineCycle = {
    latlngs: [],
    color: "green"
  };
  markers = [];
  cyclic = false;
  boatOptions = {
    trackId: 1,
    fill: true,
    fillColor: "#00ffff",
    fillOpacity: 1.0,
    stroke: true,
    color: "#000000",
    opacity: 1.0,
    weight: 1.0,
    speed: 0,
    heading: 0,
    size: 24,
    defaultSymbol: [
      0.75,
      0,
      0.5,
      0.3,
      -0.5,
      0.3,
      -0.25,
      0,
      -0.5,
      -0.3,
      0.5,
      -0.3
    ]
  };
  replayIcon = L.icon({
    iconRetinaUrl: require("../assets/icons/circle.svg"),
    iconUrl: require("../assets/icons/circle.svg"),
    shadowUrl: require("../assets/icons/blank.png"),
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  get mapObject() {
    return this.$store.state.mapObject;
  }

  get boatPosition() {
    return this.$store.state.boatPosition;
  }

  get replayWaypoints(): Array<ReplayWaypoint> {
    return this.$store.state.replayWaypoints;
  }

  get replayTimestamp(): Date {
    return this.$store.state.replayTimestamp;
  }

  get snapOnBoat(): boolean {
    return this.$store.state.snapOnBoat;
  }

  @Watch('replayTimestamp')
  onReplayTimestampChanged(val: Date, oldVal: Date) {
    const boatPosition = this.activeReplayWaypoints[this.activeReplayWaypoints.length - 1].latlng;
    this.$store.commit("setBoatPosition", boatPosition);
  }

  get replayTimestampFormatted(): String {
    if (this.replayTimestamp === undefined) {
      return "";
    } else {
      return format(this.replayTimestamp, "dd.MM.yyyy HH:mm:ss");
    }
  }

  get activeReplayWaypoints(): Array<ReplayWaypoint> {
    const activeReplayWaypoints: Array<ReplayWaypoint> = [];
    for (let elem of this.replayWaypoints) {
      if (isBefore(elem.timestamp, this.replayTimestamp)) {
        activeReplayWaypoints.push(elem);
      } else {
        break;
      }
    }
    return activeReplayWaypoints;
  }

  mounted() {
    this.$store.commit("setMapObject", this.$refs.map);
  }

  clickSnapOnBoat() {
    this.$store.commit("setSnapOnBoat", true);
    this.mapObject.setCenter(this.boatPosition);
  }

  reset() {
    this.markers = [];
    this.cyclic = false;
    this.polyline.uuids = [];
    this.polyline.latlngs = [];
    this.polylineCycle.latlngs = [];
  }

  zoomUpdated(zoom: number) {
    this.zoom = zoom;
  }

  dragMap(center: any) {
    this.$store.commit("setSnapOnBoat", false);
  }

  isFirstMarker(id: number) {
    return this.polyline.uuids.indexOf(id) === 0;
  }

  isLastMarker(id: number) {
    return this.polyline.uuids.indexOf(id) === this.polyline.uuids.length - 1;
  }

  showCyclic(id: number) {
    return this.polyline.uuids.length > 1 && this.isLastMarker(id);
  }

  needUpdateCyclic(id: number) {
    return (
      this.polyline.uuids.length > 1 &&
      (this.isFirstMarker(id) || this.isLastMarker(id))
    );
  }

  updateCyclic() {
    if (this.cyclic) {
      const first = this.polyline.latlngs[0];
      const last = this.polyline.latlngs[this.polyline.latlngs.length - 1];
      Vue.set(this.polylineCycle.latlngs, 0, first);
      Vue.set(this.polylineCycle.latlngs, 1, last);
    }
  }

  handleMapClick(event: any) {
    if (this.mapMode == Modes.EDIT) {
      const uuid = uuidv4();
      this.markers.push({
        id: uuid,
        latlng: event.latlng,
        content: "Another"
      });
      this.polyline.uuids.push(uuid);
      this.polyline.latlngs.push(event.latlng);
      this.updateCyclic();
    }
  }

  handleMarkerDrag(event: Event, id: number) {
    const index = this.polyline.uuids.indexOf(id);
    Vue.set(this.polyline.latlngs, index, event.target._latlng);
    if (this.needUpdateCyclic(id)) {
      this.updateCyclic();
    }
  }

  handleSaveClick() {
    const geoJson = this.$refs.polyline.mapObject.toGeoJSON();
    Vue.set(
      geoJson["properties"],
      "cyclic",
      this.polyline.uuids.length > 1 && this.cyclic
    );
    const blob = new Blob([JSON.stringify(geoJson)], {
      type: "application/json"
    });
    FileSaver.saveAs(blob, "waypoints.json");
    this.$refs.map.mapObject.closePopup();
  }

  handleDeleteClick(event: Event, id: number) {
    const needCyclicUpdate = this.needUpdateCyclic(id);
    const index = this.polyline.uuids.indexOf(id);
    this.polyline.latlngs.splice(index, 1);
    this.polyline.uuids.splice(index, 1);
    this.markers.splice(index, 1);
    if (needCyclicUpdate) {
      this.updateCyclic();
    }
  }

  handleCyclicClick() {
    this.cyclic = !this.cyclic;
    this.updateCyclic();
    this.$refs.map.mapObject.closePopup();
  }
}
</script>

<style scoped lang="scss">
@import "~leaflet/dist/leaflet.css";

.leaflet-map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.snapOnBoat {
  cursor: pointer;
  position: absolute;
  bottom: 48px;
  right: 8px;
  z-index: 10;
}

.replayTimestamp {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.slider {
  position: absolute;
  bottom: 0px;
  left: 8px;
  right: 8px;
  z-index: 10;
}

#textarea-gps {
  height: 250px;
}
.icon {
  cursor: pointer;
}
.popup-button {
  width: 100%;
}
.v-btn {
  margin: 6px 0;
}
.leaflet-shadow-pane {
  display: none;
}
</style>