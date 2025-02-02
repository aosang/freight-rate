<template>
  <div class="Login">
    <div class="Login-box">
      <div class="Login-box-l">
        <img src="https://wxa.worldjaguar.com/webview/images/wj_online/login_bg.jpg" @click="goToHome" alt="万嘉集运背景图">
      </div>
      <div class="Login-box-r">
        <h3>欢迎登录万嘉集运</h3>
        <div class="login-mask" v-if="isShow">二维码加载中...</div> 
        <div class="Login-code">
          <img :src="codeImg" alt="">
        </div>
        <div class="Login-text">
          <i class="el-icon el-icon-full-screen"></i>
          <p>请使用微信扫码二维码登录</p>
        </div>
        <div class="login-agreement">
          您登录即代表同意<a @click="goToAgreement">《用户服务协议》</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let timer = null
export default {
  name: 'Login',
  data() {
    return {
      codeImg: '',
      usercode: '',
      isShow: true,
      salesCode: ''
    }
  },

  mounted() {
    let codes = window.location.href
    if(codes.indexOf('?') == -1) {
      this.salesCode = ''
    }else {
      let sub = codes.split('?')
      let subs = sub[1].split('#')
      this.salesCode = subs[0].split('=')[1]
    }

    this.getCodeImages()
  },

  methods: {
    async getCodeImages() {
      const {data: res} = await this.$http.post('wxapp/qrcode', {
        path: 'pages/home/home',
        responseType: 'arraybuffer',
        salesCode: this.salesCode
      })
      try{
        if(res.code === 200) {
          this.codeImg = res.data.base64
          this.usercode = res.data.pccode
          this.isShow = false

          // 每隔5s轮询一次
          timer = setInterval(()=> {
            this.getFindUserInfo()
          }, 5000)
        }
      }catch(error){
        console.log(error)
      }
    },

    // 轮询用户数据表
    async getFindUserInfo() {
      const {data: res} = await this.$http.post('login/pclogin', {
        Pccode: this.usercode
      })
      try{
        if(res.code === 200) {
          window.localStorage.setItem('loginInfo', JSON.stringify(res.data))
          clearInterval(timer)
          this.$router.push({
            path: '/Home',
          })
        }
      }catch(error) {
        console.log(error)
      }
    },

    goToHome() {
      this.$router.push({
        path: '/Home'
      })
    },

    goToAgreement() {
      this.$router.push({
        path: '/Agreement'
      })
    }
  }
}
</script>

<style scoped lang="less">
.Login {
  position: relative;
  width: 100%;
  height: 100vh;

  .Login-box {
    display: flex;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 750px;
    height: 510px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 5px 5px 10px #ccc;

    @media screen and (max-width: 1366px) {
      top: 50%;
    }

    .Login-box-l {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        cursor: pointer;
      }
    }

    .Login-box-r {
      position: relative;
      width: 50%;
      padding: 0 24px;

      .login-agreement {
        text-align: center;
        font-size: 14px;
        margin-top: 30px;
        a {
          color: #073290;
          text-decoration: underline;
          &:hover {
            cursor: pointer;
          }
        }
      }

      .login-mask {
        position: absolute;
        top: 102px;
        left: 50%;
        transform: translateX(-50%);
        width: 228px;
        height: 228px;
        background: #fff;
        text-align: center;
        line-height: 224px;
        font-size: 20px;
        color: #555;
      }

      h3 {
        margin-top: 30px;
        font-weight: 550;
        font-size: 26px;
        letter-spacing: 1px;
        text-align: center;
      }

      p {
        font-size: 13px;
        margin-top: 8px;

        a {
          color: #073290;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }

      .Login-code {
        width: 220px;
        height: 220px;
        margin: 40px auto 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .Login-text {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #555;
        .el-icon {
          font-size: 30px;
          margin-right: 10px;
        }

        p{
          font-size: 16px;
        }
      }

      .Login-form {
        width: 100%;
        margin-top: 20px;

        .el-input {
          width: 300px;

          img {
            width: 100%;
          }
        }

        .login-forgot {
          position: absolute;
          top: 32px;
          right: 0;
          width: 65px;
          display: flex;
          justify-content: flex-end;
          font-size: 12px;
          color: #073290;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
  }

  .el-dialog {
    .el-input {
      width: 500px;

      img {
        width: 100%;
      }
    }
  }
}

.el-form-item {
  margin-bottom: 25px;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

/deep/ .el-input-group__append {
  width: 90px;
}
</style>