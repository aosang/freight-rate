<template>
  <div class="TruckList">
    <common-header></common-header>
    <back-top></back-top>
    <Search>
      <template slot="Search-col">
        <div class="Search-item">
          <span>20尺/40尺/45尺</span>
          <div class="Lcl-input" @click="showPop">
            <el-popover
                placement="bottom"
                width="260"
                trigger="click"
                ref="truckModelShow"
              >
                <div 
                  slot="reference" 
                  class="Home-input-number"
                  :class="truckInfo.num20 || truckInfo.num40 || truckInfo.num45? 'Home-input-active' : ''" 
                >
                  {{truckShowInfo? truckShowInfo : '20尺/40尺/45尺'}}
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <span>20尺：</span>
                  <el-input-number 
                    v-model.number="truckInfo.num20" 
                    :min="0"
                  >
                  </el-input-number>
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <span>40尺：</span>
                  <el-input-number 
                    v-model.number="truckInfo.num40" 
                    :min="0"
                  >
                  </el-input-number>
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <span>45尺：</span>
                  <el-input-number 
                    v-model.number="truckInfo.num45" 
                    :min="0"
                  >
                  </el-input-number>
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <el-row :gutter="20">
                    <el-col :span="7">
                      <el-button 
                        :disabled="isTruckButton" 
                        type="primary"
                        @click="truckConfirmData"
                      >
                        确认
                      </el-button>
                    </el-col>
                    <el-col :span="7">
                      <el-button @click="closePop">取消</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>
          </div>
        </div>
        <div class="Search-item">
          <span>提送地</span>
          <div class="Lcl-input">
            <el-cascader 
              ref="cascader"
              v-model="truckAreaData.areaName"
              placeholder="请选择提送地"
              clearable
              filterable
              :options="areaInfoArr"
              @change="handlerChangeArea"
            >
            </el-cascader>
          </div>
        </div>
        <div class="Search-item">
          <span>提送地邮编</span>
          <div class="Lcl-input">
            <el-input
              type="number" 
              v-model.number="truckCode"
              placeholder="请输入邮政编码"
              clearable
              style="line-height: 56px"
            >
            </el-input>
          </div>
        </div>
        <div class="Search-item">
          <span>港口</span>
          <div class="Lcl-input">
            <el-select 
              v-model="truckPod" 
              filterable
              remote
              :remote-method="remoteLandPod"  
              clearable
              placeholder="请选择港口"
              @focus="getLandLockedData('')"
            >
              <el-option 
                v-for="t in truckPodData" 
                :key="t.F_Id" 
                :value="t.F_Id" 
                :label="t.F_PortEnglish+ ' ' + '(' + t.F_PortName + ' ' + '|' + ' ' + t.F_CountryName + ')'"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>港口码头</span>
          <div class="Lcl-input">
            <el-select 
              v-model="truckPodId" 
              clearable
              placeholder="选择港口码头"
              @focus="getTruckPodData"
            >
              <el-option 
                v-for="t in truckWharfData" 
                :key="t.F_Id" 
                :value="t.F_Id" 
                :label="t.F_PortQuayName+ ' ' + '(' + t.F_PortQuayeEnglish + ')'"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button
          class="Search-btn"
          type="primary"
          icon="el-icon-search"
          @click="debounceMethods"
        >
        </el-button>
      </template>
    </Search>
    <!-- 列表 -->
    <Data-truck-list>
      <!-- 分页 -->
      <div slot="pageContent" class="pagesBox">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </Data-truck-list>
    <Contact></Contact>
    <Tencent></Tencent>
    <Common-Footer></Common-Footer>
    <Type-Tag :bgColor="bgColor">
      <div slot="slot-text">集卡陆运</div>
    </Type-Tag>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import TypeTag from '@/components/TypeTag/TypeTag'
import Search from '@/components/Search/Search'
import DataTruckList from '@/components/DataList/DataTruckList'
import Contact from '@/components/Contact/Contact'
import BackTop from '@/components/BackTop/BackTop'
import Tencent from '@/components/Tencent/Tencent'

import areaJson from '@/assets/data/area.json'

// 导入pubsub
import pubsub from 'pubsub-js'
import _ from 'lodash'

export default {
  name: 'TruckList',
  data() {
    return {
      bgColor: '#e67e22',

      polArr: [], //起运港列表
      podArr: [], //目的港列表
      total: 0, // 总条数
      currentPage: 0,
      pageSize: 0,

      truckCode: '',
      truckArea: [],
      truckShowInfo: '',
      isTruckButton: true,
      truckPodData: [],
      truckWharfData: [],
      truckPod: '',
      truckPodId: '',
      truckAreaData: { truckName: ''},
      truckInfo: {
        num20: '',
        num40: '',
        num45: ''
      },
      podCountryArr: [],
      dataArr: [],
      areaInfoArr: []
    }
  },

  created() {
    this.getLandLockedData()
    this.truckPod = this.$route.params.truckPod 
    this.truckPodId = this.$route.params.truckPodId //码头ID
    this.truckAreaData.truckName = this.$route.params.truckName? this.$route.params.truckName : ''
    // this.truckAreaData.areaId = this.$route.params.truckName? this.$route.params.truckName[2] : ''
    this.truckCode = this.$route.params.truckCode? this.$route.params.truckCode : '' // 邮编
    this.truckInfo.num20 = this.$route.params.num20? this.$route.params.num20 : ''
    this.truckInfo.num40 = this.$route.params.num40? this.$route.params.num40 : ''
    this.truckInfo.num45 = this.$route.params.num45? this.$route.params.num45 : ''
    if(this.truckInfo.num20 && this.truckInfo.num40 && this.truckInfo.num45) {
      this.truckShowInfo = this.truckInfo.num20 + '/' + this.truckInfo.num40 + '/' + this.truckInfo.num45
    }else {
      this.truckShowInfo = '20尺/40尺/45尺'
    }
    if((this.truckPod) && (this.truckInfo.num20 || this.truckInfo.num40 || this.truckInfo.num45)) {
      this.getTruckListData(this.currentPage)
    }else {
      this.$message({
        message: '请完善查询信息',
        type: 'error',
        duration: 2000
      })
    }

    if(this.truckPod !== '') {
      this.getTruckPodData()
    }
    this.areaInfoArr = areaJson
  },

  watch: {
    truckInfo: {
      deep: true,
      immediate: true,
      handler() {
        if(this.truckInfo.num20 == '' && this.truckInfo.num40 == '' && this.truckInfo.num45 == '') {
          this.isTruckButton = true
          this.truckShowInfo = '20尺/40尺/45尺'
        }else {
          this.isTruckButton = false
          this.truckShowInfo = this.truckInfo.num20 + '/' + this.truckInfo.num40 + '/' + this.truckInfo.num45
        }
      }
    }
  },  

  methods: {
    showPop() {
      this.$refs.truckModelShow.doShow()
    },

    closePop() {
      this.$refs.truckModelShow.doClose()
    },

    // 选择箱型
    truckConfirmData() {
      const {num20, num40, num45} = this.truckInfo
      this.truckShowInfo = num20 + '/' + num40 + '/' + num45
      this.closePop()
    },

    // 获取发货地数据
    async lazyLoad(node, resolve) {
      const {level, value} = node
      var requestCode = ''    
      if(level === 0) {
        requestCode = ''
      }

      if(level >=1 ) {
        requestCode = value
      }

      const {data: res} = await this.$http.post('Data/getArea', {
        Pid: requestCode
      })
      if(res.code === 200) {
        res.data.forEach(item => {
          item.leaf = level >= 2
        })
      }
      resolve(res.data)
    },

    remoteLandPod(query) {
      this.getLandLockedData(query)
    },

    // 陆运中文港口数据
    async getLandLockedData(query) {
      const {data: res} = await this.$http.post('Data/getPortCn', {
        SearchText: query? query : ''
      })
      try{
        if(res.code !== 200) return
        this.truckPodData = res.data.data
      }
      catch(err) {
        console.log(err)
      }
    },

    // 获取码头
    async getTruckPodData() {
      if(!this.truckPod) {
        return
        // this.$message({
        //   message: '请先选择目的地！',
        //   type: 'warning',
        //   duration: 2000
        // })
      }else {
        const {data: res} = await this.$http.post('data/getQuayByPort', {
          PortId: this.truckPod
        })
        this.truckWharfData = res.data
      }
    },

    handlerChangeArea(value) {
      this.truckAreaData.truckName = value? value : ''
    },

    // 查询列表
    async getTruckListData(page) {
      const {num20, num40, num45} = this.truckInfo
      const {truckName} = this.truckAreaData
      if(num20 == '' && num40 == '' && num45 == '') {
        this.$message({
          message: '请选择箱型',
          type: 'error',
          duration: 2000
        })
      }else if(!truckName && !this.truckCode) {
        this.$message({
          message: '请填写提货地或邮编',
          type: 'error',
          duration: 2000
        })
      }else if(!this.truckPod) {
        this.$message({
          message: '请选择港口',
          type: 'error',
          duration: 2000
        })
      }else {
        const {data: res} = await this.$http.post('Landtrans/truckIndex', {
          AreaId: this.truckAreaData.truckName[2],
          PortId: this.truckPod,
          QuayId: this.truckPodId ,
          Quantity20: this.truckInfo.num20,
          Quantity40: this.truckInfo.num40,
          Quantity45: this.truckInfo.num45,
          PostCode: this.truckCode,
          Page: page
        })
        try{
          if(res.code == 200) {
            this.total = res.data.total
            this.currentPage = res.data.current_page
            this.pageSize = res.data.per_page
            pubsub.publish('sendTruckData', res.data)
          }else {
            this.$message({
              message: res.info,
              type: 'error',
              duration: 1500
            })
          }
        }
        catch(err) {
          console.log(err)
        }
      }
    },

    handleCurrentChange(newPage) {
      this.getTruckListData(newPage)
    },

    // 防抖
    debounceMethods:  _.debounce(function() {
      this.getTruckListData()
    }, 500)
  },

  components: {
    CommonHeader,
    CommonFooter,
    Search,
    DataTruckList,
    Contact,
    TypeTag,
    BackTop,
    Tencent
  }
}
</script>


<style scoped lang="less">
.Search-item {
  width: 19.5%;

  .Lcl-input {
    width: 100%;
    display: flex;
    align-items: center;
    height: 50px;

    span {
      display: block;
      width: 100%;
    }

    ::v-deep .el-popover__reference-wrapper {
      display: block;
    }

    .Home-input-number {
      width: 100%;
      height: 50px;
      margin-top: 6px;
      background: #fff;
      font-size: 14px;
      color: #C0C4CC;
      line-height: 50px;
      padding: 0 12px;
      box-sizing: border-box;
      border: 1px solid #DCDFE6;
    }

    .Home-input-active {
      color: #606266;
      font-size: 14px;
    }

    i {
      width: 50px;
      background: #fff;
      height: 48px;
      line-height: 48px;
      text-align: center;
      color: #555;
      font-weight: 550;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .el-cascader {
      width: 100%;
      /deep/ .el-input__icon {
        line-height: 50px;
      }
    }

    .el-select {
      width: 100%;

      /deep/ .el-input__icon {
        line-height: 50px;
      }
    }

    ::v-deep .el-input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  span {
    font-size: 13px;
    color: #697e9d;
    margin-bottom: 6px;
  }

  ::v-deep .el-input__inner {
    height: 50px;
  }
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

/deep/ .el-input__inner {
  line-height: 1px !important;
}

</style>