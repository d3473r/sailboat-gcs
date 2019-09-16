<template>
  <v-app>
    <v-content>
      <SailboatGcs />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import SailboatGcs from "./components/SailboatGcs.vue";

export default Vue.extend({
  name: "App",
  components: {
    SailboatGcs
  },
  data: () => ({
    //
  })
});
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>