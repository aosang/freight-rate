<template>
  <div class="DataList">
    <div class="DataList-box" v-show="lcldata.length > 0">
      <table>
        <thead style="background: #e9f0f7">
          <tr>
            <th>起运港</th>
            <th></th>
            <th>目的港</th>
            <th>船公司/舱位</th>
            <th>班期/开航</th>
            <th>航线代码/有效期</th>
            <th>20GP</th>
            <th>40GP</th>
            <th>40HQ</th>
            <th>45HQ</th>
            <th>40NOR</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in lcldata" :key="d.F_Id">
            <td>
              <h3 class="city-en">{{ d.FromPortEnglish }}</h3>
              <p class="city-zh">{{ d.FromPortName }}</p>
            </td>
            <td>
              <div class="lcl-info">
                <span class="lcl-day">{{ d.F_Voyage? d.F_Voyage : '--' }}天</span>
                <i class="line"></i>
                <span class="lcl-type">
                  {{ d.TransitPortEnglish === null ? '直达' : d.TransitPortEnglish }}
                </span>
              </div>
            </td>
            <td>
              <h3 class="city-en">{{ d.ToPortEnglish }}</h3>
              <p class="city-zh">{{ d.ToPortName }}</p>
            </td>
            <td>
              <p class="take-type">{{ d.F_ShoppingCompany? d.F_ShoppingCompany : '--' }}</p>
              <p class="lcl-rt">{{ d.F_ShippingSpace? d.F_ShippingSpace : '--' }}</p>
            </td>
            <td>
              <p class="lcl-week">
                {{ d.F_ShiftPeriod? d.F_ShiftPeriod : '--' }}
              </p>
              <p class="lcl-week" style="margin-top: -15px">
                {{ d.F_CutoffTime? d.F_CutoffTime : '--' }}
              </p>
            </td>
            <td>
              <p>{{ d.F_RouteCode? d.F_RouteCode : '--' }}</p>
              <p class="lcl-date">{{ d.F_StartTime }} 至 {{ d.F_EndTime }}</p>
            </td>
            <td>
              <div v-if="loginInfo">
                <span class="ton">{{d.F_20GP?  '$'+d.F_20GP : '--'}}</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              <div v-if="loginInfo">
                <span class="ton">{{d.F_40GP? '$'+d.F_40GP : '--'}}</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              <div v-if="loginInfo">
                <span class="ton">{{d.F_40HQ? '$'+d.F_40HQ : '--'}}</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              <div v-if="loginInfo">
                <span class="ton">{{d.F_45HQ? '$'+d.F_45HQ : '--'}}</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              <div v-if="loginInfo">
                <span class="ton">{{d.F_40NOR? '$'+d.F_40NOR : '--'}}</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              <div class="lcl-btn">
                <el-button
                  style="background: #0081ff" 
                  type="primary" 
                  size="mini"
                  @click="getDetailsInfo(d.F_Id)"
                  v-if="loginInfo !== null"
                >
                  详情
                </el-button>
                <el-button
                  type="success"
                  size="mini"
                  v-else @click="goToLogin"
                >
                  登录
                </el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <slot name="pageContent"></slot>
    </div>
    <div class="public-empty" v-show="lcldata.length <= 0">
      <div class="public-loading" ref="hide" v-loading="isLoading" element-loading-text="拼命查询中..."></div>
      <div class="public-empty-text">
        <div class="el-icon-warning"></div>
        <p>暂无搜索数据</p>
      </div>
    </div>
    <Data-F-Model></Data-F-Model>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
import DataFModel from './DataModel/DataFModel'
export default {
  name: 'DataFList',
  data() {
    return {
      isShow: true,
      lcldata: [],
      loginInfo: null,
      visible: false,
      originArr: [],
      destArr: [],
      freightArr: [],
      mergeObj: {}, // 用来记录需要合并行的下标
      mergeArr: ['F_ExpenseCodeName'],// 表格中的列名
      isLoading: true
    }
  },

  mounted() {
    setTimeout(() => {
      this.isLoading = false
      this.$refs.hide.style.display = 'none'
    }, 1000)

    // 接收列表查询数据
    pubsub.subscribe('sendListData', (_, lcldata) => {
      this.lcldata = lcldata.data
    })

    this.loginInfo = window.localStorage.getItem('loginInfo')
  },

  methods: {
    // 获取详情数据
    async getDetailsInfo(id) {
      const {data: res} = await this.$http.post('Exportfcl/fclInfo', {
        FclId: id
      })
      try{
        if(res.code !== 200) {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }else {
          pubsub.publish('details', [this.isShow, res.data])
        }
        
      }catch(error) {
        console.log(error)
      }
    },

    goToLogin() {
      this.$router.push({
        path: '/Login'
      })
    }
  },

  components: { 
    DataFModel 
  }
}
</script>

<style scoped lang="less">
.DataList {
  width: 1280px;
  margin: 12px auto 0 auto;
  background: #fff;
  padding: 0 0;
  box-sizing: border-box;
  margin-bottom: 230px;

  .pagesBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

  .public-empty {
    position: relative;
    height: 360px;

    .public-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
    }

    .public-empty-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 70px;
    }

    .el-icon-warning {
      font-size: 88px;
      color: #d2d3e3;
    }

    p {
      color: #5a5d71;
      font-size: 16px;
      margin: 10px 0;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    box-sizing: border-box;
    // table-layout: fixed;

    tr {
      &:nth-child(even) {
        background: #e9f0f7;
      }
    }

    th,
    td {
      height: 40px;
      font-size: 13px;
      color: #697e9d;
      border-bottom: 1px solid #eee;
      text-align: left;
      line-height: 40px;
      padding: 10px 15px;
      font-weight: 500;

      .city-en {
        font-size: 13px;
        font-weight: 550;
      }

      .city-zh {
        margin-top: -20px;
        font-size: 12px;
      }

      .lcl-info {
        width: 90px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: -20px;

        .line {
          position: relative;
          display: block;
          width: 80px;
          border: 1px solid #ccc;
          margin-top: -6px;
          &::before {
            position: absolute;
            top: 50%;
            left: -2px;
            transform: translateY(-50%);
            display: block;
            content: '';
            width: 8px;
            height: 8px;
            background: #ccc;
            border-radius: 100%;
          }

          &::after {
            position: absolute;
            top: 50%;
            right: -2px;
            transform: translateY(-50%);
            display: block;
            content: '';
            width: 8px;
            height: 8px;
            background: #ccc;
            border-radius: 100%;
          }
        }

        .lcl-day,
        .lcl-type {
          display: block;
          font-size: 12px;
        }

        .lcl-type {
          width: 120px;
          margin-top: -6px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
        }
      }

      .ton, .cbm {
        color: #f53;
        font-weight: 550;
      }

      .take-type {
        font-size: 13px;
      }

      .lcl-rt {
        margin-top: -20px;
        font-size: 12px;
        color: #0081ff;
        font-weight: 550;
      }
      .lcl-week, .lcl-ship {
        font-size: 12px;
      }

      .lcl-ship {
        margin-top: -20px;
      }

      .lcl-btn {
        display: flex;
        justify-content: center;
      }

      .lcl-pay {
        display: flex;
        a {
          font-size: 12px;
          margin-right: 5px;
          white-space: nowrap;
          color: #0081ff;
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .lcl-date {
          font-size: 12px;
          white-space: nowrap;
          margin-top: -20px;
        }
    }
  }
}</style>