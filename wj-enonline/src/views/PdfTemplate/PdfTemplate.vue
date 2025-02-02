<template>
  <div class="pdfTemplateBox">
    <div id="pdfTemplate">
      <div class="wj-template">
        <div class="wj-template-info">
          <div class="wj-template-info-l">
            <div class="info-l-head">
              <!-- <img
                v-if="userInfo.CompanyCode !== 'WJ0002'" 
                :src="userInfo.LogopathBase64? userInfo.LogopathBase64 : ''" 
                alt="万嘉logo"
              /> -->
              <img
                src="@/assets/images/wj_logo.png" 
                alt="万嘉logo"
              />
              <img
                src="@/assets/images/td_logo.png" 
                alt="通达logo"
              />
              <div class="info-l-name">
                <h3>{{ userInfo.EnCompanyName? userInfo.EnCompanyName : 'World Jaguar Logistics Inc.' }}</h3>
              </div>
            </div>
            <div class="info-l-info">
              <p>{{lclInfo.FromPortEnglish}}{{ '(' + lclInfo.FromCountryNameEng + ')' }} -- {{lclInfo.ToPortEnglish}}{{ '(' +  lclInfo.ToPortEnglish +')' }}</p>
              <p>
                Carrier: {{ lclInfo.F_ShoppingCompany }}&nbsp;&nbsp;{{ lclInfo.F_SpellState === '1'? 'Direct' : 'Transfer' }}&nbsp;&nbsp;{{ lclInfo.F_Voyage? lclInfo.F_Voyage : '-'  }}Day
              <p>
              <p>ETD:{{lclInfo.F_ShiftPeriodEn}}&nbsp;&nbsp;Doc cutoff:{{ lclInfo.F_CutoffTime }}&nbsp;&nbsp;CFS cutoff:{{ lclInfo.F_CutoffGoodsTime }}</p>
              <p>Consignee:{{ lclInfo.F_ConsigneeType }}</p>
              <p>Cargo information:{{this.pcs}}{{this.type? this.type == 1? 'CTN(S)' : 'PLT(S)' : 'PKG(S)'}}/{{this.kgs}}KGS/{{this.cbm}}CBM</p>
              <p>Valid:{{this.lclInfo.F_StartTime}} to {{ this.lclInfo.F_EndTime }}</p>
            </div>
          </div>
          <div class="wj-template-info-r">
            <div class="info-num">
              <p>Quotation No.</p>
              <p>LCL{{ dateNumber }}</p>
            </div>
            <div class="info-contact">
              <p>Contact: <span>{{ userInfo.F_EnName? userInfo.F_EnName : '--'}}</span></p>
              <p>Phone: <span>{{ userInfo.F_Mobile? userInfo.F_Telephone : '--' }}</span></p>
              <p>Email: <span>{{ userInfo.F_Email? userInfo.F_Email : '--' }}</span></p>
              <p>Time: <span>{{ dateText }}&nbsp;{{ timeText }}</span></p>
            </div>
          </div>
        </div>
        <!-- table -->
        <div class="wj-template-table" v-if="freight.length !== 0">
          <div class="wj-template-title">
            <h3>Freight and surcharges</h3>
            <span>Total:{{ freightTotal }}</span>
            <span>Convert(USD): {{ freightTotalUsd? (freightTotalUsd < 0? '(' + freightTotalUsd * -1 + ')'  : freightTotalUsd ) : '--' }}</span>
            <span style="margin: 0 0 0 auto; color: #f56c6c">(Fees are for reference only)</span>
          </div>
          <table class="wj-template-box">
            <thead>
              <tr>
                <th>#</th>
                <th>Charge Name</th>
                <th>CCY</th>
                <th>Rate</th>
                <th>Unit</th>
                <th>Count</th>
                <th>Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in freight" :key="index">
                <td style="width: 30px">{{ index + 1 }}</td>
                <td style="width: 200px">{{item.F_ExpenseCode}}</td>
                <td style="width: 80px">{{ item.F_Currency }}</td>
                <td style="width: 80px">{{ item.F_QuotedPrice < 0? '(' + item.F_QuotedPrice * -1 +')' : item.F_QuotedPrice }}</td>
                <td style="width: 80px">{{ item.F_Unit? item.F_Unit : '--' }}</td>
                <td style="width: 80px">{{ item.F_Quantity }}</td>
                <td style="width: 80px">{{ item.F_QuotedAmount < 0? '(' + item.F_QuotedAmount * -1 +')' : item.F_QuotedAmount }}</td>
                <td style="width: 180px">{{ item.F_Remark }}</td>
              </tr>
            </tbody>
          </table>
          <div class="wj-remark" v-if="textareaFreight">
            <span>Remark</span>
            <div class="wj-remark-text">{{ textareaFreight }}</div>
          </div> 
        </div>
        <div class="wj-template-table" v-if="polFee.length !== 0">
          <div class="wj-template-title">
            <h3>Origin</h3>
            <span>Total:{{ polTotal }}</span>
            <span v-if="!type">Convert(USD):{{convertMiniTotal}}</span>
            <span v-else>Convert(USD):{{polTotalUsd}}</span>
            <span style="margin: 0 0 0 auto; color: #f56c6c">(Fees are for reference only)</span>
          </div>
          <table class="wj-template-box">
            <thead>
              <tr>
                <th>#</th>
                <th>Charge Name</th>
                <th>CCY</th>
                <th>Rate</th>
                <th>Unit</th>
                <th>Count</th>
                <th>Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in polFee" :key="index">
                <td style="width: 30px">{{ index + 1 }}</td>
                <td style="width: 200px">{{item.F_ExpenseCode}}</td>
                <td style="width: 80px">{{ item.F_Currency }}</td>
                <td style="width: 80px">{{ item.F_QuotedPrice }}</td>
                <td style="width: 80px">{{ item.F_Unit }}</td>
                <td style="width: 80px">{{ item.F_Quantity }}</td>
                <td style="width: 80px">{{ item.F_QuotedAmount }}</td>
                <td style="width: 180px">{{ item.F_Remark }}</td>
              </tr>
            </tbody>
          </table>
          <div class="wj-remark" v-if="textareaPol">
            <span>Remark</span>
            <div class="wj-remark-text">{{ textareaPol }}</div>
          </div> 
        </div>
        <div class="wj-template-table" v-if="podFee.length !== 0">
          <div class="wj-template-title">
            <h3>Dest</h3>
            <span>Total:{{ podTotal }}</span>
            <div>
              <span v-if="type">Convert:{{ convertMiniTotal }}</span>
              <span v-else>Convert(USD):{{ podTotalUsd }}</span>
            </div>
            <span v-if="typeTotal">Type:{{ typeTotal }}</span>
            <span style="margin: 0 0 0 auto; color: #f56c6c">(Fees are for reference only)</span> 
          </div>
          <table class="wj-template-box">
            <thead>
              <tr>
                <th>#</th>
                <th>Charge Name</th>
                <th>CCY</th>
                <th>Rate</th>
                <th>Unit</th>
                <th>Count</th>
                <th>Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in podFee" :key="index">
                <td style="width: 30px">{{ index + 1 }}</td>
                <td style="width: 200px">{{ item.F_ExpenseCode }}</td>
                <td style="width: 80px">{{ item.F_Currency }}</td>
                <td style="width: 80px">{{ item.F_QuotedPrice }}</td>
                <td style="width: 80px">{{ item.F_Unit }}</td>  
                <td style="width: 80px">{{ item.F_Quantity }}</td>
                <td style="width: 80px">{{ item.F_QuotedAmount }}</td>
                <td style="width: 180px">{{ item.F_Remark }}</td>
              </tr>
            </tbody>
          </table>
          <div class="wj-remark" v-if="textareaPod">
            <span>Remark</span>
            <div class="wj-remark-text">{{ textareaPod }}</div>
          </div> 
        </div>
        <span 
          style="color:#f28900; 
          font-size: 16px; margin: 20px 0">
            Total(USD):{{ totalUsd }}
        </span>
        <p class="wj-template-notice">The above quotation and billing results are for reference only, please contact our staff for the final quotation.</p>
      </div>
    </div>
    <div class="wj-template-btn">
      <div class="wi-template-back" @click="closeWindow">Back to home</div>
      <div class="wi-template-pdf" @click="exportPdf">Export(PDF File)</div>
    </div>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
  name: 'PdfTemplate',
  data() {
    return {
      exportPDFtitle: "Worldjaguar LCL",
      pdfData: '',
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
      totalUsd: ""
    }
  },

  mounted() {
    this.getDateTime()

    setTimeout(()=> {
      this.pdfData = window.sessionStorage.getItem('enpdfData') ? JSON.parse(window.sessionStorage.getItem('enpdfData')) : ''
    })
    setTimeout(()=> {
      if (this.pdfData === null) {
        this.$router.replace({
          path: '/Home'
        })
      }else {
        this.lclInfo = this.pdfData.lclInfo
        this.userInfo = this.pdfData.lclInfo.Contact
        
        this.polFee = this.pdfData.polFee
        this.podFee = this.pdfData.podFee
        this.freight = this.pdfData.freight
        this.pcs = this.pdfData.pcs
        this.kgs = this.pdfData.kgs
        this.cbm = this.pdfData.cbm
        this.type = this.pdfData.type
        this.freightTotal = this.pdfData.freightTotal
        this.polTotal = this.pdfData.polTotal
        this.podTotal = this.pdfData.podTotal
        this.typeTotal = this.pdfData.typeTotal
        this.convertTotal = this.pdfData.convertTotal
        this.freightTotalUsd = this.pdfData.freightTotalUsd
        this.polTotalUsd = this.pdfData.polTotalUsd
        this.podTotalUsd = this.pdfData.podTotalUsd
        this.totalUsd = this.pdfData.totalUsd? this.pdfData.totalUsd.toFixed(2) : '--'
        this.miniCharge = this.pdfData.miniCharge

        this.textareaFreight = this.pdfData.textareaFreight
        this.textareaPol = this.pdfData.textareaPol
        this.textareaPod = this.pdfData.textareaPod
      }
    }, 100)
  },

  computed: {
    convertMiniTotal() {
      let sum = null
      sum = this.miniCharge? Number(this.convertTotal) < this.miniCharge? this.miniCharge : this.convertTotal : this.convertTotal
      return 'USD' + ' ' + Number(sum).toFixed(2)
    }
  },

  methods: {
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

      this.dateNumber = y + mon + d + h + m + s + random
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
  padding-bottom: 20px;
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
  margin-bottom: 10px;
}

.info-contact span {
  display: block;
}

.wj-template-table {
  margin-top: 20px;
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
}

.wj-template-title {
  display: flex;
  align-items: center;
}

.wj-template-title h3 {
  font-size: 15px;
  margin-right: 20px;
}

.wj-template-title span {
  color: #f28900;
  font-size: 14px;
  font-weight: 550;
  margin-right: 8px;
}

.wj-template-box {
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
  border-collapse: collapse;
}

.wj-template-box td, th {
  border: 1px solid #eee;
  height: 20px;
  text-align: left;
  padding: 10px 0 10px 10px;
  font-size: 13px;
  color: #5d5d6a;
}

.wj-template-notice {
  font-size: 13px;
  margin-top: 10px;
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
</style>