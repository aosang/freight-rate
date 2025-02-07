<template>
  <div class="Footer">
    <!-- <p>Copyright © 2022 - 2023 <a href="https://beian.miit.gov.cn/" target="__blank">鲁ICP备11007633号-2</a></p> -->
  </div>
</template>

<script>
  export default {
    name: 'Footer',
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="less">
.Footer {
  position: absolute;
  left: 50%;
  bottom: 10px;
  width: 100%;
  transform: translate(-50%);
  text-align: center;
  p, a {
    color: #fff;
    font-size: 15px;
  }
}
</style>