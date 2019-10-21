<template>
  <div class="sliderWrapper">
    <v-icon large v-if="!playing" @click="clickPlay">mdi-play</v-icon>
    <v-icon large v-if="playing" @click="clickPause">mdi-pause</v-icon>
    <v-slider :max="replayLength" @change="changeSlider" :value="sliderValue" class="v-slider"></v-slider>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { ReplayWaypoint } from "../models/replayWaypoint";
import {
  addSeconds,
  startOfSecond,
  endOfSecond,
  differenceInSeconds
} from "date-fns";

@Component
export default class Slider extends Vue {
  sliderValue = 0;
  playing = false;

  get replayWaypoints(): Array<ReplayWaypoint> {
    return this.$store.state.replayWaypoints;
  }

  get replayWaypointsLength(): number {
    return this.replayWaypoints.length;
  }

  get replayLength(): number {
    return differenceInSeconds(
      endOfSecond(
        this.replayWaypoints[this.replayWaypointsLength - 1].timestamp
      ),
      startOfSecond(this.replayWaypoints[0].timestamp)
    );
  }

  get replayInterval(): any {
    return this.$store.state.replayInterval;
  }

  get replayTimestamp(): Date {
    return this.$store.state.replayTimestamp;
  }

  changeSlider(step: number) {
    this.$store.commit(
      "setReplayTimestamp",
      this.replayWaypoints[step].timestamp
    );
    this.sliderValue = step;
  }

  clickPlay() {
    this.playing = true;
    if (this.replayTimestamp === undefined) {
      if (this.replayWaypointsLength > 0) {
        this.$store.commit(
          "setReplayTimestamp",
          this.replayWaypoints[0].timestamp
        );
      }
    }
    const interval = setInterval(() => {
      if (this.sliderValue === this.replayLength) {
        this.clickPause();
      } else {
        if (this.replayTimestamp !== undefined) {
          this.$store.commit(
            "setReplayTimestamp",
            addSeconds(this.replayTimestamp, 1)
          );
          this.sliderValue++;
        }
      }
    }, 1000);
    this.$store.commit("setReplayInterval", interval);
  }

  clickPause() {
    this.playing = false;
    clearInterval(this.replayInterval);
  }
}
</script>

<style scoped lang="scss">
.sliderWrapper {
  display: flex;
  align-items: flex-end;
}

.v-slider {
  padding-left: 16px;
}
</style>