<template>
  <div class="Tencent" @click="openTencent">
    <el-avatar 
      :size="40" 
      :src="circleUrl" 
      class="Tencent-header">
    </el-avatar>
    <p>在线<br/>咨询</p> 
    <!-- <a 
      href="http://wpa.qq.com/msgrd?v=3&uin=3001634218&site=qq&menu=yes"
      style="position: relative; z-index: 100">QQ咨询
    </a> -->
  </div>
</template>

<script>
export default {
  name: "Tencent",
  data() {
    return {
      circleUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/tencent.png',
    }
  },

  methods: {
    openTencent() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=3001634218&site=qq&menu=yes')
    }
  }
}
</script>

<style scoped lang="less">
.Tencent {
  display: flex;
  position: fixed;
  z-index: 2;
  right: 0;
  bottom: 120px;
  width: 120px;
  height: 60px;
  background: #002775;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  align-items: center;
  cursor: pointer;

  .Tencent-header {
    margin-left: 15px;
  }

  p {
    margin-left: 10px;
    color: #fff;
    font-size: 15px;
  }
}
</style>