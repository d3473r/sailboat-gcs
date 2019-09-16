<template>
  <div class="leaflet-map-wrapper">
    <!--
    <div class="map-info">
      <v-textarea
        id="textarea-gps"
        :no-resize="true"
        label="GPS log"
        hint="Paste your gps log here"
        v-on:input="handleGpsCvsChange"
      ></v-textarea>
    </div>
    -->
    <l-map
      class="leaflet-map"
      ref="map"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @click="handleMapClick"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-ais :lat-lng="boatPosition" :options="boatOptions">
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
    </l-map>
  </div>
</template>

<script>
import Vue from "vue";
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
import Vue2LeafletTracksymbol from "vue2-leaflet-tracksymbol";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-polyline", LPolyline);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);
Vue.component("l-icon", LIcon);
Vue.component("l-ais", Vue2LeafletTracksymbol);

export default {
  data() {
    return {
      url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 14,
      manualCenter: {
        lat: 0,
        lng: 0
      },
      snapOnBoat: true,
      polyline: {
        uuids: [],
        latlngs: [],
        color: "blue"
      },
      polylineCycle: {
        latlngs: [],
        color: "green"
      },
      markers: [],
      cyclic: false
    };
  },
  computed: {
    boatPosition: function() {
      return {
        lat: this.$store.state.lat,
        lng: this.$store.state.lon
      };
    },
    heading: function() {
      return this.$store.state.heading;
    },
    center: {
      get: function() {
        return this.snapOnBoat ? this.boatPosition : this.manualCenter;
      }
    },
    headingRadians: function() {
      return this.degrees_to_radians(this.heading);
    },
    boatOptions: function() {
      return {
        trackId: 1,
        fill: true,
        fillColor: "#00ffff",
        fillOpacity: 1.0,
        stroke: true,
        color: "#000000",
        opacity: 1.0,
        weight: 1.0,
        speed: this.$store.state.speed, // meter per second
        heading: this.headingRadians,
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
    }
  },
  methods: {
    degrees_to_radians(degrees) {
      var pi = Math.PI;
      return degrees * (pi / 180);
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.snapOnBoat = false;
      this.manualCenter = center;
    },
    isFirstMarker(id) {
      return this.polyline.uuids.indexOf(id) === 0;
    },
    isLastMarker(id) {
      return this.polyline.uuids.indexOf(id) === this.polyline.uuids.length - 1;
    },
    showCyclic(id) {
      return this.polyline.uuids.length > 1 && this.isLastMarker(id);
    },
    needUpdateCyclic(id) {
      return (
        this.polyline.uuids.length > 1 &&
        (this.isFirstMarker(id) || this.isLastMarker(id))
      );
    },
    updateCyclic() {
      if (this.cyclic) {
        const first = this.polyline.latlngs[0];
        const last = this.polyline.latlngs[this.polyline.latlngs.length - 1];
        Vue.set(this.polylineCycle.latlngs, 0, first);
        Vue.set(this.polylineCycle.latlngs, 1, last);
      }
    },
    handleMapClick(event) {
      const uuid = this.$uuid.v4();
      this.markers.push({
        id: uuid,
        latlng: event.latlng,
        content: "Another"
      });
      this.polyline.uuids.push(uuid);
      this.polyline.latlngs.push(event.latlng);
      this.updateCyclic();
    },
    handleMarkerDrag(event, id) {
      const index = this.polyline.uuids.indexOf(id);
      Vue.set(this.polyline.latlngs, index, event.target._latlng);
      if (this.needUpdateCyclic(id)) {
        this.updateCyclic();
      }
    },
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
    },
    handleDeleteClick(event, id) {
      const needCyclicUpdate = this.needUpdateCyclic(id);
      const index = this.polyline.uuids.indexOf(id);
      this.polyline.latlngs.splice(index, 1);
      this.polyline.uuids.splice(index, 1);
      this.markers.splice(index, 1);
      if (needCyclicUpdate) {
        this.updateCyclic();
      }
    },
    handleCyclicClick() {
      this.cyclic = !this.cyclic;
      this.updateCyclic();
      this.$refs.map.mapObject.closePopup();
    },
    handleGpsCvsChange(csv) {
      const parsedCsv = this.$papa.parse(csv);
      console.log(parsedCsv);
    }
  }
};
</script>

<style scoped lang="scss">
@import "~leaflet/dist/leaflet.css";

.leaflet-map-wrapper {
  width: 100%;
  height: 100%;
}

.leaflet-map {
  width: 100%;
  height: 100%;
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