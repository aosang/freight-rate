<template>
  <div class="Lcl-List">
    <common-header></common-header>
    <back-top></back-top>
    <Search>
      <template slot="Search-col">
        <div class="Search-item">
          <span>起运港</span>
          <div class="Lcl-input">
            <i>A</i>
            <el-select 
              v-model="startCity" 
              filterable
              remote
              :remote-method="remotePol" 
              clearable
              placeholder="选择起运港"
              @focus="getPolListData(searchPolText, 1)"
            >
              <el-option 
                v-for="s in polArr" 
                :key="s.F_Id" 
                :value="s.F_Id" 
                :label="s.F_PortEnglish+ ' ' + '(' + s.F_PortName + ' ' + '|' + ' ' + s.F_CountryName + ')'"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>目的港国家/地区</span>
          <div class="Lcl-input">
            <i>B</i>
            <el-select 
              v-model="eclCity" 
              filterable
              remote
              clearable
              placeholder="目的港国家/地区"
              @focus="getPodCountryData"
              @change="handlerChangeCountry"
            >
              <el-option 
                v-for="e in podCountryArr" 
                :key="e.F_Id" 
                :value="e.F_Id" 
                :label="e.F_CountryEnglishName + ' ' + e.F_CountryName"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>目的港</span>
          <div class="Lcl-input">
            <i>C</i>
            <el-select 
              v-model="endCity" 
              filterable
              remote
              :remote-method="remotePod"  
              clearable
              placeholder="选择目的港"
              @focus="getPodListData(searchPodText, 1)"
            >
              <el-option 
                v-for="e in podArr" 
                :key="e.F_Id" 
                :value="e.F_Id" 
                :label="e.F_PortEnglish+ ' ' + '(' + e.F_PortName + ' ' + '|' + ' ' + e.F_CountryName + ')'"
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
          @click="debounceMethods"
        >
        </el-button>
      </template>
    </Search>
    <!-- 筛选 -->
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
            v-model="consigneeType" 
            class="Filters-item-input" 
            placeholder="请选择收货人类型"
            @change="getFilterconsigneeType"
            clearable
          >
            <el-option 
              v-for="t in consigneeTypeArr" 
              :key="t.F_ItemDetailId" 
              :value="t.F_ItemValue"
              :label="t.F_ItemName"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="transport" 
            class="Filters-item-input" 
            placeholder="请选择运输方式"
            @change="getFilterTransportType"
            clearable
          >
            <el-option 
              v-for="t in transportType" 
              :key="t.id"
              :value="t.id"
              :label="t.name"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="standard" 
            class="Filters-item-input" 
            placeholder="费用标准"
            @change="getFilterStandard"
            clearable
          >
            <el-option 
              v-for="s in standardFee" 
              :key="s.id"
              :value="s.id"
              :label="s.name"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select
            filterable 
            @focus="getTransPortStoreData(1)" 
            @change="getTransitPortStore"
            v-model="transitPort" 
            class="Filters-item-input" 
            placeholder="请选择中转港"
            clearable
          >
            <el-option 
              v-for="z in transitPortArr" 
              :key="z.F_Id" 
              :value="z.F_Id" 
              :label="z.F_PortName + ' ' + z.F_PortEnglish "
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div class="Filters-item">
          <el-select
            @focus="getTransPortStoreData(2)"
            @change="getTransitPortStore" 
            v-model="storehouse" 
            class="Filters-item-input" 
            placeholder="请选择接货仓库"
            clearable
          >
            <el-option
              v-for="c in storeArr" 
              :key="c.F_Id" 
              :value="c.F_Id" 
              :label="c.F_WarehouseName"
            >
            </el-option>
          </el-select>
        </div> -->
      </div>
    </div>
    <Data-list>
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
    </Data-list>
    <Contact></Contact>
    <Tencent></Tencent>
    <Common-Footer></Common-Footer>
    <Type-Tag :bgColor="bgColor">
      <div slot="slot-text">海出拼箱</div>
    </Type-Tag>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import TypeTag from '@/components/TypeTag/TypeTag'
import Search from '@/components/Search/Search'
import DataList from '@/components/DataList/DataList'
import Contact from '@/components/Contact/Contact'
import BackTop from '@/components/BackTop/BackTop'
import Tencent from '@/components/Tencent/Tencent'

// 导入pubsub
import pubsub from 'pubsub-js'
import _ from 'lodash'

export default {
  name: 'LclList',
  data() {
    return {
      startCity: '', //起运港
      endCity: '', //目的港
      eclCity: '',
      searchPolText: '',
      searchPodText: '',

      consigneeType: '', //收货人类型,
      transport: '', //运输方式
      transitPort: '', //中转港
      storehouse: '', //仓库
      standard: '', //收费标准
      bgColor: '#409EFF',

      polArr: [], //起运港列表
      podArr: [], //目的港列表
      podCountryArr: [],
      consigneeTypeArr: [], //收货人列表
      transitPortArr: [], //中转港列表
      storeArr: [], //仓库列表,
      transportType: [{id: 1, name: '直拼'}, {id: 2, name: '中转'}],
      standardFee: [{ id: 1, name: '标准'}, {id: 2, name: '高标'}, {id: 3, name: '低标'}],
      total: 0, // 总条数
      currentPage: 0,
      pageSize: 0
    }
  },

  created() {
    this.startCity = this.$route.params.startCity
    this.endCity = this.$route.params.endCity
    this.eclCity = this.$route.params.eclCity
    this.searchPolText = this.$route.params.searchPolText
    this.searchPodText = this.$route.params.searchPodText

    // 调用港口列表
    this.getPolListData(this.searchPolText, 1)
    this.getPodListData(this.searchPodText, 1)

    // 调用国家
    this.getPodCountryData()
  },

  mounted() {
    // 调用收货人类型
    this.getconsigneeTypeData()

    //调用查询列表
    this.getLclListData(this.currentPage)

  },

  methods: {
    // 跳转页面
    handleCurrentChange(newPage) {
      this.getLclListData(newPage)
    },

    handlerChangeCountry() {
      this.endCity = ''
    },

    remotePol(query) {
      this.getPolListData(query, 1)
    },

    remotePod(query) {
      this.getPodListData(query, 1)
    },

    // 获取国家
    async getPodCountryData() {
      const {data: res} = await this.$http.post('data/getCountry')
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.podCountryArr = res.data
      }catch(error) {
        console.log(error)
      }
    },


    // 获取查询数据
    async getLclListData(page) {
      const {data: res} = await this.$http.post('Exportlcl/index', {
        Page: page,
        From: this.startCity,
        To: this.endCity,
        CountryId: this.eclCity,
        Ctype: this.consigneeType,
        Sstate: this.transport,
        Transit: this.transitPort,
        Wareh: this.storehouse,
        ChargeStandard: this.standard
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 1500, 
          type: 'error'
        })
        this.total = res.data.total
        this.currentPage = res.data.current_page
        this.pageSize = res.data.per_page
        pubsub.publish('sendListData', res.data)
      }catch(error) {
        console.log(error)
      }      
    },

    // 获取起运港数据
    async getPolListData(data, flag) {
      const {data: res} = await this.$http.post('Data/getPort', {
        Type: 1,
        Flag: flag,
        SearchText: data? data : ''
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 1500, 
          type: 'error'
        })
        this.polArr = res.data.data
      }
      catch(error) {
        console.log(error)
      }
    },

    // 获取目的港数据
    async getPodListData(data, flag) {
      const {data: res} = await this.$http.post('Data/getPort', {
        Type: 2,
        Flag: flag,
        SearchText: data? data : '',
        CountryId: this.eclCity? this.eclCity : ''
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 1500, 
          type: 'error'
        })
        this.podArr = res.data.data
      }
      catch(error) {
        console.log(error)
      }
    },

    // 获取收货人类型
    async getconsigneeTypeData() {
      const {data: res} = await this.$http.post('Data/getConsigneeType')
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 1500, 
          type: 'error'
        })
        this.consigneeTypeArr = res.data
      }catch(error) {
        console.log(error)
      }
    },

    // 获取中转港和仓库
    async getTransPortStoreData(num) {
      const {data: res} = await this.$http.post('Data/getPortStore', {
        Type: num,
        From: this.startCity,
        To: this.endCity,
        CountryId: this.eclCity
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 1500, 
          type: 'error'
        })

        if(num === 1) {
          this.transitPortArr = res.data
        }else if (num === 2) {
          this.storeArr = res.data
        }
      }catch(error) {
        console.log(error)
      }
    },

    // 防抖
    debounceMethods:  _.debounce(function() {
      this.getLclListData()
    }, 500),

    // 根据收货人类型筛选
    getFilterconsigneeType() {
      this.getLclListData()
    },

    // 根据运输类型筛选
    getFilterTransportType() {
      this.getLclListData()
    },

    // 根据中转港货仓库查询
    getTransitPortStore() {
      this.getLclListData()
    },

    // 根据收费标准查询
    getFilterStandard() {
      this.getLclListData()
    }
  },

  components: {
    CommonHeader,
    CommonFooter,
    Search,
    DataList,
    Contact,
    TypeTag,
    BackTop,
    Tencent
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
      width: 24.5%; 
      .Filters-item-input {
        width: 100%;
      } 
    }
  }
}
</style>