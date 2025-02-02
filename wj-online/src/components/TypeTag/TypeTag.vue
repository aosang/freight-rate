<template>
  <div class="TypeTag" :style="{backgroundColor: bgColor}">
    <slot name="slot-text"></slot>
  </div>
</template>

<script>
export default {
  name: 'TypeTag',
  props: {
    bgColor: {
      // type: String,
      default: '#ccc'
    } 
  }
}
</script>

<style scoped lang="less">
.TypeTag {
  position: fixed;
  right: 0;
  bottom: 200px;
  width: 120px;
  height: 44px;
  color: #fff;
  font-size: 15px;
  text-align: center;
  line-height: 44px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
</style>