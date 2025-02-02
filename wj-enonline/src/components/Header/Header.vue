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
      <div class="Header-bottom-l">
        <img src="https://wxa.worldjaguar.com/webview/images/wj_online/wj_logo_home.png" alt="">
      </div>
      <div class="Header-bottom-m">
        <ul class="header-menu">
          <li>
            <a href="https://www.worldjaguar.com/en/e_index.html" target="_blank">Official Website</a>
            <!-- <a>World-Jaguar</a> -->
          </li>
          <li><a>Home</a></li>
          <li>
            <el-dropdown @command="handleCommand">
              <span class="el-down-menus">
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
              <span class="el-down-menus">
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
          <el-avatar style="margin-right: 10px;" :size="36" :src="circleUrl"></el-avatar>
          <el-dropdown placement="bottom" @command="goMyCenter">
            <span class="el-dropdown-link" style="color: #fff">
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
    //判断登录是否过期
    async getIsLogin() {
      const {data: res} = await this.$http.post('login/isLogin')
      if(res.code !== 200) {
          this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
        this.isLogin = false
        this.$router.replace({
          path: '/Login'
        })
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

    handleCommand(command) {
      switch(command) {
        case 'a':
          this.$router.push({path: '/LclList'})
          break
        case 'b':
          this.$router.push({path: '/ILclList'})
          break
        case 'c':
          this.$router.push({path: '/FclList'})
          break
        case 'd':
          this.$router.push({path: '/LandList'})
          break
        case 'e':
          this.$router.push({path: '/TruckList'})
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
          this.isLogin = true
          this.$router.push({path: '/Login'})
      }
    },

    goToLogin() {
      this.$router.push({
        path: '/Login'
      })
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
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;

  .Header-top {
    display: flex;
    width: 100%;
    height: 46px;
    padding: 0 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    box-sizing: border-box;

    .Header-l {
      display: flex;
      color: #fff;
      align-items: center;

      .el-dropdown-link {
        cursor: pointer;
        color: #fff;
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

      a {
        color: #fff;
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
        margin-top: 15px;
        // height: 40px;
      }
    }

    .Header-bottom-m {
      flex: 4;

      .header-menu {
        display: flex;
        width: 80%;
        margin: 0 auto;

        li {
          width: 16.66%;
          text-align: center;
          color: #dcdfe6;
          font-size: 15px;

          a {
            color: #dcdfe6;
            font-weight: 500;
            &:hover {
              color: #fff;
              cursor: pointer;
              text-decoration: underline;
            }
          }

          .el-down-menus {
            color: #dcdfe6;
            font-weight: 500; 
            font-size: 15px;
            &:hover {
              color: #fff !important;
              cursor: pointer;
              text-decoration: underline;
              font-weight: 500;
            }
          }
        }

        .active {
          color: #fff;
          text-decoration: underline;
          font-weight: 550;
        }
      }
    }

    .Header-bottom-r {
      display: flex;
      flex: 1;

      a {
        width: 74px;
        height: 34px;
        margin: 0 0 0 auto;
        border: 1px solid #fff;
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 34px;
        cursor: pointer;

        &:hover {
          background: #0081ff;
          border: none;
        }
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