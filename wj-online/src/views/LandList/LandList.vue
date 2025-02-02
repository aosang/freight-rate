<template>
  <div class="LandList">
    <common-header></common-header>
    <back-top></back-top>
    <Search>
      <template slot="Search-col">
        <div class="Search-item">
          <span>数量/重量/体积</span>
          <div class="Lcl-input" @click="showPop">
            <i>A</i>
            <el-popover
                placement="bottom"
                width="260"
                trigger="click"
                ref="landModelShow"
              >
                <div 
                  slot="reference" 
                  class="Home-input-number"
                  :class="landInfo.number && landInfo.weight && landInfo.volume? 'Home-input-active' : ''" 
                >
                  {{landShowInfo? landShowInfo : '件数/重量/体积'}}
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <el-input 
                    v-model.number="landInfo.number" 
                    placeholder="请输入件数"
                    type="number"
                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  >
                    <template slot="prepend">件数</template>
                    <template slot="append">PCS</template>
                  </el-input>
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <el-input 
                    v-model="landInfo.weight" 
                    placeholder="请输入重量"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  >
                    <template slot="prepend">重量</template>
                    <template slot="append">KGS</template>
                  </el-input>
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <el-input 
                    v-model="landInfo.volume" 
                    placeholder="请输入体积"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  >
                    <template slot="prepend">体积</template>
                    <template slot="append">CBM</template>
                  </el-input>
                </div>
                <div class="Home-input-items" style="margin-bottom: 12px">
                  <el-row :gutter="20">
                    <el-col :span="7">
                      <el-button 
                        :disabled="isLandButton" 
                        type="primary"
                        @click="landConfirmData"
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
          <span>提货地</span>
          <div class="Lcl-input">
            <i>B</i>
            <el-cascader 
              ref="cascader"
              v-model="landAreaData.areaName"
              placeholder="请选择提货地"
              clearable
              filterable
              :options="areaInfoArr"
              @change="handlerChangeArea"
            >
            </el-cascader>
          </div>
        </div>
        <div class="Search-item">
          <span>提货地邮编</span>
          <div class="Lcl-input">
            <i>C</i>
            <el-input
              type="number" 
              v-model.number="zcode"
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
            <i>D</i>
            <el-select 
              v-model="landPod" 
              filterable
              remote
              :remote-method="remoteLandPod"  
              clearable
              placeholder="请选择港口"
              @focus="getLandLockedData('')"
            >
              <el-option 
                v-for="l in podLandData" 
                :key="l.F_Id" 
                :value="l.F_Id" 
                :label="l.F_PortEnglish+ ' ' + '(' + l.F_PortName + ' ' + '|' + ' ' + l.F_CountryName + ')'"
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
    <Data-land-list>
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
    </Data-land-list>
    <Contact></Contact>
    <Tencent></Tencent>
    <Common-Footer></Common-Footer>
    <Type-Tag :bgColor="bgColor">
      <div slot="slot-text">散货陆运</div>
    </Type-Tag>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import TypeTag from '@/components/TypeTag/TypeTag'
import Search from '@/components/Search/Search'
import DataLandList from '@/components/DataList/DataLandList'
import Contact from '@/components/Contact/Contact'
import BackTop from '@/components/BackTop/BackTop'
import Tencent from '@/components/Tencent/Tencent'

import areaJson from '@/assets/data/area.json'

// 导入pubsub
import pubsub from 'pubsub-js'
import _ from 'lodash'

export default {
  name: 'LandList',
  data() {
    return {
      bgColor: '#27ae60',

      polArr: [], //起运港列表
      podArr: [], //目的港列表
      total: 0, // 总条数
      currentPage: 0,
      pageSize: 0,

      zcode: '',
      landArea: [],
      landShowInfo: '',
      isLandButton: true,
      podLandData: [],
      landPod: '',
      landTypeValue: 1,
      landAreaData: { areaName: ''},
      landInfo: {
        number: '',
        weight: '',
        volume: ''
      },
      podCountryArr: [],
      dataArr: [],
      areaInfoArr: []
    }
  },

  created() {
    this.getLandLockedData()
    this.landPod = this.$route.params.landPod
    this.landAreaData.areaName = this.$route.params.areaName
    // this.landAreaData.areaId = this.$route.params.areaName? this.$route.params.areaName[2] : ''
    this.zcode = this.$route.params.zcode? this.$route.params.zcode : ''
    this.landInfo.number = this.$route.params.number? this.$route.params.number : ''
    this.landInfo.weight = this.$route.params.weight? this.$route.params.weight : ''
    this.landInfo.volume = this.$route.params.volume? this.$route.params.volume : ''
    if(this.landInfo.number && this.landInfo.weight && this.landInfo.volume) {
      this.landShowInfo = this.landInfo.number + '/' + this.landInfo.weight + '/' + this.landInfo.volume
    }else {
      this.landShowInfo = '件数/重量/体积'
    }
    if(this.landPod && this.landInfo.number && this.landInfo.weight && this.landInfo.volume) {
      this.getLandListData(this.currentPage)
    }else {
      this.$message({
        message: '请完善查询信息',
        type: 'error',
        duration: 2000
      })
    }
    this.areaInfoArr = areaJson
  },

  watch: {
    landInfo: {
      deep: true,
      immediate: true,
      handler() {
        if(this.landInfo.number == '' || this.landInfo.weight == '' || this.landInfo.volume == '') {
          this.isLandButton = true
          this.landShowInfo = '件数/重量/体积'
        }else {
          this.isLandButton = false
          this.landShowInfo = this.landInfo.number + '/' + this.landInfo.weight + '/' + this.landInfo.volume
        }
      }
    }
  },  

  methods: {
    showPop() {
      this.$refs.landModelShow.doShow()
    },

    closePop() {
      this.$refs.landModelShow.doClose()
    },

    // 陆运件重尺
    landConfirmData() {
      const {number, weight, volume} = this.landInfo
      this.landShowInfo = number + '/' + weight + '/' + volume
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
        this.podLandData = res.data.data
      }
      catch(err) {
        console.log(err)
      }
    },

    handlerChangeArea(value) {
      this.landAreaData.areaName = value? value : ''
    },

    // 查询列表
    async getLandListData(page) {
      const {number, weight, volume} = this.landInfo
      const {areaName} = this.landAreaData
      if(number == '' || weight == '' || volume == '') {
        this.$message({
          message: '请输入货物信息',
          type: 'error',
          duration: 2000
        })
      }else if(areaName == '' && this.zcode == '') {
        this.$message({
          message: '请填写发货地或邮编',
          type: 'error',
          duration: 2000
        })
      }else if(this.landPod == '') {
        this.$message({
          message: '请选择收货地',
          type: 'error',
          duration: 2000
        })
      }else {
        const {data: res} = await this.$http.post('Landtrans/index', {
          AreaId: this.landAreaData.areaName[2],
          PortId: this.landPod,
          Quantity: this.landInfo.number,
          GrossWeight: this.landInfo.weight,
          Volume: this.landInfo.volume,
          PostCode: this.zcode,
          Page: page
        })
        try{
          if(res.code == 200) {
            this.total = res.data.total
            this.currentPage = res.data.current_page
            this.pageSize = res.data.per_page
            pubsub.publish('sendLandData', res.data)
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
      this.getLandListData(newPage)
    },

    // 防抖
    debounceMethods:  _.debounce(function() {
      this.getLandListData()
    }, 500)
  },

  components: {
    CommonHeader,
    CommonFooter,
    Search,
    DataLandList,
    Contact,
    TypeTag,
    BackTop,
    Tencent
  }
}
</script>


<style scoped lang="less">
.Search-item {
  width: 24%;
  margin-top: -6px;

  .Lcl-input {
    width: 100%;
    display: flex;
    align-items: center;

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