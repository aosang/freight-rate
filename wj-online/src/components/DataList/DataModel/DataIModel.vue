<template>
  <div class="DataModel">
    <el-dialog 
      width="83%" 
      title="海进拼箱报价单" 
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
          <label>{{ lclInfo.F_Voyage ? lclInfo.F_Voyage : '--' }}</label>
          <i></i>
          <label>{{ lclInfo.TransitPortEnglish? lclInfo.TransitPortEnglish : '直拼' }}</label>
        </div>
        <div class="city-item">
          <h3>{{ lclInfo.ToPortEnglish }}</h3>
          <span>{{ lclInfo.ToPortName }}</span>
        </div>
      </div>
      <div class="model-info-detail">
        <div class="detail-group">
          <div class="detail-item" v-if="lclInfo.F_PortofDepartureWharf">
            <span>起运港码头</span>
            <p>{{ lclInfo.F_PortofDepartureWharf? lclInfo.F_PortofDepartureWharf : '' }}</p>
          </div>
          <div class="detail-item" v-if="lclInfo.ToQuayName">
            <span>目的港码头</span>
            <p>{{ lclInfo.ToQuayEng? lclInfo.ToQuayEng : ''  }}{{ lclInfo.ToQuayName? lclInfo.ToQuayName : '' }}</p>
          </div>
          <div class="detail-item">
            <span>船公司</span>
            <p>{{ lclInfo.F_ShoppingCompany? lclInfo.F_ShoppingCompany : '-' }}</p>
          </div>
          <div class="detail-item">
            <span>收货人类型</span>
            <p>{{ lclInfo.ConsigneeTypeName? lclInfo.ConsigneeTypeName : '-' }}</p>
          </div>
          <div class="detail-item">
            <span>班期</span>
            <p>{{ lclInfo.F_ShiftPeriod? lclInfo.F_ShiftPeriod : '-' }}</p>
          </div>
          <div class="detail-item">
            <span>截关期</span>
            <p>{{ lclInfo.F_CutoffPeriod? lclInfo.F_CutoffPeriod : '-' }}</p>
          </div>
          <div class="detail-item">
            <span>有效期</span>
            <p>{{ lclInfo.F_StartTime }} 至 {{ lclInfo.F_EndTime }}</p>
          </div>
        </div>
        <div class="detail-mark">
          <div class="mark-item">
            <span>接货仓库</span>
            <p>{{ storeInfo.F_WarehouseName ? storeInfo.F_WarehouseName : '-' }}</p>
            <el-popover placement="right" width="200" trigger="click">
              <span class="el-icon-user-solid" @click="visible = !visible" slot="reference"></span>
              <div class="mark-item-store" style="font-size: 13px">
                <p style="margin-bottom: 10px">联系人员：{{ storeInfo.F_ContactPerson ? storeInfo.F_ContactPerson : '-' }}</p>
                <p>联系电话：{{ storeInfo.F_ContactNumber ? storeInfo.F_ContactNumber : '-' }}</p>
              </div>
            </el-popover>
          </div>
          <div class="mark-item">
            <span>仓库地址</span>
            <p>{{ storeInfo.F_Address ? storeInfo.F_Address : '-' }}</p>
          </div>
          <div class="mark-item">
            <span>订舱备注</span>
            <p>{{ lclInfo.F_BookingRemarks !== null ? lclInfo.F_BookingRemarks : '-' }}</p>
          </div>
          <div class="mark-item">
            <span>费用备注</span>
            <p>{{ lclInfo.F_ExpenseNote !== null ? lclInfo.F_ExpenseNote : '-' }}</p>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" class="model-tabs">
        <el-tab-pane label="收费标准" name="1">
          <div class="model-fee">
            <div class="model-fee-item">
              <!-- 海运及附件费 -->
              <div class="fee-title">海运费及附加费</div>
              <el-table border class="fee-table" :data="freightArr" :header-cell-style="{ background: '#f2f4f6' }">
                <el-table-column prop="F_ExpenseCodeName" label="费用名称"></el-table-column>
                <el-table-column prop="F_ExpenseCodeEng" label="英文名"></el-table-column>
                <el-table-column prop="F_Currency" label="币种"></el-table-column>
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
                        {{ Number(scope.row.F_CBM >= 0) ? scope.row.F_CBM  : '(' + Number(scope.row.F_CBM) * -1 + ')'  }}
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
                        {{ Number(scope.row.F_TON >= 0) ? scope.row.F_TON : '(' + Number(scope.row.F_TON) * -1 + ')' }}
                     </span>
                      <span v-else-if="scope.row.F_TON == ''"></span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="F_MIN" label="MIN"></el-table-column>
                <el-table-column prop="F_RT" label="RT范围"></el-table-column>
                <el-table-column label="体积比">
                  <template slot-scope="scope">
                    {{ scope.row.F_VolumeRatio === '' || Number(scope.row.F_VolumeRatio === 0) ? '--' : '1:' + Number(scope.row.F_VolumeRatio) }}
                  </template>
                </el-table-column>
                <el-table-column label="付款方式">
                  <template slot-scope="scope">
                    {{ scope.row.F_PaymentMethod? scope.row.F_PaymentMethod : '--' }}
                  </template>
                </el-table-column>
                <el-table-column width="280" prop="Remark" label="备注"></el-table-column>
              </el-table>
              <div style="margin-top: 10px" v-if="textareaFreight">
                <span style="font-size: 14px; margin-bottom: 10px;">费用备注：</span>
                <div class="pubFeeRemark">{{ textareaFreight }}</div> 
              </div> 
            </div>

            <!-- 起运港费用 -->
            <div class="model-fee-item">
              <div class="fee-title">起运港费用</div>
              <el-table 
                border 
                class="fee-table" 
                :data="polFee" 
                :header-cell-style="{ background: '#f2f4f6' }"
                :span-method="objectSpanMethod"
              >
                <el-table-column prop="F_DeparturePortChargeDetailsId" label="费用名称">
                  <template slot-scope="scope">
                    {{scope.row.F_ExpenseCodeName}} {{'('+scope.row.F_ExpenseCodeEng+')'}}
                  </template>  
                </el-table-column>
                <el-table-column prop="F_Currency" label="币种"></el-table-column>
                <el-table-column prop="F_UnitPrice" label="单价"></el-table-column>
                <el-table-column prop="F_Unit" label="单位"></el-table-column>
                <el-table-column label="最低费用">
                  <template slot-scope="scope">
                    {{ scope.row.F_MiniCharge? scope.row.F_MiniCharge + '/' + scope.row.F_MaxUnit : '' }}
                  </template>
                </el-table-column>
                <el-table-column label="最高费用">
                  <template slot-scope="scope">
                    {{ scope.row.F_MaxCharge? scope.row.F_MaxCharge + '/' + scope.row.F_MaxUnit : '' }}
                  </template>
                </el-table-column>
                <el-table-column width="280" label="备注">
                  <template slot-scope="scope">
                    {{ scope.row.F_Description? scope.row.F_Description : '-'  }}
                    <p style="display: none">{{ scope.row.F_IsCalculation }}</p>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px" v-if="textareaPol">
                <span style="font-size: 14px; margin-bottom: 5px">费用备注：</span>
                <div class="pubFeeRemark">{{ textareaPol }}</div> 
              </div> 
            </div>

            <!-- 目的港费用 -->
            <div class="model-fee-item">
              <div class="fee-title">目的港费用</div>
              <el-table 
                border 
                class="fee-table" 
                :data="podFee" 
                :header-cell-style="{ background: '#f2f4f6' }"
              >
                <el-table-column prop="ExpenseTypeName" label="费用类型">
                  <template slot-scope="scope">
                    {{scope.row.ExpenseTypeName? scope.row.ExpenseTypeName : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="费用名称">
                  <template slot-scope="scope">
                    {{scope.row.F_ExpenseCodeName}} {{'('+scope.row.F_ExpenseCodeEng+')'}}
                  </template>
                </el-table-column>
                <el-table-column prop="F_Currency" label="币种"></el-table-column>
                <el-table-column prop="F_UnitPrice" label="单价" ></el-table-column>
                <el-table-column prop="F_Unit" label="单位" ></el-table-column>
                <el-table-column prop="F_MiniQuantity" label="最低数量"></el-table-column>
                <el-table-column prop="F_MiniAmount" label="最低费用"></el-table-column>
                <el-table-column width="280" label="备注">
                  <template slot-scope="scope">
                    {{ scope.row.F_ExpensesDescription? scope.row.F_ExpensesDescription : '-' }}
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px" v-if="textareaPod">
                <span style="font-size: 14px; margin-bottom: 5px;">费用备注：</span>
                <div class="pubFeeRemark">{{ textareaPod }}</div> 
              </div> 
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="制作报价单" name="2">
          <div class="model-create-item">
            <div class="create-title">货物信息</div>
            <p>体积比：{{ this.lclInfo.F_VolumeRatio? '1:' + this.lclInfo.F_VolumeRatio : '--' }}</p>
            <p v-if="this.lclInfo.F_RTLowerLimit == '' && this.lclInfo.F_RTUpperLimit == ''">RT范围：--</p>
            <p v-else-if="this.lclInfo.F_RTLowerLimit !== '' && this.lclInfo.F_RTUpperLimit == ''">
              RT范围：{{ this.lclInfo.F_RTLowerLimit }}＜RT
            </p>
            <p v-else-if="this.lclInfo.F_RTLowerLimit == '' && this.lclInfo.F_RTUpperLimit !== ''">RT范围：
              RT≤{{ this.lclInfo.F_RTUpperLimit }}
            </p>
            <p v-else-if="this.lclInfo.F_RTLowerLimit !== '' && this.lclInfo.F_RTUpperLimit !== ''">
              RT范围：{{ this.lclInfo.F_RTLowerLimit }}＜RT≤{{ this.lclInfo.F_RTUpperLimit }}
            </p>
            <p v-else>RT范围：--</p>
          </div>

          <div class="model-create-input" id="term">
            <div class="landFlex">
              <div class="input-item">
                <el-checkbox v-model="isLandComputed" @change="handlerLandComputed">是否包含陆运费</el-checkbox>
              </div>
              <div class="input-item" v-if="isLandComputed">
                <el-cascader
                    ref="cascader"
                    v-model="landAreaData.areaName"
                    placeholder="请选择提送地"
                    clearable
                    filterable
                    :options="areaInfoArr"
                    @change="hanlderChangeArea"
                  >
                  </el-cascader>
              </div>
              <div class="input-item" v-if="isLandComputed">
                <el-input 
                  type="number" 
                  clearable 
                  v-model="isPostcode" 
                  placeholder="请输入邮编">
                </el-input>
              </div>
              <div class="input-item" style="margin-top: -1px">
                <el-checkbox v-model="isClearance" @change="handlerClearanceComputed">是否包含报关费</el-checkbox>
              </div>
              <div class="input-item">
                <span style="margin-top: 5px">运输条款：</span>
                <el-select @change="getImporTermStatus" v-model="isTerm" class="term">
                  <el-option
                    v-for="item in importTerm"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select> 
              </div>
            </div>
          </div>

          <div class="model-create-input" id="query">
            <div class="input-item">
              <el-input 
                type="number" 
                placeholder="请输入件数" 
                v-model.number="quotation.pcs" 
                class="input-with-select"
                onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
                <template slot="append">PKG(S)</template>
                <template slot="prepend">件数PCS</template>
              </el-input>
            </div>
            <div class="input-item">
              <el-input 
                placeholder="请输入毛重" 
                v-model="quotation.kgs" 
                class="input-with-select"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              >
                <template slot="prepend">毛重KGS</template>
              </el-input>
            </div>
            <div class="input-item">
              <el-input 
                placeholder="请输入体积" 
                v-model="quotation.cbm" 
                class="input-with-select"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              >
                <template slot="prepend">体积CBM</template>
              </el-input>
            </div>

            <div class="input-compute" style="margin-right: 10px">
              <el-button
                icon="el-icon-menu" 
                style="height: 30px; background: #0081ff" 
                type="primary" 
                size="mini" 
                @click="computedOecanFee"
              >
                计算
              </el-button>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="model-create-table">
            <div class="table-fee-item" v-if="isComputed">
              <div class="fee-info">
                <h4>海运费及附加费</h4>
                <span>合计：{{ freightTotal? freightTotal : '--' }}</span>
                <span>差额：{{ diffFreightTotal?  diffFreightTotal : '--' }}</span>
                <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550;">（费用仅供参考）</span>
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
                  <el-table-column prop="F_ExpenseCode" label="费用名称"></el-table-column>
                  <el-table-column prop="F_Currency" label="币种"></el-table-column>
                  <el-table-column label="单价" width="80">
                    <template slot-scope="scope">
                      {{ Number(scope.row.F_UnitPrice) < 0 ? '(' + Number(scope.row.F_UnitPrice) * -1 + ')' : scope.row.F_UnitPrice }} 
                    </template>
                  </el-table-column>
                  <el-table-column label="报价单价" width="90">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput">{{ Number(scope.row.F_QuotedPrice) < 0 ? '(' + Number(scope.row.F_QuotedPrice) * -1 + ')' : scope.row.F_QuotedPrice }}</span>
                        <el-input 
                          v-show="!scope.row.isInput" 
                          type="number"
                          v-model.number="scope.row.F_QuotedPrice"
                          placeholder="报价金额">
                        </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_Unit" label="单位"></el-table-column>
                  <el-table-column prop="F_Quantity" label="数量"></el-table-column>
                  <el-table-column label="金额" width="120">
                    <template slot-scope="scope">
                      {{ Number(scope.row.F_Amount) < 0 ? '(' + Number(scope.row.F_Amount) * -1 + ')' : scope.row.F_Amount }} 
                    </template>
                  </el-table-column>
                  <el-table-column label="报价金额" width="120">
                    <template slot-scope="scope">
                      {{ Number(scope.row.F_QuotedAmount) < 0 ? '(' + Number(scope.row.F_QuotedAmount) * -1 + ')' : scope.row.F_QuotedAmount }} </template>
                  </el-table-column>
                  <el-table-column prop="F_Balance" label="差额"></el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <span v-show="scope.row.isInput">{{ scope.row.F_Remark }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="text" 
                        v-model="scope.row.F_Remark"
                        placeholder="备注信息">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(1, scope.row, scope.$index)" v-show="scope.row.isEdit">
                        修改
                      </a>
                      <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                        @click="saveFeeData(1, scope.row, scope.$index)">
                        保存
                      </a>
                      <a style="color: #F56c6c; 
                        cursor: pointer" @click="deleteFeeData(1, scope.row.F_Id)">
                        删除
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
                        placeholder="费用名称"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select filterable v-model="addFee.F_Currency" placeholder="币种">
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
                        v-model="addFee.F_UnitPrice" 
                        placeholder="单价" 
                        @blur="onBlurComputed(1), addFee.F_UnitPrice=$event.target.value"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 100px" 
                        v-model="addFee.F_QuotedPrice" 
                        placeholder="报价单价"
                        @blur="onBlurComputed(1), addFee.F_QuotedPrice=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addFee.F_Unit" 
                        placeholder="单位" 
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
                        v-model="addFee.F_Quantity" 
                        placeholder="数量"
                        @blur="onBlurComputed(1), addFee.F_Quantity=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addFee.F_Amount" disabled placeholder="金额"></el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 110px" 
                        v-model="addFee.F_QuotedAmount" 
                        disabled
                        placeholder="报价金额">
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addFee.F_Balance" disabled placeholder="差额"></el-input>
                    </li>
                    <li>
                      <el-input style="width: 180px" v-model="addFee.F_Remark" placeholder="备注"></el-input>
                    </li>
                    <li>
                      <el-button
                        style="background:#0081ff"
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(1)">
                        新增
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark">
                  <span>备注信息</span>
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
            <template v-if="termText === 'FCA'">
              <div class="table-fee-item" v-if="isComputed">
                <div class="fee-info">
                  <h4>起运港费用</h4>
                  <span>合计：{{ polTotal?  polTotal : '--' }}</span>
                  <span>折算USD: {{ convertMiniTotal? convertMiniTotal + '（仅供参考）' : '--' }}</span>
                  <span>差额：{{ diffPolTotal? diffPolTotal : '--' }}</span>
                  <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550;">（费用仅供参考）</span>
                </div>
                <div class="order-table">
                  <el-table 
                    style="width: 100%" 
                    border 
                    :header-cell-style="{ background: '#f2f4f6' }"
                    :row-style="{ fontSize: '13px' }" 
                    :cell-style="{ whiteSpace: 'nowrap' }" 
                    :data="polFeeComputed"
                  >
                    <el-table-column label="费用名称">
                      <template slot-scope="scope">
                        {{scope.row.F_ExpenseCode}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="F_Currency" label="币种"></el-table-column>
                    <el-table-column prop="F_UnitPrice" label="单价"></el-table-column>
                    <el-table-column prop="F_QuotedPrice" label="报价单价">
                      <template slot-scope="scope">
                        <span v-if="scope.row.isInput">{{ scope.row.F_QuotedPrice }}</span>
                        <el-input 
                          v-show="!scope.row.isInput" 
                          type="number" 
                          v-model.number="scope.row.F_QuotedPrice"
                          placeholder="报价金额">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="F_Unit" label="单位"></el-table-column>
                    <el-table-column prop="F_Quantity" label="数量"></el-table-column>
                    <el-table-column prop="F_Amount" label="金额"></el-table-column>
                    <el-table-column prop="F_QuotedAmount" label="报价金额"></el-table-column>
                    <el-table-column width="70" prop="F_Balance" label="差额"></el-table-column>
                    <el-table-column width="280" label="备注">
                      <template slot-scope="scope">
                        <span v-if="scope.row.isInput">{{ scope.row.F_Remark }}</span>
                        <el-input 
                          v-show="!scope.row.isInput" 
                          type="text" 
                          v-model="scope.row.F_Remark"
                          placeholder="备注信息"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                          @click="editFeedata(2, scope.row, scope.$index)" v-show="scope.row.isEdit">
                          修改
                        </a>
                        <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                          @click="saveFeeData(2, scope.row, scope.$index)">
                          保存
                        </a>
                        <a style="color: #F56c6c; 
                          cursor: pointer" @click="deleteFeeData(2, scope.row.F_Id)">
                          删除
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
                          placeholder="费用名称">
                        </el-input>
                      </li>
                      <li>
                        <el-select
                          filterable 
                          v-model="addPolFee.F_Currency" 
                          placeholder="币种" 
                          @change="handlerChange">
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
                          v-model="addPolFee.F_UnitPrice" 
                          placeholder="单价" 
                          @blur="onBlurComputed(2), addPolFee.F_UnitPrice=$event.target.value"
                          oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-input 
                          style="width: 100px" 
                          v-model="addPolFee.F_QuotedPrice" 
                          placeholder="报价单价"
                          @blur="onBlurComputed(2), addPolFee.F_QuotedPrice=$event.target.value" 
                          oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-select 
                          v-model="addPolFee.F_Unit" 
                          placeholder="单位" 
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
                          v-model="addPolFee.F_Quantity" 
                          placeholder="数量"
                          @blur="onBlurComputed(2), addPolFee.F_Quantity=$event.target.value" 
                          oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-input 
                          v-model="addPolFee.F_Amount" 
                          disabled 
                          placeholder="金额">
                        </el-input>
                      </li>
                      <li>
                        <el-input 
                          tyle="width: 110px" 
                          v-model="addPolFee.F_QuotedAmount" 
                          disabled
                          placeholder="报价金额">
                        </el-input>
                      </li>
                      <li>
                        <el-input 
                          v-model="addPolFee.F_Balance" 
                          disabled 
                          placeholder="差额">
                        </el-input>
                      </li>
                      <li>
                        <el-input 
                          style="width: 180px" 
                          v-model="addPolFee.F_Remark" 
                          placeholder="备注">
                        </el-input>
                      </li>
                      <li>
                        <el-button
                          style="background: #0081ff" 
                          type="primary" 
                          size="mini" 
                          @click="addFeeList(2)">新增
                        </el-button>
                      </li>
                    </ul>
                  </div>
                  <div class="order-mark">
                    <span>备注信息</span>
                    <el-input 
                      type="textarea" 
                      :rows="6" 
                      v-model="textareaPol">
                    </el-input>
                  </div>
                </div>
              </div>
            </template>
           
            <!-- 目的港费用 -->
            <div class="table-fee-item" v-if="isComputed">
              <div class="fee-info">
                <h4>目的港费用</h4>
                <span>合计：{{ podTotal? podTotal : '--' }}</span>
                <span>类型合计：{{ typeTotal? typeTotal : '--' }}</span>
                <span>差额：{{ diffPodTotal? diffPodTotal : '--' }}</span>
                <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550;">（费用仅供参考）</span>
              </div>
              <div class="order-table">
                <el-table 
                  style="width: 100%" 
                  border 
                  :header-cell-style="{ background: '#f2f4f6' }"
                  :row-style="{ fontSize: '13px' }" 
                  :cell-style="{ whiteSpace: 'nowrap' }" 
                  :data="podFeeComputed">
                  <el-table-column width="150" label="费用类型">
                    <template slot-scope="scope">
                      {{ scope.row.ExpenseTypeName? scope.row.ExpenseTypeName : '--' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_ExpenseCode" label="费用名称"></el-table-column>
                  <el-table-column prop="F_Currency" label="币种"></el-table-column>
                  <el-table-column prop="F_UnitPrice" label="单价"></el-table-column>
                  <el-table-column prop="F_QuotedPrice" label="报价单价">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isInput">{{ scope.row.F_QuotedPrice }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="number" 
                        v-model.number="scope.row.F_QuotedPrice"
                        placeholder="报价金额">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="F_Unit" label="单位"></el-table-column>
                  <el-table-column prop="F_Quantity" label="数量"></el-table-column>
                  <el-table-column prop="F_Amount" label="金额"></el-table-column>
                  <el-table-column prop="F_QuotedAmount" width="120" label="报价金额"></el-table-column>
                  <el-table-column prop="F_Balance" label="差额"></el-table-column>
                  <el-table-column width="280" prop="F_Remark" label="备注">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isEdit">{{ scope.row.F_Remark }}</span>
                      <el-input 
                        v-show="!scope.row.isInput" 
                        type="text" 
                        v-model="scope.row.F_Remark"
                        placeholder="备注信息">
                      </el-input>
                      <p style="display: none">{{ scope.row.F_IsCalculation }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                        @click="editFeedata(3, scope.row, scope.$index)" v-show="scope.row.isEdit">
                        修改
                      </a>
                      <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                        @click="saveFeeData(3, scope.row, scope.$index)">
                        保存
                      </a>
                      <a style="color: #F56c6c; 
                        cursor: pointer" @click="deleteFeeData(3, scope.row.F_Id)">
                        删除
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="order-edit">
                  <ul>
                    <li>
                      <el-select 
                        v-model="addPodFee.ExpenseTypeName" 
                        @change="getTypePodFee" 
                        placeholder="费用类型"
                        style="width: 104px" 
                        ref="selectLabel"
                      >
                        <el-option 
                          v-for="t in typePodArr" 
                          :key="t.F_ItemDetailId" 
                          :value="t.F_ItemValue"
                          :label="t.F_ItemName">
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-input 
                        v-model="addPodFee.F_ExpenseCode" 
                        style="width: 180px" 
                        placeholder="费用名称"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select filterable v-model="addPodFee.F_Currency" placeholder="币种">
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
                        v-model="addPodFee.F_UnitPrice" 
                        placeholder="单价" 
                        @blur="onBlurComputed(3), addPodFee.F_UnitPrice=$event.target.value"
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 100px" 
                        v-model="addPodFee.F_QuotedPrice" 
                        placeholder="报价单价"
                        @blur="onBlurComputed(3), addPodFee.F_QuotedPrice=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-select 
                        v-model="addPodFee.F_Unit" 
                        placeholder="单位" 
                        style="width: 100px">
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
                        v-model="addPodFee.F_Quantity" 
                        placeholder="数量"
                        @blur="onBlurComputed(3), addPodFee.F_Quantity=$event.target.value" 
                        oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                      >
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addPodFee.F_Amount" disabled placeholder="金额"></el-input>
                    </li>
                    <li>
                      <el-input 
                        style="width: 110px" 
                        v-model="addPodFee.F_QuotedAmount" 
                        disabled
                        placeholder="报价金额">
                      </el-input>
                    </li>
                    <li>
                      <el-input v-model="addPodFee.F_Balance" disabled placeholder="差额"></el-input>
                    </li>
                    <li>
                      <el-input style="width: 180px" v-model="addPodFee.F_Remark" placeholder="备注"></el-input>
                    </li>
                    <li>
                      <el-button
                        style="background: #0081ff" 
                        type="primary" 
                        size="mini" 
                        @click="addFeeList(3)">
                        新增
                      </el-button>
                    </li>
                  </ul>
                </div>
                <div class="order-mark">
                  <span>备注信息</span>
                  <el-input type="textarea" :rows="6" v-model="textareaPod">
                  </el-input>
                </div>
              </div>
            </div>

            <!-- 陆运拖车费 -->
            <template v-if="isPostcode || landAreaData.areaName">
              <div class="table-fee-item" v-if="isComputed">
                <div class="fee-info">
                  <h4>陆运拖车费用</h4>
                  <span>合计：{{ landTotal? landTotal : '--' }}</span>
                  <span>差额：{{ diffLandTotal? diffLandTotal : '--' }}</span>
                  <span style="margin: 0 0 0 auto; color: #f56c6c; font-weight: 550;">（费用仅供参考）</span>
                </div>
                <div class="order-table">
                  <el-table 
                    style="width: 100%" 
                    border 
                    :header-cell-style="{ background: '#f2f4f6' }"
                    :row-style="{ fontSize: '13px' }" 
                    :cell-style="{ whiteSpace: 'nowrap' }" 
                    :data="landComputed">
                    <el-table-column prop="F_ExpenseCode" label="费用名称"></el-table-column>
                    <el-table-column prop="F_Currency" label="币种"></el-table-column>
                    <el-table-column prop="F_UnitPrice" label="单价"></el-table-column>
                    <el-table-column prop="F_QuotedPrice" label="报价单价">
                      <template slot-scope="scope">
                        <span v-if="scope.row.isInput">{{ scope.row.F_QuotedPrice }}</span>
                        <el-input 
                          v-show="!scope.row.isInput" 
                          type="number" 
                          v-model.number="scope.row.F_QuotedPrice"
                          placeholder="报价金额">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="F_Unit" label="单位"></el-table-column>
                    <el-table-column prop="F_Quantity" label="数量"></el-table-column>
                    <el-table-column prop="F_Amount" label="金额"></el-table-column>
                    <el-table-column prop="F_QuotedAmount" width="120" label="报价金额"></el-table-column>
                    <el-table-column prop="F_Balance" label="差额"></el-table-column>
                    <el-table-column width="280" prop="F_Remark" label="备注">
                      <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.F_Remark }}</span>
                        <el-input 
                          v-show="!scope.row.isInput" 
                          type="text" 
                          v-model="scope.row.F_Remark"
                          placeholder="备注信息">
                        </el-input>
                        <p style="display: none">{{ scope.row.F_IsCalculation }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <a style="color: #409EFF; cursor: pointer; margin-right: 5px;"
                          @click="editFeedata(4, scope.row, scope.$index)" v-show="scope.row.isEdit">
                          修改
                        </a>
                        <a style="color: #67C23A; cursor: pointer; margin-right: 5px;" v-show="!scope.row.isEdit"
                          @click="saveFeeData(4, scope.row, scope.$index)">
                          保存
                        </a>
                        <a style="color: #F56c6c; 
                          cursor: pointer" @click="deleteFeeData(4, scope.row.F_Id)">
                          删除
                        </a>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="order-edit">
                    <ul>
                      <li>
                        <el-input 
                          v-model="addLandFee.F_ExpenseCode" 
                          style="width: 180px" 
                          placeholder="费用名称"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-select filterable v-model="addLandFee.F_Currency" placeholder="币种">
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
                          v-model="addLandFee.F_UnitPrice" 
                          placeholder="单价" 
                          @blur="onBlurComputed(4), addLandFee.F_UnitPrice=$event.target.value"
                          oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-input 
                          style="width: 100px" 
                          v-model="addLandFee.F_QuotedPrice" 
                          placeholder="报价单价"
                          @blur="onBlurComputed(4), addLandFee.F_QuotedPrice=$event.target.value" 
                          oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-select 
                          v-model="addLandFee.F_Unit" 
                          placeholder="单位" 
                          style="width: 100px">
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
                          v-model="addLandFee.F_Quantity" 
                          placeholder="数量"
                          @blur="onBlurComputed(4), addLandFee.F_Quantity=$event.target.value" 
                          oninput="return value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
                        >
                        </el-input>
                      </li>
                      <li>
                        <el-input v-model="addLandFee.F_Amount" disabled placeholder="金额"></el-input>
                      </li>
                      <li>
                        <el-input 
                          style="width: 110px" 
                          v-model="addLandFee.F_QuotedAmount" 
                          disabled
                          placeholder="报价金额">
                        </el-input>
                      </li>
                      <li>
                        <el-input v-model="addLandFee.F_Balance" disabled placeholder="差额"></el-input>
                      </li>
                      <li>
                        <el-input style="width: 180px" v-model="addLandFee.F_Remark" placeholder="备注"></el-input>
                      </li>
                      <li>
                        <el-button
                          style="background: #0081ff" 
                          type="primary" 
                          size="mini" 
                          @click="addFeeList(4)">
                          新增
                        </el-button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="order-btn">
            <el-button icon="el-icon-s-order" style="background: #0081ff; color: #fff" @click="savePriceData">保存报价单</el-button>
            <el-button icon="el-icon-s-data"  style="background: #0081ff; color: #fff" @click="exportExcelFile">导出Excel报价单</el-button>
            <el-button icon="el-icon-s-claim"  style="background: #0081ff; color: #fff" @click="exportPdfFile">导出PDF报价单</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <p style="font-size: 13px; color: #909399; margin-top: 10px;">
        以上报价和计费结果仅供参考，请联系我司人员以最终报价为准。
      </p>
    </el-dialog>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
let _ = require('lodash')
import { nanoid } from 'nanoid'
import { multiply, subtract} from '@/utils/decimal.js'
import areaJson from '@/assets/data/area.json'
export default {
  name: 'DataIModel',
  data() {
    return {
      isClearance: 0,
      clearanceText: false,
      isTerm: 1,
      termText: 'FOB',
      isLandNum: 0,
      landAreaData: { areaName: '' },
      areaInfoArr: [],
      isPostcode: '',
      isLandComputed: false,
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
      landComputed: [],
      freightTotal: '', //海运费总计
      diffFreightTotal: '', //海运差额总计
      polTotal: '',//起运港总计
      diffPolTotal: '', // 起运差额总计
      podTotal: '',//目的港总计
      diffPodTotal: '', //目的港差额总计
      landTotal: '', //散货陆运费总计
      diffLandTotal: '', //散货陆运费差额总计
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
        ExpenseTypeName: '',
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
      addLandFee: {
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
      mergeArr: ['F_DeparturePortChargeDetailsId'], // 表格中的列名,
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
      isComputed: false,
      pdfAreaName: '',
      excelAreaId: '',
      importTerm: [{
        label: 'FOB',
        id: 1
      }, {
        label: 'FCA',
        id: 2
      }]
    }
  },

  mounted() {
    this.areaInfoArr = areaJson

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

      if (this.storeId) {
        this.getStoreDataInfo(this.storeId)
      }else {
        return
      }
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
    }
  },

  methods: {
    handlerLandComputed(val) {
      this.isLandNum = val? 1 : 0
      if(!val) {
        this.landAreaData.areaName = ''
        this.isPostcode = ''
      }
    },

    handlerClearanceComputed(val) {
      val? this.clearanceText = 1 : this.clearanceText = 0
      if(this.isComputed) {
        this.getComputedFeeData()
      }
    },

    hanlderChangeArea(value) {
      this.landAreaData.areaName = value? value : ''
    },

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
          message: '此币种暂无对美金汇率，请重新设置',
          type: 'error',
          duration: 2000
        })
      }
    },

    getTypePodFee(val) {
      this.addPodFee.F_ExpenseType = val
      this.$nextTick(() => {
        this.addPodFee.ExpenseTypeName = this.$refs.selectLabel.selectedLabel
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
          message: '请输入正确件数',
          type: 'error',
          duration: 2000
        })
      }else if(this.quotation.kgs === '') {
        this.$message({
          message: '请输入正确重量',
          type: 'error',
          duration: 2000
        })
      } else if(this.quotation.cbm === '') {
        this.$message({
          message: '请输入正确体积',
          type: 'error',
          duration: 2000
        })
      } else if(this.isLandComputed && (this.landAreaData.areaName == '' && this.isPostcode == '')) {
        this.$message({
          message: '请选择提货地或邮编',
          type: 'error',
          duration: 2000
        })
      } else {
        if(this.lclInfo.F_RTUpperLimit || this.lclInfo.F_RTLowerLimit) {
          let rtNumber = this.volumeRatio? this.quotation.kgs / this.volumeRatio : this.quotation.kgs / 1000
          if(rtNumber > Number(this.quotation.cbm) && (rtNumber > Number(this.lclInfo.F_RTUpperLimit) || rtNumber < Number(this.lclInfo.F_RTLowerLimit) )) {
            this.$message({
              message: '请输入正确的RT范围',
              type: 'error',
              duration: 2000
            })  
          }else if(rtNumber < Number(this.quotation.cbm) && (this.quotation.cbm > Number(this.lclInfo.F_RTUpperLimit) || this.quotation.cbm < Number(this.lclInfo.F_RTLowerLimit) )) {
            this.$message({
              message: '请输入正确的RT范围',
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

    // 防抖计算
    debounceMethods: _.debounce(function() {
      this.getComputedFeeData()
    },350),

    async getComputedFeeData() {
      const { data: res } = await this.$http.post('imlcl/calQuotation', {
        FreightRateId: this.dataId,
        Quantity: this.quotation.pcs,
        GrossWeight: this.quotation.kgs,
        Volume: this.quotation.cbm,
        IsLand: this.isLandNum,
        AreaId: this.landAreaData.areaName[2],
        PostCode: this.isPostcode,
        TransitClause: this.termText, //运输条款
        IsCustomsCharges: this.clearanceText //是否包含报关费
      })
      try {
        if (res.code === 200) {
          this.$message({
            message: '费用计算完毕',
            type: 'success',
            duration: 1500
          })

          this.textareaFreight = res.data.freightDesc
          this.textareaPol = res.data.fromDesc
          this.textareaPod = res.data.toDesc

          this.polMiniCharge = res.data.F_MinimumChargeUsd
          this.pdfAreaName = res.data.DeliveryAreaName
          this.excelAreaId = res.data.AreaId

          this.isComputed = true

          // 海运费用
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
            this.diffPodTotal = '--'
            this.typeTotal = '--'
          }

          // 陆运费用
          this.landComputed = res.data.landFreight
          this.landComputed.forEach(item => {
            this.$set(item, 'isInput', true)
            this.$set(item, 'isEdit', true)
          })

          if(this.landComputed.length !== 0) {
            this.landTotal = this.getComputedTotal(this.landComputed)[0]
            this.diffLandTotal = this.getBalanceComputed(this.landComputed)
          }else {
            this.landTotal = '--'
            this.diffLandTotal = '--'
          }

          this.getPdfParams(
            this.lclInfo, 
            this.polFeeComputed, 
            this.podFeeComputed, 
            this.freightComputed, 
            this.quotation.pcs, 
            this.quotation.kgs, 
            this.quotation.cbm, 
            this.freightTotal, 
            this.polTotal, 
            this.podTotal, 
            this.textareaFreight, 
            this.textareaPol, 
            this.textareaPod, 
            this.typeTotal, 
            this.convertTotal, 
            this.type, 
            this.polMiniCharge, 
            this.pdfAreaName, 
            this.isLandNum, 
            this.isPostcode,
            this.termText,
            this.clearanceText,
            this.landComputed,
            this.landTotal,
          )
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
      this.diffFreightTotal = ''
      this.diffPolTotal = ''
      this.diffPodTotal = ''
      this.typeTotal = ''
      this.polMiniCharge = ''
      this.textareaFreight = ''
      this.textareaPol = ''
      this.textareaPod = ''
      this.isComputed = false
      this.isPostcode = ''
      this.isLandComputed = false
      this.landAreaData.areaName = ''
      this.clearanceText = 0
      this.isClearance = false
      this.termText = 'FOB'
      this.isTerm = 1
      this.activeName = '1'

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
      },

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

      this.addLandFee = {
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

      this.activeName = '1'
    },


    // 导出pdf
    async exportPdfFile() {
      if (this.podFeeComputed.length === 0 && this.polFeeComputed.length === 0 && this.freightComputed.length === 0) {
        this.$message({
          message: '请先制作报价单',
          type: 'warning',
          duration: 2000
        })
      } else {
        const {data: res} = await this.$http.post('login/isLogin')
        if(res.code == 200) {
          const routeUrl = this.$router.resolve({
            path: '/PdfTemplate',
          })
          this.getPdfParams(
            this.lclInfo, 
            this.polFeeComputed, 
            this.podFeeComputed, 
            this.freightComputed, 
            this.quotation.pcs, 
            this.quotation.kgs, 
            this.quotation.cbm, 
            this.freightTotal, 
            this.polTotal, 
            this.podTotal, 
            this.textareaFreight, 
            this.textareaPol, 
            this.textareaPod, 
            this.typeTotal, 
            this.convertTotal, 
            this.type, 
            this.polMiniCharge,
            this.pdfAreaName, 
            this.isLandNum, 
            this.isPostcode,
            this.termText,
            this.clearanceText,
            this.landComputed,
            this.landTotal,
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

    getPdfParams(lclInfo, polFee, podFee, freight, pcs, kgs, cbm, freightTotal, polTotal, podTotal, textareaFreight, textareaPol, textareaPod, typeTotal, convertTotal, type, miniCharge, areaText, landNum, postCode, termText,clearanceText, landFee, landTotal) 
      {
        let pdfData = { lclInfo, polFee, podFee, freight, pcs, kgs, cbm, freightTotal, polTotal, podTotal, textareaFreight, textareaPol, textareaPod, typeTotal, convertTotal, type, miniCharge, areaText, landNum, postCode, termText,clearanceText, landFee, landTotal}
        window.sessionStorage.setItem('pdfData', JSON.stringify(pdfData))
      },

    // 导出excel
    async exportExcelFile() {
      if (this.podFeeComputed.length === 0 && this.polFeeComputed.length === 0 && this.freightComputed === 0) {
        this.$message({
          message: '请先制作报价单',
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
          ToTotal: this.podTotal + ' ' + '费用类型：' + this.typeTotal,
          ToConvert: "USD" + this.convertMiniTotal,
          AreaId: this.excelAreaId,
          IsLand: this.isLandNum,
          TransitClause: this.termText,
          IsCustomsCharges: this.clearanceText,
          TrailerChargesTotal: this.landTotal? this.landTotal : '',
          LandFreight: this.landComputed? this.landComputed : []
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

    // 保存报价
    async savePriceData() {
      if (this.podFeeComputed.length === 0 && this.polFeeComputed.length === 0 && this.freightComputed.length === 0) {
        this.$message({
          message: '请先制作报价单',
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
          CovertTotal: this.convertMiniTotal,
          AreaId: this.excelAreaId,
          IsLand: this.isLandNum,
          TransitClause: this.termText, //运输条款
          IsCustomsCharges: this.clearanceText, //是否包含报关
          TrailerChargesTotal: this.landTotal? this.landTotal : '',
          LandFreight: this.landComputed? this.landComputed : []
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

    // 获取运输条款
    getImporTermStatus(val) {
      val === 1? this.termText = 'FOB' : this.termText = 'FCA'
      if(this.isComputed) {
        this.getComputedFeeData()
      }
    },

    // 新增费用
    addFeeList(type) {
      if (type == 1) {
        const { F_ExpenseCode, F_Currency, F_UnitPrice, F_QuotedPrice, F_Unit, F_Quantity } = this.addFee
        if (!F_ExpenseCode.trim()) {
          this.$message({
            message: '请填写海运费名称！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Currency) {
          this.$message({
            message: '请选择币种！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_UnitPrice) {
          this.$message({
            message: '请填写单价！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_QuotedPrice) {
          this.$message({
            message: '请填写报价单价！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: '请选择单位！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_Quantity) {
          this.$message({
            message: '请填写数量！',
            type: 'error',
            duration: 2000
          })
        } else {
          this.freightComputed.push(this.addFee)
          this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
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
            message: '请填写起运港费用名称！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Currency) {
          this.$message({
            message: '请选择币种！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: '请选择单位！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_UnitPrice) {
          this.$message({
            message: '请填写单价！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_QuotedPrice) {
          this.$message({
            message: '请填写报价单价！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_Quantity) {
          this.$message({
            message: '请填写数量！',
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
            message: '请填写目的港费用名称！',
            type: 'error',
            duration: 2000
          })
        }else if(!ExpenseTypeName) {
          this.$message({
            message: '请选择类型名称！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_Currency) {
          this.$message({
            message: '请选择币种！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: '请选择单位！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_UnitPrice) {
          this.$message({
            message: '请填写单价！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_QuotedPrice) {
          this.$message({
            message: '请填写报价单价！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_Quantity) {
          this.$message({
            message: '请填写数量！',
            type: 'error',
            duration: 2000
          })
        } else {
          this.podFeeComputed.push(this.addPodFee)
          this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
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
      }else {
        const { F_ExpenseCode, F_Currency, F_UnitPrice, F_QuotedPrice, F_Unit, F_Quantity } = this.addLandFee
        if (!F_ExpenseCode.trim()) {
          this.$message({
            message: '请填写陆运拖车费用名称！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_Currency) {
          this.$message({
            message: '请选择币种！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_Unit) {
          this.$message({
            message: '请选择单位！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_UnitPrice) {
          this.$message({
            message: '请填写单价！',
            type: 'error',
            duration: 2000
          })
        }else if(!F_QuotedPrice) {
          this.$message({
            message: '请填写报价单价！',
            type: 'error',
            duration: 2000
          })
        } else if(!F_Quantity) {
          this.$message({
            message: '请填写数量！',
            type: 'error',
            duration: 2000
          })
        } else {
          this.landComputed.push(this.addLandFee)
          this.landTotal = this.getComputedTotal(this.landComputed)[0]
          this.diffLandTotal = this.getBalanceComputed(this.landComputed)
          this.addLandFee = {
            F_Id: nanoid(),
            F_ExpenseCode: '',
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
      this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge, this.pdfAreaName, this.isLandNum, this.isPostcode, this.termText, this.clearanceText, this.landComputed, this.landTotal)
    },

    // 编辑费用
    editFeedata(type, row, index) {
      row.isInput = !row.isInput
      row.isEdit = !row.isEdit
    },

    saveFeeData(type, row, index) {
      if (row.F_QuotedPrice === '') {
        this.$message({
          message: '报价单价不能为空',
          type: 'error',
          duration: 1500
        })
      } else {
        row.isInput = !row.isInput
        row.isEdit = !row.isEdit

        row.F_QuotedAmount = multiply(Number(row.F_QuotedPrice), Number(row.F_Quantity))
        row.F_Balance = subtract(Number(row.F_QuotedAmount), Number(row.F_Amount))
        if (type == 1) {
          this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
          this.diffFreightTotal = this.getBalanceComputed(this.freightComputed)
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge, this.pdfAreaName, this.isLandNum, this.isPostcode, this.termText, this.clearanceText, this.landComputed, this.landTotal)
        } else if (type == 2) {
          this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
          this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
          this.diffPolTotal = this.getBalanceComputed(this.polFeeComputed) 
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge, this.pdfAreaName, this.isLandNum, this.isPostcode, this.termText, this.clearanceText, this.landComputed, this.landTotal)
        } else if (type == 3) {
          this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
          this.diffPodTotal = this.getBalanceComputed(this.podFeeComputed)
          this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge, this.pdfAreaName, this.isLandNum, this.isPostcode, this.termText, this.clearanceText, this.landComputed, this.landTotal)
        }else {
          this.landTotal = this.getComputedTotal(this.landComputed)[0]
          this.diffLandTotal = this.getBalanceComputed(this.landComputed)
          this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge, this.pdfAreaName, this.isLandNum, this.isPostcode, this.termText, this.clearanceText, this.landComputed, this.landTotal)
        }
      }
    },

    // 删除费用
    deleteFeeData(type, id) {
      this.$alert('此操作将永久删除该费用, 是否继续?', '提示',{
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type == 1) {
          this.freightComputed = this.freightComputed.filter(item => item.F_Id !== id)
          if(this.freightComputed.length !== 0) {
            this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
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
            this.diffPolTotal = this.getBalanceComputed(this.podFeeComputed)
            this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
          }else {
            this.podTotal = '--'
            this.diffPolTotal = '--'
            this.typeTotal = '--'
          }
        }else {
          this.landComputed = this.landComputed.filter(item => item.F_Id !== id)
          if(this.landComputed.length !== 0) {
            this.landTotal = this.getComputedTotal(this.landComputed)[0]
            this.diffLandTotal = this.getBalanceComputed(this.landComputed)
          }else {
            this.landTotal = '--'
            this.diffLandTotal = '--'
          }
        }
        this.getPdfParams(this.lclInfo, this.polFeeComputed, this.podFeeComputed, this.freightComputed, this.quotation.pcs, this.quotation.kgs, this.quotation.cbm, this.freightTotal, this.polTotal, this.podTotal, this.textareaFreight, this.textareaPol, this.textareaPod, this.typeTotal, this.convertTotal, this.type, this.polMiniCharge, this.pdfAreaName, this.isLandNum, this.isPostcode, this.termText, this.clearanceText, this.landComputed, this.landTotal)
      })
      .catch(error => {
        return error
      })
    },

    // 失去焦点计算费用
    onBlurComputed(type) {
      if (type == 1) {
        if (this.addFee.F_UnitPrice && this.addFee.F_QuotedPrice && this.addFee.F_Quantity) {
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
      } else if(type == 3) {
        if (this.addPodFee.F_UnitPrice !== '' && this.addPodFee.F_QuotedPrice !== '' && this.addPodFee.F_Quantity !== '') {
          this.addPodFee.F_Amount = this.addPodFee.F_UnitPrice * this.addPodFee.F_Quantity //金额
          this.addPodFee.F_QuotedAmount = this.addPodFee.F_QuotedPrice * this.addPodFee.F_Quantity //报价金额
          this.addPodFee.F_Balance = this.addPodFee.F_QuotedAmount - this.addPodFee.F_Amount
        } else {
          return
        }
      }else {
        if (this.addLandFee.F_UnitPrice !== '' && this.addLandFee.F_QuotedPrice !== '' && this.addLandFee.F_Quantity !== '') {
          this.addLandFee.F_Amount = this.addLandFee.F_UnitPrice * this.addLandFee.F_Quantity //金额
          this.addLandFee.F_QuotedAmount = this.addLandFee.F_QuotedPrice * this.addLandFee.F_Quantity //报价金额
          this.addLandFee.F_Balance = this.addLandFee.F_QuotedAmount - this.addLandFee.F_Amount
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
      let newArr = _.groupBy(dataArr, 'ExpenseTypeName')
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
          sum < 0 ? priceTotal += key + ' ' + '(' + sum * -1 + ')' + '+' : priceTotal += key + ' ' + sum.toFixed(2) + '+'
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
        font-size: 13px;
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
    // justify-content: space-between;
    align-items: center;

    .input-item {
      margin-right: 20px;

      /deep/ .el-input__inner {
        line-height: 1px !important;
      }
    }

    .landFlex {
      display: flex;
      align-items: center;

      .input-item {
        margin-right: 20px;
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

/deep/ .term .el-input {
  width: 200px;
}

/deep/ .input-with-select .el-input-group__append {
  background-color: #fff;
  font-size: 13px;
}

/deep/ .input-with-select .el-input-group__prepend {
  font-size: 13px;
}

/deep/ #term .el-input__inner {
  width: 200px;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  padding: 0 5px;
}

/deep/ #query .el-input__inner {
  width: 260px;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  padding: 0 5px;
}

/deep/ .el-input__suffix-inner {
  //margin-top: -5px;
  line-height: 38px;
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