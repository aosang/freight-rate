<template>
  <div class="pdfTemplateBox">
    <div id="pdfTemplate">
      <div class="wj-template">
        <div class="wj-template-info">
          <div class="wj-template-info-l">
            <div class="info-l-head">
              <img
                src="@/assets/images/wj_logo.png" 
                alt="万嘉logo"
              />
              <img
                src="@/assets/images/td_logo.png" 
                alt="通达logo"
              />
              <div class="info-l-name">
                <h3>{{userInfo.CompanyName? userInfo.CompanyName : '青岛万嘉集运物流有限公司'}}</h3>
                <p>{{userInfo.EnCompanyName? userInfo.EnCompanyName : 'World Jaguar Logistics Inc.'}}</p>
              </div>
            </div>
            <div class="info-l-info">
              <p>
                {{ lclInfo.FromPortEnglish }}{{ '(' + lclInfo.FromPortName + ')' }} -- {{ lclInfo.ToPortEnglish }}{{ '(' + lclInfo.ToPortName + ')' }}
              </p>
              <p>
                船公司：{{ lclInfo.F_ShoppingCompany }}&nbsp;{{lclInfo.F_SpellState === '1'? '直达' : '中转'}}&nbsp;&nbsp;{{ lclInfo.F_Voyage? lclInfo.F_Voyage + '天' : '-' }}
              </p>
              <p v-if="lclInfo.FromQuayName || lclInfo.F_DesPortQuayId">
                <span>起运港码头：{{lclInfo.FromQuayEng}}{{lclInfo.FromQuayName}}</span>
                <span style="margin-left: 20px">目的港码头：{{lclInfo.F_DesPortQuayId}}</span>
              </p>
              <p v-if="lclInfo.TransitPortName">中转港：{{ lclInfo.TransitPortEnglish }} {{ lclInfo.TransitPortName }}</p>
              <p>班期：{{lclInfo.F_ShiftPeriod}}&nbsp;&nbsp;&nbsp;&nbsp;货物信息：<span>{{ cargoInfo }}</span></p>
              <p>有效期：{{ lclInfo.F_StartTime }} 至 {{ lclInfo.F_EndTime }}</p>
              <p v-if="lclInfo.F_BookingRemarks">订舱备注：{{ lclInfo.F_BookingRemarks }}</p>
              <p v-if="lclInfo.F_WeightLimitRemarks">限重备注：{{ lclInfo.F_WeightLimitRemarks }}</p>
            </div>
          </div>
          <div class="wj-template-info-r">
            <div class="info-num">
              <p>报价编号</p>
              <p>FCL{{ dateNumber }}</p>
            </div>
            <div class="info-contact">
              <p>联系人：{{ userInfo.F_RealName }}</p>
              <p>电话：{{ userInfo.F_Mobile? userInfo.F_Mobile : '--' }}</p>
              <p>邮箱：{{ userInfo.F_Email? userInfo.F_Email : '--' }}</p>
              <p>时间：{{ dateText }}&nbsp;{{ timeText }}</p>
            </div>
          </div>
        </div>
        <el-alert 
          :closable="false" 
          show-icon type="warning" 
          title="蓝色字体的表示该条费用为单票费用"
          style="margin-top: 10px;">
        </el-alert>
        <!-- table -->
        <div class="wj-template-table" v-if="freight.length !== 0">
          <div class="wj-template-title">
            <h3>海运及附加费用</h3>
            <div style="display: flex">
              <span v-if="freightTotal20GP">20GP：{{ freightTotal20GP }}</span>
              <span v-if="freightTotal40GP">40GP：{{ freightTotal40GP }}</span>
              <span v-if="freightTotal40HQ">40HQ：{{ freightTotal40HQ }}</span>
              <span v-if="freightTotal45HQ">45HQ：{{ freightTotal45HQ }}</span>
              <span v-if="freightTotal40NOR">40NOR：{{ freightTotal40NOR }}</span>
              <span v-if="singlePriceFreight">单票费用：{{singlePriceFreight}}</span>
              <span style="margin: 10px 15px 10px auto; color: #F56C6C">(费用仅供参考)</span>
            </div>
           
          </div>
          <el-table
            style="width: 100%" 
            border 
            :header-cell-style="{ background: '#f2f4f6' }"
            :row-style="{ fontSize: '13px' }" 
            :cell-style="{ whiteSpace: 'nowrap' }"
            :data="freight"
            :span-method="FreightobjectSpanMethod"
          >
            <el-table-column label="序号" type="index" width="55" :index="indexMethod"></el-table-column>
            <el-table-column prop="F_ExpenseCode" label="费用名称">
              <template slot-scope="scope">
                <span :class="scope.row.F_SingleVote == 1? 'singleColor' : ''">
                  {{ scope.row.F_SingleVote == 1?  '★' + scope.row.F_ExpenseCode : scope.row.F_ExpenseCode }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="币种">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Currency }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Unit" label="单位">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Unit }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_UnitPrice" label="单价">
              <template slot-scope="scope">
                <span>{{ scope.row.F_UnitPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Quantity" label="数量"></el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Amount? scope.row.F_Amount : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Remark"  label="备注"></el-table-column>
          </el-table>
        </div>
        <div class="wj-template-table" v-if="polFee.length !== 0">
          <div class="wj-template-title">
            <h3>起运港费用</h3>
            <div style="display: flex">
              <span v-if="polTotal20GP">20GP：{{ polTotal20GP }}</span>
              <span v-if="polTotal40GP">40GP：{{ polTotal40GP }}</span>
              <span v-if="polTotal40HQ">40HQ：{{ polTotal40HQ }}</span>
              <span v-if="polTotal45HQ">45HQ：{{ polTotal45HQ }}</span>
              <span v-if="polTotal40NOR">40NOR：{{ polTotal40NOR }}</span>
              <span v-if="singlePricePol">单票费用：{{singlePricePol}}</span>
              <span style="margin: 10px 15px 10px auto; color: #F56C6C">(费用仅供参考)</span>
            </div>
            
          </div>
          <el-table
            style="width: 100%" 
            border 
            :header-cell-style="{ background: '#f2f4f6' }"
            :row-style="{ fontSize: '13px' }" 
            :cell-style="{ whiteSpace: 'nowrap' }"
            :data="polFee"
            :span-method="PolobjectSpanMethod"
          >
            <el-table-column label="序号" type="index" width="55" :index="indexMethod"></el-table-column>
            <el-table-column prop="F_ExpenseCode" label="费用名称">
              <template slot-scope="scope">
                <span :class="scope.row.F_SingleVote == 1? 'singleColor' : ''">
                  {{ scope.row.F_SingleVote == 1?  '★' + scope.row.F_ExpenseCode : scope.row.F_ExpenseCode }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="币种">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Currency }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Unit" label="单位">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Unit }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_UnitPrice" label="单价">
              <template slot-scope="scope">
                <span>{{ scope.row.F_UnitPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Quantity" label="数量"></el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Amount? scope.row.F_Amount : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Remark" label="备注"></el-table-column>
          </el-table>
        </div>
        <div class="wj-template-table" v-if="podFee.length !== 0">
          <div class="wj-template-title">
            <h3>目的港费用</h3>
            <div style="display: flex">
              <span v-if="podTotal20GP">20GP：{{ podTotal20GP }}</span>
              <span v-if="podTotal40GP">40GP：{{ podTotal40GP }}</span>
              <span v-if="podTotal40HQ">40HQ：{{ podTotal40HQ }}</span>
              <span v-if="podTotal45HQ">45HQ：{{ podTotal45HQ }}</span>
              <span v-if="podTotal40NOR">40NOR：{{ podTotal40NOR }}</span>
              <span v-if="singlePricePod">单票费用：{{singlePricePod}}</span>
              <span style="margin: 10px 15px 10px auto; color: #F56C6C">(费用仅供参考)</span>
            </div>
          </div>
          <el-table
            style="width: 100%" 
            border 
            :header-cell-style="{ background: '#f2f4f6' }"
            :row-style="{ fontSize: '13px' }" 
            :cell-style="{ whiteSpace: 'nowrap' }"
            :data="podFee"
            :span-method="PodobjectSpanMethod"
          >
            <el-table-column label="序号" type="index" width="55" :index="indexMethod"></el-table-column>
            <el-table-column prop="F_ExpenseCode" label="费用名称">
              <template slot-scope="scope">
                <span :class="scope.row.F_SingleVote == 1? 'singleColor' : ''">
                  {{ scope.row.F_SingleVote == 1?  '★' + scope.row.F_ExpenseCode : scope.row.F_ExpenseCode }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="币种">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Currency }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Unit" label="单位">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Unit }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_UnitPrice" label="单价">
              <template slot-scope="scope">
                <span>{{ scope.row.F_UnitPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Quantity" label="数量"></el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <span>{{ scope.row.F_Amount? scope.row.F_Amount : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="F_Remark" label="备注"></el-table-column>
          </el-table>
        </div>
        <p class="wj-template-notice">以上报价和计费结果仅供参考，请联系我司人员以最终报价为准。</p>
      </div>
    </div>
    <div class="wj-template-btn">
      <div class="wi-template-back" @click="closeWindow">取消导出</div>
      <div class="wi-template-pdf" @click="exportPdf">导出PDF</div>
    </div>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'
import jsPDF from 'jspdf'
let _ = require('lodash')

import {colMethod} from '@/utils/utils'

export default {
  name: 'FclPdfTemplate',
  data() {
    return {
      exportPDFtitle: "万嘉集运整箱报价单",
      pdfData: '',
      num20gp: '',
      num40gp: '',
      num40hq: '',
      num45hq: '',
      num40nor: '',
      isTotalShow: false,
      freightTotal20GP: '',
      freightTotal40GP: '',
      freightTotal40HQ: '',
      freightTotal45HQ: '',
      freightTotal40NOR: '',
      polTotal20GP: '',
      polTotal40GP: '',
      polTotal40HQ: '',
      polTotal45HQ: '',
      polTotal40NOR: '',
      podTotal20GP: '',
      podlTotal40GP: '',
      podTotal40HQ: '',
      podTotal45HQ: '',
      podTotal40NOR: '',
      polFee: [],
      podFee: [],
      freight: [],
      lclInfo: {},
      userInfo: {},
      pcs: '',
      kgs: '',
      cbm: '',
      type: '',
      dateNumber: '',
      timeText: '',
      dateText: '',
      freightTotal: '',
      polTotal: '',
      podTotal: '',
      typeTotal: '',
      textareaFreight: '',
      textareaPol: '',
      textareaPod: '',
      convertTotal: '',
      miniCharge: '',
      freightMergeArr: {},
      polMergeArr: {},
      podMergeArr: {},
      indexNum: {},
      singlePriceFreight: '',
      singlePricePol: '',
      singlePricePod: ''  
    }
  },

  created() {
    this.pdfData = window.sessionStorage.getItem('FclPdfData')? JSON.parse(window.sessionStorage.getItem('FclPdfData')) : ''
  },

  mounted() {
    this.getDateTime()
    if (this.pdfData === null) {
        this.$router.replace({
          path: '/Home'
        })
    }else {
      this.lclInfo = this.pdfData.lclInfo
      this.num20gp = this.pdfData.num20gp
      this.num40gp = this.pdfData.num40gp
      this.num40hq = this.pdfData.num40hq
      this.num45hq = this.pdfData.num45hq
      this.num40nor = this.pdfData.num40nor

      this.singlePriceFreight = this.pdfData.singleFreight
      this.singlePricePol = this.pdfData.singlePol
      this.singlePricePod = this.pdfData.singlePod

      this.userInfo = this.pdfData.lclInfo.Contact
      
      this.polFee = this.pdfData.polFee
      this.polFee = _.sortBy(this.pdfData.polFee, ['F_ExpenseCode'])
      this.$nextTick(() => {
        this.polMergeArr = colMethod(['F_ExpenseCode',  'F_Remark'], this.polFee)
        this.indexobj(this.polMergeArr)
      })

      this.podFee = this.pdfData.podFee
      this.podFee = _.sortBy(this.podFee, ['F_ExpenseCode'])
      this.$nextTick(() => {
        this.podMergeArr = colMethod(['F_ExpenseCode', 'F_Remark'], this.podFee)
        this.indexobj(this.podMergeArr)
      })
      
      this.freight = this.pdfData.freight
      this.freight = _.sortBy(this.freight, ['F_Id'])
      this.$nextTick(() => {
        this.freightMergeArr = colMethod(['F_ExpenseCode', 'F_Remark'], this.freight)
        this.indexobj(this.freightMergeArr)
      })
      
      this.freightTotal20GP = this.getIsPriceTotal(this.pdfData.freightTotal20GP)
      this.freightTotal40GP = this.getIsPriceTotal(this.pdfData.freightTotal40GP)
      this.freightTotal40HQ = this.getIsPriceTotal(this.pdfData.freightTotal40HQ)
      this.freightTotal45HQ = this.getIsPriceTotal(this.pdfData.freightTotal45HQ)
      this.freightTotal40NOR = this.getIsPriceTotal(this.pdfData.freightTotal40NOR)

      this.polTotal20GP = this.getIsPriceTotal(this.pdfData.polTotal20GP)
      this.polTotal40GP = this.getIsPriceTotal(this.pdfData.polTotal40GP)
      this.polTotal40HQ = this.getIsPriceTotal(this.pdfData.polTotal40HQ)
      this.polTotal45HQ = this.getIsPriceTotal(this.pdfData.polTotal45HQ)
      this.polTotal40NOR = this.getIsPriceTotal(this.pdfData.polTotal40NOR)

      this.podTotal20GP = this.getIsPriceTotal(this.pdfData.podTotal20GP)
      this.podTotal40GP = this.getIsPriceTotal(this.pdfData.podTotal40GP)
      this.podTotal40HQ = this.getIsPriceTotal(this.pdfData.podTotal40HQ)
      this.podTotal45HQ = this.getIsPriceTotal(this.pdfData.podTotal45HQ)
      this.podTotal40NOR = this.getIsPriceTotal(this.pdfData.podTotal40NOR)

      this.singlePriceFreight = this.pdfData.singleFreight
      this.singlePricePol = this.pdfData.singlePol
      this.singlePricePod = this.pdfData.singlePod
    }
  },

  computed: {
    cargoInfo() {
      let cargoInfo = (this.num20gp? '20GP' + '*' + this.num20gp + ',' : '') + (this.num40gp? '40GP' + '*' + this.num40gp + ',' : '') + (this.num40hq? '40HQ' + '*' + this.num40hq + ',' : '') + (this.num45hq? '45HQ' + '*' + this.num45hq + ',' : '') + (this.num40nor? '40NOR' + '*' + this.num40nor + ',' : '')
      return cargoInfo
    }
  },

  methods: {
    PolobjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.polMergeArr[column.property] || []
      if (column.type == 'index' && this.polMergeArr['F_ExpenseCode'])
        return this.polMergeArr['F_ExpenseCode'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },  

    PodobjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.podMergeArr[column.property] || []
      if (column.type == 'index' && this.podMergeArr['F_ExpenseCode'])
        return this.podMergeArr['F_ExpenseCode'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },

    FreightobjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.freightMergeArr[column.property] || []
      if (column.type == 'index' && this.freightMergeArr['F_ExpenseCode'])
        return this.freightMergeArr['F_ExpenseCode'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },

    // 排列序号
    indexobj(objArr) {
      var num = 0
        objArr['F_ExpenseCode'].forEach((item, index) => {
        if (item[0] != 0) {
          this.indexNum[index] = num += 1
        }
      })
    },

    // 自定义序号
    indexMethod(index) {
      return this.indexNum[index]
    },

    getIsPriceTotal(priceComputed) {
      let price = ''
      if(priceComputed !== '-' && _.split(priceComputed, ' ')[2] !== '0.00') {
        price = priceComputed
      }else {
        price = null
      }
      return price
    },

    // 日期转换
    getDateTime() {
      let date = new Date()
      let y = date.getFullYear()
      let mon = date.getMonth() + 1
      let d = date.getDate()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()

      mon = mon < 10? '0' + mon : mon
      d = d < 10? '0' + d : d
      h = h < 10? '0' + h : h
      m = m < 10? '0' + m : m
      s = s < 10? '0' + s : s

      // 生成10-99两位随机整数
      let random = Math.floor(Math.random() * (99 - 10 + 1)) + 10

      this.dateNumber = y.toString() + mon.toString() + d.toString() + h.toString() + m.toString() + s.toString() + random 
      this.dateText = y + '-' + mon + '-' + d
      this.timeText = h + ':' + m + ':' + s
    },

    exportPdf() {
      // 当下载pdf时，若不在页面顶部会造成PDF样式不对,所以先回到页面顶部再下载
      let shareContent = document.getElementById('pdfTemplate')
      let width = shareContent.offsetWidth / 4
      let height = shareContent.offsetHeight / 4
      let _this = this

      html2Canvas(document.querySelector('#pdfTemplate'), {
        allowTaint: true,
        scale: 2,
        dpi: 300,
        useCORS: true
      }).then(canvas => {
        let context = canvas.getContext('2d')
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false

        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let img = new Image()
        img.src = pageData

        img.onload = function () {
          img.width = img.width / 2
          img.height = img.height / 2
          img.style.transform = 'scale(1)'
          if (width > height) {
            // 此可以根据打印的大小进行自动调节
            // eslint-disable-next-line
            var pdf = new jsPDF('l', 'mm', [
              width * 1.005,
              height * 1.045
            ])
          } else {
            // eslint-disable-next-line
            var pdf = new jsPDF('p', 'mm', [
              width * 1.005,
              height * 1.045
            ])
          }
          pdf.addImage(
            pageData,
            'jpeg',
            0,
            0,
            width * 1.005,
            height * 1.045
          )
          pdf.save(_this.exportPDFtitle + _this.dateNumber + '.pdf')
        }
      })
    },

    closeWindow() {
      window.close()
    }
  }
}
</script>

<style scoped>
.pdfTemplateBox {
  width: 850px;
  margin: 0 auto;
}

#pdfTemplate {
  width: 850px;

  background: #fff;
  padding: 20px;
}

.wj-template {
  width: 100%;
}

.wj-template-info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.wj-template-info-l {
  width: 65%;
}

.info-l-head {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.info-l-head img {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  border: 1px solid #eee;
  margin-right: 10px;
}

.info-l-name {
  margin-left: 15px;
}

.info-l-name h3 {
  font-size: 18px;
}

.info-l-name p {
  font-size: 14px;
  color: #61667c;
}

.info-l-info {
  margin-top: 20px;
}

.info-l-info p {
  margin-bottom: 10px;
  font-size: 14px;
}

.wj-template-info-r {
  width: 30%;
}

.info-num {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 74px;
  background: #0081ff;
  text-align: center;
  color: #fff;
  font-size: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
}

.info-contact {
  box-sizing: border-box;
  height: 210px;
  border: 1px solid #eee;
  font-size: 13px;
  padding: 20px 20px;
}

.info-contact p {
  margin-bottom: 20px;
}

.info-contact span {
  display: block;
}

.wj-template-table {
  margin-top: 20px;
}

/* .wj-template-title {
  display: flex;
  align-items: center;
} */

.wj-template-title h3 {
  font-size: 15px;
  font-weight: 550;
  margin-right: 10px;
}

.wj-template-title span {
  display: block;
  margin: 10px 15px 10px 0;
  color: #f28900;
  font-size: 14px;
  /* font-weight: 550; */
}

.wj-template-box {
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
  border-collapse: collapse;
}

.wj-template-box td,
th {
  border: 1px solid #eee;
  height: 20px;
  text-align: left;
  padding: 10px 0 10px 10px;
  font-size: 13px;
  color: #5d5d6a;
}

.wj-template-notice {
  font-size: 13px;
  margin: 10px 0 20px 0;
}

.wj-template-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
}

.wi-template-back,
.wi-template-pdf {
  width: 48.5%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.wi-template-back {
  border: 1px solid #ccc;
}

.wi-template-pdf {
  background-color: #0081ff;
  color: #fff;
}

.wj-remark {
  margin-top: 10px;
}

.wj-remark span {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.wj-remark .wj-remark-text {
  width: 100%;
  height: 80px;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #555;
  white-space: pre-wrap;
}

.singleColor {
  color: #409EFF;
}
</style>