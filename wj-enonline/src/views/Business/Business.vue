<template>
  <div class="Business">
    <common-header></common-header>
    <div class="Business-box">
      <div class="Business-box-l">
        <div class="Business-l-title">
          <h3>{{newbussiness[0].name}}</h3>
          <div class="Business-l-icon">
            <el-icon class="el-icon-star-on"></el-icon>
          </div>
        </div>
        <div class="Business-l-text">
          <p>{{ newbussiness[0].content }}</p>
        </div>
      </div>
      <div class="Business-box-r">
        <div class="Business-r-img">
          <img :src="newbussiness[0].imgUrl" alt="业务配图">
        </div>
      </div>
    </div>
    <!-- <Contact></Contact> -->
    <Common-footer></Common-footer>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import Contact from '@/components/Contact/Contact'
export default {
  name: 'Business',
  data() {
    return {
      queryId: '',
      queryCommand: '',
      newbussiness: [{
        id: 1,
        name: 'Ocean import and export',
        content: `
          With solid domestic foundations, WJ sets greater goals in the range of the world. Thanks to over 600 global agencies, 120 international routes and 150 direct ports, 
          WJ covers more than 1 ,000 ports and OCPs all across the world for the delivery of FCL and LCL services.Supported by LCL warehouses of tens of thousands of square meters,
          outdoor storage yards and intelligent storage information platform, WJ outdoor storage yards and intelligent storage information platform, 
          WJ outdoor storage yards and intelligent storage information platform, WJ such as warehousing, loading & unloading, packaging, inspection and groupage, etc.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/jinchukoupinxiang.jpg'
      }],
      bussiness: [{
        id: 1,
        name: "Ocean import and export",
        content: `
          With solid domestic foundations, WJ sets greater goals in the range of the world. Thanks to over 600 global agencies, 120 international routes and 150 direct ports, 
          WJ covers more than 1 ,000 ports and OCPs all across the world for the delivery of FCL and LCL services.Supported by LCL warehouses of tens of thousands of square meters,
          outdoor storage yards and intelligent storage information platform, WJ outdoor storage yards and intelligent storage information platform, 
          WJ outdoor storage yards and intelligent storage information platform, WJ such as warehousing, loading & unloading, packaging, inspection and groupage, etc.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/jinchukoupinxiang.jpg'
      }, {
        id: 2,
        name: "Ocean-Railway",
        content: `
          Ocean-railway combined transportation is another advantage of World Jaguar, which provides railway service from Lianyungang, Qingdao, Tianjin to Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, 
          Manzhouli and Erenhot. World Jaguar provides customers with“one-stop” comprehensive logistics service including trucking, storage, customs broker, insurance, etc.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/duoshilianyun.jpg'
      }, {
        id: 3,
        name: "E-commerce Business",
        content: `
          Taking the advantage of its own warehouse in the bonded logistics zone, World Jaguar has been concentrating on developing cross boarder e-commerce business since the beginning of 2014, 
          which can offer cross boarder e-commerce direct transportation and stock-up ground service. The key members of operation team has been working in e-commerce and international freight forwarding industry for many years, 
          so they have full experience in e-commerce ground service.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/kuajingdianshang.jpg'
      }, {
        id: 4,
        name: "Landlocked Trailer",
        content: `
          World Jaguar Qingdao keeps good cooperation relationship with lots of experienced, well-managed and diversified trucking companies, and it can provide FTL, LTL, and in-port trucking services.
          Combining closely with its ocean freight, air freight, storage and distribution services, World Jaguar offers comprehensive and superior logistics supply chain service to customers.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/luyun.jpg'
      }, {
        id: 5,
        name: "Supply Chain Management",
        content: `
          We make use of the breadth and depth of our logistics network and other resources to coordinate (comprehensive) internal and external resources in the supply chain, to provide the most professional design, 
          planning and operation of the supply chain closer to the customers of the one-stop comprehensive services.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/luyun.jpg'
      }, {
        id: 6,
        name: "Air",
        content: `
          World Jaguar can handle the import service from the worldwide main airports to Qingdao. World Jaguar Logistics Inc. has Air Freight Branch in Qingdao airport and cooperates with professional customs brokers, 
          providing high-quality and high-efficient customs clearance and pick-up services to customers. According to customers’ requirement, World Jaguar can arrange the customs clearance, pick-up and delivery as soon as the cargo arrives in Qingdao airport.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/kongyun.jpg'
      }, {
        id: 7,
        name: "Bonded Warehousing",
        content: `
          Until August 2012, World Jaguar's indoor bonded warehouse has been expanded to 6238 square meters with Omni-directional monitoring, 
          liftable goods shelf and barcode management system, which can offer safe, efficient and accurate service.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/zonghewuliubaoshui.jpg' 
      }, {
        id: 8,
        name: "Bulk Cargo Transport",
        content: `
          World Jaguar bulk cargo department is specialized in bulk cargo chartering for domestic and foreign trade, 
          which provides transport service among Chinese costal ports (Shanghai, Tianjin, Qingdao, Ningbo, Dalian, Hong Kong, etc) and international import and export service as well as booking space for domestic trade containers.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/guojizhongzhuanjipin.jpg'
      }, {
        id: 9,
        name: "Customs Broker",
        content: `
          Jaguar Star has set up different departments for different services specially, for example export declaration, import declaration, bonded customs declaration, 
          and declaration for inspection (including inspection for packages, dangerous goods, , etc.) With well-established system, closely linked service chain, 
          accurate information transmission and low error rate, Jaguar Star will stick to its operation philosophy of coordinating with customs and serving customers and endeavor to win-win for customs and enterprise.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/baoguanbaojian.jpg'
      }, {
        id: 10,
        name: "LCL/CFS",
        content: `
          World Jaguar owns a LCL warehouse with more than 5000 square meters in Qingdao Port Logistics and Storage Center, which is full-equipped and possesses experienced staffs.
          World Jaguar’s warehouse not only serves for its own LCL cargos but also provides a variety of services to other customers, including traditional warehouse service, loading&unloading, 
          packaging, inspection, LCL container stuffing, etc.`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/pinxiangchangzhan.jpg'
      }]
    }
  },

  mounted() {
    if(this.$route.query.id) {
      // 从轮播图进入筛选
      this.queryId = +this.$route.query.id
      if(this.queryId) {
        this.newbussiness = this.bussiness.filter(item => item.id === this.queryId)
      }else {
        return
      }
    }else if (this.$route.query.command) {
      // 从顶部菜单进入筛选
      this.queryCommand = +this.$route.query.command
      if(this.queryCommand) {
        this.newbussiness = this.bussiness.filter(item => item.id === this.queryCommand)
      }else {
        return
      }
    }
  },

  watch: {
    $route(to, from) {
      this.$router.go(0)
    }
  },

  components: {
    CommonHeader,
    CommonFooter,
    Contact
  }
}
</script>

<style scoped lang="less">
.Business-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  margin: 180px auto 200px auto;

  .Business-box-l {
    width: 48%;
    padding: 15px 0 30px 0;

    .Business-l-title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e9f0f7;
      padding-bottom: 25px;

      h3 {
        font-size: 26px;
        font-weight: 600;
        color: #22293c;
      }

      .Business-l-icon {
        width: 44px;
        height: 44px;
        border-radius: 100%;
        background: #3370ff;
        text-align: center;
        line-height: 42px;
        color: #fff;
        font-size: 32px;
        margin-left: 15px;
      }
    }

    .Business-l-text {
      margin-top: 30px;
      font-size: 16px;
      color: #5a5d6e;
      line-height: 36px;
    }

  }

  .Business-box-r {
    width: 48%;

    .Business-r-img {
      border-radius: 30px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}</style>