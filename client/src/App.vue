<template>
  <Donation />
</template>

<script>
import Donation from "./components/Donation.vue";

export default {
  name: "App",
  components: {
    Donation,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
