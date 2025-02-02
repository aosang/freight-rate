<template>
  <header>
    <div class="Header-top">
      <!-- nav-left -->
      <div class="Header-l">
        <div class="Header-l-text">Welcome to World Jaguar official website</div>
        <el-dropdown placement="bottom">
          <span class="el-dropdown-link">
            Mobile website
            <el-icon class="el-icon-link"></el-icon>
          </span>
          <el-dropdown-menu slot="dropdown" class="Header-down">
            <div>
              <img 
                style="width: 320px" 
                class="Header-mini" 
                src="https://wxa.worldjaguar.com/webview/images/wj_online/h5_en.png">
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- nav-right -->
      <div class="Header-r">
        <!-- <a href="http://online.worldjaguar.com" target="_blank">
          <span>中文</span>
        </a> -->
        <!-- <a href="http://192.168.0.133/wj_online/index.html" target="_blank">
          <span>中文</span>
        </a> -->
        <!-- <a>
          <span>EN</span>
        </a> -->
      </div>
    </div>
    <!-- 导航 -->
    <div class="Header-bottom">
      <div class="Header-bottom-l" @click="goHome">
        <img src="https://wxa.worldjaguar.com/webview/images/wj_online/wj_logo_color.png" alt="">
      </div>
      <div class="Header-bottom-m">
        <ul class="header-menu">
          <li>
            <a href="https://www.worldjaguar.com/en/e_index.html" target="_blank">Official Website</a>
            <!-- <a>World-Jaguar</a> -->
          </li>
          <li @click="goHome">
            <a>Home</a>
          </li>
          <li>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                E-Commerce<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="a">
                  <span class="el-icons el-icon-s-home" style="margin-right: 5px"></span>EXPORT-LCL
                </el-dropdown-item> -->
                <!-- <el-dropdown-item command="b">
                  <span class="el-icons el-icon-s-promotion" style="margin-right: 5px"></span>IMPORT-LCL
                </el-dropdown-item> -->
                <!-- <el-dropdown-item command="c">
                  <span class="el-icons el-icon-menu" style="margin-right: 5px"></span>EXPORT-FCL
                </el-dropdown-item> -->
                <el-dropdown-item command="d">
                  <span class="el-icon-s-grid" style="margin-right: 5px"></span>LTL TRUCK
                </el-dropdown-item>
                <!-- <el-dropdown-item command="e">
                  <span class="el-icon-s-marketing" style="margin-right: 5px"></span>CONTAINER TRUCK
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-dropdown @command="goToBusiness" placement="top">
              <span class="el-dropdown-link">
                Product<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                  :command="m.id"
                  v-for="m in typeArr"
                  :key="m.id"
                >
                  {{ m.title }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <a href="https://www.worldjaguar.com/en/e_about.html" target="_blank">About Us</a>
            <!-- <a>About Us</a> -->
          </li>
          <li>
            <a href="https://www.worldjaguar.com/en/e_contact.html" target="_blank">Contact Us</a>
            <!-- <a>Contact Us</a> -->
          </li>
        </ul>
      </div>
      <div class="Header-bottom-r">
        <a v-if="isLogin" @click="goToLogin">Login</a>
        <div class="login-status" v-else>
          <el-avatar style="margin-right: 6px;" :size="36" :src="circleUrl"></el-avatar>
          <el-dropdown placement="bottom" @command="goMyCenter">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">Workspace</el-dropdown-item>
              <el-dropdown-item command="d">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      circleUrl: "https://wxa.worldjaguar.com/webview/images/wj_online/useravantar.png",
      isLogin: true,
      username: '',
      typeArr: [{
        id: 1,
        title: 'Sea transportation-Import&Export'
      }, {
        id: 2,
        title: 'Multimodal Transportation'
      }, {
        id: 3,
        title: 'E-commerce'
      }, {
        id: 4,
        title: 'Inland Transportation'
      }, {
        id: 5,
        title: 'Supply Chain Management'
      }, {
        id: 6,
        title: 'Air Transportation/Sea-air Transportation'
      }, {
        id: 7,
        title: 'Comprehensive logistics&Bonded warehousing'
      }, {
        id: 8,
        title: 'International T/S service VIA Qingdao'
      }, {
        id: 9,
        title: 'Customs Declaration & Inspection'
      }, {
        id: 10,
        title: 'LCL CFS'
      }]
    }
  },
  
  mounted() {
    this.getIsLogin()
    this.getLoginToken()
  },

  methods: {
    // 判断登录状态
    async getIsLogin() {
      const {data: res} = await this.$http.post('login/isLogin')
      if(res.code === 400) {
        // 未注册，跳转登录页面
        this.$alert(res.info, 'Tips', {
          showCancelButton: false,
          showClose: false,
          confirmButtonText: 'Confirm',
          type: 'warning'
        }).then(()=> {
          this.$router.replace({
            path: '/Login'
          })
        })
        .catch(() => {
          return
        })
      }else if(res.code === 401) {
        this.$alert(res.info, 'Tips', {
          showCancelButton: false,
          showClose: false,
          confirmButtonText: 'Confirm',
          type: 'warning'
        }).then(()=> {
          this.$router.replace({
            path: '/Login'
          })
        })
        .catch(() => {
          return
        })
      }else if(res.code === 402) {
        this.$alert(res.info, 'Tips', {
          showCancelButton: false,
          showClose: false,
          confirmButtonText: 'Confirm',
          type: 'warning'
        }).then(()=> {
          this.$router.replace({
            path: '/Login'
          })
        })
        .catch(() => {
          return
        })
      }else if(res.code === 403) {
        this.$alert(res.info, 'Tips', {
          showCancelButton: false,
          showClose: false,
          confirmButtonText: 'Confirm',
          type: 'warning'
        }).then(()=> {
          this.$router.replace({
            path: '/Login'
          })
        })
        .catch(() => {
          return
        })
      }else {
        return
      }
    },

    // 获取token
    getLoginToken() {
      let token = JSON.parse(window.localStorage.getItem('enloginInfo'))
      if(token !== null && token.F_Token) {
        this.isLogin = !this.isLogin
        this.username = token.F_NameCn
      }
    },

    goToLogin() {
      this.$router.push({
        path: '/Login'
      })
    },

    goHome() {
      this.$router.push({
        path: '/Home'
      })
    },

    handleCommand(command) {
      switch(command) {
        case 'a':
          this.$router.push({path: '/LclList'})
          break
        case 'b':
          this.$router.push({path: '/ILclList'})
          break
        case 'c':
          this.$router.push({ path: '/FclList' })
          break
        case 'd':
          this.$router.push({ path: '/LandList' })
          break
        case 'e':
          this.$router.push({ path: '/TruckList' })
          break
      }
    },

    goMyCenter(command) {
      switch(command) {
        case 'c':
          this.$router.push({path: '/Profile'})
          break
        case 'd':
          window.localStorage.clear()
          this.isLogin = !this.isLogin
          this.$router.go()
      }
    },

    goToBusiness(command) {
      this.$router.push({
        path: `/Business?command=${command}`
      })
    }
  }
}
</script>

<style scoped lang="less">
header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  background: #fff;
  box-shadow: 5px 5px 10px #e1e1e1;

  .Header-top {
    display: flex;
    width: 100%;
    height: 46px;
    padding: 0 40px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;

    .Header-l {
      display: flex;
      color: #555;
      align-items: center;

      .el-dropdown-link {
        cursor: pointer;
        color: #555;
      }

      .Header-l-text {
        font-size: 14px;
        margin-right: 15px;
        border-right: 1px solid #fff;
        padding-right: 15px;
      }
    }

    .Header-r {
      display: flex;
      margin: 0 0 0 auto;
      align-items: center;

      span {
        color: #555;
        padding-right: 10px;
        font-size: 14px;
        cursor: pointer;

        &:first-child {
          border-right: 1px solid #fff;
          margin-right: 10px;
        }
      }
    }
  }

  .Header-bottom {
    width: calc(100% - 80px);
    height: 74px;
    margin: 0 auto;
    display: flex;
    align-items: center;


    .Header-bottom-l {
      flex: 1;

      img {
        width: 120px;
        margin-top: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .Header-bottom-m {
      flex: 4;

      .header-menu {
        display: flex;
        width: 80%;
        margin: 0 auto;

        li {
          width: 16.666%;
          text-align: center;
          color: #555;
          font-size: 15px;
          cursor: pointer;

          a {
            color: #555;
            &:hover {
              color: #0081ff;
              text-decoration: underline;
            }
          }
        }

        .active {
          color: #0081ff;
          text-decoration: underline;
          font-weight: 550;
        }
      }
    }

    .Header-bottom-r {
      flex: 1;
      display: flex;

      a {
        width: 74px;
        height: 34px;
        margin: 0 0 0 auto;
        border: 1px solid #0081ff;
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 34px;
        cursor: pointer;
        background: #0081ff;
      }

      .login-status {
        display: flex;
        margin: 0 0 0 auto;
        align-items: center;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>