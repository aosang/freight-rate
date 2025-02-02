<template>
  <div class="AirList">
    <Common-header></Common-header>
    <back-top></back-top>
    <Search>
      <template slot="Search-col">
        <div class="Search-item">
          <span>起运机场</span>
          <div class="Lcl-input">
            <i>A</i>
            <el-select 
              v-model="flyStartCity" 
              placeholder="选择起运机场"
              remote
              :remote-method="remoteAirPol"
              clearable
              filterable
              @focus="getAirportPolDataList(airSearchPolText, 1)"
            >
              <el-option 
                v-for="air in airPlanePolData" 
                :key="air.F_Id"
                :value="air.F_Id"
                :label="air.F_Code + ' ' + air.F_NameCN"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>目的机场国家/地区</span>
          <div class="Lcl-input">
            <i>B</i>
            <el-select 
              v-model="airCountryCityId" 
              filterable
              remote
              clearable
              placeholder="目的机场国家/地区"
              @focus="getPodCountryAirData"
              @change="handlerChangeAirCountry"
            >
              <el-option 
                v-for="e in airCountryData" 
                :key="e.F_Id" 
                :value="e.F_Id" 
                :label="e.F_CountryEnglishName + ' ' + e.F_CountryName"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>目的机场</span>
          <div class="Lcl-input">
            <i>C</i>
            <el-select 
              v-model="flyEndCity" 
              placeholder="选择目的机场"
              @focus="getAirportPodDataList(airSearchPodText, 1)"
              remote
              clearable
              filterable
              :remote-method="remoteAirPod"
            >
              <el-option 
                v-for="air in airPlanePodData" 
                :key="air.F_Id"
                :value="air.F_Id"
                :label="air.F_Code + ' ' + air.F_NameCN"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button
          style="background: #0081ff"
          class="Search-btn"
          type="primary"
          icon="el-icon-search"
          @click="getAirPortSearchList"
        >
        </el-button>
      </template>
    </Search>
    <div class="Filters">
      <div class="Filters-l">
        <div class="Filters-item-icon">
          <el-icon class="el-icon-s-order"></el-icon>
          <span>筛选</span>
        </div>
      </div>
      <div class="Filters-r">
        <div class="Filters-item">
          <el-select 
            v-model="airCompanyText" 
            class="Filters-item-input" 
            placeholder="航空公司"
            ref="airLine"
            clearable
            filterable
            @focus="getAirCompanyFilter"
            @change="handlerAipCompany"
          >
            <el-option 
              v-for="air in airCompany"
              :key="air.F_Id"
              :value="air.F_Id"
              :label="air.F_NameCn"
            >
              <div style="display: flex; align-items: center">
                <span style="margin-right: 6px">
                  <img style="width: 20px" :src="air.Logopath" alt="">
                </span>
                <span>{{air.F_NameCn}}</span>
              </div>
              
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="packageType" 
            class="Filters-item-input" 
            placeholder="包装类型"
            clearable
            ref="package"
            @change="handlerPackageType"
          >
            <el-option 
              v-for="p in packageTypeData"
              :key="p.F_ItemValue"
              :value="p.F_ItemValue"
              :label="p.F_ItemName"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="transportType" 
            class="Filters-item-input" 
            placeholder="运输方式"
            clearable
            @change="handlerTransType"
          >
            <el-option 
            v-for="t in transportTypeData"
              :key="t.id"
              :value="t.id"
              :label="t.name"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-input 
            v-model="transitPort" 
            class="Filters-item-input" 
            placeholder="请输入中转机场"
            clearable
            @input="handlerTarnsport"
          >
          </el-input>
        </div>
      </div>
    </div>
    <Data-Air-List>
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
    </Data-Air-List>
    <Common-Footer></Common-Footer>
    <Contact></Contact>
    <Tencent></Tencent>
    <Type-Tag :bgColor="bgColor">
      <div slot="slot-text">空运业务</div>
    </Type-Tag>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import BackTop from '@/components/BackTop/BackTop'
import Search from '@/components/Search/Search'
import TypeTag from '@/components/TypeTag/TypeTag'
import DataAirList from '@/components/DataList/DataAirList'
import Tencent from '@/components/Tencent/Tencent'
import Contact from '@/components/Contact/Contact'

import pubsub from 'pubsub-js'

export default {
  name: "AirList",
  data() {
    return {
      bgColor: '#13c2c2',
      flyStartCity: '',
      flyEndCity: '',
      airCompanyText: '',
      transitPort: '',
      transportType: '',
      packageType: '',
      flyInfo: [],
      airCountryCityId: '',
      airCountryData: [],
      airCompany: [],
      airSearchPolText: '',
      airSearchPodText: '',
      airPlanePolData: [],
      airPlanePodData: [],
      packageTypeData: [],
      transportTypeData: [{
        id: 1,
        name: '中转',
      }, {
        id: 2,
        name: '直达',
      }],
      total: 0, // 总条数
      currentPage: 0,
      pageSize: 0
    }
  },

  created() {
    this.flyStartCity = this.$route.params.flyStartCity
    this.flyEndCity = this.$route.params.flyEndCity
    this.airCountryCityId = this.$route.params.flyCountryCity
    this.airSearchPolText = this.$route.params.airSearchPolText
    this.airSearchPodText = this.$route.params.airSearchPodText
    // 机场
    this.getAirportPolDataList(this.airSearchPolText, 1)
    this.getAirportPodDataList(this.airSearchPodText, 1)
   
    // 航空公司
    this.getAirCompanyFilter()
    // 目的港国家
    this.getPodCountryAirData()
    // 获取包装类型
    this.getPackageTypeData()
  },

  mounted() {
     // 查询列表
     this.getAirPortSearchList(this.currentPage)
  },

  methods: {
    handleCurrentChange(newPage) {
      this.getAirPortSearchList(newPage)
    },

    remoteAirPol(query) {
      this.getAirportPolDataList(query, 1)
    },

    remoteAirPod(query) {
      this.getAirportPodDataList(query, 1)
    },

    handlerAipCompany() {
      this.getAirPortSearchList()
    },

    handlerPackageType() {
      this.getAirPortSearchList()
    },

    handlerTransType() {
      this.getAirPortSearchList()
    },

    handlerTarnsport() {
      this.getAirPortSearchList()
    },

    // 获取机场数据
    async getAirportPolDataList(data, flag) {
      const {data: res} = await this.$http.post('data/getAirport', {
        Type: 1,
        Flag: flag,
        SearchText: data? data: '',
      })
      try {
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.airPlanePolData = res.data.data
      }catch(error) {
        console.log(error)
      }
    },
    
    async getAirportPodDataList(data, flag) {
      const {data: res} = await this.$http.post('data/getAirport', {
        Type: 2,
        Flag: flag,
        SearchText: data? data: '',
        CountryId: this.airCountryCityId? this.airCountryCityId : ''
      })
      try {
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.airPlanePodData = res.data.data
      }catch(error) {
        console.log(error)
      }
    },

    // 获取国家
    async getPodCountryAirData() {
      const {data: res} = await this.$http.post('data/getCountry')
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.airCountryData = res.data
      }catch(error) {
        console.log(error)
      }
    },

    handlerChangeAirCountry() {
      this.flyEndCity = ''
    },
  
    async getAirPortSearchList(page) {
      const {data: res} = await this.$http.post('Exportair/index', {
        Page: page,
        From: this.flyStartCity,
        To: this.flyEndCity,
        CountryId: this.airCountryCityId,
        AirCompanyId: this.airCompanyText,
        Sstate: this.transportType,
        Transit: this.transitPort,
        PackageType: this.packageType
      })
      if(res.code !== 200) {
        this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
      }else {
        this.total = res.data.total
        this.currentPage = res.data.current_page
        this.pageSize = res.data.per_page
        this.flyInfo = res.data.data
        pubsub.publish('sendAirData', res.data.data)
      }
    },

    // 航空公司筛选
    async getAirCompanyFilter() {
      const {data: res} = await this.$http.post('data/getAirCompany', {
        SearchText: '',
        From: '',
        To: '',
        F_CountryId: ''
      })
      this.airCompany = res.data
    },

    // 筛选包装类型
    async getPackageTypeData() {
      const {data: res} = await this.$http.post('data/getPackageType')
      this.packageTypeData = res.data
    }
  },

  components: {
    CommonHeader,
    CommonFooter,
    BackTop,
    Search,
    TypeTag,
    DataAirList,
    Tencent,
    Contact
  }
}
</script>

<style scoped lang="less">
.Search-item {
  width: 32.5%;

  .Lcl-input {
    display: flex;
    align-items: center;

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

.Filters {
  display: flex;
  width: 1280px;
  margin: 12px auto 0 auto;
  background: #fff;
  // box-shadow: 5px 5px 20px #e1e1e1;
  padding: 12px 15px;
  align-items: center;
  box-sizing: border-box;

  .Filters-l {
    width: 5%;
    .Filters-item-icon {
      display: flex;
      align-items: center;
      color: #0081ff;
      font-size: 15px;
    }
  }

  .Filters-r {
    display: flex;
    width: 95%;
    justify-content: space-between;
    .Filters-item {
      width: 24%; 
      .Filters-item-input {
        width: 100%;
      } 
    }
  }
}
</style>