<template>
  <div>
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
        <span>R-RSSI</span>
      </div>
    </div>

    <v-heading class="indicator" :size="200" :heading="heading" />
    <v-attitude class="indicator" :size="200" :pitch="pitch" :roll="roll" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class Indicators extends Vue {
  get heading(): number {
    return this.$store.state.heading;
  }

  get pitch(): number {
    return this.$store.state.pitch;
  }

  get roll(): number {
    return this.$store.state.roll;
  }

  get rssiPercent(): number {
    return this.$store.state.rssiPercent;
  }

  get remoteRssiPercent(): number {
    return this.$store.state.remoteRssiPercent;
  }

  rssiLevel(level: number): string {
    return this.rssiPercent > level ? "visible" : "invisible";
  }

  remoteRssiLevel(level: number): string {
    return this.remoteRssiPercent > level ? "visible" : "invisible";
  }
}
</script>

<style scoped lang="scss">
$signal-strength-bar-height: 50px;
$signal-strength-bar-width: 80px;

.indicator {
  margin: 0 auto;
}

.visible {
  display: inline-block !important;
}

.invisible {
  display: none !important;
}

.signal-bars-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
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