<template>
  <div>
    <div class="grid-container">
      <div class="select">
        <v-select
          class="select-comPorts"
          :items="comPorts"
          item-text="comName"
          item-value="comName"
          label="Port"
          v-on:change="handleComPortChange"
        ></v-select>
      </div>

      <v-indicators class="indicators" />
      <v-leaflet class="map" />
    </div>
    <v-snackbar v-model="snackbar['enabled']" :color="snackbar['color']">{{ snackbar['message'] }}</v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { MAVLinkModule, MAVLinkMessage } from "@ifrunistuttgart/node-mavlink";

import Serialport, { PortInfo } from "serialport";
import { messageRegistry } from "../assets/mavlink/message-registry";

// eslint-disable-next-line
import { Heading, Attitude } from "vue-flight-indicators";

import { Heartbeat } from "@/assets/mavlink/messages/heartbeat";
import { RadioStatus } from "@/assets/mavlink/messages/radio-status";
import { BoatStatus } from "@/assets/mavlink/messages/boat-status";
import Leaflet from "./Leaflet.vue";
import Indicators from "./Indicators.vue";

Vue.component("v-heading", Heading);
Vue.component("v-attitude", Attitude);
Vue.component("v-leaflet", Leaflet);
Vue.component("v-indicators", Indicators);

// Converts from degrees to radians.
const radians = function(degrees: number) {
  return (degrees * Math.PI) / 180;
};

// Converts from radians to degrees.
const degrees = function(radians: number) {
  return (radians * 180) / Math.PI;
};

@Component
export default class SailboatGcs extends Vue {
  mavLink: MAVLinkModule;
  serialPort: Serialport;

  snackbar = {
    message: "",
    enabled: false,
    color: "success"
  };

  get initialized(): boolean {
    return this.$store.state.initialized;
  }

  get comPorts(): PortInfo[] {
    return this.$store.state.comPorts;
  }

  mounted() {
    Serialport.list().then((comPorts: PortInfo[]) => {
      this.$store.commit("setComPorts", comPorts);
    });
  }

  sendHeartbeat() {
    const heartbeat: Heartbeat = new Heartbeat(255, 0);
    const messages: MAVLinkMessage[] = Array<MAVLinkMessage>();
    messages.push(heartbeat);
    this.serialPort.write(this.mavLink.pack(messages));
  }

  handleComPortChange(comPort: string) {
    if (this.mavLink === undefined) {
      this.mavLink = new MAVLinkModule(messageRegistry, 255, false);
      this.mavLink.upgradeLink();
    }

    this.closeSerialPort();

    this.serialPort = new Serialport(comPort, {
      baudRate: 57600
    });

    window.setInterval(() => {
      this.sendHeartbeat();
    }, 1000);

    this.serialPort.on("open", (_: any) => {
      this.success(`Connection with port ${comPort} opened`);
    });

    this.serialPort.on("error", (e: Error) => {
      this.error(`Error communicating with port ${comPort}: ${e}`);
    });

    this.serialPort.on("data", (data: Buffer) => {
      // console.log(data.toString('hex'))
      this.mavLink.parse(data);
    });

    this.mavLink.on("error", (error: Error) => {
      // event listener for node-mavlink ALL error message
      console.error(error);
    });

    this.mavLink.on("message", (message: MAVLinkMessage) => {
      // event listener for all messages
      console.log(message);
    });

    this.mavLink.on("RADIO_STATUS", (message: RadioStatus) => {
      this.$store.commit(
        "setRssiPercent",
        this.mapRange(message.rssi, 0, 255, 0, 100)
      );

      this.$store.commit(
        "setRemoteRssiPercent",
        this.mapRange(message.remrssi, 0, 255, 0, 100)
      );
    });

    this.mavLink.on("BOAT_STATUS", (message: BoatStatus) => {
      this.$store.commit("setLat", message.lat / 10000000);
      this.$store.commit("setLon", message.lon / 10000000);
      this.$store.commit("setHeading", message.heading);
      this.$store.commit("setPitch", message.pitch);
      this.$store.commit("setRoll", message.roll);
      this.$store.commit("setSpeed", message.speed);
      this.$store.commit("setInitialized");
    });
  }

  mapRange = (
    value: number,
    in_min: number,
    in_max: number,
    out_min: number,
    out_max: number
  ) => ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

  success(message: string) {
    this.snackbar["color"] = "success";
    this.notify(message);
  }

  error(message: string) {
    this.snackbar["color"] = "error";
    this.notify(message);
  }

  notify(message: string) {
    this.snackbar["enabled"] = false;
    this.snackbar["message"] = message;
    this.snackbar["enabled"] = true;
  }

  closeSerialPort() {
    if (this.serialPort !== undefined && this.serialPort.isOpen) {
      this.serialPort.close();
    }
  }

  beforeDestroy() {
    this.closeSerialPort();
  }
}
</script>

<style scoped lang="scss">

.container {
  width: 100%;
  height: 100%;
}

.grid-container {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 1fr 10fr;
  grid-template-areas:
    ". select"
    "indicators map";
}

.map {
  grid-area: map;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.select {
  grid-area: select;
  width: 100%;
  height: 100%;
}

.indicators {
  grid-area: indicators;
  width: 100%;
  height: 100%;
}

.select-comPorts {
  width: 200px;
}

.indicators {
  display: flex;
  flex-direction: column;
}
</style>