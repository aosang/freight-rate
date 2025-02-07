<template>
	<view class="myTab">
		<view class="myTab-title">
			<text v-for="tab in tabArr" :key="tab.id" @click="changeTab(tab.id)" :class="active === tab.id? 'active': ''">
				{{tab.name}}
			</text>
		</view>
		<view v-show="active === 0">
			<view class="tab-ocean" v-for="f in freightComputed" :key="f.F_Id">
				<view class="tabpub-title">
					{{applicationLocal == "zh-Hans"? f.F_ExpenseCodeName : f.F_ExpenseCodeEng}}
				</view>
				<view class="ocean-table">
					<view class="ocean-item">
						20GP&nbsp;&nbsp;{{f.F_20GP? f.F_20GP : '--'}}
					</view>
					<view class="ocean-item">
						40GP&nbsp;&nbsp;{{f.F_40GP? f.F_40GP : '--'}}
					</view>
					<view class="ocean-item">
						40HQ&nbsp;&nbsp;{{f.F_40HQ? f.F_40HQ : '--'}}
					</view>
					<view class="ocean-item">
						45HQ&nbsp;&nbsp;{{f.F_45HQ? f.F_45HQ : '--'}}
					</view>
					<view class="ocean-item">
						40NOR&nbsp;&nbsp;{{f.F_40NOR? f.F_40NOR : '--'}}
					</view>
					<view class="ocean-item">
						币种&nbsp;&nbsp;{{f.F_Currency? f.F_Currency : '--'}}
					</view>
					<view class="ocean-item">
						单位&nbsp;&nbsp;{{f.F_Unit? f.F_Unit : '--'}}
					</view>
					<view class="ocean-item">
						单票&nbsp;&nbsp;{{f.F_SingleVote? f.F_SingleVote : '--'}}
					</view>
				</view>
			</view>
			
			<!-- 起运港费用 -->
			<view class="tab-ocean">
				<view class="tabpub-title">{{$t('pub.pol')}}</view>
				<view class="oceanfee-item" v-for="pol in polFeeComputed" :key="pol.F_id">
					<view class="ocean-inner">
						<uni-table ref="table" border stripe>
							<uni-tr>
								<uni-td><span>费用名称</span></uni-td>
								<uni-td><span>{{ applicationLocal =='zh-Hans'? pol.F_ExpenseCodeName : pol.F_ExpenseCodeEng }}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>20GP</span></uni-td>
								<uni-td><span>{{ pol.F_20GP? pol.F_20GP + pol.F_Currency : '-' }}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>40GP</span></uni-td>
								<uni-td><span>{{ pol.F_40GP? pol.F_40GP + pol.F_Currency : '-' }}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>40HQ</span></uni-td>
								<uni-td><span>{{ pol.F_40HQ? pol.F_40HQ + pol.F_Currency : '-' }}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>45HQ</span></uni-td>
								<uni-td><span>{{ pol.F_45HQ? pol.F_45HQ + pol.F_Currency : '-' }}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>40NOR</span></uni-td>
								<uni-td><span>{{pol.F_40NOR? pol.F_40NOR + pol.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>单票</span></uni-td>
								<uni-td><span>{{pol.F_SingleVote? pol.F_SingleVote + pol.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
						</uni-table>
					</view>
					<view class="oceanfee-mark" v-if="pol.F_Description">
						<view class="oceanfee-mark-word">
							{{pol.F_Description}}
						</view>
					</view>
				</view>
			</view>
			<view class="public-mark" v-if="lclInfo.FromDesc">
				{{$t('pub.freightRemark')}}：{{lclInfo.FromDesc}}
			</view>

			<!-- 目的港费用 -->
			<view class="tab-ocean">
				<view class="tabpub-title">{{$t('pub.pod')}}</view>
				<view class="oceanfee-item" v-for="pod in podFeeComputed" :key="pod.F_Id">
					<view class="ocean-inner">
						<uni-table ref="table" border stripe>
							<uni-tr>
								<uni-td><span>费用名称</span></uni-td>
								<uni-td><span>{{ applicationLocal =='zh-Hans'? pod.F_ExpenseCodeName : pod.F_ExpenseCodeEng }}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>20GP</span></uni-td>
								<uni-td><span>{{pod.F_20GP? pod.F_20GP + pod.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>40GP</span></uni-td>
								<uni-td><span>{{pod.F_40GP? pod.F_40GP + pod.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>40HQ</span></uni-td>
								<uni-td><span>{{pod.F_40HQ? pod.F_40HQ + pod.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>45HQ</span></uni-td>
								<uni-td><span>{{pod.F_45HQ? pod.F_45HQ + pod.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>40NOR</span></uni-td>
								<uni-td><span>{{pod.F_40NOR? pod.F_40NOR + pod.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td><span>单票</span></uni-td>
								<uni-td><span>{{pod.F_SingleVote? pod.F_SingleVote + pod.F_Currency : '-'}}</span></uni-td>
							</uni-tr>
						</uni-table>
					</view>
					<view class="oceanfee-mark" v-if="pod.F_ExpensesDescription">
						<text>{{pod.F_ExpensesDescription}}</text>
					</view>
				</view>
			</view>
			<view class="public-mark" v-if="lclInfo.ToDesc">
				{{$t('pub.podRemark')}}：{{lclInfo.ToDesc}}
			</view>
		</view>

		<view v-show="active === 1">
			<view class="ocean-computed">
				<text class="ocean-rquired">*{{$t('pub.tips')}}</text>
				<view class="ocean-computed-box" @click="addComputedHandler">
					<view class="computed-item">
						<text>{{packageInfo.num20gp? packageInfo.num20gp : '--'}}</text>
						<text>20GP</text>
					</view>
					<view class="computed-item">
						<text>{{packageInfo.num40gp? packageInfo.num40gp : '--'}}</text>
						<text>40GP</text>
					</view>
					<view class="computed-item">
						<text>{{packageInfo.num40hq? packageInfo.num40hq : '--'}}</text>
						<text>40HQ</text>
					</view>
					<view class="computed-item">
						<text>{{packageInfo.num45hq? packageInfo.num45hq : '--'}}</text>
						<text>45HQ</text>
					</view>
					<view class="computed-item">
						<text>{{packageInfo.num40nor? packageInfo.num40nor : '--'}}</text>
						<text>40NOR</text>
					</view>
				</view>
			</view>
			
			<!-- 海运费及附加费 -->
			<view class="computed-sea" v-if="isComputed && freightMerge.length !== 0">
				<view class="pub-top">
					<text>{{$t('pub.freight')}}</text>
					<view class="computed-price">
						<text>{{ freightTotal20GP? '20GP：' + freightTotal20GP : '' }}</text>
						<text>{{ freightTotal40GP? '40GP：' + freightTotal40GP : '' }}</text>
						<text>{{ freightTotal40HQ? '40HQ：' + freightTotal40HQ : '' }}</text>
						<text>{{ freightTotal45HQ? '45HQ：' + freightTotal45HQ : '' }}</text>
						<text>{{ freightTotal40NOR? '40NOR：' + freightTotal40NOR : '' }}</text>
						<text>{{ singlePriceFreight? '单票费用：' + singlePriceFreight : '' }}</text>
					</view>
					<!-- <view class="addFeeBtn" @click="addFeeDataHandler(1)">
						{{$t('pub.add')}}
					</view> -->
				</view>
				<!-- 海运及附加费 -->
				<view class="pub-item" v-if="freightMerge.length !== 0" v-for="f in freightMerge" :key="f.MyId">
					<view class="pub-item-title">{{f.F_ExpenseCode}}</view>
					<view class="pub-result">
						<text v-if="f.F_UnitPrice && f.F_Unit !== 'Bill'">
							{{Number(f.F_UnitPrice)<0? '(' + Number(f.F_UnitPrice) * -1 +')' : Number(f.F_UnitPrice)}}{{f.F_Currency}} * {{Number(f.F_Quantity) + '(' + f.F_Unit + ')'}} = {{Number(f.F_Amount)<0? '(' + Number(f.F_Amount) * -1 +')' : Number(f.F_Amount)}}{{f.F_Currency}}
						</text>
						<text v-else-if="f.F_UnitPrice && f.F_Unit === 'Bill'">
							★{{Number(f.F_SingleVote)<0? '(' + Number(f.F_SingleVote) * -1 +')' : Number(f.F_SingleVote)}}{{f.F_Currency}} * {{Number(f.F_Quantity) + '(' + f.F_Unit + ')'}} = {{Number(f.F_Amount)<0? '(' + Number(f.F_Amount) * -1 +')' : Number(f.F_Amount)}}{{f.F_Currency}}
						</text>
						<text v-else>(价格单询)&nbsp;&nbsp;{{f.F_Quantity + ' ' + '*' + ' ' + f.F_Unit}}</text>
					</view>
					<view class="pub-btn">
						<view class="iconfont icon-ashbin" @click="deleteFeeData(f.MyId, 1, f.F_Unit, f.F_ExpenseCode)"></view>
					</view>
					<view class="pub-mask" v-if="f.F_Remark">
						{{$t('pub.remark')}}:{{f.F_Remark}}
					</view>
				</view>
			</view>
			
			<!-- 起运港计算 -->
			<view class="computed-sea" v-if="isComputed && polMerge.length !== 0">
				<view class="pub-top">
					<text>{{$t('pub.pol')}}</text>
					<!-- <view class="addFeeBtn" @click="addFeeDataHandler(2)">{{$t('pub.add')}}</view> -->
					<view class="computed-price">
						<text>{{ polTotal20GP? '20GP：' + polTotal20GP : '' }}</text>
						<text>{{ polTotal40GP? '40GP：' + polTotal40GP : '' }}</text>
						<text>{{ polTotal40HQ? '40HQ：' + polTotal40HQ : '' }}</text>
						<text>{{ polTotal45HQ? '45HQ：' + polTotal45HQ : '' }}</text>
						<text>{{ polTotal40NOR? '40NOR：' + polTotal40NOR : '' }}</text>
						<text>{{ singlePricePol? '单票费用：' + singlePricePol : '' }}</text>
					</view>
				</view>
				<!-- 起运港 -->
				<view class="pub-item" v-if="polMerge.length !== 0" v-for="pol in polMerge" :key="pol.MyId">
					<view class="pub-item-title">{{ pol.F_ExpenseCode}}</view>
					<view class="pub-result">
						<text v-if="pol.F_UnitPrice && pol.F_Unit !== 'Bill'">
							{{Number(pol.F_UnitPrice)<0? '(' + Number(pol.F_UnitPrice) * -1 +')' : Number(pol.F_UnitPrice)}}{{pol.F_Currency}} * {{Number(pol.F_Quantity) + '(' + pol.F_Unit + ')'}} = {{Number(pol.F_Amount)<0? '(' + Number(pol.F_Amount) * -1 +')' : Number(pol.F_Amount)}}{{pol.F_Currency}}
						</text>
						<text v-else-if="pol.F_UnitPrice && pol.F_Unit === 'Bill'">
							★{{Number(pol.F_SingleVote) < 0?  '(' + Number(pol.F_SingleVote) * -1 +')' : pol.F_SingleVote}}{{pol.F_Currency}} * {{Number(pol.F_Quantity) + '(' + pol.F_Unit + ')'}} = {{Number(pol.F_Amount)<0? '(' + Number(pol.F_Amount) * -1 +')' : Number(pol.F_Amount)}}{{pol.F_Currency}}
						</text>
						<text v-else>(价格单询)&nbsp;&nbsp;{{pol.F_Quantity + ' ' + '*' + ' ' + pol.F_Unit}} </text>
					</view>
					<view class="pub-btn">
						<view class="iconfont icon-ashbin" @click="deleteFeeData(pol.MyId, 2, pol.F_Unit, pol.F_ExpenseCode)"></view>
					</view>
					<view class="pub-mask" v-if="pol.F_Remark">
						{{$t('pub.remark')}}:{{pol.F_Remark}}
					</view>
				</view>
			</view>
			
			<!-- 目的港计算 -->
			<view class="computed-sea" v-if="isComputed && podMerge.length !== 0">
				<view class="pub-top">
					<text>{{$t('pub.pod')}}</text>
					<!-- <view class="addFeeBtn" @click="addFeeDataHandler(3)">{{$t('pub.add')}}</view> -->
					<view>
						<view class="computed-price">
							<text>{{ podTotal20GP? '20GP：' + podTotal20GP : '' }}</text>
							<text>{{ podTotal40GP? '40GP：' + podTotal40GP : '' }}</text>
							<text>{{ podTotal40HQ? '40HQ：' + podTotal40HQ : '' }}</text>
							<text>{{ podTotal45HQ? '45HQ：' + podTotal45HQ : '' }}</text>
							<text>{{ podTotal40NOR? '40NOR：' + podTotal40NOR : '' }}</text>
							<text>{{ singlePricePod? '单票费用：' + singlePricePod : '' }}</text>
						</view>
					</view>
				</view>

				<!-- 目的港 -->
				<view class="pub-item" v-if="podMerge.length !== 0" v-for="pod in podMerge" :key="pod.MyId">
					<view class="pub-item-title">{{pod.F_ExpenseCode}}</view>
					<view class="pub-result">
						<text v-if="pod.F_UnitPrice && pod.F_Unit !== 'Bill'">
							{{Number(pod.F_UnitPrice)<0? '(' + Number(pod.F_UnitPrice) * -1 +')' : Number(pod.F_UnitPrice)}}{{pod.F_Currency}} * {{Number(pod.F_Quantity) + '(' + pod.F_Unit + ')'}} = {{Number(pod.F_Amount)<0? '(' + Number(pod.F_Amount) * -1 +')' : Number(pod.F_Amount)}}{{pod.F_Currency}}
						</text>
						<text v-else-if="pod.F_UnitPrice && pod.F_Unit === 'Bill'">
							★{{Number(pod.F_SingleVote)<0? '(' + Number(pod.F_SingleVote) * -1 +')' : Number(pod.F_SingleVote)}}{{pod.F_Currency}} * {{Number(pod.F_Quantity) + '(' + pod.F_Unit + ')'}} = {{Number(pod.F_Amount)<0? '(' + Number(pod.F_Amount) * -1 +')' : Number(pod.F_Amount)}}{{pod.F_Currency}}
						</text>
						<text v-else>(价格单询)&nbsp;&nbsp;{{pod.F_Quantity + ' ' + '*' + ' ' + pod.F_Unit}} </text>
					</view>
					<view class="pub-btn">
						<view class="iconfont icon-ashbin" @click="deleteFeeData(pod.MyId, 3, pod.F_Unit, pod.F_ExpenseCode)"></view>
					</view>
					<view class="pub-mask" v-if="pod.F_Remark">
						{{$t('pub.remark')}}:{{pod.F_Remark}}
					</view>
				</view>
			</view>
			<!-- 提示 -->
			<view
				class="pub-tips"
				v-if="isComputed"
				>
					<view>{{$t('pub.pricetip')}}</view>
					<view>{{$t('pub.fcltip')}}</view>	
			</view>

			<!-- 计算输入弹窗 -->
			<uni-popup type="center" 
				ref="addComputed" 
				mask-background-color="rgba(0,0,0,0.6)"
				:is-mask-click="false"
			>
				<view class="editAddComputed">
					<view class="custom">
						<view class="custom-top">
							<view class="iconfont icon-close closeBtn" @click="closeComputedWindow"></view>
							<view class="custom-top-title">{{$t('pub.cargo')}}</view>
							<view class="custom-top-subtitle">{{$t('pub.info')}}</view>
						</view>
						<!-- 输入框 -->
						<view class="custom-input">
							<view class="custom-item">
								<text>20GP</text>
								<uni-number-box 
									v-model="packageInfo.num20gp"
								/>
							</view>
							<view class="custom-item">
								<text>40GP</text>
								<uni-number-box 
									v-model="packageInfo.num40gp"
								/>
							</view>
							<view class="custom-item">
								<text>40HQ</text>
								<uni-number-box 
									v-model="packageInfo.num40hq"
								/>
							</view>
							<view class="custom-item">
								<text>45HQ</text>
								<uni-number-box 
									v-model="packageInfo.num45hq"
								/>
							</view>
							<view class="custom-item">
								<text>40NOR</text>
								<uni-number-box 
									v-model="packageInfo.num40nor"

								/>
							</view>
							<button type="primary" 
								class="custom-btn" 
								@click="getComputedData"
							>
								{{$t('pub.computed')}}
							</button>
						</view>
					</view>
				</view>
			</uni-popup>

			<!-- 新增费用 -->
			<uni-popup 
				type="center" 
				ref="addFeeItem" 
				mask-background-color="rgba(0,0,0,0.6)" 
				@maskClick="clearAddObj"
			>
				<view class="editAddComputed">
					<view class="custom">
						<view class="custom-top" style="padding-bottom: 20rpx;">
							<view class="iconfont icon-close closeBtn" @click="closeAddWindow"></view>
							<view class="custom-top-title">{{subTitle}}</view>
						</view>
						<!-- 输入框 -->
						<view class="custom-input">
							<view 
								class="custom-item fee-item" 
								style="margin-bottom: 32rpx"
								v-if="isType">
								<text style="margin-bottom: 8rpx;">{{$t('Imlcl.type')}}：</text>
								<picker @change="typePodChange($event, podTypeArrs)" :range="podTypeArrs" :value="typeIndex"
									:range-key="'podType'" class="pickekstyle"
									style="font-size: 28rpx; padding-left: 20rpx; height: 64rpx; width: 100%">
									<view class="select-picker">
										{{applicationLocal == 'zh-Hans'? podTypeArrs[typeIndex].F_ItemName : podTypeArrs[typeIndex].F_ItemNameEn}}
									</view>
								</picker>
								<view class="iconfont icon-arrow-down iconAdd"></view>
							</view>
							
							<view class="custom-item fee-item">
								<text style="margin-bottom: 8rpx; display: block;">{{$t('pub.charge')}}：</text>
								<input :placeholder="$t('pub.charge')" type="text" v-model="addFeeObj.F_ExpenseCode" />
							</view>
							<view class="custom-item fee-item" style="margin-bottom: 32rpx;">
								<text style="margin-bottom: 8rpx;">{{$t('pub.currency')}}：</text>
								
								<picker @change="currencyChange($event, currencyArrs)" :range="currencyArrs" :value="currencyIndex"
									:range-key="'currency'" class="pickekstyle"
									style="font-size: 28rpx; padding-left: 20rpx; height: 64rpx; width: 100%">
									<view class="select-picker">
										{{currencyArrs[currencyIndex].F_ItemValue}}
									</view>
								</picker>
								<view class="iconfont icon-arrow-down iconAdd"></view>
							</view>
							<view class="custom-item fee-item">
								<text style="margin-bottom: 8rpx; display: block;">{{$t('pub.unitprice')}}：</text>
								<input 
									:placeholder="$t('pub.unitprice')" 
									type="number" 
									v-model.number="addFeeObj.F_QuotedPrice"
									trim="all" 
									@blur="getQuotedAmountComputed" />
							</view>
							<view class="custom-item fee-item" style="margin-bottom: 32rpx;">
								<text style="margin-bottom: 8rpx; display: block;">{{$t('pub.unit')}}：</text>
								<picker 
									@change="unitChange($event, unitArr)" 
									:range="unitArr" 
									:value="unitIndex"
									:range-key="'F_ItemName'" 
									style="font-size: 28rpx; padding-left: 20rpx; height: 64rpx; width: 100%"
									class="pickekstyle">
									<view class="select-picker">
										{{unitArr[unitIndex].F_ItemName}}
									</view>
								</picker>
								<view class="iconfont icon-arrow-down iconAdd"></view>
							</view>
							<view class="custom-item fee-item">
								<text style="margin-bottom: 8rpx; display: block">
									{{$t('pub.quantity')}}：
								</text>
								<input 
									:placeholder="$t('pub.quantity')" 
									type="number" 
									v-model.number="addFeeObj.F_Quantity" 
									trim="all"
									@blur="getQuotedAmountComputed" />
							</view>
							<view class="custom-item fee-item">
								<text style="margin-bottom: 8rpx; display: block;">{{$t('pub.quotedprice')}}：</text>
								<input 
									disabled 
									:placeholder="$t('pub.quotedprice')" 
									type="number" 
									v-model="addFeeObj.F_QuotedAmount" />
							</view>
							<view class="mark-item">
								<text>{{$t('pub.remark')}}：</text>
								<textarea class="markFee" v-model="addFeeObj.F_Remark" />
							</view>
							<button type="primary" class="custom-btn" @click="addFeeArr">{{$t('pub.confirm')}}</button>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- tabbar -->
		<view class="lcldetails-bottom">
			<view class="bottom-item" style="background: #67c23a; color: #fff;">
				<button open-type="contact" class="bottom-text" style="background: transparent; color: #fff">
					{{$t('navigate.service')}}
				</button>
			</view>
			<!-- 生成图片 -->
			<view class="bottom-item" style="background: #409eff" @click="saveFclImage">
				<text class="iconfont icon-pic1" style="color: #fff"></text>
				<text class="bottom-text" style="color: #fff">{{$t('pub.image')}}</text>
			</view>
			<view class="bottom-item" style="background: #e6a23c" @click="saveFclPrice">
				<text class="iconfont icon-save" style="color: #fff;"></text>
				<text class="bottom-text" style="color: #fff;">{{$t('pub.price')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	let _ = require('lodash')
	import pubsub from 'pubsub-js'
	export default {
		name: "my-fcl-tabbar",
		data() {
			return {
				lclInfo: {},
				active: 0,
				index: 0,
				currencyIndex: 0,
				unitIndex: 0,
				typeIndex: 0,
				currencyArr: [],
				type: 1,
				feeType: '',
				unitArr: [],
				podTypeArr: [],
				isType: false,
				isComputed: false,
				tabArr: [{
					id: 0,
					name: this.$t('lcldetail.charge')
				}, {
					id: 1,
					name: this.$t('lcldetail.edit')
				}],
				packageArr: ['CTN(S)', 'PLT(S)'],
				packageInfo: {
					num20gp: 0,
					num40gp: 0,
					num40hq: 0,
					num45hq: 0,
					num40nor: 0
				},
				freightComputed: [],
				polFeeComputed: [],
				podFeeComputed: [], //目的港费计算
				freightRemark: '',
				polRemark: '',
				podRemark: '',
				freightTotal: '', //海运费总计
				polTotal: '', //起运港费用
				podTotal: '', //目的港费用
				addFeeObj: {
					F_Id: Date.now(),
					F_ExpenseCode: '', //费用名称
					F_ExpenseType: '', //费用类型
					ExpenseTypeNameEn: 'OfficeCharge',
					F_Currency: '', //币种
					F_QuotedPrice: 0, //报价单价
					F_Unit: 'BL', //单位
					F_UnitPrice: '',
					F_Quantity: 0, //数量
					F_QuotedAmount: 0, //报价金额
					F_Remark: '', //备注
					F_IsCalculation: 1,
					F_IsTotal: 1
				},
				subTitle: '',
				typeTotal: '',
				convertTotal: '',
				polMiniCharge: '',
				volumeRatio: '',
				arrayFreight20gp: [],
				arrayFreight40gp: [],
				arrayFreight40hq: [],
				arrayFreight45hq: [],
				arrayFreight40nor: [],
				arrayPol20gp: [],
				arrayPol40gp: [],
				arrayPol40hq: [],
				arrayPol45hq: [],
				arrayPol40nor: [],
				arrayPod20gp: [],
				arrayPod40gp: [],
				arrayPod40hq: [],
				arrayPod45hq: [],
				arrayPod40nor: [],
				freightMerge: [],
				polMerge: [],
				podMerge: [],
				freight20_gp: [],
				freight40_gp: [],
				freight40_hq: [],
				freight45_hq: [],
				freight40_nor: [],
				pol20_gp: [],
				pol40_gp: [],
				pol40_hq: [],
				pol45_hq: [],
				pol40_nor: [],
				pod20_gp: [],
				pod40_gp: [],
				pod40_hq: [],
				pod45_hq: [],
				pod40_nor: [],
				freightTotal20GP: '',
				freightTotal40GP: '',
				freightTotal40HQ: '',
				freightTotal45HQ: '',
				freightTotal40NOR: '',
				polTotal20GP: '',
				polTotal40GP: '',
				polTotal40HQ: '',
				polTotal45HQ: '',
				polTotal40NOR: '',
				podTotal20GP: '',
				podTotal40GP: '',
				podTotal40HQ: '',
				podTotal45HQ: '',
				podTotal40NOR: '',
				singlePriceFreight: '',
				singlePricePol: '',
				singlePricePod: '',
				applicationLocal: ''
			}
		},
	
		mounted() {
			this.getCurrencyDataList()
			this.getUnitDataList()
			
			pubsub.subscribe('sendData', (_, [myData, applicationLocal]) => {
				this.lclInfo = myData
				this.feeId = this.lclInfo.F_Id
				this.freightComputed = myData.FreightAdd
				this.polFeeComputed = myData.FromFee
				this.podFeeComputed = myData.ToFee
				
				this.applicationLocal = applicationLocal
			})
		},
	
		computed: {
			currencyArrs() {
				let arr = JSON.parse(JSON.stringify(this.currencyArr))
				arr.forEach(item => {
					item.currency = item.F_ItemName + item.F_ItemValue
				})
				return arr
			},

			podTypeArrs() {
				let arr = JSON.parse(JSON.stringify(this.podTypeArr))
				arr.forEach(item => {
					item.podType = item.F_ItemName + ' ' + item.F_ItemNameEn
				})
				return arr
			}
		},

		methods: {	
			bindChange(e) {
				this.index = e.target.value
			},

			currencyChange(e, name) {
				this.currencyIndex = e.target.value
				this.addFeeObj.F_Currency = name[this.currencyIndex].F_ItemValue
			},

			unitChange(e, name) {
				this.unitIndex = e.target.value
				this.addFeeObj.F_Unit = name[this.unitIndex].F_ItemValue
			},

			typePodChange(e, name) {
				this.typeIndex = e.target.value
				this.addFeeObj.ExpenseTypeName = name[this.typeIndex].F_ItemName
			},

			changeTab(num) {
				this.active = num
			},

			// 计算弹窗
			addComputedHandler() {
				this.$refs.addComputed.open()
			},

			// 关闭计算弹窗
			closeComputedWindow() {
				this.$refs.addComputed.close()
			},

			// 关闭新增费用
			closeAddWindow() {
				this.$refs.addFeeItem.close()
				this.clearAddObj()
			},

			// 获取币种
			async getCurrencyDataList() {
				const { data: res } = await uni.$http.post('data/getCurrency')
				if (res.code !== 200) return uni.$showMsg(this.$t('pub.getdata'))
				this.currencyArr = res.data
			},

			// 获取单位
			async getUnitDataList() {
				const { data: res } = await uni.$http.post('data/getUnit')
				if (res.code !== 200) return uni.$showMsg(this.$t('pub.getdata'))
				this.unitArr = res.data
			},

			// 费用计算
			async getComputedData() {
				const {data: res} = await uni.$http.post('login/isLogin')
				if(res.code == 200) {
					const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.packageInfo
					if(num20gp > 0 || num40gp > 0 || num40hq > 0 || num45hq > 0 || num40nor > 0) {
						this.handlerImageAndSaveData()
						this.$refs.addComputed.close()
						this.isComputed = true
					}else {
						uni.showToast({
							title: '请先选择箱型',
							duration: 2000,
							icon: 'none'
						})
					}
				}else {
					uni.$showMsg(res.info)
				}
			},
			
			filterArray(id, dataArr, type) {
				if(id == 1) {
					let newArr = dataArr
					this.arrayFreight20gp = []
					this.arrayPol20gp = []
					this.arrayPod20gp = []
					for(let j in newArr) {
						let obj = {}
						let map = new Map()
						obj.F_ExpenseCode = newArr[j].F_ExpenseCodeName
						obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_20GP? newArr[j].F_20GP : ''
						obj.F_Unit20GP =  newArr[j].F_20GP? newArr[j].F_20GP : ''
						obj.F_Quantity = this.packageInfo.num20gp
						obj.F_Quantity20GP = this.packageInfo.num20gp
						obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '20GP'
						obj.F_Currency = newArr[j].F_Currency
						obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_20GP) * Number(this.packageInfo.num20gp)
						obj.F_Remark = newArr[j].F_Description
						obj.F_Id = newArr[j].F_ExpenseCodeName == '海运费'? '1' : newArr[j].F_Id
						obj.MyId = newArr[j].F_Id
						obj.F_SingleVote = newArr[j].F_SingleVote? newArr[j].F_SingleVote : ''
						if(type == 'freight') {
							this.arrayFreight20gp.push(obj)
							this.arrayFreight20gp = this.arrayFreight20gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						}else if(type == 'pol') {
							this.arrayPol20gp.push(obj)
							this.arrayPol20gp = this.arrayPol20gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						}else {
							this.arrayPod20gp.push(obj)
							this.arrayPod20gp = this.arrayPod20gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						}
					}
					return [this.arrayFreight20gp, this.arrayPol20gp, this.arrayPod20gp]
				}else if(id ==2) {
					let newArr = dataArr
					this.arrayFreight40gp = []
					this.arrayPol40gp = []
					this.arrayPod40gp = []
					for(let j in newArr) {
						let obj = {}
						let map = new Map()
						obj.F_ExpenseCode = newArr[j].F_ExpenseCodeName
						obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_40GP? newArr[j].F_40GP : ''
						obj.F_Unit40GP = newArr[j].F_40GP? newArr[j].F_40GP : ''
						obj.F_Quantity = this.packageInfo.num40gp
						obj.F_Quantity40GP = this.packageInfo.num40gp
						obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '40GP'
						obj.F_Currency = newArr[j].F_Currency
						obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_40GP) * Number(this.packageInfo.num40gp)
						obj.F_Remark = newArr[j].F_Description
						obj.F_Id = newArr[j].F_ExpenseCodeName == '海运费'? '1' : newArr[j].F_Id
						obj.MyId = newArr[j].F_Id
						obj.F_SingleVote = newArr[j].F_SingleVote? newArr[j].F_SingleVote : ''
						if(type == 'freight') {
							this.arrayFreight40gp.push(obj)
							this.arrayFreight40gp = this.arrayFreight40gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						}else if(type == 'pol') {
							this.arrayPol40gp.push(obj)
							this.arrayPol40gp = this.arrayPol40gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						}else {
							this.arrayPod40gp.push(obj)
							this.arrayPod40gp = this.arrayPod40gp.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
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
						obj.F_ExpenseCode = newArr[j].F_ExpenseCodeName
						obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_40HQ? newArr[j].F_40HQ : ''
						obj.F_Unit40HQ = newArr[j].F_40HQ? newArr[j].F_40HQ : ''
						obj.F_Quantity = this.packageInfo.num40hq
						obj.F_Quantity20HQ = this.packageInfo.num40hq
						obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '40HQ'
						obj.F_Currency = newArr[j].F_Currency
						obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_40HQ) * Number(this.packageInfo.num40hq)
						obj.F_Remark = newArr[j].F_Description
						obj.F_Id = newArr[j].F_ExpenseCodeName == '海运费'? '1' : newArr[j].F_Id
						obj.MyId = newArr[j].F_Id
						obj.F_SingleVote = newArr[j].F_SingleVote? newArr[j].F_SingleVote : ''
						if(type == 'freight') {
							this.arrayFreight40hq.push(obj)
							this.arrayFreight40hq = this.arrayFreight40hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
						}else if(type == 'pol') {
							this.arrayPol40hq.push(obj)
							this.arrayPol40hq = this.arrayPol40hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
						} else {
							this.arrayPod40hq.push(obj)
							this.arrayPod40hq = this.arrayPod40hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
						}
					}
					return [this.arrayFreight40hq, this.arrayPol40hq, this.arrayPod40hq]
				}else if (id == 4) {
					let newArr = dataArr
					this.arrayFreight45hq = []
					this.arrayPol45hq = []
					this.arrayPod45hq = []
					for(let j in newArr) {
						let obj = {}
						let map = new Map()
						obj.F_ExpenseCode = newArr[j].F_ExpenseCodeName
						obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_45HQ? newArr[j].F_45HQ : ''
						obj.F_Unit45HQ = newArr[j].F_45HQ? newArr[j].F_45HQ : ''
						obj.F_Quantity = this.packageInfo.num45hq
						obj.F_Quantity45HQ = this.packageInfo.num45hq
						obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '45HQ'
						obj.F_Currency = newArr[j].F_Currency
						obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_45HQ) * Number(this.packageInfo.num45hq)
						obj.F_Remark = newArr[j].F_Description
						obj.F_Id = newArr[j].F_ExpenseCodeName == '海运费'? '1' : newArr[j].F_Id
						obj.MyId = newArr[j].F_Id
						obj.F_SingleVote = newArr[j].F_SingleVote? newArr[j].F_SingleVote : ''
						if(type == 'freight') {
							this.arrayFreight45hq.push(obj)
							this.arrayFreight45hq = this.arrayFreight45hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						}else if(type == 'pol') {
							this.arrayPol45hq.push(obj)
							this.arrayPol45hq = this.arrayPol45hq.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()))
						} else {
							this.arrayPod45hq.push(obj)
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
						obj.F_ExpenseCode = newArr[j].F_ExpenseCodeName
						obj.F_UnitPrice = newArr[j].F_SingleVote? newArr[j].F_SingleVote : newArr[j].F_40NOR? newArr[j].F_40NOR : ''
						obj.F_Unit40NOR = newArr[j].F_40NOR? newArr[j].F_40NOR : ''
						obj.F_Quantity = this.packageInfo.num40nor
						obj.F_Quantity40NOR = this.packageInfo.num40nor
						obj.F_Unit = newArr[j].F_SingleVote? 'Bill' : '40NOR'
						obj.F_Currency = newArr[j].F_Currency
						obj.F_Amount = newArr[j].F_SingleVote? Number(newArr[j].F_SingleVote) : Number(newArr[j].F_40NOR) * Number(this.packageInfo.num40nor)
						obj.F_Remark = newArr[j].F_Description
						obj.F_Id = newArr[j].F_ExpenseCodeName == '海运费'? '1' : newArr[j].F_Id
						obj.MyId = newArr[j].F_Id
						obj.F_SingleVote = newArr[j].F_SingleVote? newArr[j].F_SingleVote : ''
						if(type == 'freight') {
							this.arrayFreight40nor.push(obj)
							this.arrayFreight40nor = this.arrayFreight40nor.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
						}else if(type == 'pol') {
							this.arrayPol40nor.push(obj)
							this.arrayPod40nor = this.arrayPod40nor.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
						} else {
							this.arrayPod40nor.push(obj)
							this.arrayPod40nor = this.arrayPod40nor.filter(item => !map.has(item['F_ExpenseCode'].toString()) && map.set(item['F_ExpenseCode'].toString()) )
						}
					}
					return [this.arrayFreight40nor, this.arrayPol40nor, this.arrayPod40nor]
				}
			},
			
			handlerImageAndSaveData() {
				const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.packageInfo
				if(num20gp > 0) {
					this.freight20_gp = this.filterArray(1, this.freightComputed, 'freight')[0]
					this.pol20_gp = this.filterArray(1, this.polFeeComputed, 'pol')[1]
					this.pod20_gp = this.filterArray(1, this.podFeeComputed, 'pod')[2]
					
					this.freightTotal20GP = this.getComputedFeeData(1, this.freight20_gp)
					this.polTotal20GP = this.getComputedFeeData(1, this.pol20_gp)
					this.podTotal20GP = this.getComputedFeeData(1, this.pod20_gp)
					
				}else if(num20gp == 0) {
					this.freight20_gp = []
					this.pol20_gp = []
					this.pod20_gp = []
					
					this.freightTotal20GP = ''
					this.polTotal20GP = ''
					this.podTotal20GP = ''
				}
				
				if(num40gp > 0) {
					this.freight40_gp = this.filterArray(2, this.freightComputed, 'freight')[0]
					this.pol40_gp = this.filterArray(2, this.polFeeComputed, 'pol')[1]
					this.pod40_gp = this.filterArray(2, this.podFeeComputed, 'pod')[2]
					
					this.freightTotal40GP = this.getComputedFeeData(2, this.freight40_gp)
					this.polTotal40GP = this.getComputedFeeData(2, this.pol40_gp)
					this.podTotal40GP = this.getComputedFeeData(2, this.pod40_gp)
					
				}else if(num40gp == 0) {
					this.freight40_gp = []
					this.pol40_gp = []
					this.pod40_gp = []
					
					this.freightTotal40GP = ''
					this.polTotal40GP = ''
					this.podTotal40GP = ''
				}
				
				if(num40hq > 0) {
					this.freight40_hq = this.filterArray(3, this.freightComputed, 'freight')[0]
					this.pol40_hq = this.filterArray(3, this.polFeeComputed, 'pol')[1]
					this.pod40_hq = this.filterArray(3, this.podFeeComputed, 'pod')[2]
					
					this.freightTotal40HQ = this.getComputedFeeData(3, this.freight40_hq)
					this.polTotal40HQ = this.getComputedFeeData(3, this.pol40_hq)
					this.podTotal40HQ = this.getComputedFeeData(3, this.pod40_hq)
				}else if(num40hq == 0) {
					this.freight40_hq = []
					this.pol40_hq = []
					this.pod40_hq = []
					
					this.freightTotal40HQ = ''
					this.polTotal40HQ = ''
					this.podTotal40HQ = ''
				}
				
				if(num45hq > 0) {
					this.freight45_hq = this.filterArray(4, this.freightComputed, 'freight')[0]
					this.pol45_hq = this.filterArray(4, this.polFeeComputed, 'pol')[1]
					this.pod45_hq = this.filterArray(4, this.podFeeComputed, 'pod')[2]
					
					this.freightTotal45HQ = this.getComputedFeeData(4, this.freight45_hq)
					this.polTotal45HQ = this.getComputedFeeData(4, this.pol45_hq)
					this.podTotal45HQ = this.getComputedFeeData(4, this.pod45_hq)
				}else if(num45hq == 0) {
					this.freight45_hq = []
					this.pol45_hq = []
					this.pod45_hq = []
					
					this.freightTotal45HQ = ''
					this.polTotal45HQ = ''
					this.podTotal45HQ = ''
				}
				
				if(num40nor > 0) {
					this.freight40_nor = this.filterArray(5, this.freightComputed, 'freight')[0]
					this.pol40_nor = this.filterArray(5, this.polFeeComputed, 'pol')[1]
					this.pod40_nor = this.filterArray(5, this.podFeeComputed, 'pod')[2]
					
					this.freightTotal40NOR = this.getComputedFeeData(5, this.freight40_nor)
					this.polTotal40NOR = this.getComputedFeeData(5, this.pol40_nor)
					this.podTotal40NOR = this.getComputedFeeData(5, this.pod40_nor)
				}else if(num40nor == 0) {
					this.freight40_nor = []
					this.pol40_nor = []
					this.pod40_nor = []
					
					this.freightTotal40NOR = ''
					this.polTotal40NOR = ''
					this.podTotal40NOR = ''
				}
				
				this.freightMerge = [...this.freight20_gp, ...this.freight40_gp, ...this.freight40_hq, ...this.freight45_hq, ...this.freight40_nor]
				this.freightMerge = _.uniqWith(_.sortBy(this.freightMerge, item => item.MyId), (a, b) => a.MyId == b.MyId && a.F_Unit == b.F_Unit)
				this.freightMerge = _.sortBy(this.freightMerge, item => item.F_ExpenseCode)
				
				this.polMerge = [...this.pol20_gp, ...this.pol40_gp, ...this.pol40_hq, ...this.pol45_hq, ...this.pol40_nor]
				this.polMerge = _.uniqWith(_.sortBy(this.polMerge, item => item.MyId), (a, b) => a.MyId == b.MyId && a.F_Unit == b.F_Unit)
				this.polMerge = _.sortBy(this.polMerge, item => item.F_ExpenseCode)
				
				this.podMerge = [...this.pod20_gp, ...this.pod40_gp, ...this.pod40_hq, ...this.pod45_hq, ...this.pod40_nor]
				this.podMerge = _.uniqWith(_.sortBy(this.podMerge, item => item.MyId), (a, b) => a.MyId == b.MyId && a.F_Unit == b.F_Unit)
				this.podMerge = _.sortBy(this.podMerge, item => item.F_ExpenseCode)
				
				this.singlePriceFreight = this.computedSingleVoteFee(this.freightMerge)
				this.singlePricePol = this.computedSingleVoteFee(this.polMerge)
				this.singlePricePod = this.computedSingleVoteFee(this.podMerge)
			},

			// 计算费用
			getComputedFeeData(id,dataArr) {
				const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.packageInfo
				let newArr = _.groupBy(dataArr, 'F_Currency')
				let sum = 0
				let priceTotal = ''
				for(let key in newArr) {
					sum = 0
					newArr[key].forEach(item => {
						if(id == 1 && num20gp > 0) {
							sum += Number(item.F_Unit20GP) * num20gp
						}else if (id == 2 && num40gp > 0) {
							sum += Number(item.F_Unit40GP) * num40gp
						}else if (id == 3 && num40hq > 0) {
							sum += Number(item.F_Unit40HQ) * num40hq
						}else if(id == 4 && num45hq > 0) {
							sum += Number(item.F_Unit45HQ) * num45hq
						}else if(id == 5 && num40nor > 0) {
							sum += Number(item.F_Unit40NOR) * num40nor
						}
					})
					if(sum > 0) {
						priceTotal += ' ' + key + ' ' + sum.toFixed(2) + ' ' + '+'
					}else {
						priceTotal = ''
					}
				}
				// 处理总计价格，去掉最后一位+ 
				if (priceTotal.charAt(priceTotal.length - 1) === '+') {
					priceTotal = priceTotal.slice(0, priceTotal.length - 1)
					return priceTotal
				}
			},
			
			// 计算单票费用
			computedSingleVoteFee(dataArr) {
				let newArr = dataArr.filter(item => item.F_SingleVote !== '')
				newArr = newArr.filter((obj, index) => 
					newArr.findIndex(item => item.F_ExpenseCode === obj.F_ExpenseCode) === index
				)
				newArr = _.groupBy(newArr, 'F_Currency')
				let sum = 0
				let priceTotal = ''
				for(let key in newArr) {
					sum = 0
					newArr[key].forEach(item => {
						if(item.F_SingleVote) {
							sum += Number(item.F_SingleVote)
						}else {
							return
						}
					})
					if(sum > 0) {
						priceTotal += ' ' + key + ' ' + sum.toFixed(2) + ' ' + '+'
					}else {
						priceTotal = ''
					}
				}
				// 处理总计价格，去掉最后一位+ 
				if (priceTotal.charAt(priceTotal.length - 1) === '+') {
					priceTotal = priceTotal.slice(0, priceTotal.length - 1)
					return priceTotal
				}
			},
			
			// 保存运价
			async saveFclPrice() {
				const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.packageInfo
				if(num20gp > 0 || num40gp > 0 || num40hq > 0 || num45hq > 0 || num40nor > 0) {
					this.freightMerge = [...this.freight20_gp, ...this.freight40_gp, ...this.freight40_hq, ...this.freight45_hq, ...this.freight40_nor]
					this.polMerge = [...this.pol20_gp, ...this.pol40_gp, ...this.pol40_hq, ...this.pol45_hq, ...this.pol40_nor]
					this.podMerge = [...this.pod20_gp, ...this.pod40_gp, ...this.pod40_hq, ...this.pod45_hq, ...this.pod40_nor]
					const {data: res} = await uni.$http.post('Lclquote/saveQuote', {
						FreightRateId: this.feeId,
						Type: 3,
						CargoQuant: (num20gp > 0? '20GP' + '*' + num20gp + ',' : '')  +  (num40gp > 0? '40GP' + '*' + num40gp + ',' : '') + (num40hq > 0? '40HQ' + '*' + num40hq + ',' : '') + (num45hq > 0? '45HQ' + '*' + num45hq + ',' : '') + (num40nor > 0? '40NOR' + '*' + num40nor + ',' : ''),
						FreightAdd: this.freightMerge,
						FromFee: this.polMerge,
						ToFee: this.podMerge,
						FreightTotal: (this.freightTotal20GP? '20GP:' + this.freightTotal20GP : '') + ' ' + (this.freightTotal40GP? '40GP:' + this.freightTotal40GP : '') + ' ' + (this.freightTotal40HQ? '40HQ:' + this.freightTotal40HQ : '') + ' ' + (this.freightTotal45HQ? '45HQ:' + this.freightTotal45HQ : '') + ' ' + (this.freightTotal40NOR? '40NOR:' + this.freightTotal40NOR : '') + ' ' + (this.singlePriceFreight? '单票费用：' + this.singlePriceFreight : ''),
						PortDepartureTotal: (this.polTotal20GP? '20GP:' + this.polTotal20GP : '') + ' ' + (this.polTotal40GP? '40GP:' + this.polTotal40GP : '') + ' ' + (this.polTotal40HQ? '40HQ:' + this.polTotal40HQ : '') + ' ' + (this.polTotal45HQ? '45HQ:' + this.polTotal45HQ : '') + ' ' + (this.polTotal40NOR? '40NOR:' + this.polTotal40NOR : '') + ' ' + (this.singlePricePol? '单票费用：' + this.singlePricePol : ''),
						PortDestinationTotal: (this.podTotal20GP? '20GP:' + this.podTotal20GP : '') + ' ' + (this.podTotal40GP? '40GP:' + this.podTotal40GP : '') + ' ' + (this.podTotal40HQ? '40HQ:' + this.podTotal40HQ : '') + ' ' + (this.podTotal45HQ? '45HQ:' + this.podTotal45HQ : '') + ' ' + (this.podTotal40NOR? '40NOR:' + this.podTotal40NOR : '') + ' ' + (this.singlePricePod? '单票费用：' + this.singlePricePod : '')
					})
					try {
						if(res.code !== 200) return uni.$showMsg(res.info)
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000
						})
					}catch(err) {
						console.log(err)
					}
				}else {
					uni.$showMsg('请先制作报价单！')
				}
			},
			
			// 保存图片
			async saveFclImage() {
				const {num20gp, num40gp, num40hq, num45hq, num40nor} = this.packageInfo
				if(num20gp > 0 || num40gp > 0 || num40hq > 0 || num45hq > 0 || num40nor > 0) {
					this.freightMerge = [...this.freight20_gp, ...this.freight40_gp, ...this.freight40_hq, ...this.freight45_hq, ...this.freight40_nor]
					this.polMerge = [...this.pol20_gp, ...this.pol40_gp, ...this.pol40_hq, ...this.pol45_hq, ...this.pol40_nor]
					this.podMerge = [...this.pod20_gp, ...this.pod40_gp, ...this.pod40_hq, ...this.pod45_hq, ...this.pod40_nor]
					const {data: res} = await uni.$http.post('Lclquote/saveLclImage', {
						FreightRateId: this.feeId,
						Type: 3,
						CargoQuant: (num20gp > 0? '20GP' + '*' + num20gp + ',' : '')  +  (num40gp > 0? '40GP' + '*' + num40gp + ',' : '') + (num40hq > 0? '40HQ' + '*' + num40hq + ',' : '') + (num45hq > 0? '45HQ' + '*' + num45hq + ',' : '') + (num40nor > 0? '40NOR' + '*' + num40nor + ',' : ''),
						FreightAdd: this.freightMerge,
						FromFee: this.polMerge,
						ToFee: this.podMerge,
						FreightTotal: (this.freightTotal20GP? '20GP：' + this.freightTotal20GP : '-') + '&' + (this.freightTotal40GP? '40GP：' + this.freightTotal40GP : '-') + '&' + (this.freightTotal40HQ? '40HQ:' + this.freightTotal40HQ : '-') + '&' + (this.freightTotal45HQ? '45HQ：' + this.freightTotal45HQ : '-') + '&' + (this.freightTotal40NOR? '40NOR：' + this.freightTotal40NOR : '-') + '&' + (this.singlePriceFreight? '单票费用：' + this.singlePriceFreight : '-'),
						FromTotal: (this.polTotal20GP? '20GP：' + this.polTotal20GP : '-') + '&' + (this.polTotal40GP? '40GP：' + this.polTotal40GP : '-') + '&' + (this.polTotal40HQ? '40HQ：' + this.polTotal40HQ : '-') + '&' + (this.polTotal45HQ? '45HQ：' + this.polTotal45HQ : '-') + '&' + (this.polTotal40NOR? '40NOR：' + this.polTotal40NOR : '-') + '&' + (this.singlePricePol? '单票费用：' + this.singlePricePol : '-'),
						ToTotal: (this.podTotal20GP? '20GP：' + this.podTotal20GP : '-') + '&' + (this.podTotal40GP? '40GP：' + this.podTotal40GP : '-') + '&' + (this.podTotal40HQ? '40HQ：' + this.podTotal40HQ : '-') + '&' + (this.podTotal45HQ? '45HQ：' + this.podTotal45HQ : '-') + '&' + (this.podTotal40NOR? '40NOR：' + this.podTotal40NOR : '-') + '&' + (this.singlePricePod? '单票费用：' + this.singlePricePod : '-')
					})
					try{
						if(res.code !== 200) return uni.$showMsg(res.info)
						uni.navigateTo({
							// url: '/pages/subPack/webview/webview?feeId=' + res.data.QuoteId + '&' + 'Type=' + res.data.Type
							url: '/pages/savefclimage/savefclimage?feeId=' + res.data.QuoteId + '&' + 'Type=' + res.data.Type
						})
					}catch(err) {
						console.log(err)
					}
				}else {
					uni.$showMsg('请先制作报价单！')
				}
			},
			
			// 删除费用
			deleteFeeData(id, type, size, name) {
				uni.showModal({
					title: this.$t('pub.notice'),
					content: this.$t('pub.deletedata'),
					success: res => {
						if (res.confirm) {
							if (type == 1) {
								this.freight20_gp = this.freight20_gp.filter(item => item.MyId !== id)
								this.freightTotal20GP = this.getComputedFeeData(1, this.freight20_gp)
								this.freightTotal20GP = this.freightTotal20GP == '' || this.freightTotal20GP == undefined? '' : this.freightTotal20GP
								
								this.freight40_gp = this.freight40_gp.filter(item => item.MyId !== id)
								this.freightTotal40GP = this.getComputedFeeData(2, this.freight40_gp)
								this.freightTotal40GP = this.freightTotal40GP == '' || this.freightTotal40GP == undefined? '' : this.freightTotal40GP
								
								this.freight40_hq = this.freight40_hq.filter(item => item.MyId !== id)
								this.freightTotal40HQ = this.getComputedFeeData(3, this.freight40_hq)
								this.freightTotal40HQ = this.freightTotal40HQ == '' || this.freightTotal40HQ == undefined? '' : this.freightTotal40HQ
								
								this.freight45_hq = this.freight45_hq.filter(item => item.MyId !== id)
								this.freightTotal45HQ = this.getComputedFeeData(4, this.freight45_hq)
								this.freightTotal45HQ = this.freightTotal45HQ == '' || this.freightTotal45HQ == undefined? '' : this.freightTotal45HQ
								
								this.freight40_nor = this.freight40_nor.filter(item => item.MyId !== id)
								this.freightTotal40NOR = this.getComputedFeeData(5, this.freight40_nor)
								this.freightTotal40NOR = this.freightTotal40NOR == '' || this.freightTotal40NOR == undefined? '' : this.freightTotal40NOR
								
								this.freightMerge = this.freightMerge.filter(item => item.MyId !== id)
								this.singlePriceFreight = this.computedSingleVoteFee(this.freightMerge)
								this.singlePriceFreight = this.singlePriceFreight == '' || this.singlePriceFreight == undefined? '' : this.singlePriceFreight
							}else if(type == 2) {
								this.pol20_gp = this.pol20_gp.filter(item => item.MyId !== id)
								this.polTotal20GP = this.getComputedFeeData(1, this.pol20_gp)
								this.polTotal20GP = this.polTotal20GP == '' || this.polTotal20GP == undefined? '' : this.polTotal20GP
								
								this.pol40_gp = this.pol40_gp.filter(item => item.MyId !== id)
								this.polTotal40GP = this.getComputedFeeData(2, this.pol40_gp)
								this.polTotal40GP = this.polTotal40GP == '' || this.polTotal40GP == undefined? '' : this.polTotal40GP
								
								this.pol40_hq = this.pol40_hq.filter(item => item.MyId !== id)
								this.polTotal40HQ = this.getComputedFeeData(3, this.pol40_hq)
								this.polTotal40HQ = this.polTotal40HQ == '' || this.polTotal40HQ == undefined? '' : this.polTotal40HQ
							
								this.pol45_hq = this.pol45_hq.filter(item => item.MyId !== id)
								this.polTotal45HQ = this.getComputedFeeData(4, this.pol45_hq)
								this.polTotal45HQ = this.polTotal45HQ == '' || this.polTotal45HQ == undefined? '' : this.polTotal45HQ
								
								this.pol40_nor = this.pol40_nor.filter(item => item.MyId !== id)
								this.polTotal40NOR = this.getComputedFeeData(5, this.pol40_nor)
								this.polTotal40NOR = this.polTotal40NOR == '' || this.polTotal40NOR == undefined? '' : this.polTotal40NOR
								
								this.polMerge = this.polMerge.filter(item => item.MyId !== id)
								this.singlePricePol = this.computedSingleVoteFee(this.polMerge)
								this.singlePricePol = this.singlePricePol == '' || this.singlePricePol == undefined? '' : this.singlePricePol
							}else if(type == 3) {
								this.pod20_gp = this.pod20_gp.filter(item => item.MyId !== id)
								this.podTotal20GP = this.getComputedFeeData(1, this.pod20_gp)
								this.podTotal20GP = this.podTotal20GP == '' || this.podTotal20GP == undefined? '' : this.podTotal20GP
						
								this.pod40_gp = this.pod40_gp.filter(item => item.MyId !== id)
								this.podTotal40GP = this.getComputedFeeData(2, this.pod40_gp)
								this.podTotal40GP = this.podTotal40GP == '' || this.podTotal40GP == undefined? '' : this.podTotal40GP
								
								this.pod40_hq = this.pod40_hq.filter(item => item.MyId !== id)
								this.podTotal40HQ = this.getComputedFeeData(3, this.pod40_hq)
								this.podTotal40HQ = this.podTotal40HQ == '' || this.podTotal40HQ == undefined? '' : this.podTotal40HQ
								
								this.pod45_hq = this.pod45_hq.filter(item => item.MyId !== id)
								this.podTotal45HQ = this.getComputedFeeData(4, this.pod45_hq)
								this.podTotal45HQ = this.podTotal45HQ == '' || this.podTotal45HQ == undefined? '' : this.podTotal45HQ
	
								this.pod40_nor = this.pod45_hq.filter(item => item.MyId !== id)
								this.podTotal40NOR = this.getComputedFeeData(5, this.pod40_nor)
								this.podTotal40NOR = this.podTotal40NOR == '' || this.podTotal40NOR == undefined? '' : this.podTotal40NOR
				
								this.podMerge = this.podMerge.filter(item => item.MyId !== id)
								this.singlePricePod = this.computedSingleVoteFee(this.podMerge)
								this.singlePricePod = this.singlePricePod == '' || this.singlePricePod == undefined? '' : this.singlePricePod
							}
						} else if (res.cancel) {
							return
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.myTab {
		width: 100%;
		margin-top: 20rpx;

		.lcldetails-bottom {
			display: flex;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 88rpx;
			background: #fff;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			z-index: 3;
			border-top: 1px solid #eee;

			.bottom-item {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;

				.iconfont {
					color: #999;
					font-size: 56rpx;
					padding: 0;
				}

				.bottom-text {
					font-size: 28rpx;
					color: #999;
				}
			}
		}

		.myTab-title {
			display: flex;
			background: #dfe6e9;
			border-radius: 20rpx;
			align-items: center;
			padding: 0 24rpx;
			box-sizing: border-box;

			text {
				flex: 1;
				text-align: center;
				font-size: 26rpx;
				padding: 10rpx 0;
				color: #8a8e9d;
			}

			.active {
				font-weight: 550;
				color: #48a1f7;
				background: #fff;
				margin: 16rpx;
				border-radius: 30rpx;
			}
		}

		.tab-ocean {
			background: #fff;
			padding: 24rpx;
			margin-top: 20rpx;

			.tabpub-title {
				color: #000;
				font-weight: 550;
				font-size: 28rpx;
			}

			.ocean-table {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 20rpx;
				justify-content: space-around;

				.ocean-item {
					width: 47%;
					height: 72rpx;
					line-height: 72rpx;
					font-size: 26rpx;
					color: #444754;
					border: 1px solid #eee;
					padding: 0 0 0 16rpx;
				}
			}

			.ocean-mark {
				margin-top: 20rpx;

				.ocean-mark-title {
					display: flex;
					align-items: center;

					.iconfont {
						font-size: 40rpx;
						margin-right: 4rpx;
					}

					.mark-text {
						font-size: 26rpx;
					}
				}

				.mark-word {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #616577;
					line-height: 40rpx;
				}
			}

			.oceanfee-item {
				margin-top: 28rpx;
				border-bottom: 1px solid #eee;
				padding: 0 0 28rpx 0;
				
				.ocean-inner {
					font-size: 26rpx;
					
					span {
						font-size: 26rpx;
					}
							
					.oceanfee-name {
						margin-bottom: 8rpx;
						display: block;
						color: #737687;
					}

					.oceanfee-num {
						display: flex;
						color: #000;
						font-weight: 550;
						text {
							margin-right: 20rpx;
						}
					}
					
					.single {
						margin-top: 10rpx;
						color: #2979ff;
					}
				}

				.oceanfee-mark {
					margin-top: 16rpx;
					padding: 16rpx 12px;
					color: #616577;
					font-size: 26rpx;
					background: #eee;
					border-radius: 12rpx;

					text {
						margin-right: 24rpx;
					}
				}
			}
		}

		.ocean-computed {
			width: 100%;
			background: #fff;
			margin-top: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;

			.ocean-rquired {
				font-size: 26rpx;
				color: #e43d33;
			}

			.ocean-computed-box {
				display: flex;
				align-items: center;
				background: #dfe6e9;
				border-radius: 20rpx;
				margin-top: 20rpx;

				.computed-item {
					flex: 1;
					height: 120rpx;
					display: flex;
					flex-direction: column;
					font-size: 26rpx;
					text-align: center;
					justify-content: center;
				}
			}
		}

		.computed-sea {
			width: 100%;
			background: #fff;
			padding: 30rpx;
			margin-top: 20rpx;
			font-size: 28rpx;
			box-sizing: border-box;

			.pub-top {
				position: relative;
				padding: 0 0 30rpx 0;
				color: #000;
				font-weight: 550;
				border-bottom: 1px solid #eee;

				.addFeeBtn {
					position: absolute;
					top: 0;
					right: 10rpx;
					text-decoration: underline;
					color: #2979ff;
					font-size: 26rpx;
				}

				.computed-price {
					margin: 20rpx 20rpx 0 0;
					color: #f53;
					font-size: 28rpx;
					font-weight: 500;
					text {
						display: block;
					}
				}
			}

			.pub-item {
				position: relative;
				padding: 20rpx 0;
				border-bottom: 1px solid #eee;
				font-size: 28rpx;

				.pub-item-type {
					font-size: 24rpx;
					margin-bottom: 20rpx;
				}

				.pub-result {
					margin-top: 10rpx;
					color: #4191df;
				}

				.pub-edit {
					position: absolute;
					right: 30rpx;
					top: 30rpx;
					color: #4191df;
					text-decoration: underline;
				}

				.pub-btn {
					position: absolute;
					top: 24rpx;
					right: 10rpx;
					display: flex;

					.iconfont {
						color: #e43d33;
						font-size: 44rpx;
						margin-left: 20rpx;
					}
				}
			}

			.pub-mask {
				padding: 10rpx 0;
				color: #8a8e9d;
				line-height: 40rpx;
			}
		}
	}

	.add-box {
		width: 600rpx;
		background: #fff;
		box-sizing: border-box;
		padding: 30rpx;
		border-radius: 10rpx;

		.add-item {
			margin-bottom: 24rpx;

			.add-select {
				display: flex;
				width: 100%;
				height: 72rpx;
				border: 1px solid #dcdfe6;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding-left: 20rpx;
				line-height: 68rpx;
				color: #000;

				.iconfont {
					margin: 0 20rpx 0 auto;
				}
			}
		}

		.add-btn {
			width: 60%;
			display: flex;
			overflow: inherit;
			margin: 50rpx auto 0 auto;
		}
	}

	.change-box {
		width: 600rpx;
		background: #fff;
		padding: 30rpx;
		border-radius: 10rpx;

		.change-item {
			margin-bottom: 24rpx;

			.change-number {
				width: 100%;
				height: 72rpx;
				border: 1px solid #dcdfe6;
				border-radius: 10rpx;
				line-height: 72rpx;
				padding-left: 24rpx;
				box-sizing: border-box;
			}
		}

		.change-btn {
			width: 60%;
			display: flex;
			overflow: inherit;
			margin: 50rpx auto 0 auto;
		}
	}

	.editAddComputed {
		width: 640rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 28rpx;

		.custom-top {
			position: relative;
			background: #fff;
			color: #000;
			border-bottom: 1px solid #eee;

			.closeBtn {
				position: absolute;
				top: 0;
				right: 4rpx;
				font-size: 44rpx;
			}

			.custom-top-title {
				font-size: 28rpx;
				font-weight: 550;
			}

			.custom-top-subtitle {
				font-size: 26rpx;
				margin: 16rpx 0;
			}

			.custom-top-scope {
				font-size: 26rpx;
				color: #566090;
				font-weight: 550;
				margin: 10rpx 0 20rpx 0;

				text {
					margin-right: 30rpx;
				}
			}
		}

		.custom-input {
			width: 100%;
			background: #fff;
			box-sizing: border-box;
			margin-top: 20rpx;

			.custom-btn {
				height: 84rpx;
				line-height: 84rpx;
				margin-top: 32rpx;
				background: #48a1f7;
				font-size: 30rpx;
			}

			.custom-item {
				position: relative;
				margin-bottom: 30rpx;
		
				.pickekstyle {
					position: relative;
					width: 76.5%;
					height: 72rpx;
					border: 1px solid #f2f2f2;
					box-sizing: border-box;
					line-height: 72rpx;
				}

				.iconAdd {
					position: absolute;
					top: 58rpx;
					right: 20rpx;
				}

				.custom-picker {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #555;
				}

				input {
					height: 68rpx;
					font-size: 28rpx;
					border-bottom: 1px solid #f2f2f2;
				}

				text {
					display: block;
					font-size: 26rpx;
					font-weight: 550;
					margin: 0 20rpx 20rpx 0;
				}
			}

			.fee-item {
				display: block;
				margin-bottom: 16rpx;

				input {
					border: 1px solid #f2f2f2;
					margin-left: 0;
					padding-left: 20rpx;
					font-size: 28rpx;
					height: 64rpx;
				}
			}

			.mark-item {
				text {
					display: block;
					font-size: 26rpx;
					font-weight: 500;
					margin: 0 0 10rpx 0;
				}

				textarea {
					width: 100%;
					height: 100rpx;
					border: 1px solid #eee;
					box-sizing: border-box;
					padding: 10rpx 0 0 20rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.public-mark {
		width: 100%;
		padding: 4rpx 24rpx 24rpx 24rpx;
		font-size: 28rpx;
		background: #fff;
		color: #737687;
	}

	button::after {
		border: none;
	}
	
	.pub-tips {
		font-size: 26rpx;
		color: #555;
		padding: 24rpx;
		box-sizing: border-box;
	}
</style>