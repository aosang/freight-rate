<template>
  <div class="DataList">
    <div class="DataList-box" v-show="lcldata.length > 0">
      <table>
        <thead style="background: #e9f0f7">
          <tr>
            <th>POL</th>
            <th></th>
            <th>POD</th>
            <th>Consignee</th>
            <th>Standard</th>
            <th>Sailing</th>
            <th>CBM</th>
            <th>TON</th>
            <th>Vol.ratio</th>
            <th>Local Charge</th>
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
                <span class="lcl-day">{{ d.F_Voyage ? d.F_Voyage : '--' }}Days</span>
                <i class="line"></i>
                <span class="lcl-type">
                  {{ d.TransitPortEnglish === null ? 'Direct' : d.TransitPortEnglish }}
                </span>
              </div>
            </td>
            <td>
              <h3 class="city-en">{{ d.ToPortEnglish }}</h3>
              <p class="city-zh">{{ d.ToPortName }}</p>
            </td>
            <td>
              <p class="take-type">{{ d.F_ConsigneeType }}</p>
              <p class="lcl-rt" v-if="d.F_RTLowerLimit === '' && d.F_RTUpperLimit === ''">--</p>
              <p class="lcl-rt" v-else>
                {{ Number(d.F_RTLowerLimit) }}＜RT≤{{ Number(d.F_RTUpperLimit) }}
              </p>
            </td>
            <td>
              <p v-if="d.F_ChargeStandard == 1">Standard</p>
              <p v-else-if="d.F_ChargeStandard == 2">High</p>
              <p v-else-if="d.F_ChargeStandard == 3">Low</p>
            </td>
            <td>
              <p class="lcl-week">{{ d.F_ShiftPeriodEn? d.F_ShiftPeriodEn : '--' }}</p>
              <p class="lcl-ship">{{ d.F_ShoppingCompany? d.F_ShoppingCompany : '--' }}</p>
            </td>
            <td>
              <div v-if="loginInfo !== null">
                <span class="ton" v-if="d.F_CBM !== ''">
                  {{ d.F_CBM < 0 ? '(' + d.F_CBM * -1 + ')' : d.F_CBM }} </span>
                    <span class="ton" v-else>case by case</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              <div v-if="loginInfo !== null">
                <span class="ton" v-if="d.F_TON !== ''">
                  {{ d.F_TON < 0 ? '(' + d.F_TON * -1 + ')' : d.F_TON }} </span>
                    <span class="ton" v-else>case by case</span>
              </div>
              <div v-else>****</div>
            </td>
            <td>
              {{ d.F_VolumeRatio === '' || Number(d.F_VolumeRatio) === 0 ? '--' : '1:' + Number(d.F_VolumeRatio) }}
            </td>
            <td>
              <div class="lcl-pay" v-if="loginInfo !== null">
                <el-popover placement="left" width="1000" title="ORIGIN">
                  <a 
                    slot="reference" 
                    @click="getPolFeesData(d.F_Id)">
                    ORIGIN
                  </a>
                  <el-table
                    border 
                    :data="originArr" 
                    style="font-size: 12px" 
                    max-height="400"
                  >
                    <el-table-column prop="F_ExpenseCodeEng" label="Charge Name"></el-table-column>
                    <el-table-column width="160" prop="F_Currency" label="Currency"></el-table-column>
                    <el-table-column prop="F_UnitPrice" width="100" label="Rate"></el-table-column>
                    <el-table-column prop="F_Unit" label="Unit"></el-table-column>
                    <el-table-column label="Remark">
                      <template slot-scope="scope">
                        <el-tooltip 
                          v-if="scope.row.F_ExpensesDescription"  
                          placement="left" 
                          effect="light"
                        >
                          <div slot="content" style="max-width: 600px; line-height: 20px">
                            {{scope.row.F_ExpensesDescription? scope.row.F_ExpensesDescription : '-'}}
                          </div>
                          <el-button size="mini">Details</el-button>
                        </el-tooltip>
                        <div v-else>-</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-popover>
                <el-popover placement="left" width="1000" title="DEST">
                  <a 
                    slot="reference" 
                    @click="getPodFeesData(d.F_Id)">
                    DEST
                  </a>
                  <el-table
                    border 
                    :data="destArr" 
                    style="font-size: 12px" 
                    :span-method="objectSpanMethod" 
                    max-height="400"
                  >
                    <el-table-column width="240" prop="F_ExpenseCodeEng" label="Charge Name"></el-table-column>
                    <el-table-column width="120" prop="F_Currency" label="Currency"></el-table-column>
                    <el-table-column width="80" prop="F_UnitPrice" label="Rate"></el-table-column>
                    <el-table-column width="80" prop="F_Unit" label="Unit"></el-table-column>
                    <el-table-column width="80" label="Min">
                      <template slot-scope="scope">
                        {{ scope.row.F_MiniCharge ? scope.row.F_MiniCharge : '' }}{{ scope.row.F_MaxUnit ? '/' + scope.row.F_MaxUnit : '' }}
                      </template>
                    </el-table-column>
                    <el-table-column width="80" label="Max">
                      <template slot-scope="scope">
                        {{ scope.row.F_MaxCharge ? scope.row.F_MaxCharge : '' }}{{ scope.row.F_MaxUnit ? '/' +
                          scope.row.F_MaxUnit : '' }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Range">
                      <template slot-scope="scope">
                        <div v-if="Number(scope.row.F_IntervalMaxPrice) && Number(scope.row.F_IntervalMinPrice)">
                          {{ Number(scope.row.F_IntervalMinPrice) }}＜{{ scope.row.F_IntervalUnit }}≤
                          {{ Number(scope.row.F_IntervalMaxPrice) }}
                        </div>
                        <div v-else-if="Number(scope.row.F_IntervalMaxPrice)">
                          {{ scope.row.F_IntervalUnit }}≤{{ Number(scope.row.F_IntervalMaxPrice) }}
                        </div>
                        <div v-else-if="Number(scope.row.F_IntervalMinPrice)">
                          {{ scope.row.F_IntervalUnit }}＞{{ Number(scope.row.F_IntervalMinPrice) }}
                        </div>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="90" prop="F_VolumeRatio" label="Vol.Ratio">
                      <template slot-scope="scope">
                        {{ scope.row.F_VolumeRatio ? '1:' + scope.row.F_VolumeRatio : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Remark">
                      <template slot-scope="scope">
                        <el-tooltip 
                          v-if="scope.row.F_Description" 
                          placement="left" 
                          effect="light"
                        >
                          <div slot="content" style="max-width: 600px; line-height: 20px">
                            {{scope.row.F_Description}}
                          </div>
                          <el-button size="mini">Details</el-button>
                        </el-tooltip>
                        <div v-else>-</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-popover>
              </div>
              <div v-else>****</div>
              <p class="lcl-date">{{ d.F_StartTime }} to {{ d.F_EndTime }}</p>
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
                  Detail
                </el-button>
                <el-button type="success" size="mini" v-else @click="goToLogin">
                  Login
                </el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <slot name="pageContent"></slot>
    </div>
    <div class="public-empty" v-show="lcldata.length <= 0">
      <div class="public-loading" ref="hide" v-loading="isLoading" element-loading-text="searching..."></div>
      <div class="public-empty-text">
        <div class="el-icon-warning"></div>
        <p>SORRY THERE'S NOTING HERE!</p>
      </div>
    </div>
    <DataModel></DataModel>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
import DataModel from './DataModel/DataModel'
export default {
  name: 'DataList',
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
      mergeArr: ['F_ExpenseCodeEng'],// 表格中的列名
      isLoading: true
    }
  },

  mounted() {
    this.loginInfo = window.localStorage.getItem('enloginInfo')

    if(this.loginInfo) {
      setTimeout(() => {
        this.isLoading = false
        this.$refs.hide.style.display = 'none'
      }, 1000)
    }

    // 接收列表查询数据
    pubsub.subscribe('sendListData', (_, lcldata) => {
      this.lcldata = lcldata.data
      this.total = lcldata.total
      this.currentPage = lcldata.current_page
      this.pageSize = lcldata.per_page
    })
  },

  methods: {
    // getSpanArr方法
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
      }else {
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

    // 获取详情数据
    async getDetailsInfo(id) {
      const { data: res } = await this.$http.post('Exportlcl/lclInfo', {
        LclId: id
      })
      try {
        if (res.code !== 200) {
          this.$message({
            message: 'Please log in again',
            type: 'error',
            duration: 2000
          })
        }else {
          pubsub.publish('details', [this.isShow, res.data])
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 获取起运港费用
    async getPolFeesData(id) {
      const { data: res } = await this.$http.post('Exportlcl/lclFee', {
        Type: 1,
        LclId: id
      })
      try {
        if (res.code !== 200) {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }else {
          this.originArr = res.data
          pubsub.publish('polFeesData', res.data)
        }
      }catch (error) {
        console.log(error)
      }
    },

    // 获取目的港费用
    async getPodFeesData(id) {
      const { data: res } = await this.$http.post('Exportlcl/lclFee', {
        Type: 2,
        LclId: id
      })
      try {
        if (res.code !== 200) {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }else {
          this.destArr = res.data
          this.getSpanArr(this.destArr)
          pubsub.publish('podFeesData', res.data)
        }
        
      } catch (error) {
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
    DataModel
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
        margin: 0 0 0 -20px;

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
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: -6px;
          white-space: nowrap;
        }
      }

      .ton,
      .cbm {
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

      .lcl-week,
      .lcl-ship {
        font-size: 12px;
      }

      .lcl-ship {
        margin-top: -20px;
        font-size: 12px;
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
}
</style>