<template>
  <div class="DataModel">
    <el-dialog 
      width="83%" 
      title="Import-LCL Quotation Details" 
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
          <label>{{ lclInfo.F_Voyage ? lclInfo.F_Voyage : '--' }}days</label>
          <i></i>
          <label>{{ lclInfo.TransitPortEnglish? lclInfo.TransitPortEnglish : 'Direct' }}</label>
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
            <p>{{ lclInfo.F_ShoppingCompany? lclInfo.F_ShoppingCompany : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Consignee</span>
            <p>{{ lclInfo.F_ConsigneeType? lclInfo.F_ConsigneeType : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>ETD</span>
            <p>{{ lclInfo.F_ShiftPeriodEn? lclInfo.F_ShiftPeriodEn : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Closing</span>
            <p>{{ lclInfo.F_CutoffPeriodEn? lclInfo.F_CutoffPeriodEn : '--' }}</p>
          </div>
          <div class="detail-item">
            <span>Valid</span>
            <p>{{ lclInfo.F_StartTime}} to {{ lclInfo.F_EndTime }}</p>
          </div>
        </div>
        <div class="detail-mark">
          <div class="mark-item">
            <span>Warehouse</span>
            <p>{{ storeInfo.F_WarehouseName ? storeInfo.F_WarehouseName : '--' }}</p>
            <el-popover placement="right" width="200" trigger="click">
              <span class="el-icon-user-solid" @click="visible = !visible" slot="reference"></span>
              <div class="mark-item-store" style="font-size: 13px">
                <p style="margin-bottom: 10px">Name：{{ storeInfo.F_ContactPerson ? storeInfo.F_ContactPerson : '-' }}</p>
                <p>Phone：{{ storeInfo.F_ContactNumber ? storeInfo.F_ContactNumber : '-' }}</p>
              </div>
            </el-popover>
          </div>
          <div class="mark-item">
            <span>Address</span>
            <p>{{ storeInfo.F_Address ? storeInfo.F_Address : '--' }}</p>
          </div>
          <div class="mark-item" v-if="lclInfo.F_EnglishRemarks">
            <span>Remark</span>
            <p>{{ lclInfo.F_EnglishRemarks  }}</p>
          </div>
          <div v-else>
            <div class="mark-item">
              <span>订舱备注</span>
              <p>{{ lclInfo.F_BookingRemarks ? lclInfo.F_BookingRemarks : '--' }}</p>
            </div>
            <div class="mark-item">
              <span>费用备注</span>
              <p>{{ lclInfo.F_ExpenseNote ? lclInfo.F_ExpenseNote : '--' }}</p>
            </div>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" class="model-tabs">
        <el-tab-pane label="Charge list" name="1">
          <div class="model-fee">
            <!-- 海运及附加费 -->
            <div class="model-fee-item">
              <div class="fee-title">Freight and surcharges</div>
              <el-table 
                border 
                class="fee-table" 
                :data="freightArr" 
                :header-cell-style="{ background: '#f2f4f6' }"
              >
                <el-table-column prop="F_ExpenseCodeEng" label="Charge Name"></el-table-column>
                <el-table-column prop="F_Currency" label="Currency"></el-table-column>
                <el-table-column label="CBM">
                  <template slot-scope="scope">
                    <div v-if="scope.row.FeeType == '1'">
                      <span v-if="scope.row.F_CBM !== ''">
                        {{ Number(scope.row.F_CBM >= 0) ? scope.row.F_CBM  : '(' + Number(scope.row.F_CBM) * -1 + ')'}}
                     </span>
                      <span v-else-if="scope.row.F_CBM == ''">case by case</span>
                    </div>
                    <div v-else>
                      <span v-if="scope.row.F_CBM !== ''">
                        {{ Number(scope.row.F_CBM >= 0) ? scope.row.F_CBM + '/' + scope.row.F_Unit : '(' + Number(scope.row.F_CBM) * -1 + ')' + '/' + scope.row.F_Unit }}
                     </span>
                      <span v-else-if="scope.row.F_CBM == ''"></span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="TON">
                  <template slot-scope="scope">
                    <div v-if="scope.row.FeeType == '1'">
                      <span v-if="scope.row.F_TON !== ''">
                        {{ Number(scope.row.F_TON >= 0) ? scope.row.F_TON : '(' + Number(scope.row.F_TON) * -1 + ')'}}
                     </span>
                      <span v-else-if="scope.row.F_TON == ''">case by case</span>
                    </div>
                    <div v-else>
                      <span v-if="scope.row.F_TON !== ''">
                        {{ Number(scope.row.F_TON >= 0) ? scope.row.F_TON + '/' + scope.row.F_Unit : '(' + Number(scope.row.F_TON) * -1 + ')' + '/' + scope.row.F_Unit }}
                     </span>
                      <span v-else-if="scope.row.F_TON == ''"></span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="F_MIN" label="MIN"></el-table-column>
                <el-table-column prop="F_RT" label="RT Scope"></el-table-column>
                <el-table-column prop="F_VolumeRatio" label="Vol.ratio">
                  <template slot-scope="scope">
                    {{ scope.row.F_VolumeRatio === '' || Number(scope.row.F_VolumeRatio === 0) ? '--' : '1:' + Number(scope.row.F_VolumeRatio) }}
                  </template>
                </el-table-column>
                <el-table-column label="Payment">
                  <template slot-scope="scope">
                    {{ scope.row.F_PaymentMethod? scope.row.F_PaymentMethod : '--' }}
                  </template>
                </el-table-column>
                <el-table-column width="280" prop="Remark" label="Remark"></el-table-column>
              </el-table>
              <div style="margin-top: 10px" v-if="textareaFreight">
                <span style="font-size: 14px; margin-bottom: 10px;">Remark：</span>
                <div class="pubFeeRemark">{{ textareaFreight }}</div> 
              </div> 
            </div>

            <!-- 起运港费用 -->
            <div class="model-fee-item">
              <div class="fee-title">Origin Charges</div>
              <el-table 
                border 
                class="fee-table" 
                :data="polFee" 
                :header-cell-style="{ background: '#f2f4f6' }"
                :span-method="objectSpanMethod">
                <el-table-column prop="F_DeparturePortChargeDetailsId" label="Charge Name">
                  <template slot-scope="scope">
                    {{scope.row.F_ExpenseCodeEng? scope.row.F_ExpenseCodeEng : '--'}}
                  </template>
                </el-table-column>
                <el-table-column prop="F_Currency" label="Currency"></el-table-column>
                <el-table-column label="Rate">
                  <template slot-scope="scope">
                    {{scope.row.F_UnitPrice? scope.row.F_UnitPrice : '' }}
                  </template>
                </el-table-column>
                <el-table-column label="Unit">
                  <template slot-scope="scope">
                    {{scope.row.F_Unit? scope.row.F_Unit : '' }}
                  </template>
                </el-table-column>
                <el-table-column prop="F_MiniCharge" label="Min">
                  <template slot-scope="scope">
                    {{ scope.row.F_MiniCharge ? scope.row.F_MiniCharge + '/' + scope.row.F_MaxUnit : '' }}
                  </template>
                </el-table-column>
                <el-table-column label="Max">
                  <template slot-scope="scope">
                    {{ scope.row.F_MaxCharge ? scope.row.F_MaxCharge + '/' + scope.row.F_MaxUnit : '' }}
                  </template>
                </el-table-column>
                <el-table-column width="280" label="Remark">
                  <template slot-scope="scope">
                    {{ scope.row.F_Description ? scope.row.F_Description  : '-' }}
                    <p style="display: none">{{ scope.row.F_IsCalculation }}</p>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px" v-if="textareaPol">
                <span style="font-size: 14px; margin-bottom: 5px">Remark：</span>
                <div class="pubFeeRemark">{{ textareaPol }}</div> 
              </div> 
            </div>

            <!-- 目的港费用 -->
            <div class="model-fee-item">
              <div class="fee-title">Destination Charges</div>
              <el-table 
                border 
                class="fee-table" 
                :data="podFee" 
                :header-cell-style="{ background: '#f2f4f6' }"
              >
                <el-table-column label="Type">
                  <template slot-scope="scope">
                    {{ scope.row.ExpenseTypeNameEn? scope.row.ExpenseTypeNameEn : scope.row.F_ExpenseType }}
                  </template>
                </el-table-column>
                <el-table-column prop="F_ExpenseCodeEng" label="Charge Name">
                  <template slot-scope="scope">
                    {{ scope.row.F_ExpenseCodeEng? scope.row.F_ExpenseCodeEng : '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="F_Currency" label="Currency"></el-table-column>
                <el-table-column prop="F_UnitPrice" label="Rate"></el-table-column>
                <el-table-column prop="F_Unit" label="Unit"></el-table-column>
                <el-table-column prop="F_MiniQuantity" label="Min Quality"></el-table-column>
                <el-table-column prop="F_MiniAmount" label="Min Rate"></el-table-column>
                <el-table-column width="280" label="Remark">
                  <template slot-scope="scope">
                    {{scope.row.F_ExpensesDescription? scope.row.F_ExpensesDescription : '-'}}
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px" v-if="textareaPod">
                <span style="font-size: 14px; margin-bottom: 5px;">Remark：</span>
                <div class="pubFeeRemark">{{ textareaPod }}</div> 
              </div> 
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Edit Quotation" name="2">
          <div class="model-create-item">
            <div class="create-title">Cargo Information</div>
            <p>Vol.ratio:{{ this.lclInfo.F_VolumeRatio? '1:' + this.lclInfo.F_VolumeRatio : '--' }}</p>
            <p v-if="this.lclInfo.F_RTLowerLimit == '' && this.lclInfo.F_RTUpperLimit == ''">RT Scope:--</p>
            <p v-else-if="this.lclInfo.F_RTLowerLimit !== '' && this.lclInfo.F_RTUpperLimit == ''">RT
              Scope:{{ this.lclInfo.F_RTLowerLimit }}＜RT
            </p>
            <p v-else-if="this.lclInfo.F_RTLowerLimit == '' && this.lclInfo.F_RTUpperLimit !== ''">RT
              Scope:RT≤{{ this.lclInfo.F_RTUpperLimit }}
            </p>
            <p v-else-if="this.lclInfo.F_RTLowerLimit !== '' && this.lclInfo.F_RTUpperLimit !== ''">RT
              Scope:{{ this.lclInfo.F_RTLowerLimit }}＜RT≤{{ this.lclInfo.F_RTUpperLimit }}
            </p>
            <p v-else>RT Scope:--</p>
          </div>

          <div class="model-create-input">
            <div class="input-item">
              <el-input 
                type="number" 
                placeholder="PCS" 
                v-model.number="quotation.pcs" 
                class="input-with-select"
                onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              >
                <template slot="append">PKG(S)</template>
                <template slot="prepend">PCS</template>
              </el-input>
            </div>
            <div class="input-item">
              <el-input 
                placeholder="KGS" 
                v-model="quotation.kgs" 
                class="input-with-select"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              >
                <template slot="prepend">KGS</template>
              </el-input>
            </div>
            <div class="input-item">
              <el-input 
                placeholder="CBM" 
                v-model="quotation.cbm" 
                class="input-with-select"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              >
                <template slot="prepend">CBM</template>
              </el-input>
            </div>
            <div class="input-compute">
              <el-button 
                style="height: 30px; background: #0081ff" 
                type="primary" 
                size="mini" 
                @click="computedOecanFee"
              >
                Calculate
              </el-button>
            </div>
          </div>

          <!-- 海运费及附加费 -->
          <div class="model-create-table">
            <div class="table-fee-item" v-if="isComputed">
              <div class="fee-info">
                <h4>Freight and surcharges</h4>
                <span>Total:{{ freightTotal? freightTotal : '--' }}</span>
                <span>Convert(USD): {{ converTotalFre? (converTotalFre < 0? '(' + converTotalFre * -1  + ')' : converTotalFre) : '--' }}</span>
                <span>Balance:{{ diffFreightTotal? diffFreightTotal : '--' }}</span>
                <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550">(The cost is for reference only)</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6'}"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="freightComputed"
                >
                  <el-table-column prop="F_ExpenseCode" label="Charge Name"></el-table-column>
                  <el-table-column prop="F_Currency" label="CCY"></el-table-column>
                  <el-table-column label="Rate" width="80">
                    <template slot-scope="scope">
                      {{ Number(scope.row.F_UnitPrice) < 0 ? '(' + Number(scope.row.F_UnitPrice) * -1 + ')' : scope.row.F_UnitPrice }} 
                    </template>
                  </el-table-column>
                  <el-table-column label="Quoted Rate">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput">{{ Number(scope.row.F_QuotedPrice) < 0 ? '(' +Number(scope.row.F_QuotedPrice) * -1 + ')' : scope.row.F_QuotedPrice }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="number" 
                        v-model.number="scope.row.F_QuotedPrice"
                        placeholder="Quoted Rate"
                      >
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_Unit" label="Unit"></el-table-column>
                  <el-table-column prop="F_Quantity" label="Count"></el-table-column>
                  <el-table-column label="Amount">
                    <template slot-scope="scope">
                      {{ Number(scope.row.F_Amount) < 0 ? '(' + Number(scope.row.F_Amount) * -1 + ')' : scope.row.F_Amount }} 
                    </template>
                  </el-table-column>
                  <el-table-column label="Quoted Amount">
                    <template slot-scope="scope">
                      {{ Number(scope.row.F_QuotedAmount) < 0 ? '(' + Number(scope.row.F_QuotedAmount) * -1 + ')' : scope.row.F_QuotedAmount }} 
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_Balance" label="Balance"></el-table-column>
                  <el-table-column prop="F_Remark" label="Remark">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput">{{ scope.row.F_Remark }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="text" 
                        v-model="scope.row.F_Remark"
                        placeholder="Remark">
                      </el-input>
                      <p style="display: none">{{ scope.row.F_IsCalculation }}</p>
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
                        v-model="addFee.F_ExpenseCode" 
                        style="width: 180px" 
                        placeholder="Charge Name"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select v-model="addFee.F_Currency" placeholder="CCY">
                        <el-option 
                          v-for="c in currencyArr" 
                          :key="c.F_ItemDetailId" 
                          :value="c.F_ItemValue"
                          :label="c.F_ItemValue"
                        >
                          <span style="float: left; margin-right: 15px">{{ c.F_ItemValue }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ c.F_ItemName }}</span>
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model.number="addFee.F_UnitPrice" 
                        placeholder="Rate" 
                        @blur="onBlurComputed(1), addFee.F_UnitPrice=$event.target.value"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 100px" 
                        v-model.number="addFee.F_QuotedPrice" 
                        placeholder="Quoted Rate"
                        @blur="onBlurComputed(1), addFee.F_QuotedPrice=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select v-model="addFee.F_Unit" placeholder="Unit" style="width: 100px">
                        <el-option 
                          v-for="u in unitArr" 
                          :key="u.F_ItemDetailId" 
                          :value="u.F_ItemName"
                          :label="u.F_ItemName">
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model.number="addFee.F_Quantity" 
                        placeholder="Count"
                        @blur="onBlurComputed(1), addFee.F_Quantity=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addFee.F_Amount" disabled placeholder="Amount"></el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 110px" 
                        v-model="addFee.F_QuotedAmount" 
                        disabled
                        placeholder="Quoted Amount">
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addFee.F_Balance" disabled placeholder="Balance"></el-input>
                    </li>
                    <li>
                      <el-input style="width: 180px" v-model="addFee.F_Remark" placeholder="Remark"></el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(1)">
                        Add
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark">
                  <span>Remark</span>
                  <el-input 
                    type="textarea" 
                    :rows="6" 
                    v-model="textareaFreight"
                  >
                  </el-input>
                </div>
              </div>
            </div>

            <!-- 起运港费用 -->
            <div class="table-fee-item" v-if="isComputed">
              <div class="fee-info">
                <h4>Origin</h4>
                <span>Total:{{ polTotal? polTotal : '--' }}</span>
                <span>Convert(USD):{{ convertMiniTotal? convertMiniTotal : '--' }}</span>
                <span>Balance:{{ diffPolTotal? diffPolTotal : '--' }}</span>
                <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550">(The cost is for reference only)</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6'}"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="polFeeComputed"
                >
                  <el-table-column prop="F_ExpenseCode" label="Charge Name"></el-table-column>
                  <el-table-column prop="F_Currency" label="CCY"></el-table-column>
                  <el-table-column prop="F_UnitPrice" label="Rate" width="80"></el-table-column>
                  <el-table-column label="Quoted Rate">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isInput">{{ scope.row.F_QuotedPrice }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        v-model.number="scope.row.F_QuotedPrice"
                        placeholder="Quoted Amount">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_Unit" label="Unit"></el-table-column>
                  <el-table-column prop="F_Quantity" label="Count"></el-table-column>
                  <el-table-column prop="F_Amount" label="Amount"></el-table-column>
                  <el-table-column prop="F_QuotedAmount" label="Quoted Amount"></el-table-column>
                  <el-table-column width="70" prop="F_Balance" label="Balance"></el-table-column>
                  <el-table-column width="280" label="Remark">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isInput">{{ scope.row.F_Remark }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="text"
                        v-model="scope.row.F_Remark"
                        placeholder="Remark">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Others">
                    <template slot-scope="scope">
                      <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(2, scope.row, scope.$index)" v-show="scope.row.isEdit">
                        Edit
                      </a>
                      <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                        @click="saveFeeData(2, scope.row, scope.$index)">
                        Save
                      </a>
                      <a style="color: #F56c6c; 
                        cursor: pointer" @click="deleteFeeData(2, scope.row.F_Id)">
                        Delete
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="order-edit">
                  <ul>
                    <li>
                      <el-input 
                        v-model="addPolFee.F_ExpenseCode" 
                        style="width: 180px"
                        placeholder="Charge Name">
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addPolFee.F_Currency" 
                        placeholder="CCY"
                        @change="handlerChange"
                      >
                        <el-option 
                          v-for="c in currencyArr" 
                          :key="c.F_ItemDetailId" 
                          :value="c.F_ItemValue"
                          :label="c.F_ItemValue"
                        >
                          <span style="float: left; margin-right: 15px;">{{ c.F_ItemValue }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ c.F_ItemName }}</span>
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model.number="addPolFee.F_UnitPrice" 
                        placeholder="Rate" 
                        @blur="onBlurComputed(2), addPolFee.F_UnitPrice=$event.target.value"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 100px" 
                        v-model.number="addPolFee.F_QuotedPrice" 
                        placeholder="Quoted Rate"
                        @blur="onBlurComputed(2), addPolFee.F_QuotedPrice=$event.target.value"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addPolFee.F_Unit" 
                        placeholder="Unit" 
                        style="width: 100px"
                      >
                        <el-option 
                          v-for="u in unitArr" 
                          :key="u.F_ItemDetailId" 
                          :value="u.F_ItemName"
                          :label="u.F_ItemName"
                        >
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model.number="addPolFee.F_Quantity" 
                        placeholder="Count"
                        @blur="onBlurComputed(2), addPolFee.F_Quantity=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        v-model="addPolFee.F_Amount" 
                        disabled 
                        placeholder="Amount">
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 110px" 
                        v-model="addPolFee.F_QuotedAmount" 
                        disabled
                        placeholder="Quoted Amount">
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        v-model="addPolFee.F_Balance" 
                        disabled 
                        placeholder="Balance">
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 180px" 
                        v-model="addPolFee.F_Remark" 
                        placeholder="Remark">
                      </el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(2)">
                        Add
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark">
                  <span>Remark</span>
                  <el-input 
                    type="textarea" 
                    :rows="6" 
                    v-model="textareaPol">
                  </el-input>
                </div>
              </div>
            </div>

            <!-- 目的港费用 -->
            <div class="table-fee-item" v-if="isComputed">
              <div class="fee-info">
                <h4>Dest</h4>
                <span>Total:{{ podTotal? podTotal : '--' }}</span>
                <span>Type: {{ typeTotal? typeTotal : '--' }}</span>
                <span>Convert(USD): {{converTotalPod? converTotalPod : '--' }}</span>
                <span>Balance:{{ diffPodTotal? diffPodTotal : '--' }}</span>
                <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550">(The cost is for reference only)</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6'}"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="podFeeComputed">
                  <el-table-column width="180" label="Type">
                    <template slot-scope="scope">
                      {{ scope.row.ExpenseTypeNameEn? scope.row.ExpenseTypeNameEn : scope.row.F_ExpenseType }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_ExpenseCode" label="Charge Name"></el-table-column>
                  <el-table-column prop="F_Currency" label="CCY"></el-table-column>
                  <el-table-column prop="F_UnitPrice" label="Rate"></el-table-column>
                  <el-table-column prop="F_QuotedPrice" label="Quoted Rate">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isInput">{{ scope.row.F_QuotedPrice }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="number" 
                        v-model.number="scope.row.F_QuotedPrice"
                        placeholder="Quoted Amount">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_Unit" label="Unit"></el-table-column>
                  <el-table-column prop="F_Quantity" label="Count"></el-table-column>
                  <el-table-column prop="F_Amount" label="Amount"></el-table-column>
                  <el-table-column prop="F_QuotedAmount" label="Quoted Amount"></el-table-column>
                  <el-table-column prop="F_Balance" label="Balance"></el-table-column>
                  <el-table-column width="280" label="Remark">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isEdit">{{ scope.row.F_Remark }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="text" 
                        v-model="scope.row.F_Remark"
                        placeholder="Remark">
                      </el-input>
                      <p style="display: none">{{ scope.row.F_IsCalculation }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="Others">
                    <template slot-scope="scope">
                      <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(3, scope.row, scope.$index)" v-show="scope.row.isEdit">
                        Edit
                      </a>
                      <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                        @click="saveFeeData(3, scope.row, scope.$index)">
                        Save
                      </a>
                      <a style="color: #F56c6c; 
                        cursor: pointer" @click="deleteFeeData(3, scope.row.F_Id)">
                        Delete
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="order-edit">
                  <ul>
                    <li>
                      <el-select 
                        v-model="addPodFee.ExpenseTypeNameEn" 
                        @change="getTypePodFee" 
                        placeholder="Type"
                        style="width: 100px" 
                        ref="selectLabel"
                      >
                        <el-option 
                          v-for="t in typePodArr" 
                          :key="t.F_ItemDetailId" 
                          :value="t.F_ItemValue"
                          :label="t.F_ItemNameEn">
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model="addPodFee.F_ExpenseCode" 
                        style="width: 180px"
                        placeholder="Charge Name">
                      </el-input>
                    </li>
                    <li>
                      <el-select v-model="addPodFee.F_Currency" placeholder="CCY">
                        <el-option 
                          v-for="c in currencyArr" 
                          :key="c.F_ItemDetailId" 
                          :value="c.F_ItemValue"
                          :label="c.F_ItemValue"
                        >
                          <span style="float: left; margin-right: 15px;">{{ c.F_ItemValue }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ c.F_ItemName }}</span>
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model.number="addPodFee.F_UnitPrice" 
                        placeholder="Rate" 
                        @blur="onBlurComputed(3), addPodFee.F_UnitPrice=$event.target.value"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 100px" 
                        v-model.number="addPodFee.F_QuotedPrice" 
                        placeholder="Quoted Rate"
                        @blur="onBlurComputed(3), addPodFee.F_QuotedPrice=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addPodFee.F_Unit" 
                        placeholder="Unit" 
                        style="width: 100px"
                      >
                        <el-option 
                          v-for="u in unitArr" 
                          :key="u.F_ItemDetailId" 
                          :value="u.F_ItemName"
                          :label="u.F_ItemName"
                        >
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model.number="addPodFee.F_Quantity" 
                        placeholder="Count"
                        @blur="onBlurComputed(3), addPodFee.F_Quantity=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addPodFee.F_Amount" disabled placeholder="Amount"></el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 110px" 
                        v-model="addPodFee.F_QuotedAmount" 
                        disabled
                        placeholder="Quoted Amount">
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addPodFee.F_Balance" disabled placeholder="Balance"></el-input>
                    </li>
                    <li>
                      <el-input style="width: 180px" v-model="addPolFee.F_Remark" placeholder="Remark"></el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(3)"
                      >
                        Add
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark">
                  <span>Remark</span>
                  <el-input type="textarea" :rows="6" v-model="textareaPod"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="order-total">Convert(USD): {{importLclUsdTotal}}</div>
          <div class="order-btn">
            <el-button icon="el-icon-s-order" style="background: #0081ff; color: #fff" @click="savePriceData">Save</el-button>
            <el-button icon="el-icon-s-data"  style="background: #0081ff; color: #fff" @click="exportExcelFile">Export File(Excel)</el-button>
            <el-button icon="el-icon-s-claim" style="background: #0081ff; color: #fff" @click="exportPdfFile">Export File(PDF)</el-button>
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
  name: 'DataIModel',
  data() {
    return {
      visible: false,
      isShow: false,
      lclInfo: {},
      polFee: null,
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
      unit: [{ id: 1, value: 'CTN(S)' }],
      quotation: {
        pcs: '', //件数
        kgs: '', //毛重
        cbm: '' //cbm
      },
      addFee: {
        F_Id: nanoid(),
        F_ExpenseCode: '', //费用名称
        F_Currency: '', //币种
        F_UnitPrice: '', //单价
        F_QuotedPrice: '', //报价单价
        F_Unit: '', //单位
        F_Quantity: '', //数量
        F_Amount: '',//金额
        F_QuotedAmount: '',//报价金额
        F_Balance: '',//差额
        F_Remark: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },
      addPolFee: {
        F_Id: nanoid(),
        F_ExpenseCode: '', //费用名称
        F_Currency: '', //币种
        F_UnitPrice: null, //单价
        F_QuotedPrice: null, //报价单价
        F_Unit: '', //单位
        F_Quantity: null, //数量
        F_Amount: null,//金额
        F_QuotedAmount: null,//报价金额
        F_Balance: null,//差额
        F_Remark: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },
      addPodFee: {
        F_Id: nanoid(),
        F_ExpenseCode: '', //费用名称
        F_ExpenseType: '',
        ExpenseTypeNameEn: '',
        F_Currency: '', //币种
        F_UnitPrice: null, //单价
        F_QuotedPrice: null, //报价单价
        F_Unit: '', //单位
        F_Quantity: null, //数量
        F_Amount: null,//金额
        F_QuotedAmount: null,//报价金额
        F_Balance: null,//差额
        F_Remark: '',
        F_ExchangeRate: null,
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },
      currencyArr: [], //币种
      unitArr: [], //单位
      typePodArr: [], //目的港费用类型
      mergeObj: {}, // 用来记录需要合并行的下标
      mergeArr: ['F_DeparturePortChargeDetailsId'], // 表格中的列名
      activeName: "1",
      selectType: '',
      textareaFreight: '',
      textareaPol: '',
      textareaPod: '',
      storeId: '',
      storeInfo: {},
      typeTotal: '',
      convertTotal: '',
      converTotalPod: '',
      converTotalFre: '',
      totalUsd: 0,
      polMiniCharge: '',
      type: '',
      isComputed: false
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
    this.user = window.localStorage.getItem('enloginInfo') ? JSON.parse(window.localStorage.getItem('enloginInfo')) : ''
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
      if(this.polFee) {
        this.getSpanArr(this.polFee)
      }
      this.podFee = this.lclInfo.ToFee

      this.dataId = this.lclInfo.F_Id
      this.storeId = this.lclInfo.F_Warehouse

      if (this.storeId !== null || this.storeId !== '') return this.getStoreDataInfo(this.storeId)
    })

    // 调用币种
    this.getCurrencyData()
    // 调用单位
    this.getUnitData()
    // 调用费用类型
    this.getTypePodData()
  },

  computed: {
    convertMiniTotal() {
      let sum = null
      sum = this.polMiniCharge? Number(this.convertTotal) < Number(this.polMiniCharge)?  this.polMiniCharge : this.convertTotal : this.convertTotal
      return Number(sum).toFixed(2)
    },

    importLclUsdTotal() {
      this.totalUsd = Number(this.converTotalFre) + Number(this.converTotalPod) + Number(this.convertTotal)
      return this.totalUsd.toFixed(2)
    }
  },

  methods: {
    handlerChange(e) {
      let newCurrency = []
      newCurrency = this.currencyArr.filter(item => {
        return item.F_ItemValue == e && item.F_ExchangeRate > 0
      })
      if(newCurrency.length > 0 ) {
        this.addPolFee.F_Currency = e
      }else {
        this.addPolFee.F_Currency = ""
        this.$message({
          message: 'There is currently no exchange rate for this currency, please reset',
          type: 'error',
          duration: 2000
        })
      }
    },

    getTypePodFee(val) {
      this.addPodFee.F_ExpenseType = val
      this.$nextTick(() => {
        this.addPodFee.ExpenseTypeNameEn = this.$refs.selectLabel.selectedLabel
      })
    },

    // 合并单元格
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

    // 获取仓库地址
    async getStoreDataInfo(id) {
      const { data: res } = await this.$http.post('data/getStoreInfo', {
        StoreId: id
      })
      try {
        if (res.code === 200) {
          this.storeInfo = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 计算费用
    async computedOecanFee() {
      if (this.quotation.pcs === '') {
        this.$message({
          message: 'Please enter the pcs',
          type: 'error',
          duration: 2000
        })
      }else if(this.quotation.kgs === '') {
        this.$message({
          message: 'Please enter the kgs',
          type: 'error',
          duration: 2000
        })
      } else if(this.quotation.cbm === '') {
        this.$message({
          message: 'Please enter the cbm',
          type: 'error',
          duration: 2000
        })
      } else {
        if(this.lclInfo.F_RTUpperLimit || this.lclInfo.F_RTLowerLimit) {
          let rtNumber = this.volumeRatio? this.quotation.kgs / this.volumeRatio : this.quotation.kgs / 1000
          if(rtNumber > Number(this.quotation.cbm) && (rtNumber > Number(this.lclInfo.F_RTUpperLimit) || rtNumber < Number(this.lclInfo.F_RTLowerLimit) )) {
            this.$message({
              message: 'Please enter the correct RT range',
              type: 'error',
              duration: 2000
            })  
          }else if(rtNumber < Number(this.quotation.cbm) && (this.quotation.cbm > Number(this.lclInfo.F_RTUpperLimit) || this.quotation.cbm < Number(this.lclInfo.F_RTLowerLimit) )) {
            this.$message({
              message: 'Please enter the correct RT range',
              type: 'error',
              duration: 2000
            })  
          }else {
            this.debounceMethods()
          }
        }else {
          this.debounceMethods()
        }
      }
    },

    // 计算功能防抖
    debounceMethods: _.debounce(function() {
      this.getComputedFeeData()
    },350),

    async getComputedFeeData() {
      const { data: res } = await this.$http.post('imlcl/calQuotation', {
        FreightRateId: this.dataId,
        Quantity: this.quotation.pcs,
        GrossWeight: this.quotation.kgs,
        Volume: this.quotation.cbm
      })
      try {
        if (res.code === 200) {
          this.$message({
            message: 'Computed Successful',
            type: 'success',
            duration: 1500
          })

          this.textareaFreight = res.data.freightDesc
          this.textareaPol = res.data.fromDesc
          this.textareaPod = res.data.toDesc

          this.polMiniCharge = res.data.F_MinimumChargeUsd
          this.isComputed = true

          // 海运费
          this.freightComputed = res.data.freight
          this.freightComputed.forEach(item => {
            this.$set(item, 'isInput', true)
            this.$set(item, 'isEdit', true)
          })
          if(this.freightComputed.length !== 0) {
            this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
            this.converTotalFre = this.getComputedTotal(this.freightComputed)[1]
            this.diffFreightTotal = this.getBalanceComputed(this.freightComputed)
          }else {
            this.freightTotal = '--'
            this.converTotalFre = 0
            this.diffFreightTotal = '--'
          }
        
          // 起运港费用
          this.polFeeComputed = res.data.departurePortCharges
          this.polFeeComputed.forEach(item => {
            this.$set(item, 'isInput', true)
            this.$set(item, 'isEdit', true)
          })
          if(this.polFeeComputed.length !== 0) {
            this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
            this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
            this.diffPolTotal = this.getBalanceComputed(this.polFeeComputed)
          }else {
            this.polTotal = '--'
            this.convertTotal = 0
            this.diffPolTotal = '--'
          }
          
          // 目的港费用
          this.podFeeComputed = res.data.destinationPorts
          this.podFeeComputed.forEach(item => {
            this.$set(item, 'isInput', true)
            this.$set(item, 'isEdit', true)
          })
          if(this.podFeeComputed.length !== 0) {
            this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
            this.converTotalPod = this.getComputedTotal(this.podFeeComputed)[1]
            this.diffPodTotal = this.getBalanceComputed(this.podFeeComputed)
            this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
          }else {
            this.podTotal = '--'
            this.diffPodTotal = 0
            this.typeTotal = '--'
            this.converTotalPod = 0
          }

          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.converTotalFre, this.converTotalPod, this.totalUsd, this.type, this.polMiniCharge)
        } else if (res.code === 0) {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 1500
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 关闭清除计算内容
    clearHistory() {
      this.polFeeComputed = []
      this.podFeeComputed = []
      this.freightComputed = []
      this.quotation = {}
      this.storeInfo = {}
      this.lclInfo = {}
      this.freightTotal = ''
      this.polTotal = ''
      this.podTotal = ''
      this.convertTotal = ''
      this.converTotalPod = ''
      this.converTotalFre = ''
      this.diffFreightTotal = ''
      this.diffPolTotal = ''
      this.diffPodTotal = ''
      this.typeTotal = ''
      this.polMiniCharge = ''
      this.textareaFreight = ''
      this.textareaPol = ''
      this.textareaPod = ''
      this.isComputed = false
      this.totalUsd = 0

      this.addFee = {
        F_Id: nanoid(),
        F_ExpenseCode: '', //费用名称
        F_Currency: '', //币种
        F_UnitPrice: '', //单价
        F_QuotedPrice: '', //报价单价
        F_Unit: '', //单位
        F_Quantity: '', //数量
        F_Amount: '',//金额
        F_QuotedAmount: '',//报价金额
        F_Balance: '',//差额
        F_Remark: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },

      this.addPolFee = {
        F_Id: nanoid(),
        F_ExpenseCode: '', //费用名称
        F_Currency: '', //币种
        F_UnitPrice: '', //单价
        F_QuotedPrice: '', //报价单价
        F_Unit: '', //单位
        F_Quantity: '', //数量
        F_Amount: '',//金额
        F_QuotedAmount: '',//报价金额
        F_Balance: '',//差额
        F_Remark: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      }

      this.addPodFee = {
        F_Id: nanoid(),
        F_ExpenseCode: '', //费用名称
        F_Currency: '', //币种
        F_UnitPrice: '', //单价
        F_QuotedPrice: '', //报价单价
        F_Unit: '', //单位
        F_Quantity: '', //数量
        F_Amount: '',//金额
        F_QuotedAmount: '',//报价金额
        F_Balance: '',//差额
        F_Remark: '',
        isEdit: true,
        isInput: true,
        F_IsTotal: 1,
        F_IsCalculation: 1
      },

      this.activeName = '1'
    },

    // 导出pdf
    async exportPdfFile() {
      if (this.podFeeComputed.length === 0 && this.polFeeComputed.length === 0 && this.freightComputed.length === 0) {
        this.$message({
          message: 'Please edit quotation first',
          type: 'warning',
          duration: 2000
        })
      } else {
        const {data: res} = await this.$http.post('login/isLogin')
        if(res.code === 200) {
          const routeUrl = this.$router.resolve({
            path: '/PdfTemplate',
          })
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.converTotalFre, this.converTotalPod, this.totalUsd, this.type, this.polMiniCharge)
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
    getPdfParams(lclInfo, polFee, podFee, freight, pcs, kgs, cbm, freightTotal, polTotal, podTotal, textareaFreight, textareaPol, textareaPod, typeTotal, convertTotal, freightTotalUsd, podTotalUsd, totalUsd, type, miniCharge ) {
      let pdfData = { lclInfo, polFee, podFee, freight, pcs, kgs, cbm, freightTotal, polTotal, podTotal, textareaFreight, textareaPol, textareaPod, typeTotal, convertTotal, freightTotalUsd, podTotalUsd, totalUsd, type, miniCharge }
      window.sessionStorage.setItem('enpdfData', JSON.stringify(pdfData))
    },

    // 导出excel
    async exportExcelFile() {
      if (this.podFeeComputed.length === 0 && this.polFeeComputed.length === 0 && this.freightComputed.length === 0) {
        this.$message({
          message: 'Please edit quotation first',
          type: 'warning',
          duration: 2000
        })
      } else {
        const { data: res } = await this.$http.post('Imlcl/imLclExcel', {
          FreightRateId: this.dataId,
          Quantity: this.quotation.pcs,
          GrossWeight: this.quotation.kgs,
          Volume: this.quotation.cbm,
          FreightAdd: this.freightComputed,
          FromFee: this.polFeeComputed,
          ToFee: this.podFeeComputed,
          FreightAddDesc: this.textareaFreight,
          FromDesc: this.textareaPol,
          ToDesc: this.textareaPod,
          FreightTotal: this.freightTotal,
          FromTotal: this.polTotal,
          ToTotal: this.podTotal + ' ' + 'Type:' + this.typeTotal,
          ToConvert: 'USD' + this.convertMiniTotal
        })
        try {
          if (res.code === 200) {
            let url = res.data.Downurl
            window.open(url)
          }else {
            this.$message({
              message: res.info,
              duration: 2000,
              type: 'error'
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    },

    // 保存运价
    async savePriceData() {
      if (this.podFeeComputed.length === 0 && this.polFeeComputed.length === 0 && this.freightComputed === 0) {
        this.$message({
          message: 'Please edit quotation first',
          type: 'warning',
          duration: 2000
        })
      } else {
        const { data: res } = await this.$http.post('Lclquote/saveQuote', {
          FreightRateId: this.dataId,
          Type: 2,
          Quantity: this.quotation.pcs,
          UnitType: 1,
          GrossWeight: this.quotation.kgs,
          Volume: this.quotation.cbm,
          FreightAdd: this.freightComputed,
          FromFee: this.polFeeComputed,
          ToFee: this.podFeeComputed,
          FreightAddDesc: this.textareaFreight,
          FromDesc: this.textareaPol,
          ToDesc: this.textareaPod,
          FreightTotal: this.freightTotal,
          PortDepartureTotal: this.polTotal,
          PortDestinationTotal: this.podTotal,
          ExpenseTypeTotal: this.typeTotal,
          CovertTotal: this.convertMiniTotal
        })
        try {
          if (res.code === 200) {
            this.$message({
              message: 'Successful',
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

    // 获取单位
    async getUnitData() {
      const { data: res } = await this.$http.post('data/getUnit')
      try {
        if (res.code === 200) {
          this.unitArr = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 获取目的港费用类型
    async getTypePodData() {
      const { data: res } = await this.$http.post('data/getExpenseType')
      try {
        if (res.code === 200) {
          this.typePodArr = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 新增费用
    addFeeList(type) {
      if (type == 1) {
        const { F_ExpenseCode, F_Currency, F_UnitPrice, F_QuotedPrice, F_Unit, F_Quantity } = this.addFee
        if (!F_ExpenseCode.trim() ) {
          this.$message({
            message: 'Please fill in the name of the sea freight',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Currency) {
          this.$message({
            message: 'Please select a currency',
            type: 'error',
            duration: 2000
          })
        }else if(!F_UnitPrice) {
          this.$message({
            message: 'Please fill in the unit price',
            type: 'error',
            duration: 2000
          })
        }else if(!F_QuotedPrice) {
          this.$message({
            message: 'Please fill in the quotation unit price',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: 'Please select a unit',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Quantity) {
          this.$message({
            message: 'Please fill in the quantity',
            type: 'error',
            duration: 2000
          })
        } else {
          this.freightComputed.push(this.addFee)
          this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
          this.converTotalFre = this.getComputedTotal(this.freightComputed)[1]
          this.diffFreightTotal = this.getBalanceComputed(this.freightComputed)
          this.freightComputed.forEach(item => {
            item.isInput = true
            item.isEdit = true
          })
          this.addFee = {
            F_Id: nanoid(),
            F_ExpenseCode: '', //费用名称
            F_Currency: '', //币种
            F_UnitPrice: '', //单价
            F_QuotedPrice: '', //报价单价
            F_Unit: '', //单位
            F_Quantity: '', //数量
            F_Amount: '',//金额
            F_QuotedAmount: '',//报价金额
            F_Balance: '',//差额
            F_Remark: '',
            isEdit: true,
            isInput: true,
            F_IsTotal: 1,
            F_IsCalculation: 1
          }
        }
      } else if (type == 2) {
        const { F_ExpenseCode, F_Currency, F_UnitPrice, F_QuotedPrice, F_Unit, F_Quantity } = this.addPolFee
        if (!F_ExpenseCode.trim()) {
          this.$message({
            message: 'Please fill in the name of the sea freight',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Currency) {
          this.$message({
            message: 'Please select a currency',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: 'Please select a unit',
            type: 'error',
            duration: 2000
          })
        }else if(!F_UnitPrice) {
          this.$message({
            message: 'Please fill in the unit price',
            type: 'error',
            duration: 2000
          })
        }else if(!F_QuotedPrice) {
          this.$message({
            message: 'Please fill in the quotation unit price',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Quantity) {
          this.$message({
            message: 'Please fill in the quantity',
            type: 'error',
            duration: 2000
          })
        } else {
          this.polFeeComputed.push(this.addPolFee)
          this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
          this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
          this.diffPolTotal = this.getBalanceComputed(this.polFeeComputed)
          this.addPolFee = {
            F_Id: nanoid(),
            F_ExpenseCode: '',
            ExpenseTypeName: '',
            F_UnitPrice: '',
            F_QuotedPrice: '',
            F_Quantity: '',
            F_Amount: '',
            F_QuotedAmount: '',
            F_Balance: '',
            F_Description: '',
            isEdit: true,
            isInput: true,
            F_IsTotal: 1,
            F_IsCalculation: 1,
            F_Remark: '',
            F_ExchangeRate: '',
          }
        }
      } else if (type == 3) {
        const { F_ExpenseCode, F_Currency, F_UnitPrice, F_QuotedPrice, F_Unit, F_Quantity, ExpenseTypeName } = this.addPodFee
        if (!F_ExpenseCode.trim()) {
          this.$message({
            message: 'Please fill in the name of the sea freight',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Currency) {
          this.$message({
            message: 'Please select a currency',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: 'Please select a unit',
            type: 'error',
            duration: 2000
          })
        }else if(!F_UnitPrice) {
          this.$message({
            message: 'Please fill in the unit price',
            type: 'error',
            duration: 2000
          })
        }else if(!F_QuotedPrice) {
          this.$message({
            message: 'Please fill in the quotation unit price',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Quantity) {
          this.$message({
            message: 'Please fill in the quantity',
            type: 'error',
            duration: 2000
          })
        } else {
          this.podFeeComputed.push(this.addPodFee)
          this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
          this.converTotalPod = this.getComputedTotal(this.podFeeComputed)[1]
          this.diffPodTotal = this.getBalanceComputed(this.podFeeComputed)
          this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
          this.addPodFee = {
            F_Id: nanoid(),
            F_ExpenseCode: '',
            F_ExpenseType: '',
            F_UnitPrice: '',
            F_QuotedPrice: '',
            F_Quantity: '',
            F_Amount: '',
            F_QuotedAmount: '',
            F_Balance: '',
            F_Description: '',
            F_ExchangeRate: '',
            isEdit: true,
            isInput: true,
            F_IsTotal: 1,
            F_IsCalculation: 1,
            F_Remark: ''
          }
        }
      }
      this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge)
    },

    // 编辑费用
    editFeedata(type, row, index) {
      row.isInput = !row.isInput
      row.isEdit = !row.isEdit
    },

    saveFeeData(type, row, index) {
      if (row.F_QuotedPrice === '') {
        this.$message({
          message: 'Quotation cannot be empty!',
          type: 'error',
          duration: 1500
        })
      } else {
        row.isInput = !row.isInput
        row.isEdit = !row.isEdit
        row.F_QuotedAmount = Number(row.F_QuotedPrice) * Number(row.F_Quantity).toFixed(2)
        row.F_Balance = (Number(row.F_QuotedAmount) - Number(row.F_Amount)).toFixed(2)
        if (type == 1) {
          this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
          this.diffFreightTotal = this.getBalanceComputed(this.freightComputed)
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.converTotalFre, this.converTotalPod, this.totalUsd, this.type, this.polMiniCharge)
        } else if (type == 2) {
          this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
          this.converTotal = this.getComputedTotal(this.polFeeComputed)[1]
          this.diffPolTotal = this.getBalanceComputed(this.polFeeComputed)
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.converTotalFre, this.converTotalPod, this.totalUsd, this.type, this.polMiniCharge)
        } else {
          this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
          this.diffPodTotal = this.getBalanceComputed(this.podFeeComputed)
          this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.converTotalFre, this.converTotalPod, this.totalUsd, this.type, this.polMiniCharge)
        }
      }
    },

    // 删除费用
    deleteFeeData(type, id) {
      this.$alert('Do you want to delete this expense', 'Tip',{
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        if (type == 1) {
          this.freightComputed = this.freightComputed.filter(item => item.F_Id !== id)
          if(this.freightComputed.length !== 0) {
            this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
            this.converTotalFre = this.getComputedTotal(this.freightComputed)[1]
            this.diffFreightTotal = this.getBalanceComputed(this.freightComputed)
          }else {
            this.freightTotal = '--'
            this.diffFreightTotal = '--'
          }
        } else if (type == 2) {
          this.polFeeComputed = this.polFeeComputed.filter(item => item.F_Id !== id)
          if(this.polFeeComputed.length !== 0) {
            this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
            this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
            this.diffPolTotal = this.getBalanceComputed(this.polFeeComputed)
          }else {
            this.polTotal = '--'
            this.convertTotal = 0
            this.diffPolTotal = '--'
          }
        } else if (type == 3) {
          this.podFeeComputed = this.podFeeComputed.filter(item => item.F_Id !== id)
          if(this.podFeeComputed.length !== 0) {
            this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
            this.converTotalPod = this.getComputedTotal(this.podFeeComputed)[1]
            this.diffPodTotal = this.getBalanceComputed(this.podFeeComputed)
            this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
          }else {
            this.podTotal = '--'
            this.diffPodTotal = '--'
            this.typeTotal = '--'
          }
        }
        this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.converTotalFre, this.converTotalPod, this.totalUsd, this.type, this.polMiniCharge)
      }).catch(() => {
        return
      })
    },

    // 失去焦点计算费用
    onBlurComputed(type) {
      if (type == 1) {
        if (this.addFee.F_UnitPrice !== '' && this.addFee.F_QuotedPrice !== '' && this.addFee.F_Quantity !== '') {
          this.addFee.F_Amount = this.addFee.F_UnitPrice * this.addFee.F_Quantity //金额
          this.addFee.F_QuotedAmount = this.addFee.F_QuotedPrice * this.addFee.F_Quantity //报价金额
          this.addFee.F_Balance = this.addFee.F_QuotedAmount - this.addFee.F_Amount
        } else {
          return
        }
      } else if (type == 2) {
        if (this.addPolFee.F_UnitPrice !== '' && this.addPolFee.F_QuotedPrice !== '' && this.addPolFee.F_Quantity !== '') {
          this.addPolFee.F_Amount = this.addPolFee.F_UnitPrice * this.addPolFee.F_Quantity //金额
          this.addPolFee.F_QuotedAmount = this.addPolFee.F_QuotedPrice * this.addPolFee.F_Quantity //报价金额
          this.addPolFee.F_Balance = this.addPolFee.F_QuotedAmount - this.addPolFee.F_Amount
        } else {
          return
        }
      } else {
        if (this.addPodFee.F_UnitPrice !== '' && this.addPodFee.F_QuotedPrice !== '' && this.addPodFee.F_Quantity !== '') {
          this.addPodFee.F_Amount = this.addPodFee.F_UnitPrice * this.addPodFee.F_Quantity //金额
          this.addPodFee.F_QuotedAmount = this.addPodFee.F_QuotedPrice * this.addPodFee.F_Quantity //报价金额
          this.addPodFee.F_Balance = this.addPodFee.F_QuotedAmount - this.addPodFee.F_Amount
        } else {
          return
        }
      }
    },

    // 费用总计公共方法
    getComputedTotal(dataArr) {
      let sum = 0
      let converTotal = 0
      let priceTotal = ''
      let newArr = _.groupBy(dataArr, 'F_Currency')
      for (let key in newArr) {
        sum = 0
        newArr[key].forEach(item => {
          if (item.F_Quantity == 0) {
            item.F_Quantity = ''
          }
          if (typeof item.F_QuotedAmount === 'number' && (item.F_IsTotal === undefined || item.F_IsTotal === 1)) {
            sum += item.F_QuotedAmount
          }
        })
        if (key) {
          let hl = this.currencyArr.filter(item => {
            return item.F_ItemValue == key 
          })[0].F_ExchangeRate
          converTotal += sum * Number(hl)
          sum < 0 ? (priceTotal += key + ' ' + '(' + sum * -1 + ')' + '+') : (priceTotal += key + ' ' + sum.toFixed(2) + '+')
        }
      }
      converTotal = converTotal.toFixed(2)
      // 处理总计价格，去掉最后一位+ 
      if (priceTotal.charAt(priceTotal.length - 1) === '+') {
        priceTotal = priceTotal.slice(0, priceTotal.length - 1)
        return [priceTotal, converTotal]
      }
    },

    // 计算差额
    getBalanceComputed(dataArr) {
      let sum = 0
      let priceTotal = ''
      let newArr = _.groupBy(dataArr, 'F_Currency')
      for (let key in newArr) {
        sum = 0
        newArr[key].forEach(item => {
          if (item.F_Quantity == 0) {
            item.F_Quantity = ''
          }
          if (typeof item.F_QuotedAmount === 'number' && (item.F_IsTotal === undefined || item.F_IsTotal === 1)) {
            sum += item.F_QuotedAmount - item.F_Amount
          }
        })
        if (key) {
          sum < 0 ? (priceTotal += key + ' ' + '(' + sum * -1 + ')' + '+') : (priceTotal += key + ' ' + sum.toFixed(2) + '+')
        }
      }
      if (priceTotal.charAt(priceTotal.length - 1) === '+') {
        priceTotal = priceTotal.slice(0, priceTotal.length - 1)
        return priceTotal
      }
    },

    // 根据目的港费用类型计算
    getDestTypeTotal(dataArr) {
      let sum = 0
      let priceTotal = ''
      
      let newArr = _.groupBy(dataArr, 'F_ExpenseType')
      for (let key in newArr) {
        sum = 0
        newArr[key].forEach(item => {
          if (item.F_Quantity == 0) {
            item.F_Quantity = ''
          } else {
            if(typeof item.F_QuotedAmount === 'number' && (item.F_IsTotal === undefined || item.F_IsTotal === 1)) {
              sum += item.F_QuotedAmount
            }
          }
        })
        if(key) {
          sum < 0 ? priceTotal += key + '(' + sum * -1 + ')' + '+' : priceTotal += key + sum.toFixed(2) + '+'
        }else {
          sum < 0 ? priceTotal += '(' + sum * -1 + ')' + '+' : priceTotal += sum.toFixed(2) + '+'
        }
      }
      // 处理总计价格，去掉最后一位+ 
      if (priceTotal.charAt(priceTotal.length - 1) === '+') {
        priceTotal = priceTotal.slice(0, priceTotal.length - 1)
        return priceTotal
      }
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
      width: 30%;

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

  .order-total {
    font-size: 16px;
    color: #ffa024;
    margin: -15px 0 15px 0;
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

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

/deep/ input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>