<template>
  <v-container>
    <v-select
      :items="comPorts"
      item-text="comName"
      item-value="comName"
      label="Port"
      v-on:change="handleComPortChange"
    ></v-select>

    <div class="indicators">
      <div class="signal-bars-wrapper">
        <div class="signal-bars">
          <div class="bars">
            <div class="first-bar bar" v-bind:class="rssiLevel(10)"></div>
            <div class="second-bar bar" v-bind:class="rssiLevel(30)"></div>
            <div class="third-bar bar" v-bind:class="rssiLevel(50)"></div>
            <div class="fourth-bar bar" v-bind:class="rssiLevel(70)"></div>
            <div class="fifth-bar bar" v-bind:class="rssiLevel(90)"></div>
          </div>
          <span>RSSI</span>
        </div>

        <div class="signal-bars">
          <div class="bars">
            <div class="first-bar bar" v-bind:class="remoteRssiLevel(10)"></div>
            <div class="second-bar bar" v-bind:class="remoteRssiLevel(30)"></div>
            <div class="third-bar bar" v-bind:class="remoteRssiLevel(50)"></div>
            <div class="fourth-bar bar" v-bind:class="remoteRssiLevel(70)"></div>
            <div class="fifth-bar bar" v-bind:class="remoteRssiLevel(90)"></div>
          </div>
          <span>REMOTE RSSI</span>
        </div>
      </div>

      <v-heading :size="200" :heading="heading" />
      <v-attitude :size="200" :pitch="pitch" :roll="roll" />
    </div>

    <v-snackbar v-model="snackbar['enabled']" :color="snackbar['color']">{{ snackbar['message'] }}</v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { MAVLinkModule, MAVLinkMessage } from "@ifrunistuttgart/node-mavlink";

import Serialport, { PortInfo } from "serialport";
import { messageRegistry } from "../assets/mavlink/message-registry";

/* eslint-disable */
import { Heading, Attitude } from "vue-flight-indicators";
import { Heartbeat } from "@/assets/mavlink/messages/heartbeat";
import { RadioStatus } from "@/assets/mavlink/messages/radio-status";
import { BoatStatus } from "@/assets/mavlink/messages/boat-status";
/* eslint-enable */

Vue.component("v-heading", Heading);
Vue.component("v-attitude", Attitude);

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
  serialPort: SerialPort;

  snackbar = {
    message: "",
    enabled: false,
    color: "success"
  };

  get heading(): number {
    return this.$store.state.heading;
  }

  get pitch(): number {
    return this.$store.state.pitch;
  }

  get roll(): number {
    return this.$store.state.roll;
  }

  get comPorts(): PortInfo[] {
    return this.$store.state.comPorts;
  }

  get rssiPercent(): number {
    return this.$store.state.rssiPercent;
  }

  get remoteRssiPercent(): number {
    return this.$store.state.remoteRssiPercent;
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
      console.log(this.mapRange(message.rssi, 0, 255, 0, 100));
      this.$store.commit(
        "setRemoteRssiPercent",
        this.mapRange(message.remrssi, 0, 255, 0, 100)
      );
    });

    this.mavLink.on("BOAT_STATUS", (message: BoatStatus) => {
      this.$store.commit("setHeading", message.heading);
      this.$store.commit("setPitch", message.pitch);
      this.$store.commit("setRoll", message.roll);
    });
  }

  rssiLevel(level: number): string {
    console.log(this.rssiPercent, level, this.rssiPercent > level);
    return this.rssiPercent > level ? "visible" : "invisible";
  }

  remoteRssiLevel(level: number): string {
    return this.remoteRssiPercent > level ? "visible" : "invisible";
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

<style lang="scss">
$signal-strength-bar-height: 50px;
$signal-strength-bar-width: 80px;

.visible {
  display: inline-block !important;
}

.invisible {
  display: none !important;
}

.indicators {
  display: flex;
  flex-direction: column;
}

.signal-bars-wrapper {
  display: flex;
  flex-direction: row;
}

.signal-bars {
  display: flex;
  flex-direction: column;
}

.bars {
  display: inline-block;
  height: $signal-strength-bar-height;
  width: $signal-strength-bar-width;
}
.bars .bar {
  width: 14%;
  margin-left: 1%;
  min-height: 20%;
  display: inline-block;
}
.bars .bar.first-bar {
  height: 20%;
}
.bars .bar.second-bar {
  height: 40%;
}
.bars .bar.third-bar {
  height: 60%;
}
.bars .bar.fourth-bar {
  height: 80%;
}
.bars .bar.fifth-bar {
  height: 100%;
}
.bar {
  background-color: #2196f3;
}
</style>