<template>
  <div class="MyOrder">
    <back-top></back-top>  
    <el-card class="order-card">
      <el-tag type="danger" style="margin-right: 20px">海出整箱</el-tag>
      <el-date-picker 
        v-model="startTime" 
        type="date" 
        placeholder="选择开始时间" 
        :clearable="true" 
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd" 
        style="margin-right: 15px">
      </el-date-picker>
      <el-date-picker 
        v-model="endTime" 
        type="date" placeholder="选择结束日期" 
        :clearable="true" 
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button
        style="background: #0081ff"  
        class="order-btn" 
        type="primary" 
        @click="getSearchData">
          查询
      </el-button>
    </el-card>
    <!-- 数据列表 -->
    <el-card class="order-card">
      <el-button 
        size="mini" 
        type="danger" 
        icon="el-icon-delete" 
        @click="deletePriceData"
      >
        删除
      </el-button>
      <el-table :stripe="true" fit :data="savePriceData" border class="order-table"
        @selection-change="handleSelectChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column min-width="120" label="报价编号">
          <template slot-scope="scope">
            <a class="order-number" @click="getPriceDetail(scope.row), dialogVisible = true">
              {{ scope.row.F_PriceSheetNo }}
            </a>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="业务类型">
          <template slot-scope="scope">
            {{ scope.row.F_FRType === '3' ? '出口整箱' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="80" prop="F_PriceSheetChannel" label="报价渠道">
          <template slot-scope="scope">
            {{ scope.row.F_PriceSheetChannel === '1' ? '网站' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="120" prop="FromPortName" label="起运港"></el-table-column>
        <el-table-column min-width="120" prop="ToPortName" label="目的港"></el-table-column>
        <el-table-column min-width="150" label="航司">
          <template slot-scope="scope">
            {{ scope.row.F_ShoppingCompany? scope.row.F_ShoppingCompany : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="货量">
          <template slot-scope="scope">
            {{ scope.row.CargoInfo}}
          </template>
        </el-table-column>
        <el-table-column min-width="80" prop="F_CreateUserName" label="报价人"></el-table-column>
        <el-table-column min-width="130" prop="F_CreateDate" label="报价时间"></el-table-column>
        <el-table-column min-width="80" label="报价方式">
          <template slot-scope="scope">
            {{ scope.row.F_PriceSheetType === '1' ? '收费标准报价' : '报价单' }}
          </template>
        </el-table-column>
        <el-table-column min-width="80" prop="CustomerName" label="联系人"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="order-page">
        <el-pagination 
          layout="total, prev, pager, next" 
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 报价单详情 -->
    <el-dialog title="海出整箱报价单详情" width="83%" :visible.sync="dialogVisible">
      <div class="model-info-city">
        <div class="city-item">
          <h3>{{ lclInfo.FromPortEnglish }}</h3>
          <span>{{ lclInfo.FromPortName }}</span>
        </div>
        <div class="city-item">
          <label>{{ lclInfo.F_Voyage }}天</label>
          <i></i>
          <label>{{ lclInfo.TransitPortEnglish === null ? '直拼' : lclInfo.TransitPortEnglish }}</label>
        </div>
        <div class="city-item">
          <h3>{{ lclInfo.ToPortEnglish }}</h3>
          <span>{{ lclInfo.ToPortName }}</span>
        </div>
      </div>
      <div class="model-info-detail">
        <div class="detail-group">
          <div class="detail-item">
            <span>起运港码头</span>
            <p>{{lclInfo.FromQuayEng? lclInfo.FromQuayEng : ''}}{{ lclInfo.FromQuayName? lclInfo.FromQuayName : '' }}</p>
          </div>
          <div class="detail-item">
            <span>目的港码头</span>
            <p>{{ lclInfo.F_DesPortQuayId? lclInfo.F_DesPortQuayId : '' }}</p>
          </div>
          <div class="detail-item">
            <span>船公司</span>
            <p>{{ lclInfo.F_ShoppingCompany? lclInfo.F_ShoppingCompany : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>班期</span>
            <p>{{ lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>截关期</span>
            <p>{{ lclInfo.F_CutoffPeriod? lclInfo.F_CutoffPeriod : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>截单日期</span>
            <p>{{ lclInfo.F_CutoffTime? lclInfo.F_CutoffTime : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>航线代码</span>
            <p>{{ lclInfo.F_RouteCode? lclInfo.F_RouteCode : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>箱属</span>
            <p>{{ lclInfo.F_Ceratina? lclInfo.F_Ceratina : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>有效期</span>
            <p>{{ lclInfo.F_StartTime }}-{{ lclInfo.F_EndTime }}</p>
          </div>
          <div class="detail-item">
            <span>起运港码头</span>
            <p>{{ lclInfo.FromQuayName? lclInfo.FromQuayName : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>目的港码头</span>
            <p>{{ lclInfo.F_DesPortQuayId? lclInfo.F_DesPortQuayId : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>货量</span>
            <p>{{ lclInfo.F_CargoQuantity? lclInfo.F_CargoQuantity : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>联系人</span>
            <p>{{ username == '' ? '--' : username }}</p>
          </div>
          <div class="detail-item">
            <span>联系电话</span>
            <p>{{ userphone? userphone : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>电子邮箱</span>
            <p>{{ usermail? usermail : '--' }}</p>
          </div>
        </div>
        <div class="detail-mark">
          <div class="mark-item">
            <span>订舱备注</span>
            <p>{{ lclInfo.F_BookingRemarks? lclInfo.F_BookingRemarks : '-' }}</p>
          </div>
          <div class="mark-item">
            <span>限重备注</span>
            <p>{{ lclInfo.F_WeightLimitRemarks? lclInfo.F_WeightLimitRemarks : '-' }}</p>
          </div>
        </div>
      </div>
      <div class="model-create-table">
        <div class="table-fee-item" v-if="freightArr.length !== 0">
          <div class="fee-info">
            <h4>海运费及附加费</h4>
            <span>{{ freightTotal? freightTotal + ' ' : '--' }}</span>
          </div>
          <div class="order-table">
            <el-table 
              border 
              stripe 
              :data="freightArr"
              :header-cell-style="{ background: '#f2f4f6' }"
              :row-style="{ fontSize: '13px' }"
              :cell-style="{ whiteSpace: 'nowrap' }"
              :span-method="FreightobjectSpanMethod"
            >
              <el-table-column prop="F_ExpenseCode" label="费用名称">
                <template slot-scope="scope">
                   <span :class="scope.row.F_Unit == 'Bill'? 'singleColor' : ''">
                    {{ scope.row.F_Unit == 'Bill'?  '★' + scope.row.F_ExpenseCode : scope.row.F_ExpenseCode }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="F_Currency" label="币种"></el-table-column>
              <el-table-column prop="F_Unit" label="单位"></el-table-column>
              <el-table-column label="单价">
                <template slot-scope="scope">
                  {{ scope.row.F_UnitPrice < 0? '('+ Number(scope.row.F_UnitPrice) * -1 +')' : scope.row.F_UnitPrice }}
                </template>
              </el-table-column>
              <el-table-column prop="F_Quantity" label="数量"></el-table-column>
              <el-table-column label="金额">
                <template slot-scope="scope">
                  {{ scope.row.F_Amount < 0? '('+ Number(scope.row.F_Amount) * -1 +')' : scope.row.F_Amount }}
                </template>
              </el-table-column>
              <el-table-column prop="F_Remark" label="备注"></el-table-column>
            </el-table>
          </div>
          <div class="order-mark" v-if="textareaFreight">
            <span>备注信息</span>
            <el-input
              type="textarea" 
              :rows="4" 
              readonly
              v-model="textareaFreight" 
            >
            </el-input>
          </div>
        </div>
        <!-- 起运港费 -->
        <div class="table-fee-item" v-if="polFeeArr.length !== 0">
          <div class="fee-info">
            <h4>起运港费用</h4>
            <span>{{ polTotal? polTotal + ' ' : '--' }}</span>
          </div>
          <div class="order-table">
            <el-table 
              border 
              stripe 
              :data="polFeeArr"
              :header-cell-style="{ background: '#f2f4f6' }"
              :row-style="{ fontSize: '13px' }"
              :cell-style="{ whiteSpace: 'nowrap' }"
              :span-method="PolobjectSpanMethod"
              >
              <el-table-column prop="F_ExpenseCode" label="费用名称">
                <template slot-scope="scope">
                  <span :class="scope.row.F_Unit == 'Bill'? 'singleColor' : ''">
                    {{ scope.row.F_Unit == 'Bill'?  '★' + scope.row.F_ExpenseCode : scope.row.F_ExpenseCode }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="F_Currency" label="币种"></el-table-column>
              <el-table-column prop="F_Unit" label="单位"></el-table-column>
              <el-table-column prop="F_UnitPrice" label="单价"></el-table-column>
              <el-table-column prop="F_Quantity" label="数量"></el-table-column>
              <el-table-column prop="F_Amount" label="金额"></el-table-column>
              <el-table-column prop="F_Remark" label="备注"></el-table-column>
            </el-table>
          </div>
          <div class="order-mark" v-if="textareaPol">
            <span>备注信息</span>
            <el-input
              type="textarea" 
              :rows="4" 
              readonly
              v-model="textareaPol" 
            >
            </el-input>
          </div>
        </div>
        <!-- 目的港费用 -->
        <div class="table-fee-item" v-if="podFeeArr.length !== 0">
          <div class="fee-info">
            <h4>目的港费用</h4>
            <span>{{ podTotal? podTotal : '--' }}</span>
          </div>
          <div class="order-table">
            <el-table 
              border 
              stripe 
              :data="podFeeArr"
              :header-cell-style="{ background: '#f2f4f6' }"
              :row-style="{ fontSize: '13px' }"
              :cell-style="{ whiteSpace: 'nowrap' }"
              :span-method="PodobjectSpanMethod"
              >
              <el-table-column prop="F_ExpenseCode" label="费用名称">
                <template slot-scope="scope">
                  <span :class="scope.row.F_SingleVote == 1? 'singleColor' : ''">
                    {{ scope.row.F_SingleVote == 1?  '★' + scope.row.F_ExpenseCode : scope.row.F_ExpenseCode }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="F_Currency" label="币种"></el-table-column>
              <el-table-column prop="F_Unit" label="单位"></el-table-column>
              <el-table-column prop="F_UnitPrice" label="单价"></el-table-column>
              <el-table-column prop="F_Quantity" label="数量"></el-table-column>
              <el-table-column prop="F_Amount" label="金额"></el-table-column>
              <el-table-column prop="F_Remark" label="备注"></el-table-column>
            </el-table>
          </div>
          <div class="order-mark" v-if="textareaPod">
            <span>备注信息</span>
            <el-input
              type="textarea" 
              :rows="4" 
              readonly
              v-model="textareaPod"
            >
            </el-input>
          </div>
        </div>
      </div>
      <p style="font-size: 13px; color: #909399">以上报价和计费结果仅供参考，请联系我司人员以最终报价为准。</p>
    </el-dialog>
  </div>
</template>

<script>
import BackTop from '@/components/BackTop/BackTop'
import {colMethod} from '@/utils/utils'
export default {
  name: 'MyOrder',
  data() {
    return {
      savePriceData: [],
      total: 0,
      startTime: '',
      endTime: '',
      selectionArr: [],
      deleteId: '',
      dialogVisible: false,
      lclInfo: {},
      visible: false,
      freightArr: [],
      polFeeArr: [],
      podFeeArr: [],
      freightMergeArr: [],
      polMergeArr: [],
      podMergeArr: [],
      freightTotal: '',
      polTotal: '',
      podTotal: '',
      typeTotal: '',
      textareaFreight: '',
      textareaPol: '',
      textareaPod: '',
      username: '',
      userphone: '',
      usermail: '',
      convert: '',
      // mergeObj: {}, // 用来记录需要合并行的下标
      // mergeArr: ['F_ExpenseCode'], // 表格中的列名,
    }
  },

  mounted() {
    this.getSavePriceData(1, 20, 3, this.startTime, this.endTime)
  },

  components: {
    BackTop
  },

  methods: {
    PolobjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.polMergeArr[column.property] || []
      if (column.type == 'index' && this.polMergeArr['F_ExpenseCode'])
        return this.polMergeArr['F_ExpenseCode'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },  

    PodobjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.podMergeArr[column.property] || []
      if (column.type == 'index' && this.podMergeArr['F_ExpenseCode'])
        return this.podMergeArr['F_ExpenseCode'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },

    FreightobjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.freightMergeArr[column.property] || []
      if (column.type == 'index' && this.freightMergeArr['F_ExpenseCode'])
        return this.freightMergeArr['F_ExpenseCode'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },

    async getSavePriceData(page, limit, type, startTime, endTime) {
      const { data: res } = await this.$http.post('Lclquote/index', {
        Page: page,
        Limit: limit,
        Type: type,
        StartDate: startTime,
        EndDate: endTime,
      })
      try {
        if (res.code === 200) {
          this.savePriceData = res.data.data
        }else {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 按时间查询
    getSearchData() {
      this.getSavePriceData(1, 20, 3, this.startTime, this.endTime)
    },

    // 获取删除Id
    handleSelectChange(selection) {
      let id = ''
      this.selectionArr = selection
      this.selectionArr.forEach(item => {
        id += item.F_Id + ','
      })
      if (id.charAt(id.length - 1) === ',') {
        id = id.slice(0, id.length - 1)
        this.deleteId = id
      }
    },

    // 删除数据
    async deletePriceData() {
      if (this.selectionArr.length == 0) {
        this.$message({
          message: '请选择删除数据',
          type: 'error',
          duration: 2000
        })
      } else {
        const { data: res } = await this.$http.post('Lclquote/delete', {
          QuoteId: this.deleteId
        })
        try {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getSavePriceData(1, 20, 3, this.startTime, this.endTime)
          } else {
            this.$message({
              message: res.info,
              type: 'error',
              duration: 2000
            })
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    // 获取运价详情数据
    async getPriceDetail(row) {
      const { data: res } = await this.$http.post('Lclquote/quoteInfo', {
        QuoteId: row.F_Id,
        Type: 3
      })
      try {
        if (res.code === 200) {
          this.lclInfo = res.data
          this.freightArr = res.data.freightSurcharge
          this.freightMeArr = _.sortBy(this.freightArr, ['F_ExpenseCode'])
          this.$nextTick(() => {
            this.freightMergeArr = colMethod(['F_ExpenseCode',  'F_Remark'], this.freightArr)
          })

          this.polFeeArr = res.data.departurePortCharges
          this.polFeeArr = _.sortBy(this.polFeeArr, ['F_ExpenseCode'])
          this.$nextTick(() => {
            this.polMergeArr = colMethod(['F_ExpenseCode',  'F_Remark'], this.polFeeArr)
          })

          this.podFeeArr = res.data.destinationPorts
          this.podFeeArr = _.sortBy(this.podFeeArr, ['F_ExpenseCode'])
          this.$nextTick(() => {
            this.podMergeArr = colMethod(['F_ExpenseCode',  'F_Remark'], this.podFeeArr)
          })

          const {F_RealName, F_Telephone, F_Email} = this.lclInfo.BelongInfo
          this.username = F_RealName
          this.userphone = F_Telephone
          this.usermail = F_Email

        
          this.freightTotal = res.data.F_FreightTotal
          this.polTotal = res.data.F_PortDepartureTotal
          this.podTotal = res.data.F_PortDestinationTotal
          this.convert = res.data.F_CovertTotal
          this.typeTotal = res.data.F_ExpenseTypeTotal
        }else {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
.order-card {
  position: relative;
  margin-bottom: 15px;

  span {
    font-size: 14px;
  }

  .order-btn {
    margin-left: 12px;
  }
}

.order-table {
  position: relative;
  width: 100%;
  font-size: 12px;
  margin-top: 15px;

  .singleColor {
    color: #409eff;
  }

  .order-number {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: #409eff;
    }
  }
}

.order-mark {
  margin-top: 12px;
  font-family: "微软雅黑" sans-serif !important;

  span {
    font-size: 13px;
    font-weight: 550;
    margin-bottom: 8px;
  }
}

.order-page {
  margin-top: 20px;
  display: flex;

  .el-pagination {
    margin: 0 0 0 auto;
  }
}

.model-info-city {
  display: flex;

  .city-item {
    display: flex;
    flex-direction: column;
    margin-right: 15px;

    h3 {
      font-weight: 550;
      font-size: 16px;
      color: #000;
    }

    i {
      width: 70px;
      height: 1px;
      background: #ccc;
    }

    label {
      margin: 2px 0;
      text-align: center;
      font-size: 12px;
    }

    span {
      font-size: 14px;
    }

    p {
      font-size: 14px;
    }
  }

}

.model-info-detail {
  margin-top: 15px;

  .detail-group {
    display: flex;
    flex-wrap: wrap;

    .detail-item {
      display: flex;
      width: 25%;
      margin-top: 15px;
      font-size: 13px;

      span {
        margin-right: 8px;
        color: #8d95a7;
      }
    }
  }

  .detail-mark {
    display: flex;
    flex-wrap: wrap;

    .mark-item {
      display: flex;
      width: 100%;
      margin-top: 15px;
      font-size: 13px;

      .el-icon-user-solid {
        font-size: 16px;
        margin-left: 5px;
        cursor: pointer;
      }

      span {
        white-space: nowrap;
        margin-right: 8px;
        color: #8d95a7;
      }

      p {
        line-height: 24px;
        margin-top: -3px;
      }
    }
  }
}

.model-tabs {
  margin-top: 30px;

  .model-fee {
    .model-fee-item {
      margin-bottom: 25px;

      .fee-ul {
        display: flex;
        margin-top: 20px;

        li {
          width: 20%;
          font-size: 13px;

          p {
            margin-top: 10px;
            font-weight: 550;
          }
        }
      }

      .fee-table {
        font-size: 13px;
      }

      .fee-title {
        color: #000;
        font-size: 15px;
        font-weight: 550;
        margin: 10px 0;
      }
    }
  }

  .model-create-item {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .create-title {
      color: #000;
      font-size: 15px;
      font-weight: 550;
      margin-right: 20px;
    }

    span {
      color: #ffa024;
      margin: 0 5px;
    }

    p {
      margin-right: 20px;
    }
  }

  .model-create-input {
    display: flex;
    margin-top: 15px;
    justify-content: space-between;

    .input-item {
      width: 31%;

      /deep/ .el-input__inner {
        line-height: 1px !important;
      }
    }
  }
}

.model-create-table {
    margin-top: 30px;

    .table-fee-item {
      margin-bottom: 25px;

      .fee-info {
        // display: flex;
        
        h4 {
          margin-right: 10px;
          font-size: 15px;
          font-weight: 550;
        }

        span {
          margin: 6px 10px 6px 0;
          color: #ffa024;
        }
      }

      .order-table {
        margin-top: 10px;

        .order-edit {
          width: 100%;

          ul {
            display: flex;
            background: #e6ebf4;
            padding: 4px;
            align-items: center;

            li {
              margin-right: 4px;

              /deep/ .el-select .el-input {
                width: auto;
              }
            }
          }
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ebeef5;

          thead {
            background: #ebeef5;
          }

          th,
          td {
            height: 40px;
            font-size: 13px;
            text-align: left;
            white-space: nowrap;
            padding: 0 0 0 12px;
          }

          tbody {
            tr {
              &:nth-child(even) {
                background: #eee;
              }
            }

            .input-style {
              margin: 0 auto;

              td {
                padding: 0 0 0 6px;
              }

              .el-input {
                width: 100%;
              }
            }
          }
        }

      }
    }
  }

  /deep/ .el-textarea__inner {
    font-family: "微软雅黑", sans-serif;
    font-size: 13px;
    padding: 5px 10px;
  }
</style>