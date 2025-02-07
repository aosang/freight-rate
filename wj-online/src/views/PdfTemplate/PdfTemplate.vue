<template>
  <div class="pdfTemplateBox">
    <div id="pdfTemplate">
      <div class="wj-template">
        <div class="wj-template-info">
          <div class="wj-template-info-l">
            <div class="info-l-head">
              <!-- <canvas ref="headCanvas" style="position: absolute;height: 0; width: 0;opacity: 0;"></canvas> -->
              <img src="@/assets/images/wj_logo.png" alt="万嘉logo" />
              <!-- <img src="@/assets/images/td_logo.png" alt="通达logo" /> -->
              <div class="info-l-name">
                <h3>
                  <!-- {{userInfo.CompanyName? userInfo.CompanyName : "青岛万嘉集运物流有限公司"}} -->
                  欢迎访问使用线上询价系统
                </h3>
                <p>
                  Welcome to use the online quotation system.
                  <!-- {{userInfo.EnCompanyName? userInfo.EnCompanyName : "World Jaguar Logistics Inc."}} -->
                </p>
              </div>
            </div>
            <div class="info-l-info">
              <p>
                {{ lclInfo.FromPortEnglish}}{{"(" +lclInfo.FromCountryName + "." + lclInfo.FromPortName +")"}}-- {{ lclInfo.ToPortEnglish}}{{"(" + lclInfo.ToCountryName + "." + lclInfo.ToPortName + ")"}}
              </p>
              <p v-if="lclInfo.F_PortofDepartureWharf || lclInfo.ToQuayName ">
                <span>起运港码头：{{ lclInfo.F_PortofDepartureWharf }}</span>
                <span style="margin-left: 20px">目的港码头： {{lclInfo.ToQuayEng}}{{ lclInfo.ToQuayName }}</span>
              </p>
              <p v-if="lclInfo.FromQuayName || lclInfo.F_PortofDestinationConnection">
                <span>起运港码头：{{ lclInfo.FromQuayEng }}{{ lclInfo.FromQuayName }}</span>
                <span style="margin-left: 20px">目的港码头： {{ lclInfo.F_PortofDestinationConnection }}</span>
              </p>
              <p>
                船公司：{{ lclInfo.F_ShoppingCompany }}&nbsp;{{lclInfo.F_SpellState === "1" ? "直拼" : "中转"}}&nbsp;&nbsp;{{ lclInfo.F_Voyage ? lclInfo.F_Voyage : "-" }}
              </p>
              <p v-if="lclInfo.F_SpellState == 2">
                中转港：{{ lclInfo.TransitPortEnglish}}{{ lclInfo.TransitPortName }}
              </p>
              <p>班期：{{ lclInfo.F_ShiftPeriod }}</p>
              <p>截单期：{{lclInfo.F_CutoffTime? lclInfo.F_CutoffTime : '--' }}</p>
              <p>截货期：{{lclInfo.F_CutoffGoodsTime? lclInfo.F_CutoffGoodsTime : '--' }}</p>
              <p>收货人类型：{{ lclInfo.ConsigneeTypeName }}</p>
              <div style="display: flex" v-if="!type">
                <p style="margin-right: 10px">运输条款：{{termText}}，</p>
                <p>是否包含报关费：{{ clearanceText === 1? '是' : '否' }}</p>
              </div>
              <p>货物信息：{{ this.pcs }}{{this.type ? (this.type == 1 ? "CTN(S)" : "PLT(S)") : "PKG(S)"}}/{{ this.kgs }}KGS/{{ this.cbm }}CBM</p>
              <p v-if="isLand == 1">
                是否陆运： {{ isLand == 1? '是' : '否' }}&nbsp;&nbsp;&nbsp;&nbsp; 
                <span v-if="!type">送货地：{{ deliveryAreaName? deliveryAreaName : '' }}</span>
                <span v-else>起运地：{{ deliveryAreaName? deliveryAreaName : '' }}</span>  
              </p>
              <p>有效期：{{ this.lclInfo.F_StartTime }} 至 {{ this.lclInfo.F_EndTime }}</p>
              <div v-if="type">
                <div v-if="this.lclInfo.Efw_WarehouseArr != [] || this.lclInfo.Efw_WarehouseArr">
                  <p>接货仓库：</p>
                  <p v-for="s in this.lclInfo.Efw_WarehouseArr" :key="s.F_Id">{{ s.F_WarehouseName }}</p>
                </div>
              </div>
              <div v-else>
                <p>接货仓库：{{ this.lclInfo.F_WarehouseName || '--'}}</p>
                <p>仓库地址：{{ this.lclInfo.F_Address || '--' }}</p>
              </div> 
            </div>
          </div>
          <div class="wj-template-info-r">
            <div class="info-num">
              <p>报价编号</p>
              <p>LCL{{ dateNumber }}</p>
            </div>
            <div class="info-contact">
              <p>联系人：<span>{{userInfo.F_RealName ? userInfo.F_RealName : "--"}}</span></p>
              <p>电话：<span>{{userInfo.F_Mobile ? userInfo.F_Telephone : "--"}}</span></p>
              <p>邮箱：<span>Miles@example.com</span></p>
              <p>时间：<span>{{ dateText }}&nbsp;{{ timeText }}</span></p>
            </div>
          </div>
        </div>
        <!-- table -->
        <div class="wj-template-table" v-if="freight.length !== 0">
          <div class="wj-template-title">
            <h3>海运及附加费用</h3>
            <span>合计：{{ freightTotal }}</span>
            <span style="margin: 0 0 0 auto; color: #f56c6c">（费用仅供参考）</span>
          </div>
          <table class="wj-template-box">
            <thead>
              <tr>
                <th>#</th>
                <th>费用名称</th>
                <th>币种</th>
                <th>单价</th>
                <th>单位</th>
                <th>数量</th>
                <th>金额</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in freight" :key="index">
                <td style="width: 30px">{{ index + 1 }}</td>
                <td style="width: 200px">{{ item.F_ExpenseCode }}</td>
                <td style="width: 80px">{{ item.F_Currency }}</td>
                <td style="width: 120px">
                  {{item.F_QuotedPrice < 0? "(" + item.F_QuotedPrice * -1 + ")" : item.F_QuotedPrice}}
                </td>
                <td style="width: 120px">{{ item.F_Unit }}</td>
                <td style="width: 80px">{{ item.F_Quantity }}</td>
                <td style="width: 80px">
                  {{item.F_QuotedAmount < 0? "(" + item.F_QuotedAmount * -1 + ")" : item.F_QuotedAmount}}
                </td>
                <td style="width: 180px">{{ item.F_Remark }}</td>
              </tr>
            </tbody>
          </table>
          <div class="wj-remark" v-if="textareaFreight">
            <span>备注</span>
            <div class="wj-remark-text">{{ textareaFreight }}</div>
          </div>
        </div>
        <template v-if="!type && termText === 'FCA' ">
          <div class="wj-template-table" v-if="polFee.length !== 0">
            <div class="wj-template-title">
              <h3>起运港费用</h3>
              <span>合计：{{ polTotal }}</span>
              <span v-if="!type">折算USD：{{convertMiniTotal}}</span>
              <span style="margin: 0 0 0 auto; color: #f56c6c">（费用仅供参考）</span>
            </div>
            <table class="wj-template-box">
              <thead>
                <tr>
                  <th>#</th>
                  <th>费用名称</th>
                  <th>币种</th>
                  <th>单价</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>金额</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in polFee" :key="index">
                  <td style="width: 30px">{{ index + 1 }}</td>
                  <td style="width: 200px">{{ item.F_ExpenseCode }}</td>
                  <td style="width: 80px">{{ item.F_Currency }}</td>
                  <td style="width: 120px">{{ item.F_QuotedPrice }}</td>
                  <td style="width: 120px">{{ item.F_Unit }}</td>
                  <td style="width: 80px">{{ item.F_Quantity }}</td>
                  <td style="width: 80px">{{ item.F_QuotedAmount }}</td>
                  <td style="width: 180px">{{ item.F_Remark }}</td>
                </tr>
              </tbody>
            </table>
            <div class="wj-remark" v-if="textareaPol !== ''">
              <span>备注</span>
              <div class="wj-remark-text">{{ textareaPol }}</div>
            </div>
          </div>
        </template>

        <template v-else-if="type == 1">
          <div class="wj-template-table" v-if="polFee.length !== 0">
            <div class="wj-template-title">
              <h3>起运港费用</h3>
              <span>合计：{{ polTotal }}</span>
              <span v-if="!type">折算USD：{{convertMiniTotal}}</span>
              <span style="margin: 0 0 0 auto; color: #f56c6c">（费用仅供参考）</span>
            </div>
            <table class="wj-template-box">
              <thead>
                <tr>
                  <th>#</th>
                  <th>费用名称</th>
                  <th>币种</th>
                  <th>单价</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>金额</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in polFee" :key="index">
                  <td style="width: 30px">{{ index + 1 }}</td>
                  <td style="width: 200px">{{ item.F_ExpenseCode }}</td>
                  <td style="width: 80px">{{ item.F_Currency }}</td>
                  <td style="width: 120px">{{ item.F_QuotedPrice }}</td>
                  <td style="width: 120px">{{ item.F_Unit }}</td>
                  <td style="width: 80px">{{ item.F_Quantity }}</td>
                  <td style="width: 80px">{{ item.F_QuotedAmount }}</td>
                  <td style="width: 180px">{{ item.F_Remark }}</td>
                </tr>
              </tbody>
            </table>
            <div class="wj-remark" v-if="textareaPol !== ''">
              <span>备注</span>
              <div class="wj-remark-text">{{ textareaPol }}</div>
            </div>
          </div>
        </template>

        <div class="wj-template-table" v-if="podFee.length !== 0">
          <div class="wj-template-title">
            <h3>目的港费用</h3>
            <span>合计：{{ podTotal }}</span>
            <span v-if="type">折算USD：{{ convertMiniTotal }}</span>
            <span v-if="typeTotal">类型合计：{{ typeTotal }}</span>
            <span style="margin: 0 0 0 auto; color: #f56c6c">（费用仅供参考）</span>
          </div>
          <table class="wj-template-box">
            <thead>
              <tr>
                <th>#</th>
                <th v-if="typeTotal">费用类型</th>
                <th>费用名称</th>
                <th>币种</th>
                <th>单价</th>
                <th>单位</th>
                <th>数量</th>
                <th>金额</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in podFee" :key="index">
                <td style="width: 30px">{{ index + 1 }}</td>
                <td style="width: 200px" v-if="item.ExpenseTypeName">
                  {{ item.ExpenseTypeName }}
                </td>
                <td style="width: 200px">{{ item.F_ExpenseCode }}</td>
                <td style="width: 80px">{{ item.F_Currency }}</td>
                <td style="width: 120px">{{ item.F_QuotedPrice }}</td>
                <td style="width: 120px">{{ item.F_Unit }}</td>
                <td style="width: 80px">{{ item.F_Quantity }}</td>
                <td style="width: 80px">{{ item.F_QuotedAmount }}</td>
                <td style="width: 180px">{{ item.F_Remark }}</td>
              </tr>
            </tbody>
          </table>
          <div class="wj-remark" v-if="textareaPod !== ''">
            <span>备注</span>
            <div class="wj-remark-text">{{ textareaPod }}</div>
          </div>
        </div>

        <template v-if="isLand ==1">
          <div class="wj-template-table" v-if="landFee.length !== 0">
            <div class="wj-template-title">
              <h3>陆运拖车费用</h3>
              <span>合计：{{ landTotal }}</span>
              <span style="margin: 0 0 0 auto; color: #f56c6c">（费用仅供参考）</span>
            </div>
            <table class="wj-template-box">
              <thead>
                <tr>
                  <th>#</th>
                  <th>费用名称</th>
                  <th>币种</th>
                  <th>单价</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>金额</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in landFee" :key="index">
                  <td style="width: 30px">{{ index + 1 }}</td>
                  <td style="width: 200px">{{ item.F_ExpenseCode }}</td>
                  <td style="width: 80px">{{ item.F_Currency }}</td>
                  <td style="width: 120px">{{ item.F_QuotedPrice }}</td>
                  <td style="width: 120px">{{ item.F_Unit }}</td>
                  <td style="width: 80px">{{ item.F_Quantity }}</td>
                  <td style="width: 80px">{{ item.F_QuotedAmount }}</td>
                  <td style="width: 180px">{{ item.F_Remark }}</td>
                </tr>
              </tbody>
            </table>
          </div>  
        </template>
        
        <p class="wj-template-notice">
          以上报价和计费结果仅供参考，请联系我司人员以最终报价为准。
        </p>
      </div>
    </div>
    <div class="wj-template-btn">
      <div class="wi-template-back" @click="closeWindow">取消导出</div>
      <div class="wi-template-pdf" @click="exportPdf">导出PDF</div>
    </div>
  </div>
</template>

<script>
import html2Canvas from "html2canvas";
import jsPDF from "jspdf";

export default {
  name: "PdfTemplate",
  data() {
    return {
      exportPDFtitle: "万嘉集运拼箱报价单",
      pdfData: "",
      polFee: [],
      podFee: [],
      freight: [],
      landFee: [],
      lclInfo: {},
      userInfo: {},
      pcs: "",
      kgs: "",
      cbm: "",
      type: "",
      dateNumber: "",
      timeText: "",
      dateText: "",
      freightTotal: "",
      polTotal: "",
      podTotal: "",
      landTotal: "",
      typeTotal: "",
      textareaFreight: "",
      textareaPol: "",
      textareaPod: "",
      convertTotal: "",
      miniCharge: "",
      CutoffGoodsTime: "",
      CutoffTime: "",
      isLand: '',
      deliveryAreaName: '',
      termText: '',
      clearanceText: '',
    }
  },

  mounted() {
    this.getDateTime();
    setTimeout(() => {
      this.pdfData = window.sessionStorage.getItem("pdfData")? JSON.parse(window.sessionStorage.getItem("pdfData")) : ""})
    setTimeout(() => {
      if (this.pdfData === null) {
        this.$router.replace({
          path: "/Home",
        });
      } else {
        this.lclInfo = this.pdfData.lclInfo;
        this.userInfo = this.pdfData.lclInfo.Contact;

        this.polFee = this.pdfData.polFee? this.pdfData.polFee : [];
        this.podFee = this.pdfData.podFee? this.pdfData.podFee : [];
        this.freight = this.pdfData.freight? this.pdfData.freight : [];
        this.landFee = this.pdfData.landFee? this.pdfData.landFee : [];


        this.pcs = this.pdfData.pcs;
        this.kgs = this.pdfData.kgs;
        this.cbm = this.pdfData.cbm;
        this.type = this.pdfData.type;
        this.freightTotal = this.pdfData.freightTotal;
        this.polTotal = this.pdfData.polTotal;
        this.podTotal = this.pdfData.podTotal;
        this.landTotal = this.pdfData.landTotal;
        this.typeTotal = this.pdfData.typeTotal;
        this.convertTotal = this.pdfData.convertTotal;
        this.miniCharge = this.pdfData.miniCharge;

        this.textareaFreight = this.pdfData.textareaFreight;
        this.textareaPol = this.pdfData.textareaPol;
        this.textareaPod = this.pdfData.textareaPod;

        this.isLand = this.pdfData.landNum;
        this.deliveryAreaName = this.pdfData.areaText

        this.termText = this.pdfData.termText;
        this.clearanceText = this.pdfData.clearanceText;
      }
    }, 100)
  },

  computed: {
    convertMiniTotal() {
      let sum = null;
      sum = this.miniCharge? Number(this.convertTotal) < this.miniCharge? this.miniCharge : this.convertTotal : this.convertTotal;
      return Number(sum).toFixed(2);
    },
  },

  methods: {
    // 日期转换
    getDateTime() {
      let date = new Date();
      let y = date.getFullYear();
      let mon = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();

      mon = mon < 10 ? "0" + mon : mon;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;

      // 生成10-99两位随机整数
      let random = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

      this.dateNumber =
        y.toString() +
        mon.toString() +
        d.toString() +
        h.toString() +
        m.toString() +
        s.toString() +
        random;
      this.dateText = y + "-" + mon + "-" + d;
      this.timeText = h + ":" + m + ":" + s;
    },

    exportPdf() {
      // 当下载pdf时，若不在页面顶部会造成PDF样式不对,所以先回到页面顶部再下载
      let shareContent = document.getElementById("pdfTemplate");
      let width = shareContent.offsetWidth / 4;
      let height = shareContent.offsetHeight / 4;
      let _this = this;

      html2Canvas(document.querySelector("#pdfTemplate"), {
        allowTaint: false,
        scale: 2,
        dpi: 300,
        useCORS: true,
      }).then((canvas) => {
        let context = canvas.getContext("2d");
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let img = new Image();
        img.src = pageData;

        img.onload = function () {
          img.width = img.width / 2;
          img.height = img.height / 2;
          img.style.transform = "scale(1)";
          if (width > height) {
            // 此可以根据打印的大小进行自动调节
            // eslint-disable-next-line
            var pdf = new jsPDF("l", "mm", [width * 1.005, height * 1.045]);
          } else {
            // eslint-disable-next-line
            var pdf = new jsPDF("p", "mm", [width * 1.005, height * 1.045]);
          }
          pdf.addImage(pageData, "jpeg", 0, 0, width * 1.005, height * 1.045);
          pdf.save(_this.exportPDFtitle + _this.dateNumber + ".pdf");
        }
      })
    },

    closeWindow() {
      window.close();
    },
  },
};
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
  margin-bottom: 10px;
}

.info-contact span {
  display: block;
}

.wj-template-table {
  margin-top: 20px;
}

.wj-template-title {
  display: flex;
  align-items: center;
}

.wj-template-title h3 {
  font-size: 15px;
  font-weight: 550;
  margin-right: 10px;
}

.wj-template-title span {
  margin-right: 20px;
  color: #f28900;
  font-size: 14px;
  font-weight: 550;
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
  /* height: 80px; */
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #555;
  white-space: pre-wrap;
}
</style>