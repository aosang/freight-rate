<template>
  <div class="Profile">
    <el-container class="Profile-container">
      <el-header>
        <div class="Profile-header-pic">
          <img 
            src="https://wxa.worldjaguar.com/webview/images/wj_online/wj_logo.png" 
            alt="" 
            @click="goToHome"
          >
        </div>
        <div class="Proffile-info">
          <div class="Proffile-info-item">
            <el-dropdown placement="bottom">
              <span class="el-dropdown-link">
                微信小程序
                <el-icon class="el-icon-link"></el-icon>
              </span>
              <el-dropdown-menu slot="dropdown" class="Header-down">
                <div>
                  <img 
                    style="width: 278px; height: 408px" 
                    class="Header-mini" 
                    src="https://wxa.worldjaguar.com/webview/images/wj_online/miniprogram.png"
                  >
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="Proffile-info-item">
            <!-- <el-dropdown placement="bottom" @command="handleLang">
              <span class="el-dropdown-link">
                简体中文
                <el-icon class="el-icon-s-help"></el-icon>
              </span>
              <el-dropdown-menu slot="dropdown" class="Header-down">
                <el-dropdown-item command="c">简体中文</el-dropdown-item>
                <el-dropdown-item command="d">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
          <div class="Proffile-info-item">
            <el-dropdown placement="bottom" @command="handleCommand" class="Profile-center">
              <span class="el-dropdown-link">
                <el-avatar :size="36" :src="circleUrl"></el-avatar>
                <span>{{username}}<i class="el-icon-arrow-down"></i></span>
              </span>
              <el-dropdown-menu slot="dropdown" class="Header-down">
                <el-dropdown-item command="a">返回首页</el-dropdown-item>
                <el-dropdown-item command="b">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeIndex" 
            text-color="#909399"
            active-text-color="#409EFF"
            class="Profile-menu"
            :router="true"
          >
            <el-menu-item index="/MyOrder" route="/MyOrder">
              <span>
                <i class="el-icon-tickets"></i>
                海出拼箱报价单
              </span>
            </el-menu-item>
            <el-menu-item index="/MyOrderImport" route="/MyOrderImport">
              <span>
                <i class="el-icon-notebook-2"></i>
                海进拼箱报价单
              </span>
            </el-menu-item>
            <el-menu-item index="/MyOrderFcl" route="/MyOrderFcl">
              <span>
                <i class="el-icon-menu"></i>
                海出整箱报价单
              </span>
            </el-menu-item>
            <el-menu-item index="/Subscribe" route="/Subscribe">
              <span>
                <i class="el-icon-message"></i>
                我的订阅运价
              </span>
            </el-menu-item>
            <el-menu-item index="/MyInfo" route="/MyInfo">
              <span>
                <i class="el-icon-edit"></i>
                编辑信息
              </span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="background: #fefefe">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <Contact></Contact>
    <Tencent></Tencent>
  </div>
</template>

<script>
import Contact from '@/components/Contact/Contact'
import Tencent from '@/components/Tencent/Tencent'
export default {
  name: 'Profile',
  data() {
    return {
      circleUrl: "https://wxa.worldjaguar.com/webview/images/wj_online/useravantar.png",
      username: '',
      activeIndex: ''
    }
  },

  mounted() {
    this.activeIndex = this.$route.path
    this.getLoginToken()
  },

  methods: {
    // 检查是否已经登录
    getLoginToken() {
      var token = JSON.parse(window.localStorage.getItem('loginInfo'))
      if(token !== null && token.F_Token) {
        this.username = token.F_NameCn
      }else {
        this.$router.push({
          path: '/Login'
        })
      }
    },

    handleCommand(command) {
      switch(command) {
        case 'a':
          this.$router.push({path: '/Home'})
          break
        case 'b':
          window.localStorage.clear()
          this.$router.push({
            path: '/Home'
          })
      }
    },

    handleLang(command) {
      switch(command) {
        case 'c':
          window.open("http://online.worldjaguar.com")
          // window.open("http://192.168.0.133/wj_online/index.html")
          break
        case 'd':
          window.open('http://online.worldjaguar.com/wj_enonline')
          // window.open('http://192.168.0.133/wj_enonline/index.html')
      }
    },

    // 返回首页
    goToHome() {
      this.$router.push({
        path: '/Home'
      })
    }
  },

  components: {
    Contact,
    Tencent
  }
}
</script>

<style scoped lang="less">
.Profile-container {
  height: 100vh;
}

.el-header {
  display: flex;
  background: #0081ff;
  align-items: center;
}

.el-aside {
  position: relative;
  background: #fff;
  box-shadow: 5px 5px 10px #e1e1e1;
}

.Profile-header-pic {
  width: 130px;
}

.Profile-header-pic img {
  width: 100%;
  margin-left: 15px;
  cursor: pointer;
}

.Proffile-info {
  display: flex;
  margin: 0 0 0 auto;
  align-items: center;
}

.el-dropdown-link {
  color: #fff;
}

.Proffile-info-item {
  margin-right: 24px;
  cursor: pointer;

  .Profile-center {
    margin-top: 5px;
    .el-dropdown-link {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
      }
    }
  }
}

</style>