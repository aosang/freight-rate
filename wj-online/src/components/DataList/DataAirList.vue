<template>
  <div class="DataAirList">
    <div class="DataAirList-box" v-show="flyInfo.length > 0">
      <div class="DataAirList-item" v-for="air in flyInfo" :key="air.F_Id">
        <div class="DataAirList-item-l">
          <div class="DataAirInfo-air">
           航空公司：<div style="width: 22px; margin-right: 5px"><img v-if="air.Logopath" :src="air.Logopath? air.Logopath : '' " /></div>  
            {{air.AirCompanyname ? air.AirCompanyname : "--"}}
          </div>
          <div class="DataAirInfo-area">
            <div class="DataAirInfo-location">
              <span>{{ air.FromCode }}</span>
              <p>{{ air.FromPort }}</p>
            </div>
            <div class="DataAirInfo-arrow">
              <div class="el-icon-caret-right"></div>
              <div style="font-size: 13px">
                {{ air.F_SpellState === "1" ? air.F_PortofTransit : "直达" }}
              </div>
              <div class="el-icon-caret-right"></div>
            </div>
            <div class="DataAirInfo-location">
              <span>{{ air.ToCode }}</span>
              <p>{{ air.ToPort }}</p>
            </div>
          </div>
          <div class="DataAirInfo-other">
            <div class="DataAirInfo-other-item DataAirInfo-airtime">
              班期：{{ air.F_ShiftPeriod ? air.F_ShiftPeriod : "--" }}
            </div>
            <div class="DataAirInfo-other-item DataAirInfo-validate">
              航程：{{ air.F_Voyage ? air.F_Voyage : "--" }}
            </div>
            <div
              class="DataAirInfo-other-item DataAirInfo-type"
              v-show="air.F_PackagTypeCn"
            >
              {{ air.F_PackagTypeCn? air.F_PackagTypeCn : '-' }}
            </div>
          </div>
          <div class="DataAirInfo-other">
            有效期：{{ air.F_StartTime + " " + "至" + " " + air.F_EndTime }}
          </div>
        </div>
        <div class="DataAirList-item-m">
          <el-table
            style="min-width: 820px"
            :data="air.RangeList"
            :header-cell-style="{ fontSize: '13px', color: '#8a8a8a' }"
            :row-style="{ fontSize: '13px', whiteSpace: 'nowrap'}"
            :span-method="objectSpanMethod"
            border
          >
            <el-table-column
              v-for="header in air.Fields"
              :key="header.prop"
              :prop="header.prop"
              :label="header.label"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="DataAirList-item-r">
          <div class="DataAirList-detail">
            <el-button
              type="primary"
              size="mini" 
              @click="getAirDetailsInfo(air.F_Id)"
            >
              详情
            </el-button>
          </div>
        </div>
      </div>
      <slot name="pageContent"></slot>
    </div>
    <!-- 暂无数据 -->
    <div class="public-empty" v-show="flyInfo.length <= 0">
      <div
        class="public-loading"
        ref="hide"
        v-loading="isLoading"
        element-loading-text="拼命查询中..."
      >
      </div>
      <div class="public-empty-text">
        <div class="el-icon-warning"></div>
        <p>暂无搜索数据</p>
      </div>
    </div>
    <Data-Air-Model></Data-Air-Model>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
import DataAirModel from './DataModel/DataAirModel'
import {colMethod} from '@/utils/utils'

export default {
  name: "DataAirList",
  data() {
    return {
      isShow: true,
      isLoading: false,
      flyInfo: [],
      isLoading: true,
      mergeObj: {}, // 用来记录需要合并行的下标
      mergeArr: [],// 表格中的列名,
      airMerge: []
    }
  },

  mounted() {
    this.loginInfo = window.localStorage.getItem("loginInfo");

    if (this.loginInfo) {
      setTimeout(() => {
        this.isLoading = false;
        this.$refs.hide.style.display = "none";
      }, 1000);
    }

    pubsub.subscribe("sendAirData", (_, airData) => {
      this.flyInfo = airData
      for(let val in this.flyInfo) {
        this.getSpanArr(this.flyInfo[val].RangeList)
      }
    })
  },

  methods: {
     getSpanArr(data) {
      if (data.length !== 0) {
        this.mergeArr.forEach((key, index1) => {
          let count = 0; // 用来记录需要合并行的起始位置
          this.mergeObj[key] = []; // 记录每一列的合并信息
          data.forEach((item, index) => {
            // index == 0表示数据为第一行，直接 push 一个 1
            if (index === 0) {
              this.mergeObj[key].push(1);
            } else {
              // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
              if (item[key] === data[index - 1][key]) {
                this.mergeObj[key][count] += 1;
                this.mergeObj[key].push(0);
              } else {
                // 如果当前行和上一行其值不相等 
                count = index; // 记录当前位置 
                this.mergeObj[key].push(1); // 重新push 一个 1
              }
            }
          })
        })
      } else {
        return
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 判断列的属性
      if (this.mergeArr.indexOf(column.property) !== -1) {
        // 判断其值是不是为0 
        if (this.mergeObj[column.property][rowIndex]) {
          return [this.mergeObj[column.property][rowIndex], 1]
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },

    async getAirDetailsInfo(id) {
      const {data: res} = await this.$http.post('Exportair/airInfo', {
        AirId: id
      })
      if(res.code !== 200) {
        this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
      }else {
        pubsub.publish('airDetails', [this.isShow, res.data])
      }
    }
  },

  components: {
    DataAirModel
  }
}
</script>

<style scoped lang="less">
.DataAirList {
  width: 1280px;
  margin: 12px auto 0 auto;
  padding: 0 0;
  box-sizing: border-box;
  margin-bottom: 230px;

  .pagesBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    background: #fff;
    margin-top: -12px;
  }

  .DataAirList-box {
    width: 100%;

    .DataAirList-item {
      display: flex;
      align-items: center;
      color: #697e9d;
      padding: 15px;
      box-sizing: border-box;
      background: #fff;
      margin-bottom: 12px;
      // border-bottom: 1px solid #eee;
      box-shadow: 5px 5px 10px #eaeaea;

      .DataAirList-item-l {
        flex: 1;
        padding: 0 10px;

        .DataAirInfo-air {
          display: flex;
          align-items: center;
          font-size: 13px;

          img {
            width: 100%;
            // display: inline-block;
            vertical-align: top;
            margin-right: 5px;
          }
        }

        .DataAirInfo-area {
          display: flex;
          align-items: center;
          margin-top: 8px;

          .DataAirInfo-location {
            span {
              font-size: 13px;
            }
            p {
              font-size: 13px;
            }
          }

          .DataAirInfo-arrow {
            margin: 0 20px;
            display: flex;
            color: #0081ff;
            .el-icon-right {
              font-size: 20px;
              font-weight: 600;
              // color: #0081ff;
            }
          }
        }

        .DataAirInfo-other {
          display: flex;
          font-size: 13px;
          margin-top: 8px;
          align-items: center;

          .DataAirInfo-other-item {
            margin-right: 20px;
          }

          .DataAirInfo-type {
            border: 1px solid #0081ff;
            padding: 2px 6px;
            color: #0081ff;
          }
        }
      }

      .DataAirList-item-m {
        flex: 2;
        padding: 0 10px;
        // border-right: 1px solid #e2e2e2;

        .DataAirList-table {
          width: 100%;
          font-size: 13px;
          border-collapse: collapse;
          text-align: left
        }
      }

      .DataAirList-item-r {
        padding: 0 10px;
        .DataAirList-detail {
          margin: 0 0 0 10px;
          .el-button {
            background: #0081ff;
            // padding: 6px 10px;
          }
          span {
            display: block;
            font-size: 13px;
            margin-top: 10px;
          }
        }
      }
    }
  }

  .public-empty {
    position: relative;
    height: 360px;
    background: #fff;

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
  }
}

::v-deep .el-table .cell {
  white-space: nowrap;
}

::v-deep .el-table .el-table__cell {
  padding: 10px 0;
}

::v-deep .el-table::before {
  background-color: transparent;
}
</style>