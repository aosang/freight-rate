<template>
  <div class="Serve" @click="open">
    <el-avatar :size="40" :src="circleUrl" class="Serve-header"></el-avatar>
    <p>客服<br/>信息</p>
  </div>
</template>

<script>
export default {
  name: 'Serve',
  data() {
    return {
      circleUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/miles.png',
      serve: `
        <div class="Contact">
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">客服支持：</span>
            <p>吴翠丽</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">电话号码：</span>
            <p>0532-68607931</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">QQ号码：</span>
            <p>3001634218</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">电子邮箱：</span>
            <p>lclservice@wplx.com</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">公司地址：</span>
            <p>青岛市香港中路40号新世界数码港旗舰大厦36层</p>
          </div>
        </div>
      `
    }
  },

  methods: {
    open() {
      this.$notify({
        title: '联系信息：',
        dangerouslyUseHTMLString: true,
        message: this.serve,
        position: 'bottom-right',
        duration: 0,
      })
    }
  }
}
</script>

<style scoped lang="less">
.Serve {
  display: flex;
  position: fixed;
  z-index: 2;
  right: 0;
  bottom: 40px;
  width: 120px;
  height: 60px;
  background: #002775;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  align-items: center;
  cursor: pointer;

  .Serve-header {
    margin-left: 15px;
  }

  p {
    margin-left: 10px;
    color: #fff;
    font-size: 15px;
  }
}

</style>