<template>
  <header>
    <div class="Header-top">
      <!-- nav-left -->
      <div class="Header-l">
        <div class="Header-l-text">欢迎访问线上询价系统</div>
        <el-dropdown placement="bottom">
          <span class="el-dropdown-link">
            微信小程序
            <el-icon class="el-icon-link"></el-icon>
          </span>
          <el-dropdown-menu slot="dropdown" class="Header-down">
            <div>
              <img 
                style="width: 320px" 
                class="Header-mini" 
                src="https://www.wangle.run/images/myImage/wj_online/miniprogram.png"
              >
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- nav-right -->
      <div class="Header-r">
        <!-- <a>
          <span>中文</span>
        </a>
        <a href="http://online.worldjaguar.com/wj_enonline" target="_blank">
          <span>EN</span>
        </a> -->
        <!-- <a href="http://192.168.0.133/wj_enonline/index.html" target="_blank">
          <span>EN</span>
        </a> -->
      </div>
    </div>
    <!-- 导航 -->
    <div class="Header-bottom">
      <div class="Header-bottom-l">
        <img src="https://www.wangle.run/images/myImage/wj_online/wj_logo.png" alt="">
      </div>
      <div class="Header-bottom-m">
        <ul class="header-menu">
          <li>
            <a href="http://www.worldjaguar.com/index.html" target="_blank">集团官网</a>
            <!-- <a>集团官网</a> -->
          </li>
          <li>
            <a>首页</a>
          </li>
          <li>
            <el-dropdown @command="handleCommand">
              <span class="el-down-menus">
                电子商务<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <span class="el-icons el-icon-s-home" style="margin-right: 5px"></span>海出拼箱
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <span class="el-icons el-icon-s-promotion" style="margin-right: 5px"></span>海进拼箱
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <span class="el-icons el-icon-menu" style="margin-right: 5px"></span>海出整箱
                </el-dropdown-item>
                <el-dropdown-item command="d">
                  <span class="el-icon-s-grid" style="margin-right: 5px"></span>散货陆运
                </el-dropdown-item>
                <el-dropdown-item command="e">
                  <span class="el-icon-s-marketing" style="margin-right: 5px"></span>集卡陆运
                </el-dropdown-item>
                <el-dropdown-item command="f">
                  <span class="el-icon-s-order" style="margin-right: 5px"></span>空运出口
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-dropdown @command="goToBusiness" placement="top">
              <span class="el-down-menus">
                产品及服务<i class="el-icon-arrow-down el-icon--right"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item 
                    v-for="item in typeArr"
                    :key="item.id"
                    :command="item.id">
                    {{ item.title }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </span>
            </el-dropdown>
          </li>
          <li>
            <a href="http://www.worldjaguar.com/about.html" target="_blank">关于我们</a>
            <!-- <a>关于我们</a> -->
          </li>
          <li>
            <a href="http://www.worldjaguar.com/contact.html" target="_blank">联系我们</a>
            <!-- <a>联系我们</a> -->
          </li>
        </ul>
      </div>
      <div class="Header-bottom-r">
        <a v-if="!isLogin" @click="goToLogin">登录</a>
        <div class="login-status" v-else>
          <el-avatar style="margin-right: 10px;" :size="36" :src="circleUrl"></el-avatar>
          <el-dropdown placement="bottom" @command="goMyCenter">
            <span class="el-dropdown-link" style="color: #fff">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">我的工作台</el-dropdown-item>
              <el-dropdown-item command="d">退出登录</el-dropdown-item>
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
        title: '海运进出口'
      }, {
        id: 2,
        title: '多式联运'
      }, {
        id: 3,
        title: '跨境电商'
      }, {
        id: 4,
        title: '陆运业务'
      }, {
        id: 5,
        title: '供应链管理'
      }, {
        id: 6,
        title: '空运/海空联运'
      }, {
        id: 7,
        title: '综合物流保税'
      }, {
        id: 8,
        title: '国际中转集拼'
      }, {
        id: 9,
        title: '报关报检'
      }, {
        id: 10,
        title: '拼箱场站'
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
      let token = JSON.parse(window.localStorage.getItem('loginInfo'))
      if(token !== null && token.F_Token) {
        this.isLogin = true
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
        case 'f':
          this.$router.push({path: '/AirList'})
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
          this.isLogin = false
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
        width: 193px;
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
              font-weight: 500;
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
        cursor: pointer;
      }
    }
  }
}
</style>