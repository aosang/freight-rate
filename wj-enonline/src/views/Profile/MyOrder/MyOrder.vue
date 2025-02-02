<template>
  <div class="MyOrder">
    <back-top></back-top>
    <el-card class="order-card">
      <el-tag style="margin-right: 20px">Export-LCL</el-tag>
      <el-date-picker 
        v-model="startTime" 
        type="date" 
        placeholder="Start-Time" 
        :clearable="true"
        style="margin-right: 15px"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-date-picker 
        v-model="endTime" 
        type="date" 
        placeholder="End-Time" 
        :clearable="true"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-button
        style="background: #0081ff" 
        class="order-btn" 
        type="primary" 
        @click="getSearchData">
          Search
      </el-button>
    </el-card>
    <!-- 数据列表 -->
    <el-card class="order-card">
      <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletePriceData">Delete</el-button>
      <el-table 
        stripe 
        fit 
        :data="savePriceData" 
        border 
        class="order-table"
        @selection-change="handleSelectChange"
      >
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column min-width="120" label="Quotation No.">
          <template slot-scope="scope">
            <a class="order-number" @click="getPriceDetail(scope.row), dialogVisible = true">
              {{ scope.row.F_PriceSheetNo }}
            </a>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="Type">
          <template slot-scope="scope">
            {{ scope.row.F_FRType === '1' ? 'LCL' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="Channel">
          <template slot-scope="scope">
            {{ scope.row.F_PriceSheetChannel === '1' ? 'website' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="120" prop="FromPortEnglish" label="POL"></el-table-column>
        <el-table-column min-width="120" prop="ToPortEnglish" label="POD"></el-table-column>
        <el-table-column min-width="150" prop="F_ShoppingCompany" label="Carrier"></el-table-column>
        <el-table-column min-width="150" label="Number">
          <template slot-scope="scope">
            {{ scope.row.F_PCSQuantity }}{{ scope.row.F_PCSUnit === '1' ? 'CTN(S)' : 'PLT(S)' }}/{{ scope.row.F_GrossWeight + 'KGS' }}/{{ scope.row.F_Volume + 'CBM' }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" prop="F_CreateUserName" label="Offeror"></el-table-column>
        <el-table-column min-width="150" prop="F_CreateDate" label="Time"></el-table-column>
        <el-table-column min-width="80" label="Method">
          <template slot-scope="scope">
            {{ scope.row.F_PriceSheetType === '1' ? 'standard' : 'quotation' }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" prop="CustomerName" label="Contact"></el-table-column>
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
    <el-dialog title="Quotation" width="75%" :visible.sync="dialogVisible">
      <div class="model-info-city">
        <div class="city-item">
          <h3>{{ lclInfo.FromPortEnglish }}</h3>
          <span>{{ lclInfo.FromPortName }}</span>
        </div>
        <div class="city-item">
          <label>{{ lclInfo.F_Voyage }}Days</label>
          <i></i>
          <label>{{ lclInfo.TransitPortEnglish === null ? 'Direct' : lclInfo.TransitPortEnglish }}</label>
        </div>
        <div class="city-item">
          <h3>{{ lclInfo.ToPortEnglish }}</h3>
          <span>{{ lclInfo.ToPortName }}</span>
        </div>
      </div>
      <div class="model-info-detail">
        <div class="detail-group">
          <div class="detail-item">
            <span>Carrier</span>
            <p>{{ lclInfo.F_ShoppingCompany }}</p>
          </div>
          <div class="detail-item">
            <span>Consignee</span>
            <p>{{ lclInfo.F_ConsigneeType }}</p>
          </div>
          <div class="detail-item">
            <span>ETD</span>
            <p>{{ lclInfo.F_ShiftPeriodEn }}</p>
          </div>
          <div class="detail-item">
            <span>Closing</span>
            <p>{{ lclInfo.F_CutoffPeriodEn }}</p>
          </div>
          <div class="detail-item">
            <span>Doc cutoff</span>
            <p>{{ lclInfo.F_CutoffTimeEn }}</p>
          </div>
          <div class="detail-item">
            <span>CFS cutoff</span>
            <p>{{ lclInfo.F_CutoffGoodsTime === null ? '--' : lclInfo.F_CutoffGoodsTimeEn }}</p>
          </div>
          <div class="detail-item">
            <span>Valid</span>
            <p>{{ lclInfo.F_StartTime }} to {{ lclInfo.F_EndTime }}</p>
          </div>
          <div class="detail-item">
            <span>Cargo information</span>
            <p>{{ lclInfo.F_PCSQuantity + 'PCS' }}/{{ lclInfo.F_GrossWeight + 'KGS' }}/{{ lclInfo.F_Volume + 'CBM' }}</p>
          </div>
          <div class="detail-item">
            <span>Warehouse</span>
            <p style="margin-right: 5px">{{ lclInfo.F_WarehouseName === null ? '--' : lclInfo.F_WarehouseName }}</p>
            <el-popover placement="right" width="200" trigger="click">
              <span class="el-icon-user-solid" @click="visible = !visible" slot="reference"></span>
              <div class="mark-item-store" style="font-size: 13px">
                <p style="margin-bottom: 10px">Name：{{ lclInfo.F_ContactPerson? lclInfo.F_ContactPerson: '--' }}</p>
                <p>Phone：{{ lclInfo.F_ContactNumber? lclInfo.F_ContactNumber: '--' }}</p>
              </div>
            </el-popover>
          </div>
          <div class="detail-item">
            <span>Address</span>
            <p>{{ lclInfo.F_Address === null ? '--' : lclInfo.F_Address }}</p>
          </div>
          <div class="detail-item">
            <span>Contact</span>
            <p>{{ username == '' ? '--' : username }}</p>
          </div>
          <div class="detail-item">
            <span>Phone</span>
            <p>{{ userphone == '' ? '--' : userphone }}</p>
          </div>
          <div class="detail-item">
            <span>Email</span>
            <p>{{ usermail == '' ? '--' : usermail }}</p>
          </div>
        </div>
      </div>
      <div class="model-create-table">
        <div class="table-fee-item" v-if="freightArr.length !== 0">
          <div class="fee-info">
            <h4>Freight and surcharges</h4>
            <span>Total:{{ freightTotal }}</span>
          </div>
          <div class="order-table">
            <el-table 
              border 
              stripe 
              :data="freightArr"
              :header-cell-style="{ background: '#f2f4f6' }"
              :row-style="{ fontSize: '13px' }"
              :cell-style="{ whiteSpace: 'nowrap' }"
              >
              <el-table-column prop="F_ExpenseCode" label="Charge Name"></el-table-column>
              <el-table-column prop="F_Currency" label="CCY"></el-table-column>
              <el-table-column label="Rate">
                <template slot-scope="scope">
                  {{ Number(scope.row.F_QuotedPrice) < 0? '('+ Number(scope.row.F_QuotedPrice) * -1 +')' : scope.row.F_QuotedPrice }}
                </template>
              </el-table-column>
              <el-table-column prop="F_Unit" label="Unit"></el-table-column> 
              <el-table-column prop="F_Quantity" label="Count"></el-table-column>
              <el-table-column label="Amount">
                <template slot-scope="scope">
                  {{ Number(scope.row.F_QuotedAmount) < 0? '('+ Number(scope.row.F_QuotedAmount) * -1 +')' : scope.row.F_QuotedAmount }}
                </template>
              </el-table-column>
              <el-table-column prop="F_Remark" label="Remark"></el-table-column>
            </el-table>
          </div>
          <div class="order-mark" v-if="textareaFreight">
            <span>Remark</span>
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
            <h4>Origin</h4>
            <span>Total:{{ polTotal }}</span>
          </div>
          <div class="order-table">
            <el-table 
              border 
              stripe 
              :data="polFeeArr"
              :header-cell-style="{ background: '#f2f4f6' }"
              :row-style="{ fontSize: '13px' }"
              :cell-style="{ whiteSpace: 'nowrap' }"
              >
              <el-table-column prop="F_ExpenseCode" label="Charge Name"></el-table-column>
              <el-table-column prop="F_Currency" label="CCY"></el-table-column>
              <el-table-column prop="F_QuotedPrice" label="Rate"></el-table-column>
              <el-table-column prop="F_Unit" label="Unit"></el-table-column> 
              <el-table-column prop="F_Quantity" label="Count"></el-table-column>
              <el-table-column prop="F_QuotedAmount" label="Amount"></el-table-column>
              <el-table-column prop="F_Remark" label="Remark"></el-table-column>
            </el-table>
          </div>
          <div class="order-mark" v-if="textareaPol">
            <span>Remark</span>
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
            <h4>Dest</h4>
            <span>Total:{{ podTotal }}</span>
            <span>Convert: {{ convert? convert : '--' }}</span>
          </div>
          <div class="order-table">
            <el-table 
              border 
              stripe 
              :data="podFeeArr"
              :header-cell-style="{ background: '#f2f4f6' }"
              :row-style="{ fontSize: '13px' }"
              :cell-style="{ whiteSpace: 'nowrap' }"
              >
              <el-table-column prop="F_ExpenseCode" label="Charge Name"></el-table-column>
              <el-table-column prop="F_Currency" label="CCY"></el-table-column>
              <el-table-column prop="F_QuotedPrice" label="Rate"></el-table-column>
              <el-table-column prop="F_Unit" label="Unit"></el-table-column> 
              <el-table-column prop="F_Quantity" label="Count"></el-table-column>
              <el-table-column prop="F_QuotedAmount" label="Amount"></el-table-column>
              <el-table-column prop="F_Remark" label="Remark"></el-table-column>
            </el-table>
          </div>
          <div class="order-mark" v-if="textareaPod">
            <span>Remark</span>
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
      <p style="font-size: 13px; color: #909399; margin-top: 10px">
        The above quotation and billing results are for reference only, please contact our staff for the final quotation.
      </p>
    </el-dialog>
  </div>
</template>

<script>
import BackTop from '@/components/BackTop/BackTop'
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
    }
  },

  mounted() {
    this.getSavePriceData(1, 20, 1, this.startTime, this.endTime)
  },

  components: {
    BackTop
  },

  methods: {
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
          this.total = res.data.total
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 按时间查询
    getSearchData() {
      this.getSavePriceData(1, 20, 1, this.startTime, this.endTime)
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

    async deletePriceData() {
      if (this.selectionArr.length == 0) {
        this.$message({
          message: 'Please select one data',
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
              message: 'Delete Successful',
              type: 'success',
              duration: 2000
            })
            this.getSavePriceData(1, 20, 1, this.startTime, this.endTime)
          } else {
            this.$message({
              message: 'Fail',
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
        Type: 1
      })
      try {
        if (res.code === 200) {
          this.lclInfo = res.data
          const {F_RealName, F_Telephone, F_Email} = this.lclInfo.Contact
          this.username = F_RealName
          this.userphone = F_Telephone
          this.usermail = F_Email
      
          this.freightArr = res.data.freightSurcharge
          this.polFeeArr = res.data.departurePortCharges
          this.podFeeArr = res.data.destinationPorts

          this.freightTotal = res.data.F_FreightTotal
          this.polTotal = res.data.F_PortDepartureTotal
          this.podTotal = res.data.F_PortDestinationTotal
          this.convert = res.data.F_CovertTotal

          this.textareaFreight = res.data.F_FreightRemark
          this.textareaPol = res.data.F_PortDepartureRemark
          this.textareaPod = res.data.F_PortDestinationRemark
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

  .order-number {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: #409eff;
    }
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
        display: flex;

        h4 {
          margin-right: 10px;
          font-size: 15px;
          font-weight: 550;
        }

        span {
          margin-right: 10px;
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
    }
  }

  /deep/ .el-textarea__inner {
    font-family: "微软雅黑", sans-serif;
    font-size: 13px;
  }

  /deep/ .el-backtop {
    bottom: 120px !important;
    right: 36px !important;
  }
</style>