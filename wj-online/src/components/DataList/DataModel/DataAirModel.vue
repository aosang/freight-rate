<template>
  <div class="DataAirModel">
    <el-dialog 
      width="83%" 
      title="空运出口" 
      :visible.sync="isShow"
      :close-on-click-modal="false"  
    >
      <div class="airInfo" style="margin-top: -10px">
        <el-row :gutter="20">
          <el-col :span="20">
            <div class="airInfo-item">
              <div class="airInfo-port">
                <div>{{showInfo.FromCode? showInfo.FromCode : '' }} {{showInfo.FromPort? showInfo.FromPort : ''}} {{showInfo.FromCityNameCN? '(' + showInfo.FromCityNameCN  +')' : ''}}</div>
                <div style="display: flex; align-items: center; margin: 0 20px">
                  <span class="el-icon el-icon-caret-right"></span>
                  <p style="margin: 0 4px">{{showInfo.F_PortofTransit? showInfo.F_PortofTransit : '直达'}}</p>
                  <span class="el-icon el-icon-caret-right"></span>
                </div>
                <div>{{showInfo.ToCode? showInfo.ToCode : '' }} {{showInfo.ToPort? showInfo.ToPort : ''}} {{showInfo.ToCityNameCN? '(' + showInfo.ToCityNameCN  +')' : ''}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="airInfo-item">
              <span style="margin-right: 30px" class="airInfo-info">
                航空公司：<img v-if="showInfo.Logopath" :src="showInfo.Logopath? showInfo.Logopath : '' " alt="航空公司logo"/>{{ showInfo.AirCompanyname? showInfo.AirCompanyname : '' }}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">
              <span>航程：{{showInfo.F_Voyage? showInfo.F_Voyage : '--'}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">  
              <span>货物类型：{{showInfo.F_GoodsTypeCn? showInfo.F_GoodsTypeCn : '--' }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">  
              <span>包装类型：{{showInfo.F_PackagTypeCn? showInfo.F_PackagTypeCn : '--' }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="airInfo-item">
              <span class="airInfo-info">
                尺寸限制：{{showInfo.F_SizeLength? 'L' + showInfo.F_SizeLength + 'cm' + ' /' : ''}} {{showInfo.F_SizeWide? 'W' + showInfo.F_SizeWide + 'cm' + ' /' : ''}} {{showInfo.F_SizeHigh? 'H' + showInfo.F_SizeHigh + 'cm' : ''}}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">
              <span>最大重量：{{showInfo.F_MaxWeight? showInfo.F_MaxWeight + 'KGS' : '--'}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">  
              <span>最低承运：{{showInfo.F_MinWeight? showInfo.F_MinWeight + 'KGS' : '--'}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">  
              <span>锂电池：{{showInfo.F_LithiumBattery? showInfo.F_LithiumBattery : '--'}}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="airInfo-item">
              <span class="airInfo-info">
                班期：{{showInfo.F_ShiftPeriod? showInfo.F_ShiftPeriod : '--'}}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">
              <span class="airInfo-info">
                转运方式：{{showInfo.F_TransportMode? showInfo.F_TransportMode : '--'}}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="airInfo-item">
              <span>有效期：{{showInfo.F_StartTime}} 至 {{showInfo.F_EndTime}}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <div class="airInfo-item">
            <el-col :span="30" style="line-height: 24px">订舱备注：{{showInfo.F_BookingRemarks? showInfo.F_BookingRemarks : '--'}}</el-col>
          </div>
        </el-row>

        <el-row :gutter="20">
          <div class="airInfo-item">
            <el-col :span="30" style="line-height: 24px">费用备注：{{showInfo.F_ExpenseNote? showInfo.F_ExpenseNote : '--'}}</el-col>
          </div>
        </el-row>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane name="1" label="收费标准"></el-tab-pane>
      </el-tabs>

      <div class="airTableFly">
        <div class="airTableFly-title">空运运费明细</div>
        <el-table
          border
          :header-cell-style="{ background: '#f2f4f6', fontSize: '13px' }"
          :row-style="{ fontSize: '13px' }" 
          :cell-style="{ whiteSpace: 'nowrap' }"
          :data="showInfo.RangeList"
          :span-method="airFreightSpanMethod"
        >
          <el-table-column 
            v-for="header in showInfo.Fields" 
            :key="header.prop"
            :prop="header.prop"
            :label="header.label"
          >
          </el-table-column>
        </el-table>
      </div>

      <div class="airTableFly">
        <div class="airTableFly-title">起运机场费用</div>
        <el-table 
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f2f4f6' }"
          :row-style="{ fontSize: '13px' }" 
          :cell-style="{ whiteSpace: 'nowrap' }"
          :data="departureFee"
          :span-method="airPolSpanMethod"
        >
          <el-table-column prop="F_DeparturePortChargesDetailsId" label="费用名称">
            <template slot-scope="scope">
              {{scope.row.F_ExpenseCodeName}} {{ '('+scope.row.F_ExpenseCodeEng+')'}}
            </template>
          </el-table-column>
          <el-table-column prop="F_Currency" label="币种"></el-table-column>
          <el-table-column prop="F_UnitPrice" label="费用"></el-table-column>
          <el-table-column prop="F_Unit" label="单位"></el-table-column>
          <el-table-column label="最低收费">
            <template slot-scope="scope">
              {{scope.row.F_MiniCharge? scope.row.F_MiniCharge + '/' + scope.row.F_MaxUnit : '' }}
            </template>
          </el-table-column>
          <el-table-column label="最高收费">
            <template slot-scope="scope">
              {{scope.row.F_MaxCharge? scope.row.F_MaxCharge + '/' + scope.row.F_MaxUnit : '' }}
            </template>
          </el-table-column>
          <el-table-column label="密度区间范围">
            <template slot-scope="scope">
              <div v-if="scope.row.F_IntervalMinPrice || scope.row.F_IntervalMaxPrice">
                {{scope.row.F_IntervalMinPrice? scope.row.F_IntervalMinPrice + '≤' : '' }} 1CBM {{scope.row.F_IntervalMaxPrice? '＜' + scope.row.F_IntervalMaxPrice : '' }}
              </div>
              <div v-else></div> 
            </template>
          </el-table-column>
          <el-table-column prop="F_Description" label="备注"></el-table-column>
        </el-table>
        <div style="margin-top: 15px" v-show="fromDesc">
          <span style="font-size: 14px; margin-bottom: 5px">费用备注：</span>
          <div class="pubFeeRemark">{{ fromDesc }}</div>
        </div>
      </div>

      <div class="airTableFly">
        <div class="airTableFly-title">目的机场费用</div>
        <el-table 
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f2f4f6' }"
          :row-style="{ fontSize: '13px' }" 
          :cell-style="{ whiteSpace: 'nowrap' }"
          :data="destFee"
          :span-method="airPodSpanMethod"
        >
          <el-table-column prop="F_DestinationPortChargesDetailsId" label="费用名称">
            <template slot-scope="scope">
              {{scope.row.F_ExpenseCodeName}} {{ '('+scope.row.F_ExpenseCodeEng+')'}}
            </template>
          </el-table-column>
          <el-table-column prop="F_Currency" label="币种"></el-table-column>
          <el-table-column prop="F_UnitPrice" label="费用"></el-table-column>
          <el-table-column prop="F_Unit" label="单位"></el-table-column>
          <el-table-column label="最低收费">
            <template slot-scope="scope">
              {{scope.row.F_MiniCharge? scope.row.F_MiniCharge + '/' + scope.row.F_MaxUnit : '' }}
            </template>
          </el-table-column>
          <el-table-column label="最高收费">
            <template slot-scope="scope">
              {{scope.row.F_MaxCharge? scope.row.F_MaxCharge + '/' + scope.row.F_MaxUnit : '' }}
            </template>
          </el-table-column>
          <el-table-column label="密度区间范围">
            <template slot-scope="scope">
              <div v-if="scope.row.F_IntervalMinPrice || scope.row.F_IntervalMaxPrice">
                {{scope.row.F_IntervalMinPrice? scope.row.F_IntervalMinPrice + '≤' : '' }} 1CBM {{scope.row.F_IntervalMaxPrice? '＜' + scope.row.F_IntervalMaxPrice : '' }}
              </div>
              <div v-else></div> 
            </template>
          </el-table-column>
          <el-table-column prop="F_Description" label="备注"></el-table-column>
        </el-table>
        <div style="margin-top: 15px" v-show="destDesc">
          <span style="font-size: 14px; margin-bottom: 5px">费用备注：</span>
          <div class="pubFeeRemark">{{ destDesc }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
import {colMethod} from '@/utils/utils'

export default {
  name: "DataAirModel",
  data() {
    return {
      visible: false,
      isShow: false,
      showInfo: {},
      departureFee: [],
      destFee: [],
      airMerge: [],
      polMerge: [],
      podMerge: [],
      activeTab: '1',
      fromDesc: '',
      destDesc: ''
    }
  },

  mounted() {
    pubsub.subscribe('airDetails', (_, [isShowData, dataInfo]) => {
      this.isShow = isShowData
      this.showInfo = dataInfo
      this.departureFee = this.showInfo.FromFee
      this.destFee = this.showInfo.ToFee

      this.fromDesc = this.showInfo.FromDesc
      this.destDesc = this.showInfo.ToDesc

      this.$nextTick(() => {
        this.airMerge = colMethod(['F_Currency', 'F_MinimumCharge'], this.showInfo.RangeList)
      })
      this.polMerge = colMethod(['F_DeparturePortChargesDetailsId'], this.departureFee)
      this.podMerge = colMethod(['F_DestinationPortChargesDetailsId'], this.destFee)
    })
  },

  methods: {
    airFreightSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.airMerge[column.property] || []
      if (column.type == 'index' && this.airMerge['F_Currency', 'F_MinimumCharge'])
        return this.airMerge['F_Currency', 'F_MinimumCharge'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },

    airPolSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.polMerge[column.property] || []
      if (column.type == 'index' && this.polMerge['F_DeparturePortChargesDetailsId'])
        return this.polMerge['F_DeparturePortChargesDetailsId'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    },

    airPodSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.podMerge[column.property] || []
      if (column.type == 'index' && this.podMerge['F_DestinationPortChargesDetailsId'])
        return this.podMerge['F_DestinationPortChargesDetailsId'][rowIndex]
      else if (arr.length) return arr[rowIndex]
      else[1, 1]
    }
  }
}
</script>

<style scoped lang="less">
.airInfo {
  .airInfo-item {
    display: flex;
    margin-bottom: 12px;
    align-items: center;
    font-size: 13px;
    
    .airInfo-info {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        margin-right: 6px;
        white-space: nowrap;
      }
    }

    .airInfo-port {
      display: flex;
      margin: 0;
      align-items: center;
      color: #0081ff;
      font-size: 16px;

      .el-icon {
        font-size: 18px;
      }
    }
    
    .airInfo-type {
      margin-right: 30px;
    }
  }
}

.airTableFly {
  margin-bottom: 20px;
  
  .pubFeeRemark {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #eee;
    box-sizing: border-box;
    font-size: 13px;
  }

  .airTableFly-title {
    font-size: 15px;
    color: #000;
    margin-bottom: 12px;
  }

  .airTableFly-table {
    width: 100%;
    border-collapse: collapse;

    th {
      background: #f2f4f6;
      font-size: 14px !important;
    }

    th, td {
      text-align: left;
      height: 40px;
      border: 1px solid #EBEEF5;
      font-size: 13px;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
}

::v-deep .el-tabs__item.is-active {
  color: #0081ff !important;
}
</style>