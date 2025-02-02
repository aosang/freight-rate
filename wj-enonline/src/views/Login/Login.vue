<template>
  <div class="Login">
    <div class="Login-box">
      <div class="Login-box-l">
        <img src="https://wxa.worldjaguar.com/webview/images/wj_online/login_bg_en.jpg" @click="goToHome" alt="万嘉集运背景图">
      </div>
      <div class="Login-box-r" v-show="isLogin">
        <h3>Login</h3>
        <p>Don't have an account yet?<a @click="goToRegister">Create an account</a></p>
        <div class="Login-form">
          <el-form 
            ref="loginFormRef" 
            :rules="registerFormRules" 
            :model="registerForm" 
            @submit.native.prevent
          >
            <el-form-item prop="email">
              <el-input 
                type="text" 
                placeholder="Email" 
                clearable 
                v-model="registerForm.email"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                type="password" 
                placeholder="Password" 
                v-model="registerForm.password" 
                show-password 
                clearable
              >
              </el-input>
              <span class="login-forgot" @click="isChangeShow = true">Forgot?</span>
            </el-form-item>
            <el-form-item style="margin-top: 40px">
              <el-button 
                style="width: 100%" 
                type="primary" 
                @click="subLogin('loginFormRef')"
                native-type="submit"
              >
                Login
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="Login-box-r" v-show="!isLogin">
        <h3>Get started</h3>
        <p>Already have an account?<a @click="goToLogin">Log in here</a></p>
        <div class="Login-form">
          <el-form 
            :rules="registerFormRules" 
            :model="registerForm" 
            ref="registerFormRef" 
            @submit.native.prevent>
            <el-form-item prop="email">
              <el-input 
                type="text" 
                placeholder="Email" 
                v-model="registerForm.email" 
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="codeValidate">
              <el-input 
                type="text" 
                placeholder="Code" 
                v-model="registerForm.codeValidate" >
                <el-button 
                  slot="append" 
                  @click="sendEmailCode(1)" 
                  :disabled="disabled"
                >
                  {{ codeTitle }}
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                placeholder="Password" 
                clearable 
                type="password"
                show-password>
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                placeholder="Confirm Password" 
                clearable
                type="password" 
                show-password>
              </el-input>
            </el-form-item>
            <el-form-item prop="countryArea">
              <el-select
                v-model="registerForm.countryArea" 
                style="width: 100%" 
                placeholder="Select country/region"
                filterable
                clearable
                @focus="getCountryAreaData"
                @change="handlerChangeCountry"
              >
                <el-option
                  v-for="area in areaCountryArr"
                  :key="area.F_Id"
                  :value="area.F_Id"
                  :label="area.F_CountryEnglishName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="company">
              <el-input 
                type="text" 
                placeholder="Company Name" 
                v-model="registerForm.company" 
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                style="width: 100%" 
                type="primary" 
                @click="submitForm('registerFormRef')"
                native-type="submit"
              >
                Create my account
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="login-Agreement">I agree to the <a @click="goToAgreement">Terms of Service</a></div>
      </div>
    </div>
    <!-- 忘记密码-->
    <el-dialog 
      title="Reset Password" 
      :visible.sync="isChangeShow" 
      :close-on-click-modal="false" 
      width="30%"
    >
      <el-form 
        :rules="registerFormRules"
        :model="registerForm"
        ref="changeFormRef"
        @submit.native.prevent
      >
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="Email"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="codeValidate">
          <el-input 
            placeholder="codeValidate" 
            v-model="registerForm.codeValidate"
            clearable>
            <el-button slot="append" @click="sendEmailCode(2)">{{ codeTitle }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            placeholder="password"
            type="password" 
            v-model="registerForm.password"
            show-password
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input 
            placeholder="confirm password"
            type="password" 
            v-model="registerForm.confirmPassword"
            show-password
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="resetPasswordHandler('changeFormRef')"
            native-type="submit"
          >
            confirm
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
let timer
export default {
  name: 'Login',
  data() {
    // 邮箱正则
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('Email is Error！'))
    }

    // 密码验证
    let checkPass = (rule, value, cb) => {
      const regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/
      if (regPassword.test(value)) {
        return cb()
      }
      cb(new Error('Password is Error!'))
    }
    // 判读两次密码是否一致
    let equalToPassword = (rule, value, cb) => {
      if (this.registerForm.password !== value) {
        cb(new Error('The two codes are not consistent with each othe'))
      } else {
        return cb()
      }
    }
    return {
      isLogin: true,
      isChangeShow: false,
      codeTitle: 'Send verification code',
      timeNum: 30,
      disabled: false,
      salesCode: '',
      areaCountryArr: [],
      registerFormRules: {
        //Email
        email: [{
          required: true,
          message: 'Email is error!',
          trigger: 'blur'
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        // 密码
        password: [{
          required: true,
          message: 'Password is error!',
          tigger: 'blur'
        }, {
          validator: checkPass,
          trigger: 'blur'
        }],
        // 重置密码
        confirmPassword: [{
          required: true,
          message: 'confirmPassword is Error!',
          trigger: 'blur'
        }, {
          validator: equalToPassword,
          trigger: 'blur'
        }],
        // 公司名
        company: [{
          required: true,
          message: 'Company is error!',
          trigger: 'blur'
        }],
        // 验证码
        codeValidate: [{
          required: true,
          message: 'Code is error!',
          trigger: 'blur'
        }],
        //国家
        countryArea: [{
          required: true,
          message: 'Select country/region',
          trigger: 'blur'
        }]
      },

      registerForm: {
        codeValidate: '', //验证码
        password: '', //密码
        confirmPassword: '', //确认密码
        email: '', //邮件
        company: '', //公司名
        countryArea: '',
        areaCountyrId: ''
      },
    }
  },

  methods: {
    goToLogin() {
      this.isLogin = !this.isLogin
    },

    goToRegister() {
      this.isLogin = !this.isLogin
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
    },

    async getCountryAreaData() {
      const {data: res} = await this.$http.post('data/getCountry')
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.areaCountryArr = res.data
      }catch(error) {
        console.log(error)
      }
    },

    handlerChangeCountry(id) {
      this.registerForm.areaCountyrId = id
    },

    sendEmailCode(type) {
      const checkEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      const { email } = this.registerForm
      if (email.trim() === '' || !checkEmail.test(email)) {
        return this.$message({
          message: 'Email is Error',
          type: 'error',
          duration: 1500
        })
      }
      // 调用验证码
      this.getEmailCode(type)
    },

    // 获取验证码
    async getEmailCode(type) {
      const {data: res} = await this.$http.post('login/sendsmsmail', {
        F_Email: this.registerForm.email,
        CodeType: type
      })
      try {
        if(res.code === 200) {
          timer = setInterval(() => {
            this.timeNum--
            this.codeTitle = this.timeNum + 's Resend'
          }, 1000)
          this.disabled = true

          this.$message({
            message: res.info,
            type: 'success',
            duration: 2000
          })
        }else {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }
      }catch(error) {
        console.log(error)
      }
    },

    // 注册表单按钮提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {data: res} = await this.$http.post('login/register', {
            F_Email: this.registerForm.email,
            F_Code: this.registerForm.codeValidate,
            F_Password: this.registerForm.password,
            F_RePassword: this.registerForm.confirmPassword,
            F_CompanyName: this.registerForm.company,
            F_CountryId: this.registerForm.areaCountyrId
          })
          try{
            if(res.code === 200) {
              this.$message({
                message: res.info,
                duration: 5000,
                type: 'success'
              })
              console.log(res)
              // 注册成功跳转登录页
              this.isLogin = true
              // 清空登录和注册表单
              this.$refs.registerFormRef.resetFields()
              this.$refs.loginFormRef.resetFields()
            }else if (res.code === 0) {
              this.$message({
                message: res.info,
                duration: 5000,
                type: 'error'
              })
            }
          }catch(error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
    },

    // 登录表单提交
    subLogin(loginName) {
      this.$refs[loginName].validate(async valid => {
        if (valid) {
          const {data: res} = await this.$http.post('login/index', {
            F_Email: this.registerForm.email,
            F_Password: this.registerForm.password
          })
          if(res.code === 200) {
            window.localStorage.setItem('enloginInfo', JSON.stringify(res.data))
            this.$message({
              message: res.info,
              type: 'success',
              duration: 3000
            })
            this.$router.push({
              path: '/Home'
            })
          } else if(res.code !== 200) {
            this.$message({
              message: res.info,
              type: 'error',
              duration: 5000
            })
          }
        } else {
          return false
        }
      })
    },

    // 重置密码
    resetPasswordHandler(changeName) {
      this.$refs[changeName].validate(async valid => {
        if(valid) {
          const {data: res} = await this.$http.post('Login/forgetpwd', {
            F_Email: this.registerForm.email,
            F_Code: this.registerForm.codeValidate,
            F_Password: this.registerForm.password,
            F_RePassword: this.registerForm.confirmPassword
          })
          try{
            if(res.code === 200) {
              this.$message({
                message: res.info,
                type: 'success',
                duration: 2000
              })
              this.isChangeShow = false
              this.$refs.changeFormRef.resetFields()
            }else if (res.code === 0) {
              this.$message({
                message: res.info,
                type: 'error',
                duration: 2000
              })
            } 
          }catch(error) {
            console.log(error)
          }
        }else {
          return false
        }
      })
    }
  },

  watch: {
    timeNum() {
      if (this.timeNum <= 0) {
        this.disabled = false
        this.codeTitle = 'Send verification code'
        this.timeNum = 30
        clearInterval(timer)
      }
    },
  }
}
</script>

<style scoped lang="less">
.Login {
  position: relative;
  width: 100%;
  height: 100vh;

  .login-Agreement {
    font-size: 13px;
    margin-top: -10px;
    a{
      color: #0081ff;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .Login-box {
    display: flex;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 780px;
    height: 580px;
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
      padding: 0 24px;

      h3 {
        margin-top: 30px;
        font-weight: 550;
        font-size: 26px;
        letter-spacing: 1px;
      }

      p {
        font-size: 13px;
        margin-top: 4px;

        a {
          color: #0081ff;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }

      .Login-form {
        width: 100%;
        margin-top: 16px;

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
          color: #0081ff;

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
  margin-bottom: 22px;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

/deep/ .el-input-group__append {
  width: 90px;
}
</style>