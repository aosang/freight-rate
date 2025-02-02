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
    <Tencent></Tencent>
    <common-footer></common-footer>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import Contact from '@/components/Contact/Contact'
import Tencent from '@/components/Tencent/Tencent'

export default {
  name: 'Business',
  data() {
    return {
      newbussiness: [{
        id: 1,
        name: '海运进出口',
        content: `
          万嘉集运立足国内，放眼世界。600余家遍布全球的代理网络，120余条国际航线，150多个直达港口，服务涵盖全球1000多个口岸和内陆点，
          拥有强大的全球代理网络，主要涵盖地区有港台、日韩、欧洲、地中海、美国、加拿大、中南美、东南亚、澳洲、印尼等。可承接到世界各地的整柜、拼箱业务。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/jinchukoupinxiang.jpg'
      }],
      bussiness: [{
        id: 1,
        name: "海运进出口",
        queryId: '',
        queryCommand: '',
        content: `
          万嘉集运立足国内，放眼世界。600余家遍布全球的代理网络，120余条国际航线，150多个直达港口，服务涵盖全球1000多个口岸和内陆点，
          拥有强大的全球代理网络，主要涵盖地区有港台、日韩、欧洲、地中海、美国、加拿大、中南美、东南亚、澳洲、印尼等。可承接到世界各地的整柜、拼箱业务。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/jinchukoupinxiang.jpg'
      }, {
        id: 2,
        name: "多式联运",
        content: `
          多式联运（海铁联运）是万嘉的另一大优势，响应一带一路国家战略，重点布局“丝路”起点市场；业务涉及中亚、中蒙、中欧班列。我们竭诚为客户提供由中国出口或过境中国，
          到中亚五国，蒙古，欧洲等地的铁路运输，及相关的拖车、仓储、代理进出口报关和检验检疫、代办运输保险等业务，为客户提供“一站式”综合性物流服务。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/duoshilianyun.jpg'
      }, {
        id: 3,
        name: "跨境电商",
        content: `
          我司利用临近港口的保税物流园区内自有仓库优势，已在2014年初便全力发展跨境电子商务业务板块，承接跨境电子商务直邮、备货地面服务业务，业务团队骨干成员均有在其他跨境电子商务试点城市相关单位工作的经历，
          且全部从事国际货运代理行业多年，拥有丰富的跨境电商地面服务经验。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/kuajingdianshang.jpg'
      }, {
        id: 4,
        name: "陆运业务",
        content: `
          专业从事国内货物长途整车、零担配载运输、公路快运、大件运输、长途搬运、货物仓储、仓储管理、市区货物配送、货物分检物流加工。我们拥有和整合车辆多部，车型齐全。仓库、分拨场地4800平方米。
          与多家世界五百强企业建立了长期合作关系，凭着稳定、可靠、安全的运营网络，科学的资整合，先进的管理技术，可为各类企业提供全方位的物流服务。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/luyun.jpg'
      }, {
        id: 5,
        name: "供应链管理",
        content: `
          利用我们在物流网络的广度及深度等各项资源，协调（综合）供应链上企业内外资源，提供供应链最专业的设计、规划和运作等更贴近客商的一条龙全盘服务。赋能整个贸易环节，形成完整的供应链闭环，
          令供应链服务从制造商（贸易方）的供应商采购、供应商选择、供应链金融环节开始，延伸到智能库存仓储、国际通关、配送中心、运输、渠道商等到最终满足客商对商流、信息流、资金流、物流等所有需求。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/luyun.jpg'
      }, {
        id: 6,
        name: "空运/海空联运",
        content: `
          万嘉集运签约国内多地主营航司协议，拥有机场海关和航站进出口资质，拥有海关进口监管仓库，可直接与航空公司、航站、海关操作进口空运业务，提供清关、派送一条龙服务，同时可以操作跨境电商业务，
          电商直购和转关业务。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/kongyun.jpg'
      }, {
        id: 7,
        name: "综合物流保税",
        content: `
          万嘉集运在青岛空港和前湾保税港区拥有大型保税仓，包括跨境电商专用保税仓库。专注于跨境电商、保税仓储、转口、中转集拼等业务。同时万嘉集运在韩国仁川等地有海外保税仓，在澳大利亚、荷兰、英国、美国等各有紧密合作伙伴，
          可操作跨境电商保税备货及直购进口服务和跨境电商出口业务。万嘉集运的室内保税仓库已经拓展为6238平方米。仓库内全方位监控，可升降货架,条形码管理。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/zonghewuliubaoshui.jpg' 
      }, {
        id: 8,
        name: "国际中转集拼",
        content: `
          国际中转集拼业务是指境外货物经过近海、远洋国际航线运至港口，在海关监管仓库内拆箱进行分类，并根据不同目的港，与本地货源一起重新装箱后再运送出境的一种港口物流业务。万嘉集运承接了青岛港首单中转集拼后，
          已经持续完成来自日韩/印度/美国/台湾等去往日本/东南亚/土耳其/立陶宛/中南美/加拿大的多条箱柜。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/guojizhongzhuanjipin.jpg'
      }, {
        id: 9,
        name: "报关报检",
        content: `
          我司于2012年8月投资设立青岛嘉达报关有限公司作为代理报关，主要经营代理进、出口报关业务。于2014年4月通过海关审核成为A类报关企业，曾多次参与海关及行业政策调研。现设有出口、进口、外勤、报检等业务部门，
          分别承担出口报关、进口报关、保税报关、前台交单、码头查验、进出口报检（法检、包装检、危险品、预装船检验）等各环节业务。公司各项制度完善，各环节联系紧密，信息传递及时准确，综合差错率较低。并将继续致力于实现配合海关、服务客人的经营理念，拒绝代理非法业务，为实现关企共赢而努力。`,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/baoguanbaojian.jpg'
      }, {
        id: 10,
        name: "拼箱场站",
        content: `
          我司在青岛港物流仓储中心拥有超过5000平方米的拼箱库。拼箱库内配有叉车、托盘、打包机等设备，并拥有专业的操作、理货人员和自己的装卸工队伍。除服务于我司自己的拼箱之外，仓库还对外服务。
          为客户提供传统仓库服务的同时，还可进行出口货物的装卸、包装、查验以及拼箱装箱 等各项服务。`,
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
    Contact,
    Tencent
  }
}
</script>

<style scoped lang="less">
.Business-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  margin: 180px auto 240px auto;

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