<template>
	<view class="myTab">
		<view class="myTab-title">
			<text 
				v-for="tab in tabArr" 
				:key="tab.id" 
				@click="changeTab(tab.id)" 
				:class="active === tab.id? 'active': ''"
			>
				{{tab.name}}
			</text>
		</view>
		<view v-show="active === 0">
			<view class="tab-ocean" v-for="f in freightArr" :key="f.F_Id">
				<view class="tabpub-title">
					{{f.F_ExpenseCodeName}}
				</view>
				<view class="ocean-table">
					<view class="ocean-item">
						CBM&nbsp;&nbsp;{{f.F_CBM !== ''? f.F_CBM<0? '(' + (Number(f.F_CBM) *-1).toFixed(2) + ')' : f.F_CBM : 'case by case'}}
					</view>
					<view class="ocean-item">
						TON&nbsp;&nbsp;{{f.F_TON !==''? f.F_TON<0? '(' + (Number(f.F_TON) *-1).toFixed(2) + ')' : f.F_TON : 'case by case'}}
					</view>
					<view class="ocean-item">Min&nbsp;&nbsp;{{f.F_MIN? f.F_MIN : '--'}}</view>
					<view class="ocean-item">
						{{$t('lcllist.vol')}}&nbsp;&nbsp;{{f.F_VolumeRatio? '1:' + f.F_VolumeRatio : '--'}}
					</view>
					<view class="ocean-item">{{f.F_RT? f.F_RT : '--'}}</view>
					<view class="ocean-item">
						{{$t('lcldetail.pay')}}&nbsp;&nbsp;{{f.F_PaymentMethod? f.F_PaymentMethod : '--'}}
					</view>
				</view>
			</view>
			<view class="public-mark" v-if="lclInfo.F_BookingRemarks">
				{{$t('pub.freightRemark')}}：{{lclInfo.F_BookingRemarks}}
			</view>
			
			<!-- 起运港费用 -->
			<view class="tab-ocean">
				<view class="tabpub-title">{{$t('pub.pol')}}</view>
				<view class="oceanfee-item" v-for="pol in polFee" :key="pol.F_id">
					<view class="ocean-inner">
						<text class="oceanfee-name">
							{{pol.F_ExpenseCodeName}}
						</text>
						<text class="oceanfee-num" v-if="pol.F_UnitPrice">
							{{pol.F_Currency? pol.F_Currency : ''}} {{pol.F_UnitPrice? pol.F_UnitPrice : ''}}{{ pol.F_Unit? '/' + pol.F_Unit : ''}}
						</text>
						<text v-else>--</text>
					</view>
					<view class="oceanfee-mark" v-if="pol.F_MiniCharge || pol.F_MaxCharge">
						<text>{{$t('pub.min')}} {{pol.F_MiniCharge? pol.F_MiniCharge : '--'}}</text>
						<text>{{$t('pub.max')}} {{pol.F_MaxCharge? pol.F_MaxCharge : '--'}}</text>
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
				<view class="oceanfee-item" v-for="pod in podFee" :key="pod.F_Id">
					<view class="ocean-inner">
						<text class="oceanfee-name">
							{{pod.F_ExpenseCodeName}}
						</text>
						<text class="oceanfee-num" v-if="pod.F_UnitPrice">
							{{pod.F_Currency? pod.F_Currency : ''}} {{pod.F_UnitPrice? pod.F_UnitPrice + '/' + pod.F_Unit : ''}}
						</text>
						<text v-else>--</text>
						<text style="margin-left: 30rpx">
							{{$t('Imlcl.type')}}&nbsp;{{pod.ExpenseTypeName}}
						</text>
					</view>
					<view class="oceanfee-mark">
						<text>{{$t('pub.min')}} {{pod.F_MiniAmount? pod.F_MiniAmount : '--'}}</text>
						<text>{{$t('pub.minnum')}} {{pod.F_MiniQuantity? pod.F_MiniQuantity : '--'}}</text>
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
						<text>{{packageInfo.number? packageInfo.number : '--'}}</text>
						<text>{{$t('pub.pcs')}}</text>
					</view>
					<view class="computed-item">
						<text>
							{{packageInfo.weight? packageInfo.weight : '--'}}
						</text>
						<text>{{$t('pub.kgs')}}</text>
					</view>
					<view class="computed-item">
						<text>
							{{packageInfo.volume? packageInfo.volume : '--'}}
						</text>
						<text>{{$t('pub.cbm')}}</text>
					</view>
				</view>
			</view>
			<!-- 海运费及附加费 -->
			<view class="computed-sea" v-if="isComputed">
				<view class="pub-top">
					<text>{{$t('pub.freight')}}</text>
					<view class="computed-price">
						{{$t('pub.total')}}：{{ freightTotal? freightTotal : '--' }}
					</view>
					<view class="addFeeBtn" @click="addFeeDataHandler(1)">
						{{$t('pub.add')}}
					</view>
				</view>
				<view class="pub-item" v-for="f in freightComputed" :key="f.F_Id">
					<view class="pub-item-title">{{f.F_ExpenseCode}}</view>
					<view class="pub-result">
						<text v-if="f.F_QuotedPrice && f.F_QuotedPrice !== 'CASE BY CASE'">
							{{Number(f.F_QuotedPrice)<0? '(' + Number(f.F_QuotedPrice) * -1 +')' : f.F_QuotedPrice}}{{f.F_Currency}}*{{Number(f.F_Quantity)}}{{f.F_Unit}} = {{Number(f.F_QuotedAmount)<0? '(' + Number(f.F_QuotedAmount) * -1 +')' : Number(f.F_QuotedAmount)}}{{f.F_Currency}}
						</text>
						<text v-else-if="f.F_QuotedPrice == 0">{{f.F_QuotedPrice + f.F_Currency}}</text>
						<text v-else>CASE BY CASE</text>
					</view>
					<view class="pub-btn">
						<view class="iconfont icon-ashbin" @click="deleteFeeData(f.F_Id, 1)"></view>
					</view>
					<view class="pub-mask" v-if="f.F_Remark">
						{{$t('pub.remark')}}:{{f.F_Remark}}
					</view>
				</view>
				<view class="pub-mask" v-if="freightRemark">
					{{$t('pub.freightRemark')}}:{{freightRemark}}
				</view>
			</view>
			
			<!-- 起运港计算 -->
			<view v-if="termText === 'FCA' " >
				<view class="computed-sea" v-if="isComputed">
					<view class="pub-top">
						<text>{{$t('pub.pol')}}</text>
						<view class="addFeeBtn" @click="addFeeDataHandler(2)">{{$t('pub.add')}}</view>
						<view class="computed-price">{{$t('pub.total')}}：{{ polTotal? polTotal : '--' }}</view>
						<view class="computed-price" style="margin-top: 0">
							{{$t('pub.convert')}}：{{ convertMiniTotal? convertMiniTotal : '--' }}
						</view>
					</view>
					<view class="pub-item" v-for="f in polFeeComputed" :key="f.F_Id">
						<view class="pub-item-title">{{ f.F_ExpenseCode}}</view>
						<view class="pub-result">
							<text v-if="f.F_QuotedPrice">
								{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity? f.F_Quantity : '-'  + '(' + f.F_Unit + ')'}} = {{f.F_QuotedAmount? f.F_QuotedAmount : '-'}}{{f.F_Currency}}
							</text>
							<text v-else-if="f.F_QuotedPrice == 0">{{f.F_QuotedPrice}}</text>
							<text v-else>CASE BY CASE</text>
						</view>
						<view class="pub-btn">
							<view class="iconfont icon-ashbin" @click="deleteFeeData(f.F_Id, 2)"></view>
						</view>
						<view class="pub-mask" v-if="f.F_Remark">
							{{$t('pub.remark')}}:{{f.F_Remark}}
						</view>
					</view>
					<view class="pub-mask" v-if="polRemark">
						{{$t('pub.polRemark')}}:{{polRemark}}
					</view>
				</view>
			</view>
			
			<!-- 目的港计算 -->
			<view class="computed-sea" v-if="isComputed">
				<view class="pub-top">
					<text>{{$t('pub.pod')}}</text>
					<view class="addFeeBtn" @click="addFeeDataHandler(3)">{{$t('pub.add')}}</view>
					<view>
						<view class="computed-price">
							{{$t('pub.total')}}：{{ podTotal? podTotal : '--' }}
						</view>
						<view class="computed-price" style="margin-top: 0">
							{{$t('Imlcl.type')}}：{{ typeTotal? typeTotal : '--' }}
						</view>
					</view>
				</view>

				<!-- 目的港费 -->
				<view class="pub-item" v-for="f in podFeeComputed" :key="f.F_Id">
					<view class="pub-item-title">{{f.F_ExpenseCode}}</view>
					<view class="pub-item-type">
						{{$t('Imlcl.type')}}：{{ f.ExpenseTypeName? f.ExpenseTypeName : '--' }}
					</view>
					<view class="pub-result">
						<text v-if="f.F_QuotedPrice">
							{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity? f.F_Quantity : '-'  + '(' + f.F_Unit + ')'}} = {{f.F_QuotedAmount? f.F_QuotedAmount : '-'}}{{f.F_Currency}}
						</text>
						<text v-else-if="f.F_QuotedPrice == 0">{{f.F_QuotedPrice}}</text>
						<text v-else>CASE BY CASE</text>
					</view>
					<view class="pub-btn">
						<view class="iconfont icon-ashbin" @click="deleteFeeData(f.F_Id, 3)"></view>
					</view>
					<view class="pub-mask" v-if="f.F_Remark">
						{{$t('pub.remark')}}:{{f.F_Remark}}
					</view>
				</view>
				<view class="pub-mask" v-if="podRemark">
					{{$t('pub.podRemark')}}:{{podRemark}}
				</view>
			</view>
			
			<!-- 陆运拖车费 -->
			<block v-if="indexLand == 1">
				<view class="computed-sea" v-if="isComputed">
					<view class="pub-top">
						<text>陆运拖车费</text>
						<view class="addFeeBtn" @click="addFeeDataHandler(4)">{{$t('pub.add')}}</view>
						<view>
							<view class="computed-price">
								{{$t('pub.total')}}：{{ landTotal? landTotal : '--' }}
							</view>
						</view>
					</view>
					
					<view class="pub-item" v-for="f in landFeeComputed" :key="f.F_Id">
						<view class="pub-item-title">{{f.F_ExpenseCode}}</view>
						<view class="pub-result">
							<text v-if="f.F_QuotedPrice">
								{{f.F_QuotedPrice}}{{f.F_Currency}}*{{f.F_Quantity? f.F_Quantity : '-'  + '(' + f.F_Unit + ')'}} = {{f.F_QuotedAmount? f.F_QuotedAmount : '-' }}{{f.F_Currency}}
							</text>
							<text v-else-if="f.F_QuotedPrice == 0">{{f.F_QuotedPrice}}</text>
							<text v-else>CASE BY CASE</text>
						</view>
						<view class="pub-btn">
							<view class="iconfont icon-ashbin" @click="deleteFeeData(f.F_Id, 4)"></view>
						</view>
						<view class="pub-mask" v-if="f.F_Remark">
							{{$t('pub.remark')}}:{{f.F_Remark}}
						</view>
					</view>
				</view>
			</block>

			<view
				class="pub-tips"
				v-if="freightComputed.length !== 0"
				>
					{{$t('pub.pricetip')}}
			</view>

			<!-- 计算输入弹窗 -->
			<uni-popup 
				type="center" 
				ref="addComputed" 
				mask-background-color="rgba(0,0,0,0.6)"
				:is-mask-click="false"
				>
				<view class="editAddComputed">
					<view class="custom">
						<view class="custom-top">
							<view class="iconfont icon-close closeBtn" @click="closeComputedWindow"></view>
							<view class="custom-top-title">{{$t('pub.cargo')}}</view>
							<view class="custom-top-scope">
								<text v-if="lclInfo.F_RTLowerLimit == '' && lclInfo.F_RTUpperLimit == ''">
									{{$t('lcllist.rt')}}--
								</text>
								<text	v-else-if="lclInfo.F_RTLowerLimit !== '' && lclInfo.F_RTUpperLimit == ''">
									{{$t('lcllist.rt')}}{{lclInfo.F_RTLowerLimit}}＜RT
								</text>
								<text v-else-if="lclInfo.F_RTLowerLimit == '' && lclInfo.F_RTUpperLimit !== ''">
									{{$t('lcllist.rt')}}RT≤{{lclInfo.F_RTUpperLimit}}
								</text>
								<text v-else-if="lclInfo.F_RTLowerLimit !== '' && lclInfo.F_RTUpperLimit !== ''">
									{{$t('lcllist.rt')}}{{lclInfo.F_RTLowerLimit}}＜RT≤{{lclInfo.F_RTUpperLimit}}
								</text>
								<text>
									{{$t('lcllist.vol')}}{{lclInfo.F_VolumeRatio? '1:' + lclInfo.F_VolumeRatio : '--' }}
								</text>
							</view>
						</view>
						<!-- 输入框 -->
						<view class="custom-input">
							<view class="custom-item">
								<text>{{$t('pub.pcs')}}</text>
								<input 
									:placeholder="$t('pub.inputquantity')" 
									type="number" 
									v-model="packageInfo.number" 
								/>
								<view class="custom-picker" style="margin-left: 24rpx;">
									<view>PKG(S)</view>
								</view>
							</view>
							<view class="custom-item">
								<text>{{$t('pub.kgs')}}</text>
								<input 
									:placeholder="$t('pub.inputweight')" 
									type="digit" 
									v-model="packageInfo.weight" 
								/>
								<view class="custom-picker" style="margin-left: 24rpx;">
									<view>KGS</view>
								</view>
							</view>
							<view class="custom-item">
								<text>{{$t('pub.cbm')}}</text>
								<input 
									:placeholder="$t('pub.inputvolume')" 
									type="digit" 
									v-model="packageInfo.volume" />
								<view class="custom-picker" style="margin-left: 24rpx;">
									<view>CBM</view>
								</view>
							</view>
							<view class="custom-item">
								<text>是否包含陆运费</text>
								<picker 
									@change="bindPickerLandChange" 
									:value="indexLand" 
									:range="landArray"
									style="width: 37.5%; padding: 8rpx; border-bottom: 1px solid #eee; font-size: 28rpx"
								>
									<view style="display: flex; align-items: center">
										<view class="uni-input">{{landArray[indexLand]}}</view>
										<view
											style="color: #ccc; margin-left: 10px;"
											class="iconfont icon-arrow-down"
											>
										</view>
									</view>
									
								</picker>
								
							</view>
							
							<view class="custom-item" v-if="indexLand==1">
								<view class="landsearch-item-picker">
									<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
										<view v-if="areaArray.length !== 0" style="font-size: 28rpx">{{regionName}}</view>
										<view class="land-searchtip" v-else>{{areaTip}}</view>
									</pick-regions>
								</view>
							</view>
							
							<view class="custom-item" v-if="indexLand==1">
								<input
									placeholder="请输入邮政编码"
									type="number"
									v-model="zcode"
									style="margin-left: 0; padding-left: 0; width: 70%;"
									/>
							</view>
							
							<view class="custom-item">
								<text>是否包含报关费</text>
								<picker 
									@change="bindPickerClearanceChange" 
									:value="indexClearance" 
									:range="clearanceArray"
									style="width: 37.5%; padding: 8rpx; border-bottom: 1px solid #eee; font-size: 28rpx"
								>
									<view style="display: flex; align-items: center;">
										<view class="uni-input">{{clearanceArray[indexClearance]}}</view>
										<view
											style="margin-left: 10px; color: #ccc" 
											class="iconfont icon-arrow-down">
										</view>
									</view>
								</picker>
							</view>
							
							<view class="custom-item">
								<text>运输条款</text>
								<picker 
									@change="bindPickerTermChange" 
									:value="indexTerm" 
									:range="termArray"
									style="width: 37.5%; padding: 8rpx; border-bottom: 1px solid #eee; font-size: 28rpx"
								>
									<view style="display: flex; align-items: center">
										<view class="uni-input">{{termArray[indexTerm]}}</view>
										<view 
											class="iconfont icon-arrow-down"
											style="color: #ccc; margin-left: 10px;">
										</view>
									</view>
									
								</picker>
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
										{{podTypeArrs[typeIndex].F_ItemName}}
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
			<view class="bottom-item" style="background: #409eff" @click="getImportSaveImage">
				<text class="iconfont icon-pic1" style="color: #fff"></text>
				<text class="bottom-text" style="color: #fff">{{$t('pub.image')}}</text>
			</view>
			<view class="bottom-item" @click="getSavePriceData" style="background: #e6a23c">
				<text class="iconfont icon-save" style="color: #fff;"></text>
				<text class="bottom-text" style="color: #fff;">{{$t('pub.price')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	import {isLoginMethod} from '@/utils/isLogin.js'
	export default {
		name: "my-import-tabbar",
		props: ['lclInfo', 'polFee', 'podFee', 'freightArr', 'applicationLocal'],
		data() {
			return {
				areaArray: [],
				areaCode: [],
				podLandData: [],
				defaultRegionCode: '110101',
				areaTip: this.$t('ltl.pickaddress'),
				landArray: ['否', '是'],
				clearanceArray: ['否', '是'],
				termArray: ['FOB', 'FCA'],
				indexTerm: 0,
				termText: 'FOB',
				zcode: '',
				indexLand: 0,
				indexClearance: 0,
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
					number: '',
					weight: '',
					volume: ''
				},
				freightComputed: [], //海运费计算
				polFeeComputed: [], //起运港计算
				podFeeComputed: [], //目的港费计算
				landFeeComputed: [], //陆运费用计算
				freightRemark: '',
				polRemark: '',
				podRemark: '',
				freightTotal: '', //海运费总计
				polTotal: '', //起运港费用
				podTotal: '', //目的港费用
				landTotal: '',
				addFeeObj: {
					F_Id: Date.now(),
					F_ExpenseCode: '', //费用名称
					F_ExpenseType: '', //费用类型
					ExpenseTypeName: '办公室收费', //费用类型名称
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
				volumeRatio: ''
			}
		},
		
		mounted() {
			this.getCurrencyDataList()
			this.getUnitDataList()
			this.getPodTypeData()
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
			},
			
			convertMiniTotal() {
				let sum = null
				sum = this.polMiniCharge? Number(this.convertTotal) < Number(this.polMiniCharge)?  this.polMiniCharge : this.convertTotal : this.convertTotal
				return 'USD' + ' ' + Number(sum).toFixed(2)
			},
			
			regionName() {
				return this.areaArray.map(item => item.name).join('-')
			}
		},

		methods: {
			handleGetRegion(region) {
				this.areaCode = []
				this.areaArray = region
				this.areaArray.map(item => {
					this.areaCode.push(item.id)
				})
			},
			
			bindPickerLandChange(e) {
				this.indexLand = Number(e.detail.value)
				if(this.indexLand !== 1) {
					this.areaCode = ''
					this.zcode = ''
					this.areaArray = []
				}
			},
			
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
			
			bindPickerClearanceChange(e) {
				this.indexClearance = e.detail.value
			},
			
			bindPickerTermChange(e) {
				this.indexTerm = e.detail.value
				this.indexTerm == 0? this.termText='FOB' :  this.termText='FCA'
			},

			// 计算弹窗
			addComputedHandler() {
				this.$refs.addComputed.open()
			},

			// 关闭计算弹窗
			closeComputedWindow() {
				this.$refs.addComputed.close()
			},

			// 新增费用弹窗
			addFeeDataHandler(type) {
				this.$refs.addFeeItem.open()
				this.feeType = type
				if (type == 1) {
					this.subTitle = '新增海运附加费'
					this.addFeeObj.F_Currency = 'KWD'
					this.isType = false
					this.getCurrencyDataList()
				} else if (type == 2) {
					this.subTitle = '新增起运港费'
					this.isType = false
					this.addFeeObj.F_Currency = 'CHF'
					this.currencyArr = this.currencyArr.filter(item => {
						return item.F_ExchangeRate > 0
					})
				} else if(type == 3) {
					this.subTitle = '新增目的港费'
					this.isType = true
					this.addFeeObj.F_Currency = 'KWD'
					this.getCurrencyDataList()
				}else {
					this.subTitle = '新增陆运拖车费'
					this.isType = false
					this.addFeeObj.F_Currency = 'KWD'
					this.getCurrencyDataList()
				}
			},

			// 关闭新增费用
			closeAddWindow() {
				this.$refs.addFeeItem.close()
				this.clearAddObj()
			},

			clearAddObj() {
				this.addFeeObj = {
					F_Id: Date.now(),
					F_ExpenseCode: '', //费用名称
					F_ExpenseType: '', //费用类型
					ExpenseTypeName: '', //费用类型名称
					F_Currency: '', //币种
					F_QuotedPrice: 0, //报价单价
					F_Unit: 'RT', //单位
					F_UnitPrice: '',
					F_Quantity: 0, //数量
					F_QuotedAmount: 0, //报价金额
					F_Remark: '',
					F_IsCalculation: 1,
					F_IsTotal: 1
				}
			},

			// 新增费用
			addFeeArr() {
				const { F_ExpenseCode, F_Quantity, F_QuotedPrice } = this.addFeeObj
				if (F_ExpenseCode === '' || F_Quantity === '' || F_QuotedPrice === '') {
					uni.showToast({
						title: this.$t('pub.rightfee'),
						icon: 'none',
						duration: 1500
					})
				} else {
					if(this.feeType == 1) {
						this.freightComputed.push(this.addFeeObj)
						this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
						this.clearAddObj()
						this.currencyIndex = 0
					}else if (this.feeType == 2) {
						this.polFeeComputed.push(this.addFeeObj)
						this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
						this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
						this.clearAddObj()
						this.currencyIndex = 0
					}else if (this.feeType == 3) {
						this.podFeeComputed.push(this.addFeeObj)
						this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
						this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
						this.clearAddObj()
						this.currencyIndex = 0
					}else {
						this.landFeeComputed.push(this.addFeeObj)
						this.landTotal = this.getComputedTotal(this.landFeeComputed)[0]
						this.clearAddObj()
						this.currencyIndex = 0
					}
					this.$refs.addFeeItem.close()
				}
			},

			// 失去焦点计算报价金额
			getQuotedAmountComputed() {
				this.addFeeObj.F_QuotedAmount = this.addFeeObj.F_QuotedPrice * this.addFeeObj.F_Quantity
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

			// 获取目的港费用类型
			async getPodTypeData() {
				const { data: res } = await uni.$http.post('data/getExpenseType')
				if (res.code !== 200) return uni.$showMsg(this.$t('pub.getdata'))
				this.podTypeArr = res.data
			},

			// 费用计算输入校验
			getComputedData() {
				let { F_RTLowerLimit, F_RTUpperLimit, F_VolumeRatio } = this._props.lclInfo
				let { number, weight, volume } = this.packageInfo
				if (number === '' || weight === '' || volume === '') {
					uni.showToast({
						title: this.$t('pub.rightfee'),
						duration: 2000,
						icon: 'none'
					})
				}else if(this.indexLand == 1 && !this.areaCode[2] && !this.zcode) {
					uni.showToast({
						title: '请选择提货地或填写邮编',
						duration: 2500,
						icon: 'none'
					})
				} else {
					if(F_RTLowerLimit || F_RTUpperLimit) {
						let rtNumber = F_VolumeRatio? weight / F_VolumeRatio : weight / 1000
						if(rtNumber > Number(volume) && (rtNumber > Number(F_RTUpperLimit) || rtNumber < Number(F_RTLowerLimit) )) {
							uni.showToast({
								title: this.$t('pub.info'),
								duration: 2000,
								icon: 'none'
							})
						}else if (rtNumber < Number(volume) && (volume > Number(F_RTUpperLimit) || volume < Number(F_RTLowerLimit) )) {
							uni.showToast({
								title: this.$t('pub.info'),
								duration: 2000,
								icon: 'none'
							})
						}else {
							this.getComputedFeeData()
						}
					} else {
						this.getComputedFeeData()
					}
				}
			},

			// 计算费用
			async getComputedFeeData() {
				let { F_Id } = this._props.lclInfo
				const { data: res } = await uni.$http.post('imlcl/calQuotation', {
					FreightRateId: F_Id,
					Quantity: this.packageInfo.number,
					GrossWeight: this.packageInfo.weight,
					Volume: this.packageInfo.volume,
					AreaId: this.areaCode[2]? this.areaCode[2] : '' ,
					IsLand: this.indexLand,
					PostCode: this.zcode? this.zcode : '',
					TransitClause: this.termText,
					IsCustomsCharges: this.indexClearance
				})
				if (res.code !== 200) return uni.$showMsg(this.$t('pub.info'))
				
				this.isComputed = true
				this.polMiniCharge = res.data.F_MinimumChargeUsd
				
				this.freightComputed = res.data.freight
				if(this.freightComputed.length !== 0) {
					this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
				}
				
				this.polFeeComputed = res.data.departurePortCharges
				if(this.polFeeComputed.length !== 0) {
					this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
					this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
				}
				
				this.podFeeComputed = res.data.destinationPorts
				if(this.podFeeComputed.length !== 0) {
					this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
					this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
				}
				
				this.landFeeComputed = res.data.landFreight
				if(this.landFeeComputed.length !== 0) {
					this.landTotal =  this.getComputedTotal(this.landFeeComputed)[0]
				}
				
				this.freightRemark = res.data.freightAddDesc
				this.polRemark = res.data.fromDesc
				this.podRemark = res.data.toDesc

				this.$refs.addComputed.close()
				uni.showToast({
					title: this.$t('pub.computedsuccess'),
					duration: 1500,
					icon: 'none'
				})
			},

			// 计算总价
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
						sum < 0 ? (priceTotal += key + ' ' + '(' + sum * -1 + ')' + '+') : (priceTotal += key + ' ' + sum.toFixed(
							2) + '+')
					}
				}
				converTotal = converTotal.toFixed(2)
				// 处理总计价格，去掉最后一位+ 
				if (priceTotal.charAt(priceTotal.length - 1) === '+') {
					priceTotal = priceTotal.slice(0, priceTotal.length - 1)
					return [priceTotal, converTotal]
				}
			},

			// 根据目的港费用类型计算
			getDestTypeTotal(dataArr) {
				let newArr = null
				let sum = 0
				let priceTotal = ''
				
				newArr = _.groupBy(dataArr, 'ExpenseTypeName')
				for (let key in newArr) {
					sum = 0
					newArr[key].forEach(item => {
						if (item.F_Quantity == 0) {
							item.F_Quantity = ''
						} else {
							if (typeof item.F_QuotedAmount === 'number' && (item.F_IsCalculation == 0 || item.F_IsTotal == 1)) {
								sum += item.F_QuotedAmount
							}
						}
					})
					if (key) {
						sum < 0 ? priceTotal += key + ' ' + '(' + sum * -1 + ')' + '+' : priceTotal += key + ' ' + sum.toFixed(2) +
							'+'
					} else {
						sum < 0 ? priceTotal += '(' + sum * -1 + ')' + '+' : priceTotal += sum.toFixed(2) + '+'
					}
				}
				// 处理总计价格，去掉最后一位+ 
				if (priceTotal.charAt(priceTotal.length - 1) === '+') {
					priceTotal = priceTotal.slice(0, priceTotal.length - 1)
					return priceTotal
				}
			},

			// 删除费用
			deleteFeeData(id, type) {
				uni.showModal({
					title: this.$t('pub.notice'),
					content: this.$t('pub.deletedata'),
					success: (res) => {
						if (res.confirm) {
							if (type == 1) {
								this.freightComputed = this.freightComputed.filter(item => item.F_Id !== id)
								if(this.freightComputed.length !== 0) {
									this.freightTotal = this.getComputedTotal(this.freightComputed)[0]
								}
							} else if (type == 2) {
								this.polFeeComputed = this.polFeeComputed.filter(item => item.F_Id !== id)
								if(this.polFeeComputed.length !== 0) {
									this.polTotal = this.getComputedTotal(this.polFeeComputed)[0]
									this.convertTotal = this.getComputedTotal(this.polFeeComputed)[1]
								}
							} else if (type == 3) {
								this.podFeeComputed = this.podFeeComputed.filter(item => item.F_Id !== id)
								if(this.podFeeComputed.length !== 0) {
									this.podTotal = this.getComputedTotal(this.podFeeComputed)[0]
									this.typeTotal = this.getDestTypeTotal(this.podFeeComputed)
								}
							}else {
								this.landFeeComputed = this.landFeeComputed.filter(item => item.F_Id !== id)
								if(this.landFeeComputed.length !== 0) {
									this.landTotal = this.getComputedTotal(this.landFeeComputed)[0]
								}
							}
						} else if (res.cancel) {
							return
						}
					}
				})
			},

			// 生成图片
			async getImportSaveImage() {
				if (this.freightComputed.length === 0 && this.polFeeComputed.length === 0 && this.podFeeComputed.length === 0) {
					uni.showToast({
						title: this.$t('pub.created'),
						duration: 1500,
						icon: 'none'
					})
				} else {
					let { F_Id } = this._props.lclInfo
					const { data: res } = await uni.$http.post('Lclquote/saveLclImage', {
						FreightRateId: F_Id,
						Type: 2,
						Quantity: this.packageInfo.number,
						GrossWeight: this.packageInfo.weight,
						Volume: this.packageInfo.volume,
						UnitType: Number(this.index) + 1,
						FreightAdd: this.freightComputed,
						FromFee: this.polFeeComputed,
						ToFee: this.podFeeComputed,
						FreightAddDesc: this.freightRemark,
						FromDesc: this.polRemark,
						ToDesc: this.podRemark,
						FreightTotal: this.freightTotal,
						FromTotal: this.polTotal,
						ToTotal: this.podTotal,
						ToTypeTotal: this.typeTotal,
						UsdTotal: this.convertMiniTotal,
						AreaId: this.areaCode[2]? this.areaCode[2] : '' ,
						IsLand: this.indexLand,
						TransitClause:  this.termText,
						IsCustomsCharges: this.indexClearance,
						LandFreight: this.landFeeComputed,
						TrailerChargesTotal: this.landTotal
					})
					try {
						if (res.code !== 200) return uni.$showMsg(res.info)
						uni.navigateTo({
							// url: '/pages/subPack/webview/webview?feeId=' + res.data.QuoteId + '&' + 'Type=' + res.data.Type
							url: '/pages/saveimage/saveimage?feeId=' + res.data.QuoteId + '&' + 'Type=' + res.data.Type
						})
					} catch (error) {
						console.log(error)
					}
				}
			},

			// 保存报价数据
			async getSavePriceData() {
				if (this.freightComputed.length === 0 && this.polFeeComputed.length === 0 && this.podFeeComputed.length === 0) {
					uni.showToast({
						title: this.$t('pub.created'),
						duration: 1500,
						icon: 'none'
					})
				} else {
					let { F_Id } = this._props.lclInfo
					const { data: res } = await uni.$http.post('Lclquote/saveQuote', {
						FreightRateId: F_Id,
						Type: 2,
						Quantity: this.packageInfo.number,
						GrossWeight: this.packageInfo.weight,
						Volume: this.packageInfo.volume,
						UnitType: Number(this.index) + 1,
						FreightAdd: this.freightComputed,
						FromFee: this.polFeeComputed,
						ToFee: this.podFeeComputed,
						FreightAddDesc: this.freightRemark,
						FromDesc: this.polRemark,
						ToDesc: this.podRemark,
						FreightTotal: this.freightTotal,
						PortDepartureTotal: this.polTotal,
						PortDestinationTotal: this.podTotal,
						ExpenseTypeTotal: this.typeTotal,
						CovertTotal: this.convertMiniTotal,
						IsLand: this.indexLand,
						AreaId: this.areaCode[2]? this.areaCode[2] : '',
						TransitClause: this.termText,
						IsCustomsCharges: this.indexClearance,
						LandFreight: this.landFeeComputed,
						TrailerChargesTotal: this.landTotal
					})
					try {
						if (res.code !== 200) return uni.$showMsg(res.info)
						uni.showToast({
							icon: 'success',
							title: this.$t('pub.computedsuccess'),
							duration: 1500
						})
					} catch (error) {
						console.log(error);
					}
				}
			}
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

					.oceanfee-name {
						display: block;
						color: #737687;
					}

					.oceanfee-num {
						color: #000;
						font-weight: 550;
					}
				}

				.oceanfee-mark {
					margin-top: 10rpx;
					padding: 16rpx 12px;
					color: #616577;
					font-size: 26rpx;
					background: #eee;
					border-radius: 12rpx;

					text {
						margin-right: 24rpx;
						line-height: 40rpx;
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
				
				.pub-item-title {
					max-width: 300px;
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
	
	.pub-tips {
		margin-top: 20rpx;
		padding: 0 24rpx;
		font-size: 26rpx;
		color: #a4a4a4;
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
				margin-top: 10rpx;
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
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				
				.landsearch-item-picker {
					width: 90%;
					margin-top: 10rpx;
					border-bottom: 1px solid #EBEEF5;
					padding: 10rpx 0 10rpx 0;
					box-sizing: border-box;
					
					.land-searchtip {
						color: #808080;
						font-size: 28rpx;
					}
				}

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
					margin-left: 20rpx;
					font-size: 28rpx;
					border-bottom: 1px solid #f2f2f2;
					padding-left: 20rpx;
				}

				text {
					font-size: 26rpx;
					font-weight: 550;
					margin-right: 20rpx;
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
		box-sizing: border-box;
	}

	button::after {
		border: none;
	}
</style>