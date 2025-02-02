<template>
  <div class="DataList">
    <div class="DataList-box" v-show="truckListData.length > 0">
      <table>
        <thead style="background: #e9f0f7">
          <tr>
            <th>Pick-up Address</th>
            <th>Port</th>
            <th>Place of container pick-up</th>
            <th>Place of Vanning</th>
            <th>Place of sealing</th>
            <th>Total</th>
            <th>Validity</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in truckListData" :key="d.F_Id">
            <td>
              <div style="margin-top: 4px;">
                <h3 class="city-en">{{ d.AreaText }}</h3>
                <el-tag size="mini">{{d.F_PostCode? 'Postcode:' + d.F_PostCode : '--'}}</el-tag>
              </div>
            </td>
            <td>
              <div style="margin-top: 4px;">
                <h3 class="city-en">{{ d.PortEnglish }}</h3>
                <el-tag type="success" size="mini">{{d.PortQuayName? 'Port Terminal:' + d.PortQuayEnglish : '--'}}</el-tag>
              </div>
            </td>
            <td>
              <el-tooltip effect="light" v-if="d.F_PickUpPlace && d.F_PickUpPlace.length > 6" :content="d.F_PickUpPlace" placement="bottom">
                <span class="city-point">{{d.F_PickUpPlace? d.F_PickUpPlace : '--'}}</span>
              </el-tooltip>
              <span class="city-point" v-else>{{d.F_PickUpPlace? d.F_PickUpPlace : '--'}}</span>
            </td>
            <td>
              <el-tooltip effect="light" v-if="d.F_LoadingPlace && d.F_LoadingPlace.length > 6" :content="d.F_LoadingPlace" placement="bottom">
                <span class="city-point">{{d.F_LoadingPlace? d.F_LoadingPlace : '--'}}</span>
              </el-tooltip>
              <span class="city-point" v-else>{{d.F_LoadingPlace? d.F_LoadingPlace : '--'}}</span>
            </td>
            <td>
              <el-tooltip effect="light" v-if="d.F_SealingPlace && d.F_SealingPlace.length > 6" :content="d.F_SealingPlace" placement="bottom">
                <span class="city-point">{{d.F_SealingPlace? d.F_SealingPlace : '--'}}</span>
              </el-tooltip>
              <span class="city-point" v-else>{{d.F_SealingPlace? d.F_SealingPlace : '--'}}</span>
            </td>
            <td>
              <p class="ton">{{d.TotalAmount? d.F_Currency + d.TotalAmount : '--'}}</p>
            </td>
            <td>
              {{ d.F_StartTime + ' ' + 'To' + ' ' + d.F_EndTime}}
            </td>
            <td>
              <el-tooltip v-if="d.F_Remark" effect="light" :content="d.F_Remark" placement="left">
                <el-button size="mini">Detail</el-button>
              </el-tooltip>
              <p v-else>-</p>
            </td>
          </tr>
        </tbody>
      </table>
      <slot name="pageContent"></slot>
    </div>
    <div class="public-empty" v-show="truckListData.length <= 0">
      <div 
        class="public-loading" 
        ref="hide" 
        v-loading="isLoading" 
        element-loading-text="Loading...">
      </div>
      <div class="public-empty-text">
        <div class="el-icon-warning"></div>
        <p>No Data</p>
      </div>
    </div>
    <span class="public-tip" v-if="truckListData.length > 0">*Note: The above quotation is for reference only, the actual cost is subject to the final</span>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
export default {
  name: 'DataTruckList',
  data() {
    return {
      isShow: true,
      truckListData: [],
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
    pubsub.subscribe('sendTruckData', (_, TruckListData) => {
      this.truckListData = TruckListData.data
    })

    this.loginInfo = window.localStorage.getItem('enloginInfo')
  },
}
</script>

<style scoped lang="less">
.DataList {
  width: 1280px;
  margin: 12px auto 0 auto;
  background: #fff;
  padding: 0 0;
  box-sizing: border-box;
  margin-bottom: 260px;

  .public-tip {
    padding: 0 0 15px 15px;
    font-size: 12px;
    color: #909399;
  }

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
      padding: 15px;
      font-weight: 500;

      .city-en {
        font-size: 13px;
        font-weight: 550;
        margin-bottom: 5px;
      }

      .city-zh {
        margin-top: -20px;
        font-size: 12px;
      }

      .city-point {
        width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        font-size: 13px;
        color: #0081ff;
        font-weight: 500;
        margin-top: 2px;
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
          margin-right: 8px;
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