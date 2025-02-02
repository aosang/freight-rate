<template>
  <div class="BackTop">
    <el-backtop></el-backtop>
  </div>
</template>

<script>
export default {
  name: 'BackTop',
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-backtop {
  bottom: 180px !important;
  right: 36px !important;
}
</style>