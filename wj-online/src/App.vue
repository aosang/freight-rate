<template>
  <div id="app">
    <MaskLoad />
    <router-view></router-view>
  </div>
</template>

<script>
  import MaskLoad from './components/MaskLoad/MaskLoad.vue'
  export default {
    components: {
      MaskLoad
    }
  }
</script>

<style>
/* 公共css */
@import './assets/css/common.css';
</style>
