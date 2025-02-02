<template>
  <div class="Serve" @click="open">
    <el-avatar :size="40" :src="circleUrl" class="Serve-header">
    </el-avatar>
    <p>Consult<br />Service</p>
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
            <span style="color: #3d404e; font-weight: 550">Service：</span>
            <p>Lily Wu</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">Phone：</span>
            <p>0532-60607981</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">QQ：</span>
            <p>3001634218</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">Email：</span>
            <p>lclservice@wplx.com</p>
          </div>
          <div class="Contact-item" style="margin-bottom: 10px">
            <span style="color: #3d404e; font-weight: 550">Address：</span>
            <p>36/Flagship Tower New World Cyber port, No.40 Hongkong Middle Road, Qingdao 266071,China</p>
          </div>
        </div>
      `
    }
  },

  methods: {
    open() {
      this.$notify({
        title: 'Contact Info：',
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
  width: 140px;
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