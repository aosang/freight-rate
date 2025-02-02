<template>
  <div class="Myinfo">
    <el-card class="info-card">
      <div slot="header">
        <span>编辑信息</span>
      </div>
      <div class="info-body">
        <el-form 
          ref="editFormRef"
          :rules="editFormRules"
          :model="editForm"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input :value="editForm.mobile" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国家/地区">
                <el-input :value="editForm.countryArea" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司名" prop="company">
                <el-input v-model="editForm.company"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱" prop="useremail">
                <el-input v-model="editForm.useremail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="QQ号">
                <el-input v-model="editForm.qqnumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司电话">
                <el-input v-model="editForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="公司地址">
                <el-input v-model="editForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="info-img">
                <span>营业执照</span>
                <div class="info-company">
                  <img 
                    @dblclick="dialogVisible = true" 
                    v-if="companyImage" 
                    :src="companyImage" 
                    alt="营业执照"
                  />
                  <p v-else>暂未上传</p>
                </div>
                <el-alert style="margin-left: 20px" :closable="false" show-icon type="warning" title="双击可查看大图"></el-alert>
              </div>
            </el-col>
          </el-row>
          <el-dialog 
            title="营业执照"
            width="60%"
            :visible.sync="dialogVisible"
          >
            <div class="company-large" style="width: 650px">
              <img style="width: 100%" :src="companyImage" alt="营业执照">
            </div>
          </el-dialog>
          <el-row>
            <el-col>
              <el-button 
                style="margin-top: 30px; background: #0081ff" 
                type="primary" 
                @click="submitEdit('editFormRef')"
              >
                提交
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Myinfo',
  data() {
     // 邮箱正则
     let checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('Email is Error！'))
    }

    return {
      dialogVisible: false,
      tokenInfo: '',
      companyImage: '',
      editForm: {
        useremail: '', //邮箱
        username: '', // 用户名
        company: '', //公司名
        qqnumber: '', // QQ号
        mobile: '', //手机号
        phone: '', //办公电话
        address: '', //公司地址
        countryArea: '' //国家或地区
      },

      editFormRules: {
        username: [{
          required: true,
          message: 'Name is error',
          trigger: 'blur'
        }],

        useremail: [{
          required: true,
          message: 'Email is error',
          trigger: 'blur'
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],

        company: [{
          required: true,
          message: 'Company is error',
          trigger: 'blur'
        }]
      }
    }
  },

  mounted() {
    // 获取登录信息
    this.getLoginToken()
  },

  methods: {
    // 获取登录信息
    getLoginToken() {
      var token = JSON.parse(window.localStorage.getItem('loginInfo'))
      if(token !== null && token.F_Token) {
        this.editForm.useremail = token.F_Email
        this.editForm.username = token.F_NameCn
        this.editForm.mobile = token.F_Mobile
        this.editForm.phone = token.F_Phone
        this.editForm.company = token.F_CompanyName
        this.editForm.address = token.F_CompanyPosition
        this.editForm.qqnumber = token.F_QQ
        this.companyImage = token.F_FilePath
        this.editForm.countryArea = token.F_CountryEnglishName
      }else {
        this.$router.push({
          path: '/Profile'
        })
      }
    },

    // 提交修改
    submitEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if(valid) {
          const {data: res} = await this.$http.post('user/update', {
            F_NameCn: this.editForm.username,
            F_Email: this.editForm.useremail,
            F_CompanyName: this.editForm.company,
            F_Mobile: this.editForm.mobile,
            F_Phone: this.editForm.phone,
            F_QQ: this.editForm.qqnumber,
            F_CompanyPosition: this.editForm.address
          })
          try {
            if(res.code == 200) {
              this.$message({
                message: res.info,
                duration: 2000,
                type: 'success'
              })
              window.localStorage.setItem('loginInfo', JSON.stringify(res.data))
              setTimeout(() => {
                this.$router.go(0)
              }, 2000)
              
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
        }else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
.info-card {
  span {
    font-size: 16px;
    color: #191b20;
    font-weight: 550;
    white-space: nowrap;
  }

  p {
    margin-top: 6px;
    font-size: 13px;
    color: #989899;
  }

  .info-img {
    display: flex;
    align-items: center;
    span {
      font-size: 15px;
      color: #303133;
      font-weight: 500;
    }
  }

  .info-company {
    position: relative;
    width: 100px;
    height: 70px;
    border: 1px solid #ccc;
    margin-left: 10px;
    border-radius: 5px;
    overflow: hidden;
    p {
      text-align: center;
      line-height: 60px;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
}

/deep/ .el-form-item__label {
  padding-left: 5px;
} 
</style>