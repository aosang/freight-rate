<template>
  <div class="MaskLoad" v-show="isMaskLoad">
    <img src="https://www.wangle.run/images/myImage/wj_online/wj_logo.png" alt="">
    <!-- <div class="wave" style="--c: #fa5601">WORLD PLAN</div>
    <div class="wave">WORLD JAGUAR</div> -->
  </div>
</template>

<script>
  export default {
    name: "MaskLoad",
    data() {
      return {
        isMaskLoad: true
      }
    },

    mounted() {
      this.onMaskLoadShow()
    },

    methods: {
      onMaskLoadShow() {
        setTimeout(() => {
          this.isMaskLoad = false
        }, 1800)
      }
    }
  }
</script>

<style scoped lang="less">
.MaskLoad {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  z-index: 2;

  .wave {
    --c: #1845a0;
    --w1: radial-gradient(100% 57% at top, #0000 100%, var(--c) 100.5%) no-repeat;
    --w2: radial-gradient(100% 57% at bottom, var(--c) 100%, #0000 100.5%) no-repeat;
    background: var(--w1), var(--w2), var(--w1), var(--w2);
    background-position-x: -200%, -100%, 0%, 100%;
    background-position-y: 100%;
    background-size: 50.5% 100%;
    animation: m 2s infinite linear;
    font-size: 86px;
    font-weight: bold;
    color: transparent;
    -webkit-background-clip: text;
    -webkit-text-stroke: 2px var(--c);
  }

  @keyframes m {
    0% {
      background-position-x: -200%, -100%, 0%, 100%;
    }
    100% {
      background-position-x: 0%, 100%, 200%, 300%;
    }
  }
}
</style>