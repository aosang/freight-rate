<template>
  <div class="DataModel">
    <el-dialog 
      width="83%" 
      title="Export-FCL Quotation Details" 
      :visible.sync="isShow" 
      :close-on-click-modal="false" 
      @close="clearHistory"
    >
      <div class="model-info-city">
        <div class="city-item">
          <h3>{{ lclInfo.FromPortEnglish }}</h3>
          <span>{{ lclInfo.FromPortName }}</span>
        </div>
        <div class="city-item">
          <label>{{ lclInfo.F_Voyage ? lclInfo.F_Voyage : '--' }}Days</label>
          <i></i>
          <label>{{ lclInfo.TransitPortEnglish? lclInfo.TransitPortEnglish : 'Direct'}}</label>
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
            <p>{{ lclInfo.F_ShoppingCompany ? lclInfo.F_ShoppingCompany : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>ETD</span>
            <p>{{ lclInfo.F_ShiftPeriodEn ? lclInfo.F_ShiftPeriodEn : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Closing</span>
            <p>{{ lclInfo.F_CutoffPeriodEn ? lclInfo.F_CutoffPeriodEn : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Sailling</span>
            <p>{{ lclInfo.F_CutoffTime ? lclInfo.F_CutoffTime : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Route</span>
            <p>{{ lclInfo.F_RouteCode? lclInfo.F_RouteCode : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Box genus</span>
            <p>{{ lclInfo.F_Ceratina? lclInfo.F_Ceratina : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Departure Port</span>
            <p>{{ lclInfo.FromQuayName? lclInfo.FromQuayName : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Destination Port </span>
            <p>{{ lclInfo.F_DesPortQuayId? lclInfo.F_DesPortQuayId : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Valid</span>
            <p>{{ lclInfo.F_StartTime }} to {{ lclInfo.F_EndTime }}</p>
          </div>
        </div>
        <div class="detail-mark">
          <div class="mark-item">
            <span>Booking remarks</span>
            <p>{{ lclInfo.F_BookingRemarks? lclInfo.F_BookingRemarks : '-' }}</p>
          </div>
          <div class="mark-item">
            <span>Weight limit remarks</span>
            <p>{{ lclInfo.F_WeightLimitRemarks? lclInfo.F_WeightLimitRemarks : '-' }}</p>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" class="model-tabs">
        <el-tab-pane label="Charge list" name="1">
          <div class="model-fee">
            <div class="model-fee-item">
              <!-- 海运及附件费 -->
              <div class="fee-title">Freight and surcharges</div>
              <el-table border class="fee-table" :data="freightArr" :header-cell-style="{ background: '#f2f4f6' }">
                <el-table-column prop="F_ExpenseCodeEng" label="Charge Name"></el-table-column>
                <el-table-column prop="F_Currency" label="Currency"></el-table-column>
                <el-table-column label="Unit">
                  <template slot-scope="scope">
                    {{ scope.row.F_Unit? scope.row.F_Unit == '单箱'? 'SingleBox' : 'SingleVote' : '--'  }}
                  </template>
                </el-table-column>
                <el-table-column label="20GP">
                  <template slot-scope="scope">
                    <span v-if="scope.row.F_20GP">
                      {{ Number(scope.row.F_20GP < 0) ? '(' + Number(scope.row.F_20GP) * -1 + ')' : scope.row.F_20GP }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="40GP">
                  <template slot-scope="scope">
                    <span v-if="scope.row.F_40GP">
                      {{ Number(scope.row.F_40GP < 0) ? '(' + Number(scope.row.F_40GP) * -1 + ')' : scope.row.F_40GP }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="40HQ">
                  <template slot-scope="scope">
                    <span v-if="scope.row.F_40HQ">
                      {{ Number(scope.row.F_40HQ < 0) ? '(' + Number(scope.row.F_40HQ) * -1 + ')' : scope.row.F_40HQ }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="45HQ">
                  <template slot-scope="scope">
                    <span v-if="scope.row.F_45HQ">
                      {{ Number(scope.row.F_45HQ < 0) ? '(' + Number(scope.row.F_45HQ) * -1 + ')' : scope.row.F_45HQ }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="40NOR">
                  <template slot-scope="scope">
                    <span v-if="scope.row.F_40NOR">
                      {{ Number(scope.row.F_40NOR < 0) ? '(' + Number(scope.row.F_40NOR) * -1 + ')' : scope.row.F_40NOR }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="SingleVote">
                  <template slot-scope="scope">
                    <span v-if="scope.row.F_SingleVote">
                      {{ scope.row.F_SingleVote? scope.row.F_SingleVote : '--' }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column width="280" label="Remark">
                  <template slot-scope="scope">
                    {{ scope.row.F_Description? scope.row.F_Description : '--' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="model-fee-item">
              <div class="fee-title">Origin Charges</div>
              <el-table 
                border 
                class="fee-table" 
                :data="polFee" 
                :header-cell-style="{ background: '#f2f4f6' }"
              >
                <el-table-column prop="F_ExpenseCodeEng" label="Charge Name"></el-table-column>
                <el-table-column prop="F_Currency" label="Currency"></el-table-column>
                <el-table-column label="Unit">
                  <template slot-scope="scope">
                    {{ scope.row.F_Unit? scope.row.F_Unit == '单箱'? 'SingleBox' : 'SingleVote' : '--'  }}
                  </template>
                </el-table-column>
                <el-table-column label="20GP">
                  <template slot-scope="scope">
                    {{ scope.row.F_20GP? scope.row.F_20GP : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="40GP">
                  <template slot-scope="scope">
                    {{ scope.row.F_40GP? scope.row.F_40GP : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="40HQ">
                  <template slot-scope="scope">
                    {{ scope.row.F_40HQ? scope.row.F_40HQ : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="45HQ">
                  <template slot-scope="scope">
                    {{ scope.row.F_45HQ? scope.row.F_45HQ : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="40NOR">
                  <template slot-scope="scope">
                    {{ scope.row.F_40NOR? scope.row.F_40NOR : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="SingleVote">
                  <template slot-scope="scope">
                    {{ scope.row.F_SingleVote? scope.row.F_SingleVote : '--' }}
                  </template>
                </el-table-column>
                <el-table-column width="280" label="Remark">
                  <template slot-scope="scope">
                    {{ scope.row.F_Description? scope.row.F_Description : '--' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="model-fee-item">
              <div class="fee-title">Destination Charges</div>
              <el-table 
                border 
                class="fee-table" 
                :data="podFee" 
                :header-cell-style="{ background: '#f2f4f6' }"
              >
                <el-table-column prop="F_ExpenseCodeEng" label="Charge Name"></el-table-column>
                <el-table-column prop="F_Currency" label="Currency"></el-table-column>
                <el-table-column label="Unit">
                  <template slot-scope="scope">
                    {{ scope.row.F_Unit? scope.row.F_Unit == '单箱'? 'SingleBox' : 'SingleVote' : '--'  }}
                  </template>
                </el-table-column>
                <el-table-column label="20GP">
                  <template slot-scope="scope">
                    {{ scope.row.F_20GP? scope.row.F_20GP : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="40GP">
                  <template slot-scope="scope">
                    {{ scope.row.F_40GP? scope.row.F_40GP : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="40HQ">
                  <template slot-scope="scope">
                    {{ scope.row.F_40HQ? scope.row.F_40HQ : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="45HQ">
                  <template slot-scope="scope">
                    {{ scope.row.F_45HQ? scope.row.F_45HQ : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="40NOR">
                  <template slot-scope="scope">
                    {{ scope.row.F_40NOR? scope.row.F_40NOR : '--' }}
                  </template>
                </el-table-column>
                <el-table-column label="SingleVote">
                  <template slot-scope="scope">
                    {{ scope.row.F_SingleVote? scope.row.F_SingleVote : '--' }}
                  </template>
                </el-table-column>
                <el-table-column width="280" label="Remark">
                  <template slot-scope="scope">
                    {{ scope.row.F_Description ? scope.row.F_Description : '--' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Edit Quotation" name="2">
          <div class="model-create-item">
            <div class="create-title">Cargo Information</div>
          </div>
          <div style="margin: 20px 0">
            <el-alert :closable="false" show-icon type="warning" title="The blue font indicates that the fee is a single ticket fee"></el-alert>
          </div>
          <div class="model-create-input">
            <div class="input-item">
              <span>20GP</span>
              <el-input-number 
                v-model="quotation.num20gp" 
                :min="0" 
                :max="100"
                @change="computedFclTotal($event,1)"
                @blur="checkInputForm"
              >
              </el-input-number>
            </div>
            <div class="input-item">
              <span>40GP</span>
              <el-input-number 
                v-model="quotation.num40gp" 
                :min="0" 
                :max="100"
                @change="computedFclTotal($event,2)"
                @blur="checkInputForm"
              >
              </el-input-number>
            </div>
            <div class="input-item">
              <span>40HQ</span>
              <el-input-number 
                v-model="quotation.num40hq" 
                :min="0" 
                :max="100"
                @change="computedFclTotal($event,3)"
                @blur="checkInputForm"
              >
              </el-input-number>
            </div>
            <div class="input-item">
              <span>45HQ</span>
              <el-input-number 
                v-model="quotation.num45hq" 
                :min="0" 
                :max="100"
                @change="computedFclTotal($event,4)"
                @blur="checkInputForm"
              >
              </el-input-number>
            </div>
            <div class="input-item">
              <span>40NOR</span>
              <el-input-number 
                v-model="quotation.num40nor" 
                :min="0" 
                :max="100"
                @change="computedFclTotal($event,5)"
                @blur="checkInputForm"
              >
              </el-input-number>
            </div>
          </div>
          <div class="model-create-table">
            <div class="table-fee-item">
              <div class="fee-info">
                <h4>Freight and surcharges</h4>
                <span>20GP:{{ freightTotal20GP? freightTotal20GP : '-' }}</span>
                <span>40GP:{{ freightTotal40GP? freightTotal40GP : '-' }}</span>
                <span>40HQ:{{ freightTotal40HQ? freightTotal40HQ : '-' }}</span>
                <span>45HQ:{{ freightTotal45HQ? freightTotal45HQ : '-' }}</span>
                <span>40NOR:{{ freightTotal40NOR? freightTotal40NOR : '-' }}</span>
                <span>SingleVote:{{singlePriceFreight? singlePriceFreight : '-'}}</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6' }"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="freightComputed"
                >
                  <el-table-column label="Charge Name">
                    <template slot-scope="scope">
                      <span :class="scope.row.F_SingleVote? 'singleColor' : ''">{{ scope.row.F_ExpenseCodeEng}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Currency">
                    <template slot-scope="scope">
                      <span :class="scope.row.F_SingleVote? 'singleColor' : ''">{{ scope.row.F_Currency}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="20GP/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_20GP? scope.row.F_20GP + ' ' + '*' + ' ' + quotation.num20gp : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num20gp : '--' }}
                      </span>
                      <el-input
                        @blur="editCheckInput(1,scope.row)"
                        @focus="editCheckInput(1,scope.row)"
                        :disabled="isFreightEditInputDisabled" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_20GP"
                        placeholder="20GP">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40GP/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40GP? scope.row.F_40GP + ' ' + '*' + ' ' + quotation.num40gp : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40gp : '--' }}
                      </span>
                      <el-input
                        @blur="editCheckInput(1,scope.row)"
                        @focus="editCheckInput(1,scope.row)"
                        :disabled="isFreightEditInputDisabled" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40GP"
                        placeholder="40GP">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40HQ/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40HQ? scope.row.F_40HQ + ' ' + '*' + ' ' + quotation.num40hq : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40hq : '--' }}
                      </span>
                      <el-input
                        @blur="editCheckInput(1,scope.row)"
                        @focus="editCheckInput(1,scope.row)"
                        :disabled="isFreightEditInputDisabled" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40HQ"
                        placeholder="40HQ">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="45HQ/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_45HQ? scope.row.F_45HQ + ' ' + '*' + ' ' + quotation.num45hq : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num45hq : '--' }}
                      </span>
                      <el-input
                        @blur="editCheckInput(1,scope.row)"
                        @focus="editCheckInput(1,scope.row)"
                        :disabled="isFreightEditInputDisabled" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_45HQ"
                        placeholder="45HQ">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40NOR/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40NOR? scope.row.F_40NOR + ' ' + '*' + ' ' + quotation.num40nor : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40nor : '--' }}
                      </span>
                      <el-input
                        @blur="editCheckInput(1,scope.row)"
                        @focus="editCheckInput(1,scope.row)"
                        :disabled="isFreightEditInputDisabled" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40NOR"
                        placeholder="40NOR">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="SingleVote">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_SingleVote? scope.row.F_SingleVote : '--' }}
                      </span>
                      <el-input 
                        @blur="editCheckInput(1,scope.row)"
                        @focus="editCheckInput(1,scope.row)"
                        :disabled="isFreightEditContainerDisabled"  
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_SingleVote"
                        placeholder="SingleVote">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Remark">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isEdit">
                        {{ scope.row.F_Description? scope.row.F_Description : '' }}
                      </span>
                      <el-input 
                        v-show="!scope.row.isInput"
                        type="text"
                        v-model="scope.row.F_Description"
                        placeholder="Remark">
                      </el-input>  
                    </template>
                  </el-table-column>
                  <el-table-column label="Others">
                    <template slot-scope="scope">
                      <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(1, scope.row, scope.$index)" v-show="scope.row.isEdit">
                        Edit
                      </a>
                      <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                        @click="saveFeeData(1, scope.row, scope.$index)">
                        Save
                      </a>
                      <a style="color: #F56c6c; 
                        cursor: pointer" @click="deleteFeeData(1, scope.row.F_Id)">
                        Delete
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 修改海运费 -->
                <div class="order-edit">
                  <ul>
                    <li>
                      <el-input 
                        v-model="addFee.F_ExpenseCodeEng" 
                        placeholder="Charge Name"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addFee.F_Currency"
                        filterable 
                        placeholder="Currency">
                        <el-option 
                          v-for="c in currencyArr" 
                          :key="c.F_ItemDetailId" 
                          :value="c.F_ItemValue"
                          :label="c.F_ItemValue">
                          <span style="float: left; margin-right: 15px">{{ c.F_ItemValue }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ c.F_ItemName }}</span>
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input
                        :disabled="isFreightInputDisabled"
                        @change="onInputCheck(1)"
                        @blur="addFee.F_20GP=$event.target.value"
                        v-model="addFee.F_20GP" 
                        placeholder="20GP" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isFreightInputDisabled"
                        @change="onInputCheck(1)"
                        @blur="addFee.F_40GP=$event.target.value"
                        v-model="addFee.F_40GP" 
                        placeholder="40GP"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isFreightInputDisabled"
                        @change="onInputCheck(1)"
                        @blur="addFee.F_40HQ=$event.target.value"
                        v-model="addFee.F_40HQ" 
                        placeholder="40HQ"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isFreightInputDisabled"
                        @change="onInputCheck(1)"
                        @blur="addFee.F_45HQ=$event.target.value"
                        v-model="addFee.F_45HQ" 
                        placeholder="45HQ"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isFreightInputDisabled"
                        @change="onInputCheck(1)"
                        @blur="addFee.F_40NOR=$event.target.value"
                        v-model="addFee.F_40NOR" 
                        placeholder="40NOR"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isFreightContainerDisabled"
                        @change="onInputCheck(1)"
                        @blur="addFee.F_SingleVote=$event.target.value"
                        v-model="addFee.F_SingleVote" 
                        placeholder="SingleVote"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        v-model="addFee.F_Description" 
                        placeholder="Remark">
                      </el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(1)">Add
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark" v-if="textareaFreight">
                  <template slot-scope="scope">
                      <span v-if="scope.row.isEdit">
                        {{ scope.row.F_Description? scope.row.F_Description : '' }}
                      </span>
                      <el-input 
                        v-show="!scope.row.isInput"
                        type="text"
                        v-model="scope.row.F_Description"
                        placeholder="Remark">
                      </el-input>  
                    </template>
                </div>
              </div>
            </div>

            <!-- 起运港费用 -->
            <div class="table-fee-item">
              <div class="fee-info">
                <h4>Origin Charges</h4>
                <span>20GP:{{ polTotal20GP? polTotal20GP : '-' }}</span>
                <span>40GP:{{ polTotal40GP? polTotal40GP : '-' }}</span>
                <span>40HQ:{{ polTotal40HQ? polTotal40HQ : '-' }}</span>
                <span>45HQ:{{ polTotal45HQ? polTotal45HQ : '-' }}</span>
                <span>40NOR:{{ polTotal40NOR? polTotal40NOR : '-' }}</span>
                <span>SingleVote:{{singlePricePol? singlePricePol : '-'}}</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6' }"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="polFeeComputed">
                  <el-table-column label="Charge Name">
                    <template slot-scope="scope">
                      <span :class="scope.row.F_SingleVote? 'singleColor' : ''">{{ scope.row.F_ExpenseCodeEng}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Currency">
                    <template slot-scope="scope">
                      <span :class="scope.row.F_SingleVote? 'singleColor' : ''">{{ scope.row.F_Currency}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="20GP/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_20GP? scope.row.F_20GP + ' ' + '*' + ' ' + quotation.num20gp : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num20gp : '--' }}
                      </span>
                      <el-input
                        :disabled="isPolEditInputDisabled"
                        @blur="editCheckInput(2,scope.row)"
                        @focus="editCheckInput(2,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_20GP"
                        placeholder="20GP">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40GP/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40GP? scope.row.F_40GP + ' ' + '*' + ' ' + quotation.num40gp : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40gp : '--' }}
                      </span>
                      <el-input
                        :disabled="isPolEditInputDisabled"
                        @blur="editCheckInput(2,scope.row)"
                        @focus="editCheckInput(2,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40GP"
                        placeholder="40GP">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40HQ/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40HQ? scope.row.F_40HQ + ' ' + '*' + ' ' + quotation.num40hq : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40hq : '--' }}
                      </span>
                      <el-input
                        :disabled="isPolEditInputDisabled"
                        @blur="editCheckInput(2,scope.row)"
                        @focus="editCheckInput(2,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40HQ"
                        placeholder="40HQ">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="45HQ/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_45HQ? scope.row.F_45HQ + ' ' + '*' + ' ' + quotation.num45hq : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num45hq : '--' }}
                      </span>
                      <el-input
                        :disabled="isPolEditInputDisabled"
                        @blur="editCheckInput(2,scope.row)"
                        @focus="editCheckInput(2,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_45HQ"
                        placeholder="45HQ">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40NOR/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40NOR? scope.row.F_40NOR + ' ' + '*' + ' ' + quotation.num40nor : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40nor : '--' }}
                      </span>
                      <el-input
                        :disabled="isPolEditInputDisabled"
                        @blur="editCheckInput(2,scope.row)"
                        @focus="editCheckInput(2,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40NOR"
                        placeholder="40NOR">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="SingleVote">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_SingleVote? scope.row.F_SingleVote : '--' }}
                      </span>
                      <el-input
                        :disabled="isPolEditContainerDisabled"
                        @blur="editCheckInput(2,scope.row)"
                        @focus="editCheckInput(2,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_SingleVote"
                        placeholder="SingleVote">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Remark">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isEdit">
                        {{ scope.row.F_Description? scope.row.F_Description : '' }}
                      </span>
                      <el-input 
                        v-show="!scope.row.isInput"
                        type="text"
                        v-model="scope.row.F_Description"
                        placeholder="Remark">
                      </el-input>  
                    </template>
                  </el-table-column>
                  <el-table-column label="Others">
                    <template slot-scope="scope">
                      <a 
                        style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(2, scope.row, scope.$index)" 
                        v-show="scope.row.isEdit">
                        Edit
                      </a>
                      <a 
                        style="color: #67C23A; cursor: pointer; margin-right: 5px;" 
                        v-show="!scope.row.isEdit"
                        @click="saveFeeData(2, scope.row, scope.$index)">
                        Save
                      </a>
                      <a 
                      style="color: #F56c6c; cursor: pointer" 
                      @click="deleteFeeData(2, scope.row.F_Id)">
                        Delete
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="order-edit">
                  <ul>
                    <li>
                      <el-input 
                        v-model="addPolFee.F_ExpenseCodeEng" 
                        placeholder="Charge Name">
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addPolFee.F_Currency"
                        filterable 
                        placeholder="Currency">
                        <el-option v-for="c in currencyArr" :key="c.F_ItemDetailId" :value="c.F_ItemValue"
                          :label="c.F_ItemValue">
                          <span style="float: left; margin-right: 15px">{{ c.F_ItemValue }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ c.F_ItemName }}</span>
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPolInputDisabled"
                        @change="onInputCheck(2)"
                        @blur="addPolFee.F_20GP=$event.target.value" 
                        v-model="addPolFee.F_20GP" 
                        placeholder="20GP" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPolInputDisabled"
                        @change="onInputCheck(2)"
                        @blur="addPolFee.F_40GP=$event.target.value" 
                        v-model="addPolFee.F_40GP" 
                        placeholder="40GP" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPolInputDisabled"
                        @change="onInputCheck(2)"
                        @blur="addPolFee.F_40HQ=$event.target.value" 
                        v-model="addPolFee.F_40HQ" 
                        placeholder="40HQ" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPolInputDisabled"
                        @change="onInputCheck(2)"
                        @blur="addPolFee.F_45HQ=$event.target.value" 
                        v-model="addPolFee.F_45HQ" 
                        placeholder="45HQ" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPolInputDisabled"
                        @change="onInputCheck(2)"
                        @blur="addPolFee.F_40NOR=$event.target.value" 
                        v-model="addPolFee.F_40NOR" 
                        placeholder="40NOR" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPolContainerDisabled"
                        @change="onInputCheck(2)"
                        @blur="addPolFee.F_SingleVote=$event.target.value" 
                        v-model="addPolFee.F_SingleVote" 
                        placeholder="SingleVote"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        v-model="addPolFee.F_Description" 
                        placeholder="Remark">
                      </el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(2)">Add
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark" v-if="textareaPol">
                  <span>Remark</span>
                  <el-input 
                    type="textarea" 
                    readonly 
                    :rows="6" 
                    v-model="textareaPol"
                  >
                  </el-input>
                </div>
              </div>
            </div>

            <!-- 目的港费用 -->
            <div class="table-fee-item">
              <div class="fee-info">
                <h4>Destination Charges</h4>
                <span>20GP:{{ podTotal20GP? podTotal20GP : '-' }}</span>
                <span>40GP:{{ podTotal40GP? podTotal40GP : '-' }}</span>
                <span>40HQ:{{ podTotal40HQ? podTotal40HQ : '-' }}</span>
                <span>45HQ:{{ podTotal45HQ? podTotal45HQ : '-' }}</span>
                <span>40NOR:{{ podTotal40NOR? podTotal40NOR : '-' }}</span>
                <span>SingleVote:{{singlePricePod? singlePricePod : '-'}}</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6' }"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="podFeeComputed">
                  <el-table-column label="Charge Name">
                    <template slot-scope="scope">
                      <span :class="scope.row.F_SingleVote? 'singleColor' : ''">{{ scope.row.F_ExpenseCodeEng}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Currency">
                    <template slot-scope="scope">
                      <span :class="scope.row.F_SingleVote? 'singleColor' : ''">{{ scope.row.F_Currency}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="20GP/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_20GP? scope.row.F_20GP + ' ' + '*' + ' ' + quotation.num20gp : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num20gp : '--' }}
                      </span>
                      <el-input
                        :disabled="isPodEditInputDisabled"
                        @blur="editCheckInput(3,scope.row)"
                        @focus="editCheckInput(3,scope.row)"
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_20GP"
                        placeholder="20GP">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40GP/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40GP? scope.row.F_40GP + ' ' + '*' + ' ' + quotation.num40gp : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40gp : '--' }}
                      </span>
                      <el-input
                        :disabled="isPodEditInputDisabled"
                        @blur="editCheckInput(3,scope.row)"
                        @focus="editCheckInput(3,scope.row)"
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40GP"
                        placeholder="40GP">
                      </el-input>
                    </template>      
                  </el-table-column>
                  <el-table-column label="40HQ/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40HQ? scope.row.F_40HQ + ' ' + '*' + ' ' + quotation.num40hq : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40hq : '--' }}
                      </span>
                      <el-input
                        :disabled="isPodEditInputDisabled"
                        @blur="editCheckInput(3,scope.row)"
                        @focus="editCheckInput(3,scope.row)"
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40HQ"
                        placeholder="40HQ">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="45HQ/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_45HQ? scope.row.F_45HQ + ' ' + '*' + ' ' + quotation.num45hq : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num45hq : '--' }}
                      </span>
                      <el-input
                        :disabled="isPodEditInputDisabled"
                        @blur="editCheckInput(3,scope.row)"
                        @focus="editCheckInput(3,scope.row)"
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_45HQ"
                        placeholder="45HQ">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="40NOR/Num">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_40NOR? scope.row.F_40NOR + ' ' + '*' + ' ' + quotation.num40nor : scope.row.F_SingleVote? scope.row.F_SingleVote + ' ' + '*' + ' ' + quotation.num40nor : '--' }}
                      </span>
                      <el-input
                        :disabled="isPodEditInputDisabled"
                        @blur="editCheckInput(3,scope.row)"
                        @focus="editCheckInput(3,scope.row)" 
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_40NOR"
                        placeholder="40NOR">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="SingleVote">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput" :class="scope.row.F_SingleVote? 'singleColor' : ''">
                        {{ scope.row.F_SingleVote? scope.row.F_SingleVote : '--' }}
                      </span>
                      <el-input
                        :disabled="isPodEditContainerDisabled"
                        @blur="editCheckInput(3,scope.row)"
                        @focus="editCheckInput(3,scope.row)"
                        v-show="!scope.row.isInput"
                        type="number"
                        v-model.number="scope.row.F_SingleVote"
                        placeholder="SingleVote">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Remark">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isEdit">
                        {{ scope.row.F_Description? scope.row.F_Description : '' }}
                      </span>
                      <el-input 
                        v-show="!scope.row.isInput"
                        type="text"
                        v-model="scope.row.F_Description"
                        placeholder="Remark">
                      </el-input>  
                    </template>
                  </el-table-column>
                  <el-table-column label="Others">
                    <template slot-scope="scope">
                      <a 
                        style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(3, scope.row, scope.$index)" 
                        v-show="scope.row.isEdit">
                        Edit
                      </a>
                      <a 
                        style="color: #67C23A; cursor: pointer; margin-right: 5px;" 
                        v-show="!scope.row.isEdit"
                        @click="saveFeeData(3, scope.row, scope.$index)">
                        Save
                      </a>
                      <a 
                        style="color: #F56c6c; 
                        cursor: pointer" @click="deleteFeeData(3, scope.row.F_Id)">
                        Delete
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="order-edit">
                  <ul>
                    <li>
                      <el-input 
                        v-model="addPodFee.F_ExpenseCodeEng" 
                        placeholder="Charge Name">
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addPodFee.F_Currency"
                        filterable 
                        placeholder="Currency">
                        <el-option v-for="c in currencyArr" :key="c.F_ItemDetailId" :value="c.F_ItemValue"
                          :label="c.F_ItemValue">
                          <span style="float: left; margin-right: 15px">{{ c.F_ItemValue }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ c.F_ItemName }}</span>
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPodInputDisabled"
                        @change="onInputCheck(3)"
                        @blur="addPodFee.F_20GP=$event.target.value" 
                        v-model="addPodFee.F_20GP" 
                        placeholder="20GP" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPodInputDisabled"
                        @change="onInputCheck(3)"
                        @blur="addPodFee.F_40GP=$event.target.value" 
                        v-model="addPodFee.F_40GP" 
                        placeholder="40GP"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPodInputDisabled"
                        @change="onInputCheck(3)"
                        @blur="addPodFee.F_40HQ=$event.target.value"
                        v-model="addPodFee.F_40HQ" 
                        placeholder="40HQ" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPodInputDisabled"
                        @change="onInputCheck(3)"
                        @blur="addPodFee.F_45HQ=$event.target.value"
                        v-model="addPodFee.F_45HQ" 
                        placeholder="45HQ"  
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPodInputDisabled"
                        @change="onInputCheck(3)"
                        @blur="addPodFee.F_40NOR=$event.target.value" 
                        v-model="addPodFee.F_40NOR" 
                        placeholder="40NOR" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input
                        :disabled="isPodContainerDisabled"
                        @change="onInputCheck(3)"
                        @blur="addPodFee.F_SingleVote=$event.target.value"  
                        v-model="addPodFee.F_SingleVote" 
                        placeholder="SingleVote"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        v-model="addPodFee.F_Description" 
                        placeholder="Remark">
                      </el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini"
                        @click="addFeeList(3)">Add
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark" v-if="textareaPod">
                  <span>Remark</span>
                  <el-input 
                    type="textarea" 
                    readonly 
                    :rows="6" 
                    v-model="textareaPod"
                  >
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="order-btn">
            <el-button icon="el-icon-s-order" style="background: #0081ff; color: #fff" @click="savePriceData">Save</el-button>
            <el-button icon="el-icon-s-data"  style="background: #0081ff; color: #fff" @click="exportExcelFile">Export File(Excel)</el-button>
            <el-button icon="el-icon-s-claim"  style="background: #0081ff; color: #fff" @click="exportPdfFile">Export File(PDF)</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <p style="font-size: 13px; color: #909399; margin-top: 10px;">
        The above quotation and billing results are for reference only, please contact our staff for the final quotation.
      </p>
    </el-dialog>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
let _ = require('lodash')
import { nanoid } from 'nanoid'
export default {
  name: 'DataModel',
  data() {
    return {
      freight20_gp: [],
      pol20_gp: [],
      pod20_gp: [],
      freight40_gp: [],
      pol40_gp: [],
      pod40_gp: [],
      freight40_hq: [],
      pol40_hq: [],
      pod40_hq: [],
      freight45_hq: [],
      pol45_hq: [],
      pod45_hq: [],
      freight40_nor: [],
      pol40_nor: [],
      pod40_nor: [],

      arrayFreight20gp: [],
      arrayPol20gp: [],
      arrayPod20gp: [],
      arrayFreight40gp: [],
      arrayPol40gp: [],
      arrayPod40gp: [],
      arrayFreight40hq: [],
      arrayPol40hq: [],
      arrayPod40hq: [],
      arrayFreight45hq: [],
      arrayPol45hq: [],
      arrayPod45hq: [],
      arrayFreight40nor: [],
      arrayPol40nor: [],
      arrayPod40nor: [],

      str20gp: '',
      str40gp: '',
      str40hq: '',
      str45hq: '',
      str40nor: '',

      freightMerge: [],
      polMerge: [],
      podMerge: [],

      visible: false,
      isShow: false,
      lclInfo: {},
      freightTotal20GP: '-',
      freightTotal40GP: '-',
      freightTotal40HQ: '-',
      freightTotal45HQ: '-',
      freightTotal40NOR: '-',
      polTotal20GP: '-',
      polTotal40GP: '-',
      polTotal40HQ: '-',
      polTotal45HQ: '-',
      polTotal40NOR: '-',
      podTotal20GP: '-',
      podTotal40GP: '-',
      podTotal40HQ: '-',
      podTotal45HQ: '-',
      podTotal40NOR: '-',
      polFee: [],
      podFee: [],
      polFeeComputed: [], //起运港计算费用
      podFeeComputed: [], //目的港费用计算
      freightComputed: [],
      freightArr: [],
      oceanFee: {},
      freightTotal: '', //海运费总计
      diffFreightTotal: '', //海运差额总计
      polTotal: '',//起运港总计
      diffPolTotal: '', // 起运差额总计
      podTotal: '',//目的港总计
      diffPodTotal: '', //目的港差额总计
      user: '',
      userId: '',
      dataId: '',
      unit: [{ id: 1, value: 'CTN(S)' }, { id: 2, value: 'PLT(S)' }],
      quotation: {
        num20gp: 0, //20gp
        num40gp: 0, //40gp
        num40hq: 0, //40hq
        num45hq: 0, //45hq
        num40nor: 0, //40nor
      },
      addFee: {
        F_Id: nanoid(),
        F_ExpenseCodeEng: '', //费用名称
        F_Currency: '', //币种
        F_20GP: '', 
        F_40GP: '', 
        F_40HQ: '', 
        F_45HQ: '',
        F_40NOR: '',
        F_SingleVote: '', 
        F_Description: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },
      addPolFee: {
        F_Id: nanoid(),
        F_ExpenseCodeEng: '', //费用名称
        F_Currency: '', //币种
        F_20GP: '', 
        F_40GP: '', 
        F_40HQ: '', 
        F_45HQ: '',
        F_40NOR: '',
        F_SingleVote: '', 
        F_Description: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },
      addPodFee: {
        F_Id: nanoid(),
        F_ExpenseCodeEng: '', //费用名称
        F_Currency: '', //币种
        F_20GP: '', 
        F_40GP: '', 
        F_40HQ: '', 
        F_45HQ: '',
        F_40NOR: '',
        F_SingleVote: '', 
        F_Description: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },
      currencyArr: [], //币种
      unitArr: [], //单位
      activeName: "1",
      selectType: '',
      textareaFreight: '',
      textareaPol: '',
      textareaPod: '',
      storeId: '',
      storeInfo: {},
      logoPath: '',
      type: 1,
      isComputed: false,
      isFreightInputDisabled: false,
      isFreightContainerDisabled: false,
      isPolInputDisabled: false,
      isPolContainerDisabled: false,
      isPodInputDisabled: false,
      isPodContainerDisabled: false,
      isFreightEditInputDisabled: false,
      isFreightEditContainerDisabled: false,
      isPolEditInputDisabled: false,
      isPolEditContainerDisabled: false,
      isPodEditInputDisabled: false,
      isPodEditContainerDisabled: false,
      singlePriceFreight: '',
      singlePricePol: '',
      singlePricePod: ''
    }
  },

  mounted() {
    // 禁止调用箭头上下键，防止输入数字变为负数
    document.onkeydown = function () {
      if (window.event.keyCode === 38 || window.event.keyCode === 40) {
        window.event.returnValue = false;
      }
    }

    // 获取用户id
    this.user = window.localStorage.getItem('loginInfo')? JSON.parse(window.localStorage.getItem('loginInfo')) : ''
    this.userId = this.user.F_Id

    // 基础信息
    pubsub.subscribe('details', (_, [isShowData, lclInfo]) => {
      this.isShow = isShowData
      this.lclInfo = lclInfo

      this.textareaFreight = this.lclInfo.SurchargeDesc
      this.textareaPol = this.lclInfo.FromDesc
      this.textareaPod = this.lclInfo.ToDesc

      this.freightArr = this.lclInfo.FreightAdd
      this.polFee = this.lclInfo.FromFee
      this.podFee = this.lclInfo.ToFee

      // 海运费
      this.freightComputed = this.lclInfo.FreightAdd
      this.freightComputed.forEach(item => {
        this.$set(item, 'isInput', true)
        this.$set(item, 'isEdit', true)
      })

      // 起运港费
      this.polFeeComputed = this.lclInfo.FromFee
      this.polFeeComputed.forEach(item => {
        this.$set(item, 'isInput', true)
        this.$set(item, 'isEdit', true)
      })

      // 目的港费
      this.podFeeComputed = this.lclInfo.ToFee
      this.podFeeComputed.forEach(item => {
        this.$set(item, 'isInput', true)
        this.$set(item, 'isEdit', true)
      })

      this.dataId = this.lclInfo.F_Id

    })

    // 调用币种
    this.getCurrencyData()
  },

  computed: {
    containerNumComputed() {
      let sum  = this.quotation.num20gp + this.quotation.num40gp + this.quotation.num40hq + this.quotation.num45hq + this.quotation.num40nor
      sum =  sum !== 0? ' ' + '*' + ' ' + sum : ''
      return sum
    }
  },

  methods: {
    filterArray(id,dataArr,type) {
      if(id == 1) {
        let newArr = dataArr
        this.arrayFreight20gp = []
        this.arrayPol20gp = []
        this.arrayPod20gp = []
        for(let j in newArr) {
          let obj = {}
          let map = new Map()
          obj.F_ExpenseCode = newArr[j].F_ExpenseCodeEng
          obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_20GP? newArr[j].F_20GP : ''
          obj.F_Quantity = this.quotation.num20gp
          obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '20GP'
          obj.F_Currency = newArr[j].F_Currency
          obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_20GP) * Number(this.quotation.num20gp)
          obj.F_Remark = newArr[j].F_Description
          obj.F_Id = newArr[j].F_ExpenseCodeEng == '海运费'? '1' : newArr[j].F_Id
          obj.F_SingleVote = newArr[j].F_SingleVote? 1 : nanoid()
          if(type == 'freight') {
            this.arrayFreight20gp.push(obj)
            this.arrayFreight20gp = this.arrayFreight20gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
            this.arrayFreight20gp = this.arrayFreight20gp.reverse()
          }else if(type == 'pol') {
            this.arrayPol20gp.push(obj)
            this.arrayPol20gp = this.arrayPol20gp.reverse()
            this.arrayPol20gp = this.arrayPol20gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
          } else {
            this.arrayPod20gp.push(obj)
            this.arrayPod20gp = this.arrayPod20gp.reverse()
            this.arrayPod20gp = this.arrayPod20gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
          }
        }
        return [this.arrayFreight20gp, this.arrayPol20gp, this.arrayPod20gp]
      }else if(id == 2) {
        let newArr = dataArr
        this.arrayFreight40gp = []
        this.arrayPol40gp = []
        this.arrayPod40gp = []
        for(let j in newArr) {
          let obj = {}
          let map = new Map()
          obj.F_ExpenseCode = newArr[j].F_ExpenseCodeEng
          obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_40GP? newArr[j].F_40GP : ''
          obj.F_Quantity = this.quotation.num40gp
          obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '40GP'
          obj.F_Currency = newArr[j].F_Currency
          obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_40GP) * Number(this.quotation.num40gp)
          obj.F_Remark = newArr[j].F_Description
          obj.F_Id = newArr[j].F_ExpenseCodeEng == 'Ocean Freight'? '1' : newArr[j].F_Id
          obj.F_SingleVote = newArr[j].F_SingleVote? 1 : nanoid()
          if(type == 'freight') {
            this.arrayFreight40gp.push(obj)
            this.arrayFreight40gp = this.arrayFreight40gp.reverse()
            this.arrayFreight40gp = this.arrayFreight40gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          }else if(type == 'pol') {
            this.arrayPol40gp.push(obj)
            this.arrayPol40gp = this.arrayPol40gp.reverse()
            this.arrayPol40gp = this.arrayPol40gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          } else {
            this.arrayPod40gp.push(obj)
            this.arrayPod40gp = this.arrayPod40gp.reverse()
            this.arrayPod40gp = this.arrayPod40gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          }
        }
        return [this.arrayFreight40gp, this.arrayPol40gp, this.arrayPod40gp]
      }else if(id == 3) {
        let newArr = dataArr
        this.arrayFreight40hq = []
        this.arrayPol40hq = []
        this.arrayPod40hq = []
        for(let j in newArr) {
          let obj = {}
          let map = new Map()
          obj.F_ExpenseCode = newArr[j].F_ExpenseCodeEng
          obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_40HQ? newArr[j].F_40HQ : ''
          obj.F_Quantity = this.quotation.num40hq
          obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '40HQ'
          obj.F_Currency = newArr[j].F_Currency
          obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_40HQ) * Number(this.quotation.num40hq)
          obj.F_Remark = newArr[j].F_Description
          obj.F_Id = newArr[j].F_ExpenseCodeEng == 'Ocean Freight'? '1' : newArr[j].F_Id
          obj.F_SingleVote = newArr[j].F_SingleVote? 1 : nanoid()
          if(type == 'freight') {
            this.arrayFreight40hq.push(obj)
            this.arrayFreight40hq = this.arrayFreight40hq.reverse()
            this.arrayFreight40hq = this.arrayFreight40hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          }else if(type == 'pol') {
            this.arrayPol40hq.push(obj)
            this.arrayPol40hq = this.arrayPol40hq.reverse()
            this.arrayPol40hq = this.arrayPol40hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          } else {
            this.arrayPod40hq.push(obj)
            this.arrayPod40hq = this.arrayPod40hq.reverse()
            this.arrayPod40hq = this.arrayPod40hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          }
        }
        return [this.arrayFreight40hq, this.arrayPol40hq, this.arrayPod40hq]
      }else if(id == 4) {
        let newArr = dataArr
        this.arrayFreight45hq = []
        this.arrayPol45hq = []
        this.arrayPod45hq = []
        for(let j in newArr) {
          let obj = {}
          let map = new Map()
          obj.F_ExpenseCode = newArr[j].F_ExpenseCodeEng
          obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_45HQ? newArr[j].F_45HQ : ''
          obj.F_Quantity = this.quotation.num45hq
          obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '45HQ'
          obj.F_Currency = newArr[j].F_Currency
          obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_45HQ) * Number(this.quotation.num45hq)
          obj.F_Remark = newArr[j].F_Description
          obj.F_Id = newArr[j].F_ExpenseCodeEng == 'Ocean Freight'? '1' : newArr[j].F_Id
          obj.F_SingleVote = newArr[j].F_SingleVote? 1 : nanoid()
          if(type == 'freight') {
            this.arrayFreight45hq.push(obj)
            this.arrayFreight45hq = this.arrayFreight45hq.reverse()
            this.arrayFreight45hq = this.arrayFreight45hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
          }else if(type == 'pol') {
            this.arrayPol45hq.push(obj)
            this.arrayPol45hq = this.arrayPol45hq.reverse()
            this.arrayPol45hq = this.arrayPol45hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
          } else {
            this.arrayPod45hq.push(obj)
            this.arrayPod45hq = this.arrayPod45hq.reverse()
            this.arrayPod45hq = this.arrayPod45hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
          }
        }
        return [this.arrayFreight45hq, this.arrayPol45hq, this.arrayPod45hq]
      }else {
        let newArr = dataArr
        this.arrayFreight40nor = []
        this.arrayPol40nor = []
        this.arrayPod40nor = []
        for(let j in newArr) {
          let obj = {}
          let map = new Map()
          obj.F_ExpenseCode = newArr[j].F_ExpenseCodeEng
          obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_40NOR? newArr[j].F_40NOR : ''
          obj.F_Quantity = this.quotation.num40nor
          obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '40NOR'
          obj.F_Currency = newArr[j].F_Currency
          obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_40NOR) * Number(this.quotation.num40nor)
          obj.F_Remark = newArr[j].F_Description
          obj.F_Id = newArr[j].F_ExpenseCodeEng == 'Ocean Freight'? '1' : newArr[j].F_Id
          obj.F_SingleVote = newArr[j].F_SingleVote? 1 : nanoid()
          if(type == 'freight') {
            this.arrayFreight40nor.push(obj)
            this.arrayFreight40nor = this.arrayFreight40nor.reverse()
            this.arrayFreight40nor = this.arrayFreight40nor.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          }else if(type == 'pol') {
            this.arrayPol40nor.push(obj)
            this.arrayPol40nor = this.arrayPol40nor.reverse()
            this.arrayPol40nor = this.arrayPol40nor.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          } else {
            this.arrayPod40nor.push(obj)
            this.arrayPod40nor = this.arrayPod40nor.reverse()
            this.arrayPod40nor = this.arrayPod40nor.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
          }
        }
        return [this.arrayFreight40nor, this.arrayPol40nor, this.arrayPod40nor]
      }
    },

    checkInputForm() {
      this.quotation.num20gp == undefined? this.quotation.num20gp = 0 : this.quotation.num20gp
      this.quotation.num40gp == undefined? this.quotation.num40gp = 0 : this.quotation.num40gp
      this.quotation.num40hq == undefined? this.quotation.num40hq = 0 : this.quotation.num40hq
      this.quotation.num45hq == undefined? this.quotation.num45hq = 0 : this.quotation.num45hq
      this.quotation.num40nor == undefined? this.quotation.num40nor = 0 : this.quotation.num40nor
    },

    // 计算费用
    computedOecanFee(e, id, dataArr) {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      let newArr = _.groupBy(dataArr, 'F_Currency')
      let sum = 0
      let priceTotal = ''
      for(let key in newArr) {
        sum = 0
        newArr[key].forEach(item => {
          if(id == 1 && num20gp > 0) {
            sum += Number(item.F_20GP) * e
          }else if (id == 2 && num40gp > 0) {
            sum += Number(item.F_40GP) * e
          }else if (id == 3 && num40hq > 0) {
            sum += Number(item.F_40HQ) * e
          }else if(id == 4 && num45hq > 0) {
            sum += Number(item.F_45HQ) * e
          }else if(id == 5 && num40nor > 0) {
            sum += Number(item.F_40NOR) * e
          }
        })
        priceTotal += ' ' + key + ' ' + sum.toFixed(2) + ' ' + '+'
      }
      // 处理总计价格，去掉最后一位+ 
      if (priceTotal.charAt(priceTotal.length - 1) === '+') {
        priceTotal = priceTotal.slice(0, priceTotal.length - 1)
        return priceTotal
      }
    },

    // 计算单票费用
    computedSingleVoteFee(dataArr) {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      let newArr = _.groupBy(dataArr, 'F_Currency')
      let sum = 0
      let priceTotal = ''
      for(let key in newArr) {
        sum = 0
        newArr[key].forEach(item => {
          if((num20gp !== 0 || num40gp !== 0 || num40hq !== 0 || num45hq !== 0 || num40nor !== 0 ) && item.F_SingleVote) {
            sum += Number(item.F_SingleVote)
          }else {
            return
          }
        })
        priceTotal += ' ' + key + ' ' + sum.toFixed(2) + ' ' + '+'
      }
      // 处理总计价格，去掉最后一位+ 
      if (priceTotal.charAt(priceTotal.length - 1) === '+') {
        priceTotal = priceTotal.slice(0, priceTotal.length - 1)
        return priceTotal
      }
    },
    

    computedFclTotal(e, id) {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      if(id == 1 && num20gp !== undefined) {
        this.freightTotal20GP = this.computedOecanFee(e, id, this.freightComputed)
        this.polTotal20GP = this.computedOecanFee(e, id, this.polFeeComputed)
        this.podTotal20GP = this.computedOecanFee(e, id, this.podFeeComputed)
        this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)
        this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)
        this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)
       
        this.str20gp = num20gp > 0? '20GP' + '*' + num20gp : ''

      }else if(id == 2 && num40gp !== undefined) {
        this.freightTotal40GP = this.computedOecanFee(e, id, this.freightComputed)
        this.polTotal40GP = this.computedOecanFee(e, id, this.polFeeComputed)
        this.podTotal40GP = this.computedOecanFee(e, id, this.podFeeComputed)
        this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)
        this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)
        this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)

        this.str40gp = num40gp > 0? '40GP' + '*' + num40gp : ''

      }else if(id == 3 && num40hq !== undefined) {
        this.freightTotal40HQ = this.computedOecanFee(e, id, this.freightComputed)
        this.polTotal40HQ = this.computedOecanFee(e, id, this.polFeeComputed)
        this.podTotal40HQ = this.computedOecanFee(e, id, this.podFeeComputed)
        this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)
        this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)
        this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)

        this.str40hq = num40hq > 0? '40HQ' + '*' + num40hq : ''

      }else if(id == 4 && num45hq !== undefined) {
        this.freightTotal45HQ = this.computedOecanFee(e, id, this.freightComputed)
        this.polTotal45HQ = this.computedOecanFee(e, id, this.polFeeComputed)
        this.podTotal45HQ = this.computedOecanFee(e, id, this.podFeeComputed)
        this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)
        this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)
        this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)

        this.str45hq = num45hq > 0? '45HQ' + '*' + num45hq : ''
        
      }else if(id == 5 && num40nor !== undefined) {
        this.freightTotal40NOR = this.computedOecanFee(e, id, this.freightComputed)
        this.polTotal40NOR = this.computedOecanFee(e, id, this.polFeeComputed)
        this.podTotal40NOR = this.computedOecanFee(e, id, this.podFeeComputed)
        this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)
        this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)
        this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)

        this.str40nor = num40nor > 0? '40NOR' + '*' + num40nor : ''        
      }
    },

    // 关闭清除计算内容
    clearHistory() {
      this.quotation.num20gp = ''
      this.quotation.num40gp = ''
      this.quotation.num40hq = ''
      this.quotation.num45hq = ''
      this.quotation.num40nor = ''

      this.freightTotal20GP = '-'
      this.freightTotal40GP = '-'
      this.freightTotal40HQ = '-'
      this.freightTotal45HQ = '-'
      this.freightTotal40NOR = '-'

      this.polTotal20GP = '-'
      this.polTotal40GP = '-'
      this.polTotal40HQ = '-'
      this.polTotal45HQ = '-'
      this.polTotal40NOR = '-'

      this.podTotal20GP = '-'
      this.podTotal40GP = '-'
      this.podTotal40HQ = '-'
      this.podTotal45HQ = '-'
      this.podTotal40NOR = '-'

      this.singlePriceFreight = ''
      this.singlePricePol = ''
      this.singlePricePod = ''

      this.activeName = '1'

      this.addFee = {
        F_Id: nanoid(),
        F_ExpenseCodeEng: '', //费用名称
        F_Currency: '', //币种
        F_20GP: '', 
        F_40GP: '', 
        F_40HQ: '', 
        F_45HQ: '',
        F_40NOR: '',
        F_SingleVote: '', 
        F_Description: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      }

      this.addPolFee = {
        F_Id: nanoid(),
        F_ExpenseCodeEng: '', //费用名称
        F_Currency: '', //币种
        F_20GP: '', 
        F_40GP: '', 
        F_40HQ: '', 
        F_45HQ: '',
        F_40NOR: '',
        F_SingleVote: '', 
        F_Description: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      }

      this.addPodFee = {
        F_Id: nanoid(),
        F_ExpenseCodeEng: '', //费用名称
        F_Currency: '', //币种
        F_20GP: '', 
        F_40GP: '', 
        F_40HQ: '', 
        F_45HQ: '',
        F_40NOR: '',
        F_SingleVote: '', 
        F_Description: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      }
      this.isFreightInputDisabled = false
      this.isFreightContainerDisabled = false
      this.isPolInputDisabled = false
      this.isPolContainerDisabled = false
      this.isPodInputDisabled = false
      this.isPodContainerDisabled = false
    },

    // 导出pdf
    async exportPdfFile() {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      if (num20gp == 0 && num40gp == 0 && num40hq == 0 && num45hq == 0 && num40nor == 0) {
        this.$message({
          message: '请先制作报价单',
          type: 'warning',
          duration: 2000
        })
      } else {
        const {data: res} = await this.$http.post('login/isLogin')
        if(res.code == 200) {
          this.handlerExcelAndSaveData()
          const routeUrl = this.$router.resolve({
            path: '/FclPdfTemplate',
          })
          this.getPdfParams(
            this.lclInfo, 
            this.polMerge, 
            this.podMerge, 
            this.freightMerge, 
            num20gp, 
            num40gp, 
            num40hq, 
            num45hq, 
            num40nor,
            this.freightTotal20GP,
            this.freightTotal40GP,
            this.freightTotal40HQ,
            this.freightTotal45HQ,
            this.freightTotal40NOR,
            this.polTotal20GP,
            this.polTotal40GP,
            this.polTotal40HQ,
            this.polTotal45HQ,
            this.podlTotal40NOR,
            this.podTotal20GP,
            this.podTotal40GP,
            this.podTotal40HQ,
            this.podTotal45HQ,
            this.podTotal40NOR,
            this.singlePriceFreight,
            this.singlePricePol,
            this.singlePricePod
          )
          window.open(routeUrl.href, "_blank")
        }else {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }
      }
    },

    // 传递导出PDF参数
    getPdfParams(
      lclInfo, 
      polFee, 
      podFee, 
      freight, 
      num20gp, 
      num40gp, 
      num40hq, 
      num45hq, 
      num40nor, 
      freightTotal20GP,
      freightTotal40GP,
      freightTotal40HQ,
      freightTotal45HQ,
      freightTotal40NOR,
      polTotal20GP,
      polTotal40GP,
      polTotal40HQ,
      polTotal45HQ,
      polTotal40NOR,
      podTotal20GP,
      podTotal40GP,
      podTotal40HQ,
      podTotal45HQ,
      podTotal40NOR,
      singleFreight,
      singlePol,
      singlePod
    ) {
      let pdfData = { 
        lclInfo, 
        polFee, 
        podFee, 
        freight, 
        num20gp, 
        num40gp, 
        num40hq, 
        num45hq, 
        num40nor,
        freightTotal20GP,
        freightTotal40GP,
        freightTotal40HQ,
        freightTotal45HQ,
        freightTotal40NOR,
        polTotal20GP,
        polTotal40GP,
        polTotal40HQ,
        polTotal45HQ,
        polTotal40NOR,
        podTotal20GP,
        podTotal40GP,
        podTotal40HQ,
        podTotal45HQ,
        podTotal40NOR,
        singleFreight,
        singlePol,
        singlePod
      }
      window.sessionStorage.setItem('FclPdfData', JSON.stringify(pdfData))
    },

    // 处理excel和保存费用函数
    handlerExcelAndSaveData() {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      if(num20gp > 0) {
        this.freight20_gp = this.filterArray(1, this.freightComputed, 'freight')[0]
        this.pol20_gp = this.filterArray(1, this.polFeeComputed, 'pol')[1]
        this.pod20_gp = this.filterArray(1, this.podFeeComputed, 'pod')[2]
      }else if(num20gp == 0) {
        this.freight20_gp = []
        this.pol20_gp = []
        this.pod20_gp = []
      }

      if(num40gp > 0) {
        this.freight40_gp = this.filterArray(2, this.freightComputed, 'freight')[0]
        this.pol40_gp = this.filterArray(2, this.polFeeComputed, 'pol')[1]
        this.pod40_gp = this.filterArray(2, this.podFeeComputed, 'pod')[2]
      }else if(num40gp == 0) {
        this.freight40_gp = []
        this.pol40_gp = []
        this.pod40_gp = []
      }

      if(num40hq > 0) {
        this.freight40_hq = this.filterArray(3, this.freightComputed, 'freight')[0]
        this.pol40_hq = this.filterArray(3, this.polFeeComputed, 'pol')[1]
        this.pod40_hq = this.filterArray(3, this.podFeeComputed, 'pod')[2]
      }else if(num40hq == 0) {
        this.freight40_hq = []
        this.pol40_hq = []
        this.pod40_hq = []
      }

      if(num45hq > 0) {
        this.freight45_hq = this.filterArray(4, this.freightComputed, 'freight')[0]
        this.pol45_hq = this.filterArray(4, this.polFeeComputed, 'pol')[1]
        this.pod45_hq = this.filterArray(4, this.podFeeComputed, 'pod')[2]
      }else if(num45hq == 0) {
        this.freight45_hq = []
        this.pol45_hq = []
        this.pod45_hq = []
      }

      if(num40nor > 0) {
        this.freight40_nor = this.filterArray(5, this.freightComputed, 'freight')[0]
        this.pol40_nor = this.filterArray(5, this.polFeeComputed, 'pol')[1]
        this.pod40_nor = this.filterArray(5, this.podFeeComputed, 'pod')[2]
      }else if(num40nor == 0) {
        this.freight40_nor = []
        this.pol40_nor = []
        this.pod40_nor = []
      }
      
      this.freightMerge = [...this.freight20_gp, ...this.freight40_gp, ...this.freight40_hq, ...this.freight45_hq, ...this.freight40_nor]
      this.freightMerge = _.uniqWith(_.sortBy(this.freightMerge, item => item.F_Id), (a, b) => a.F_Id == b.F_Id && a.F_SingleVote == b.F_SingleVote)

      this.polMerge = [...this.pol20_gp, ...this.pol40_gp, ...this.pol40_hq, ...this.pol45_hq, ...this.pol40_nor]
      this.polMerge = _.uniqWith(_.sortBy(this.polMerge, item => item.F_Id), (a, b) => a.F_Id == b.F_Id && a.F_SingleVote == b.F_SingleVote)

      this.podMerge = [...this.pod20_gp, ...this.pod40_gp, ...this.pod40_hq, ...this.pod45_hq, ...this.pod40_nor]
      this.podMerge = _.uniqWith(_.sortBy(this.podMerge, item => item.F_Id), (a, b) => a.F_Id == b.F_Id && a.F_SingleVote == b.F_SingleVote)

      this.freightTotal20GP = this.getIsPriceTotal(this.freightTotal20GP)
      this.freightTotal40GP = this.getIsPriceTotal(this.freightTotal40GP)
      this.freightTotal40HQ = this.getIsPriceTotal(this.freightTotal40HQ)
      this.freightTotal45HQ = this.getIsPriceTotal(this.freightTotal45HQ)
      this.freightTotal40NOR = this.getIsPriceTotal(this.freightTotal40NOR)

      this.polTotal20GP = this.getIsPriceTotal(this.polTotal20GP)
      this.polTotal40GP = this.getIsPriceTotal(this.polTotal40GP)
      this.polTotal40HQ = this.getIsPriceTotal(this.polTotal40HQ)
      this.polTotal45HQ = this.getIsPriceTotal(this.polTotal45HQ)
      this.polTotal40NOR = this.getIsPriceTotal(this.polTotal40NOR)

      this.podTotal20GP = this.getIsPriceTotal(this.podTotal20GP)
      this.podTotal40GP = this.getIsPriceTotal(this.podTotal40GP)
      this.podTotal40HQ = this.getIsPriceTotal(this.podTotal40HQ)
      this.podTotal45HQ = this.getIsPriceTotal(this.podTotal45HQ)
      this.podTotal40NOR = this.getIsPriceTotal(this.podTotal40NOR)
    },

    // 导出excel
    async exportExcelFile() {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      if(num20gp == 0 && num40gp == 0 && num40hq == 0 && num45hq == 0 && num40nor ==0) {
        this.$message({
          message: '请先制作报价单',
          type: 'warning',
          duration: 2000
        })
      }else {
        this.handlerExcelAndSaveData()
        const {data: res} = await this.$http.post('Exportfcl/fclExcel', {
          FreightRateId: this.dataId,
          Ctn: (this.str20gp? this.str20gp + ',' : '') + (this.str40gp? this.str40gp + ',' : '') + (this.str40hq? this.str40hq + ',' : '') + (this.str45hq? this.str45hq + ',' : '') + (this.str40nor? this.str40nor : ''),
          FreightTotal: (this.freightTotal20GP? '20GP:' + this.freightTotal20GP : '') + ' ' + (this.freightTotal40GP? '40GP:' + this.freightTotal40GP : '') + ' ' + (this.freightTotal40HQ? '40HQ:' + this.freightTotal40HQ : '') + ' ' + (this.freightTotal45HQ? '45HQ:' + this.freightTotal45HQ : '') + ' ' + (this.freightTotal40NOR? '40NOR:' + this.freightTotal40NOR : '') + ' ' + (this.singlePriceFreight? '单票费用：' + this.singlePriceFreight : ''),
          FromTotal: (this.polTotal20GP && this.polTotal20GP !== '-'? '20GP:' + this.polTotal20GP : '') + ' ' + (this.polTotal40GP? '40GP:' + this.polTotal40GP : '') + ' ' + (this.polTotal40HQ? '40HQ:' + this.polTotal40HQ : '') + ' ' + (this.polTotal45HQ? '45HQ:' + this.polTotal45HQ : '') + ' ' + (this.polTotal40NOR? '40NOR:' + this.polTotal40NOR : '') + ' ' + (this.singlePricePol? '单票费用：' + this.singlePricePol : ''),
          ToTotal: (this.podTotal20GP? '20GP:' + this.podTotal20GP : '') + ' ' + (this.podTotal40GP? '40GP:' + this.podTotal40GP : '') + ' ' + (this.podTotal40HQ? '40HQ:' + this.podTotal40HQ : '') + ' ' + (this.podTotal45HQ? '45HQ:' + this.podTotal45HQ : '') + ' ' + (this.podTotal40NOR? '40NOR:' + this.podTotal40NOR : '')+ ' ' + (this.singlePricePod? '单票费用：' + this.singlePricePod : ''),  
          FreightAdd: this.freightMerge,
          FromFee: this.polMerge,
          ToFee: this.podMerge,
          FreightDesc: this.lclInfo.F_BookingRemarks + '\n' + this.lclInfo.F_EnglishRemarks,
        })
        try{
          if(res.code == 200) {
            window.open(res.data.Downurl)
            this.freightMerge = []
            this.polMerge = []
            this.podMerge = []
          }else {
            this.$message({
              message: res.info,
              type: 'error',
              duration: 2000
            })
          }
        }catch(error) {
          console.log(error)
        }
      }
    },

    // 保存报价
    async savePriceData() {
      const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.quotation
      if (num20gp == 0 && num40gp == 0 && num40hq == 0 && num45hq == 0 && num40nor == 0) {
        this.$message({
          message: '请先制作报价单',
          type: 'warning',
          duration: 2000
        })
      } else {
        this.handlerExcelAndSaveData()
        const { data: res } = await this.$http.post('Lclquote/saveQuote', {
          FreightRateId: this.dataId,
          Type: 3,
          CargoQuant: (this.str20gp? this.str20gp + ',' : '') + (this.str40gp? this.str40gp + ',' : '') + (this.str40hq? this.str40hq + ',' : '') + (this.str45hq? this.str45hq + ',' : '') + (this.str40nor? this.str40nor : ''),
          FreightAdd: this.freightMerge,
          FromFee: this.polMerge,
          ToFee: this.podMerge,
          FreightTotal: (this.freightTotal20GP? '20GP:' + this.freightTotal20GP : '') + ' ' + (this.freightTotal40GP? '40GP:' + this.freightTotal40GP : '') + ' ' + (this.freightTotal40HQ? '40HQ:' + this.freightTotal40HQ : '') + ' ' + (this.freightTotal45HQ? '45HQ:' + this.freightTotal45HQ : '') + ' ' + (this.freightTotal40NOR? '40NOR:' + this.freightTotal40NOR : '') + ' ' + (this.singlePriceFreight? '单票费用：' + this.singlePriceFreight : ''),
          PortDepartureTotal: (this.polTotal20GP? '20GP:' + this.polTotal20GP : '') + ' ' + (this.polTotal40GP? '40GP:' + this.polTotal40GP : '') + ' ' + (this.polTotal40HQ? '40HQ:' + this.polTotal40HQ : '') + ' ' + (this.polTotal45HQ? '45HQ:' + this.polTotal45HQ : '') + ' ' + (this.polTotal40NOR? '40NOR:' + this.polTotal40NOR : '') + ' ' + (this.singlePricePol? '单票费用：' + this.singlePricePol : ''),
          PortDestinationTotal: (this.podTotal20GP? '20GP:' + this.podTotal20GP : '') + ' ' + (this.podTotal40GP? '40GP:' + this.podTotal40GP : '') + ' ' + (this.podTotal40HQ? '40HQ:' + this.podTotal40HQ : '') + ' ' + (this.podTotal45HQ? '45HQ:' + this.podTotal45HQ : '') + ' ' + (this.podTotal40NOR? '40NOR:' + this.podTotal40NOR : '') + ' ' + (this.singlePricePod? '单票费用：' + this.singlePricePod : '')
        })
        try {
          if (res.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          } else {
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
    },

    // 获取币种
    async getCurrencyData() {
      const { data: res } = await this.$http.post('data/getCurrency')
      try {
        if (res.code === 200) {
          this.currencyArr = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 新增费用
    addFeeList(type) {
      if (type == 1) {
        const { F_ExpenseCodeEng, F_Currency} = this.addFee
        if (F_ExpenseCodeEng.trim() == '' || F_Currency == '') {
          this.$message({
            message: '请填写正确海运费！',
            type: 'error',
            duration: 2000
          })
        } else {
          this.freightComputed.push(this.addFee)
          this.freightTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.freightComputed)
          this.freightTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.freightComputed)
          this.freightTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.freightComputed)
          this.freightTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.freightComputed)
          this.freightTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.freightComputed)

          this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)
      
          this.freightComputed.forEach(item => {
            item.isInput = true
            item.isEdit = true
          })
          this.addFee = {
            F_Id: nanoid(),
            F_ExpenseCodeEng: '', //费用名称
            F_Currency: '', //币种
            F_20GP: '', 
            F_40GP: '', 
            F_40HQ: '', 
            F_45HQ: '',
            F_40NOR: '',
            F_SingleVote: '', 
            F_Description: '',
            isEdit: true,
            isInput: true,
            F_IsTotal: 1,
            F_IsCalculation: 1
          }
          this.isFreightInputDisabled = false
          this.isFreightContainerDisabled = false
        }
      } else if (type == 2) {
        const { F_ExpenseCodeEng, F_Currency} = this.addPolFee
        if (F_ExpenseCodeEng.trim() == '' || F_Currency == '') {
          this.$message({
            message: '请填写正确起运港费！',
            type: 'error',
            duration: 2000
          })
        } else {
          this.polFeeComputed.push(this.addPolFee)
          this.polTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.polFeeComputed)
          this.polTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.polFeeComputed)
          this.polTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.polFeeComputed)
          this.polTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.polFeeComputed)
          this.polTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.polFeeComputed)

          this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)

          this.addPolFee = {
            F_Id: nanoid(),
            F_ExpenseCodeEng: '', //费用名称
            F_Currency: '', //币种
            F_20GP: '', 
            F_40GP: '', 
            F_40HQ: '', 
            F_45HQ: '',
            F_40NOR: '',
            F_SingleVote: '', 
            F_Description: '',
            isEdit: true,
            isInput: true,
            F_IsTotal: 1,
            F_IsCalculation: 1
          }
          this.isPolInputDisabled = false
          this.isPolContainerDisabled = false
        }
      } else if (type == 3) {
        const { F_ExpenseCodeEng, F_Currency } = this.addPodFee
        if (F_ExpenseCodeEng.trim() == '' || F_Currency == '') {
          this.$message({
            message: '请填写正确目的港费！',
            type: 'error',
            duration: 2000
          })
        } else {
          this.podFeeComputed.push(this.addPodFee)
          this.podTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.podFeeComputed)
          this.podTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.podFeeComputed)
          this.podTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.podFeeComputed)
          this.podTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.podFeeComputed)
          this.podTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.podFeeComputed)

          this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)

          this.addPodFee = {
            F_Id: nanoid(),
            F_ExpenseCodeEng: '', //费用名称
            F_Currency: '', //币种
            F_20GP: '', 
            F_40GP: '', 
            F_40HQ: '', 
            F_45HQ: '',
            F_40NOR: '',
            F_SingleVote: '', 
            F_Description: '',
            isEdit: true,
            isInput: true,
            F_IsTotal: 1,
            F_IsCalculation: 1
          }
          this.isPodInputDisabled = false
          this.isPodContainerDisabled = false
        }
      }
    },

    // 编辑费用
    editFeedata(type, row, index) {
      row.isInput = !row.isInput
      row.isEdit = !row.isEdit
    },

    saveFeeData(type, row, index) {
      row.isInput = !row.isInput
      row.isEdit = !row.isEdit
      if(type == 1) {
        this.freightTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.freightComputed)
        this.freightTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.freightComputed)
        this.freightTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.freightComputed)
        this.freightTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.freightComputed)
        this.freightTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.freightComputed)

        this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)

      }else if(type == 2) {
        this.polTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.polFeeComputed)
        this.polTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.polFeeComputed)
        this.polTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.polFeeComputed)
        this.polTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.polFeeComputed)
        this.polTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.polFeeComputed)

        this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)

      }else {
        this.podTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.podFeeComputed)
        this.podTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.podFeeComputed)
        this.podTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.podFeeComputed)
        this.podTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.podFeeComputed)
        this.podTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.podFeeComputed)

        this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)
      }
    },

    editCheckInput(type,row) {
      if(type == 1) {
        const {F_20GP, F_40GP, F_40HQ, F_45HQ, F_40NOR, F_SingleVote } = row
        if(F_20GP || F_40GP || F_40HQ || F_45HQ  || F_40NOR ) {
          this.isFreightEditInputDisabled = false
          this.isFreightEditContainerDisabled = true
        }else if (F_SingleVote) {
          this.isFreightEditInputDisabled = true
          this.isFreightEditContainerDisabled = false
        }else {
          this.isFreightEditInputDisabled = false
          this.isFreightEditContainerDisabled = false
        }
      }else if (type == 2) {
        const {F_20GP, F_40GP, F_40HQ, F_45HQ, F_40NOR, F_SingleVote } = row
        if(F_20GP  || F_40GP  || F_40HQ  || F_45HQ  || F_40NOR ) {
          this.isPolEditInputDisabled = false
          this.isPolEditContainerDisabled = true
        }else if (F_SingleVote !== '') {
          this.isPolEditInputDisabled = true
          this.isPolEditContainerDisabled = false
        }else {
          this.isPolEditInputDisabled = false
          this.isPolEditContainerDisabled = false
        }
      }else {
        const {F_20GP, F_40GP, F_40HQ, F_45HQ, F_40NOR, F_SingleVote } = row
        if(F_20GP || F_40GP || F_40HQ || F_45HQ  || F_40NOR ) {
          this.isPodEditInputDisabled = false
          this.isPodEditContainerDisabled = true
        }else if (F_SingleVote) {
          this.isPodEditInputDisabled = true
          this.isPodEditContainerDisabled = false
        }else {
          this.isPodEditInputDisabled = false
          this.isPodEditContainerDisabled = false
        }
      }
    },  

    // 删除费用
    deleteFeeData(type, id) {
      this.$alert('此操作将永久删除该费用, 是否继续?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type == 1) {
          this.freightComputed = this.freightComputed.filter(item => item.F_Id !== id)
          if(this.freightComputed.length !== 0) {
            this.freightTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.freightComputed)
            this.freightTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.freightComputed)
            this.freightTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.freightComputed)
            this.freightTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.freightComputed)
            this.freightTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.freightComputed)

            this.singlePriceFreight = this.computedSingleVoteFee(this.freightComputed)

          }else {
            this.freightTotal20GP = '-'
            this.freightTotal40GP = '-'
            this.freightTotal40HQ = '-'
            this.freightTotal45HQ = '-'
            this.freightTotal40NOR = '-'
            this.singlePriceFreight = '-'
          } 
        } else if (type == 2) {
          this.polFeeComputed = this.polFeeComputed.filter(item => item.F_Id !== id)
          if(this.polFeeComputed.length !== 0) {
            this.polTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.polFeeComputed)
            this.polTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.polFeeComputed)
            this.polTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.polFeeComputed)
            this.polTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.polFeeComputed)
            this.polTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.polFeeComputed)

            this.singlePricePol = this.computedSingleVoteFee(this.polFeeComputed)

          }else {
            this.polTotal20GP = '-'
            this.polTotal40GP = '-'
            this.polTotal40HQ = '-'
            this.polTotal45HQ = '-'
            this.polTotal40NOR = '-'
            this.singlePricePol = '-'
          }
          
        } else if (type == 3) {
          this.podFeeComputed = this.podFeeComputed.filter(item => item.F_Id !== id)
          if(this.podFeeComputed.length !== 0) {
            this.podTotal20GP = this.computedOecanFee(this.quotation.num20gp, 1, this.podFeeComputed)
            this.podTotal40GP = this.computedOecanFee(this.quotation.num40gp, 2, this.podFeeComputed)
            this.podTotal40HQ = this.computedOecanFee(this.quotation.num40hq, 3, this.podFeeComputed)
            this.podTotal45HQ = this.computedOecanFee(this.quotation.num45hq, 4, this.podFeeComputed)
            this.podTotal40NOR = this.computedOecanFee(this.quotation.num40nor, 5, this.podFeeComputed)

            this.singlePricePod = this.computedSingleVoteFee(this.podFeeComputed)

          }else {
            this.podTotal20GP = '-'
            this.podTotal40GP = '-'
            this.podTotal40HQ = '-'
            this.podTotal45HQ = '-'
            this.podTotal40NOR = '-'
            this.singlePricePod = '-'
          }
        }
      }).catch(() => {
        return
      })
    },

    // 判断整箱和整票
    onInputCheck(type) {
      if (type == 1) {
        const {F_20GP, F_40GP, F_40HQ, F_45HQ, F_40NOR, F_SingleVote} = this.addFee
        if (F_20GP || F_40GP || F_40HQ || F_45HQ || F_40NOR) {
          this.isFreightInputDisabled = false
          this.isFreightContainerDisabled = true
        } else if(F_SingleVote)  {
          this.isFreightInputDisabled = true
          this.isFreightContainerDisabled = false
        } else {
          this.isFreightInputDisabled = false
          this.isFreightContainerDisabled = false
        }
      } else if (type == 2) {
        const {F_20GP, F_40GP, F_40HQ, F_45HQ, F_40NOR, F_SingleVote} = this.addPolFee
        if (F_20GP || F_40GP || F_40HQ || F_45HQ || F_40NOR) {
          this.isPolInputDisabled = false
          this.isPolContainerDisabled = true
        } else if(F_SingleVote)  {
          this.isPolInputDisabled = true
          this.isPolContainerDisabled = false
        } else {
          this.isPolInputDisabled = false
          this.isPolContainerDisabled = false
        }
      } else {
        const {F_20GP, F_40GP, F_40HQ, F_45HQ, F_40NOR, F_SingleVote} = this.addPodFee
        if (F_20GP  || F_40GP  || F_40HQ  || F_45HQ || F_40NOR ) {
          this.isPodInputDisabled = false
          this.isPodContainerDisabled = true
        } else if(F_SingleVote)  {
          this.isPodInputDisabled = true
          this.isPodContainerDisabled = false
        } else {
          this.isPodInputDisabled = false
          this.isPodContainerDisabled = false
        }
      }
    },

    // 处理价格
    getIsPriceTotal(priceComputed) {
      let price = ''
      if(priceComputed !== '-' && _.split(priceComputed, ' ')[2] !== '0.00') {
        price = priceComputed
      }else {
        price = null
      }
      return price
    }
  }
}
</script>

<style scoped lang="less">
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
      margin: 0 auto;
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

      .pubFeeRemark {
        width: 100%;
        height: 100px;
        padding: 10px;
        border: 1px solid #eee;
        box-sizing: border-box;
        font-size: 14px;
      }

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
      width: 19%;
      display: flex;
      align-items: center;

      span {
        font-size: 13px;
        margin-right: 10px;
        white-space: nowrap;
      }

      /deep/ .el-input__inner {
        line-height: 1px !important;
      }
    }
  }

  .model-create-table {
    margin-top: 30px;

    .table-fee-item {
      margin-bottom: 30px;

      .fee-info {
        // display: flex;

        h4 {
          margin-bottom: 5px;
          font-size: 15px;
          font-weight: 550;
        }

        span {
          position: relative;
          margin: 0 30px 5px 0;
          color: #ffa024;

        }
      }

      .order-table {
        margin-top: 10px;

        .singleColor {
          color: #409EFF
        }
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

        .order-mark {
          margin-top: 12px;

          span {
            font-size: 13px;
            font-weight: 550;
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  .order-btn {
    display: flex;

    .el-button {
      width: 30%;
      height: 40px;
    }
  }
}

/deep/ .el-textarea__inner {
  font-family: "微软雅黑", sans-serif;
  font-size: 13px;
  padding: 5px 10px;
}

/deep/ .el-tabs__item.is-active {
  color: #0081ff !important;
  font-size: 15px;
  font-weight: 550;
}

/deep/ .el-tabs__active-bar {
  background-color: #0081ff
}

/deep/ .el-tabs__item:hover {
  color: #555;
}

/deep/ .el-select .el-input {
  width: 90px;
}

/deep/ .input-with-select .el-input-group__append {
  background-color: #fff;
  font-size: 13px;
}

/deep/ .input-with-select .el-input-group__prepend {
  font-size: 13px;
}

/deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  padding: 0 5px;
}

/deep/ .el-input__suffix-inner {
  margin-top: -5px;
}

/deep/ .el-input-number__increase {
  border-left: 1px solid #DCDFE6
}

/deep/ .el-input-number {
  line-height: 28px
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>