<template>
  <div class="Myinfo">
    <el-card class="info-card">
      <div slot="header">
        <span>Certification Info</span>
      </div>
      <div class="info-body">
        <el-form 
          ref="editFormRef"
          :rules="editFormRules"
          :model="editForm"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="Email">
                <el-input :value="editForm.useremail" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Country">
                <el-input :value="editForm.countryArea" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Name" prop="username">
                <el-input v-model="editForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="CompanyName" prop="company">
                <el-input v-model="editForm.company"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="QQ">
                <el-input v-model="editForm.qqnumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Mobile">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Phone">
                <el-input v-model="editForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Address">
                <el-input v-model="editForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-button
                style="background: #0081ff" 
                type="primary" 
                @click="submitEdit('editFormRef')"
              >
                Submit
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
    return {
      tokenInfo: '',
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
      var token = JSON.parse(window.localStorage.getItem('enloginInfo'))
      if(token !== null && token.F_Token) {
        this.editForm.useremail = token.F_Email
        this.editForm.username = token.F_NameCn
        this.editForm.mobile = token.F_Mobile
        this.editForm.phone = token.F_Phone
        this.editForm.company = token.F_CompanyName
        this.editForm.address = token.F_CompanyPosition
        this.editForm.qqnumber = token.F_QQ
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
              window.localStorage.setItem('enloginInfo', JSON.stringify(res.data))
              this.$router.go(0)
            }
          }catch(error) {
            console.log(error)
          }
        }else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.info-card {
  span {
    font-size: 16px;
    color: #191b20;
    font-weight: 550;
  }

  p {
    margin-top: 6px;
    font-size: 13px;
    color: #989899;
  }
}

/deep/ .el-form-item__label {
  padding-left: 5px;
} 
</style>