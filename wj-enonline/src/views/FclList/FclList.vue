<template>
  <div class="Fcl-List">
    <common-header></common-header>
    <back-top></back-top>
    <Search>
      <template slot="Search-col">
        <div class="Search-item">
          <span>POL</span>
          <div class="Lcl-input">
            <i>A</i>
            <el-select 
              v-model="startCity" 
              filterable
              remote
              :remote-method="remotePol" 
              clearable
              placeholder="Please enter the POL"
              @focus="getPolListData(startCity, 1)"
            >
              <el-option 
                v-for="s in polArr" 
                :key="s.F_Id" 
                :value="s.F_Id" 
                :label="s.F_PortEnglish + ' ' + '(' + s.F_CountryEnglishName + ')'"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>POD</span>
          <div class="Lcl-input">
            <i>B</i>
            <el-select 
              v-model="endCity" 
              filterable
              remote
              :remote-method="remotePod"  
              clearable
              placeholder="Please enter the POD"
              @focus="getPodListData(endCity, 1)"
            >
              <el-option 
                v-for="e in podArr" 
                :key="e.F_Id" 
                :value="e.F_Id" 
                :label="e.F_PortEnglish + ' ' + '(' + e.F_CountryEnglishName + ')'"
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
          <span>Filter</span>
        </div>
      </div>
      <div class="Filters-r">
        <div class="Filters-item">
          <el-select 
            v-model="shipCompany" 
            class="Filters-item-input" 
            placeholder="Shipping Company"
            @focus="getFilterListData(1)"
            @change="handlerFilterShip"
            ref="ship"
            clearable
          >
            <el-option 
              v-for="t in filterData" 
              :key="t.F_Id" 
              :value="t.F_Id"
              :label="t.F_EnglishNameAbbr"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="schedule" 
            class="Filters-item-input" 
            placeholder="Schedule"
            clearable
            @change="handlerFilterSchedule"
            ref="schedules"
          >
            <el-option 
              v-for="t in week" 
              :key="t.id"
              :value="t.id"
              :label="t.name"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="transportType" 
            class="Filters-item-input" 
            placeholder="Transport"
            clearable
            @change="handlerFilterType"
          >
            <el-option 
              v-for="t in transportTypeArr" 
              :key="t.id"
              :value="t.id"
              :label="t.name"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select 
            v-model="transitPort" 
            class="Filters-item-input" 
            placeholder="Transit port"
            @focus="getFilterListData(2)"
            @change="handlerFilterTrans"
            clearable
          >
            <el-option 
              v-for="t in filterData" 
              :key="t.F_Id"
              :value="t.F_Id"
              :label="t.F_PortEnglish"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select
            v-model="polPort" 
            @focus="getFilterListData(3)"
            @change="handlerFilterPol"
            class="Filters-item-input" 
            placeholder="Port of departure terminal"
            clearable
          >
            <el-option 
              v-for="z in filterData" 
              :key="z.F_Id" 
              :value="z.F_Id" 
              :label="z.F_PortQuayName"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-input
            v-model="podPort" 
            class="Filters-item-input" 
            placeholder="Destination port terminal"
            clearable
            @change="handlerFilterPod"
          >
          </el-input>
        </div>
        <div class="Filters-item">
          <el-select
            @focus="getFilterListData(4)"
            @change="handlerFilterCode"
            v-model="codeNumber" 
            class="Filters-item-input" 
            placeholder="Route code"
            clearable
          >
            <el-option
              v-for="c in filterData" 
              :key="c.F_RouteCode" 
              :value="c.F_RouteCode" 
              :label="c.F_RouteCode"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Filters-item">
          <el-select
            @change="handlerFilterContainer"
            v-model="boxCon" 
            class="Filters-item-input" 
            placeholder="Box genus"
            clearable
            ref="box"
          >
            <el-option
              v-for="c in containerArr" 
              :key="c.id" 
              :value="c.id" 
              :label="c.text"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <Data-F-list>
      <!-- 分页 -->
      <div class="pagesBox" slot="pageContent">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"  
        >
        </el-pagination>
      </div>
    </Data-F-list>
    <Contact></Contact>
    <Common-Footer></Common-Footer>
    <Type-Tag :bgColor="bgColor">
      <div slot="slot-text">Export-FCL</div>
    </Type-Tag>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader'
import CommonFooter from '@/components/Footer/CommonFooter'
import TypeTag from '@/components/TypeTag/TypeTag'
import Search from '@/components/Search/Search'
import DataFList from '@/components/DataList/DataFList'
import Contact from '@/components/Contact/Contact'
import BackTop from '@/components/BackTop/BackTop'

// 导入pubsub
import pubsub from 'pubsub-js'
import _ from 'lodash'

export default {
  name: 'FclList',
  data() {
    return {
      startCity: '', //起运港
      endCity: '', //目的港
      shipCompany: '', //船公司,
      schedule: '', //班期
      transportType: '', //类型
      transitPort: '', //中转港
      polPort: '', //起运港码头
      podPort: '', //目的港码头
      codeNumber: '',
      boxCon: '',
      bgColor: '#F56C6C',

      polArr: [], //起运港列表
      podArr: [], //目的港列表
      filterData: [], //收货人列表
      transportTypeArr: [{id: 1, name: 'Direct'}, {id: 2, name: 'Transfer'}],
      currentPage: 1,
      week: [{id: '一', name: 'Mon'}, {id: '二', name: 'Tues'}, {id: '三', name: 'Wed'}, {id: '四', name: 'Thur'}, {id: '五', name: 'Fri'}, {id: '六', name: 'Sat'}, {id: '七', name: 'Sun'}],
      containerArr: [{id: 1, text: 'COC'}, {id: 2, text: 'SOC'}],
      total: 0, // 总条数
      currentPage: 0,
      pageSize: 0
    }
  },

  created() {
    this.startCity = this.$route.params.startCity
    this.endCity = this.$route.params.endCity

    // 调用港口列表
    this.getPolListData(_, 1)
    this.getPodListData(_, 1)
  },

  mounted() {
    //调用查询列表
    this.getFclListData(this.currentPage)
  },

  methods: {
     // 跳转页面
     handleCurrentChange(newPage) {
      this.getFclListData(newPage)
    },

    remotePol(query) {
      this.getPolListData(query, 1)
    },

    remotePod(query) {
      this.getPodListData(query, 1)
    },

    // 获取查询数据
    async getFclListData(page) {
      const {data: res} = await this.$http.post('Exportfcl/index', {
        Page: page,
        From: this.startCity,
        To: this.endCity,
        ShopCompany	: this.shipCompany,
        ShiftPeriod: this.schedule,
        Sstate: this.transportType,
        Transit: this.transitPort,
        FromQuay: this.polPort,
        ToQuay: this.podPort,
        RouteCode: this.codeNumber,
        Ceratina: this.boxCon
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
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
          duration: 2000, 
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
        SearchText: data? data : ''
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.podArr = res.data.data
      }
      catch(error) {
        console.log(error)
      }
    },

    // 筛选数据
    async getFilterListData(type) {
      const {data: res} = await this.$http.post('Data/getExFclPortStore', {
        Type: type
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.filterData = res.data
      }catch(error) {
        console.log(error)
      }
    },

    // 防抖
    debounceMethods:  _.debounce(function() {
      this.getFclListData()
    }, 500),

    // 船公司筛选
    handlerFilterShip() {
      this.$nextTick(() => {
        this.shipCompany = this.$refs.ship.selectedLabel
        this.getFclListData()
      })
    },

    // 班期筛选
    handlerFilterSchedule() {
      this.getFclListData()
    },

    // 筛选运输方式
    handlerFilterType() {
      this.getFclListData()
    },

    // 筛选中转码头
    handlerFilterTrans() {
      this.getFclListData()
    },

    // 筛选起运港码头
    handlerFilterPol() {
      this.getFclListData()
    },

    // 筛选目的港码头
    handlerFilterPod() {
      this.getFclListData()
    },

    // 筛选航线代码
    handlerFilterCode() {
      this.getFclListData()
    },

    // 筛选箱属
    handlerFilterContainer() {
      this.$nextTick(() => {
        this.boxCon = this.$refs.box.selectedLabel
        this.getFclListData()
      })   
    }
  },

  components: {
    CommonHeader,
    CommonFooter,
    Search,
    DataFList,
    Contact,
    TypeTag,
    BackTop
  }
}
</script>


<style scoped lang="less">
.Search-item {
  width: 49.5%;

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
      width: 12%; 
      .Filters-item-input {
        width: 100%;
      } 
    }
  }
}
</style>