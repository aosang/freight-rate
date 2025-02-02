<template>
  <div class="NotFound">
      <div class="NotFound-container">
        <img src="https://wxa.worldjaguar.com/webview/images/wj_online/not_found.png" alt="not page">
        <span>404 NotFound Page</span>
        <el-button 
          type="primary" 
          size="lagre"
          @click="BackHomePage">
            Back To HomePage
        </el-button>
        <a href="https://beian.miit.gov.cn/" target="blank">Copyright © 2022 - 2023 鲁ICP备11007633号-2</a>
      </div>
    </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {}
  },
  
  methods: {
    BackHomePage() {
      this.$router.push({
        path: '/Home'
      })
    }
  }
}
</script>

<style scoped lang="less">
body {
  position: relative;
  height: 100%;
}
.NotFound {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -30%);
  width: 1366px;
  margin: 0 auto;
  background: #fff;
  padding: 60px 0;
  border-radius: 20px;
  box-shadow: 5px 5px 15px #ccc;

  .NotFound-container {
    width: 600px;
    margin: 0 auto;
    img {
      display: block;
      margin: 0 auto;
    }

    span {
      display: block;
      text-align: center;
      font-size: 30px;
      font-weight: 600;
      margin-top: 20px;
      color: #333;
    }

    ::v-deep .el-button {
      display: block;
      font-size: 20px;
      margin: 20px auto 0 auto;
    }

    a {
      display: block;
      font-size: 14px;
      color: #555;
      text-align: center;
      margin: 40px;
      text-decoration: none;
    }
  }
}
</style>