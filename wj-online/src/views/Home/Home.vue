<template>
  <div class="Home">
    <Header></Header>
    <div class="Home-mask"></div>
    <div class="Home-box">
      <h2 class="Home-box-title">集运天下 世界万嘉</h2>
      <p class="Home-box-subtitle">青岛万嘉集运物流有限公司</p>

      <!-- 搜素部分 -->
      <div class="Home-tab">
        <ul class="Home-tab-pane">
          <li :class="num == 1? 'active' : ''" @click="num = 1">
            <span class="el-icon-s-home"></span>
            海出拼箱
          </li>
          <li :class="num == 2? 'active' : ''" @click="num = 2">
            <span class="el-icon-s-promotion"></span>
            海进拼箱
          </li>
          <li :class="num == 3? 'active' : ''" @click="num = 3">
            <span class="el-icon-menu"></span>
            海出整箱
          </li>
          <li :class="num == 4? 'active' : ''" @click="num = 4">
            <span class="el-icon-s-grid"></span>
            散货陆运
          </li>
          <li :class="num == 5? 'active' : ''" @click="num = 5">
            <span class="el-icon-s-marketing"></span>
            集卡陆运
          </li>
          <li :class="num == 6? 'active' : ''" @click="num = 6">
            <span class="el-icon-s-order"></span>
            空运出口
          </li>
        </ul>
        <div class="Home-tab-type">
          <!-- 拼箱查询 -->
          <div v-show="num == 1" class="Home-tab-item">
            <div class="Home-tab-items">
              <span>起运港</span>
              <div class="Home-input">
                <i>A</i>
                <el-select 
                  v-model="startCity" 
                  filterable
                  remote
                  :remote-method="remotePol"  
                  clearable 
                  placeholder="选择起运港"
                  @focus="getPolListData(searchPolText, 1)"
                >
                  <el-option 
                    v-for="c in polArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_PortEnglish+ ' ' + '(' + c.F_PortName + ' ' + '|' + ' ' + c.F_CountryName + ')'"
                  >
                  </el-option>
                </el-select>
              </div>

            </div>
            <div class="Home-tab-items">
              <span>目的港国家/地区</span>
              <div class="Home-input">
                <i>B</i>
                <el-select 
                  v-model="eclCity" 
                  filterable 
                  remote
                  clearable 
                  placeholder="选择目的港国家/地区"
                  @focus="getPodCountryData"
                  @change="handlerChangeCountry"
                >
                  <el-option 
                    v-for="c in podCountryArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_CountryEnglishName + ' ' + c.F_CountryName"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-items">
              <span>目的港</span>
              <div class="Home-input">
                <i>C</i>
                <el-select 
                  v-model="endCity" 
                  filterable 
                  remote
                  :remote-method="remotePod"  
                  clearable 
                  placeholder="选择目的港"
                  @focus="getPodListData(searchPodText, 1)"
                >
                  <el-option 
                    v-for="c in podArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_PortEnglish+ ' ' + '(' + c.F_PortName + ' ' + '|' + ' ' + c.F_CountryName + ')'"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-btn">
              <el-button 
                style="height: 54px; background: #0081ff"
                type="primary"
                @click="goToSearchList"
              >
                查询
              </el-button>
            </div>
          </div>
          <!-- 进口拼箱 -->
          <div v-show="num == 2" class="Home-tab-item">
            <div class="Home-tab-items">
              <span>起运港国家/地区</span>
              <div class="Home-input">
                <i>A</i>
                <el-select 
                  v-model="ilclCity" 
                  filterable
                  remote
                  clearable 
                  placeholder="选择起运港国家/地区"
                  @focus="getPodCountryData"
                  @change="handlerChangeIcl"
                >
                  <el-option 
                    v-for="c in podCountryArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_CountryEnglishName + ' ' + c.F_CountryName"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-items">
              <span>起运港</span>
              <div class="Home-input">
                <i>B</i>
                <el-select 
                  v-model="startIlclCity" 
                  filterable
                  remote
                  :remote-method="remoteImportPol"
                  clearable 
                  placeholder="选择起运港"
                  @focus="getPolListData(isearchPolText, 2)"
                >
                  <el-option 
                    v-for="c in polArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_PortEnglish+ ' ' + '(' + c.F_PortName + ' ' + '|' + ' ' + c.F_CountryName + ')'"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-items">
              <span>目的港</span>
              <div class="Home-input">
                <i>C</i>
                <el-select 
                  v-model="endIlclCity" 
                  filterable 
                  placeholder="选择目的港"
                  clearable
                  remote
                  :remote-method="remoteImportPod"
                  @focus="getPodListData(isearchPodText, 2)"
                >
                  <el-option 
                    v-for="c in podArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_PortEnglish+ ' ' + '(' + c.F_PortName + ' ' + '|' + ' ' + c.F_CountryName + ')'"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-btn">
              <el-button 
                style="height: 54px; background: #0081ff"
                type="primary"
                @click="goToSearchImportList">
                  查询
              </el-button>
            </div>
          </div>
          <!-- 海出整箱 -->
          <div v-show="num == 3" class="Home-tab-item">
            <div class="Home-tab-itemsFcl">
              <span>起运港</span>
              <div class="Home-input">
                <i>A</i>
                <el-select
                  v-model="startFCity"
                  placeholder="选择起运港"
                  filterable
                  remote
                  :remote-method="remotePol"
                  clearable
                  @focus="getPolListData(searchPolText, 1)"
                >
                  <el-option 
                    v-for="c in polArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_PortEnglish+ ' ' + '(' + c.F_PortName + ' ' + '|' + ' ' + c.F_CountryName + ')'"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-itemsFcl">
              <span>目的港</span>
              <div class="Home-input">
                <i>B</i>
                <el-select
                  v-model="endFCity" 
                  filterable
                  remote
                  :remote-method="remotePod"  
                  clearable    
                  placeholder="选择目的港"
                  @focus="getPodListData(searchPodText, 1)"
                >
                  <el-option 
                    v-for="c in podArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_PortEnglish+ ' ' + '(' + c.F_PortName + ' ' + '|' + ' ' + c.F_CountryName + ')'"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-btn">
              <el-button 
                style="height: 54px; background: #0081ff"
                type="primary"
                @click="goToSearchFclList"
              >
                查询
              </el-button>
            </div>
          </div>
          <!-- 散货业务 -->
          <div v-show="num == 4" class="Home-tab-item">
            <div class="Home-tab-date">
              <span>件数/重量/体积</span>
              <div class="Home-input" style="align-items: normal" @click="showPop('land')">
                <i>A</i>
                <el-popover
                  placement="bottom"
                  width="260"
                  trigger="click"
                  ref="landModelShow"
                >
                  <div 
                    slot="reference" 
                    class="Home-input-number" 
                    :class="landInfo.number && landInfo.weight && landInfo.volume? 'Home-input-active' : ''"
                  >
                    {{ landShowInfo? landShowInfo : '件数/重量/体积' }}
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <el-input 
                      v-model.number="landInfo.number" 
                      placeholder="请输入件数"
                      type="number"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    >
                      <template slot="prepend">件数</template>
                      <template slot="append">PCS</template>
                    </el-input>
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <el-input 
                      v-model="landInfo.weight" 
                      placeholder="请输入重量"
                      oninput="value=value.replace(/[^0-9.]/g,'')"
                    >
                      <template slot="prepend">重量</template>
                      <template slot="append">KGS</template>
                    </el-input>
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <el-input 
                      v-model="landInfo.volume" 
                      placeholder="请输入体积"
                      oninput="value=value.replace(/[^0-9.]/g,'')"
                    >
                      <template slot="prepend">体积</template>
                      <template slot="append">CBM</template>
                    </el-input>
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <el-row :gutter="20">
                      <el-col :span="7">
                        <el-button 
                          :disabled="isLandButton" 
                          type="primary"
                          @click="landConfirmData('land')"
                        >
                          确认
                        </el-button>
                      </el-col>
                      <el-col :span="7">
                        <el-button 
                          @click="closePop('land')">
                            取消
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="Home-tab-date">
              <span>提送地</span>
              <div class="Home-input">
                <i>B</i>
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
            </div>
            <div class="Home-tab-date">
              <span>提送地邮编</span>
              <div class="Home-input">
                <i>C</i>
                <el-input
                  type="number" 
                  v-model.number="zcode"
                  placeholder="请输入邮政编码"
                  clearable
                  style="line-height: 56px"
                >
                </el-input>
              </div>
            </div>
            <div class="Home-tab-date">
              <span>港口</span>
              <div class="Home-input">
                <i>D</i>
                <el-select 
                  v-model="landPod"
                  filterable
                  remote
                  clearable
                  placeholder="港口"
                  @focus="getLandLockedData('')"
                  :remote-method="remoteLandPod"
                >
                  <el-option 
                    v-for="l in podLandData" 
                    :key="l.F_Id"
                    :value="l.F_Id"
                    :label="l.F_PortEnglish+ ' ' + '(' + l.F_PortName + ' ' + '|' + ' ' + l.F_CountryName + ')'"  
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-btn">
              <el-button 
                style="height: 54px; background: #0081ff" 
                type="primary"
                @click="goToLandSearchList"
              >
                查询
              </el-button>
            </div>
          </div>
          <!-- 集卡业务 -->
          <div v-show="num == 5" class="Home-tab-item">
            <div class="Home-tab-truck Home-tab-date">
              <span>20尺/40尺/45尺</span>
              <div class="Home-input" style="align-items: normal" @click="showPop('truck')">
                <el-popover
                  placement="bottom"
                  width="260"
                  trigger="click"
                  ref="truckModelShow"
                >
                  <div 
                    slot="reference" 
                    class="Home-input-number" 
                    :class="truck.num20 || truck.num40 || truck.num45? 'Home-input-active' : ''"
                  >
                    {{ truckShowInfo? truckShowInfo : '20尺/40尺/45尺' }}
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <span>20尺：</span>
                    <el-input-number
                      v-model.number="truck.num20" 
                      :min="0"
                    >
                    </el-input-number>
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <span>40尺：</span>
                    <el-input-number 
                      v-model.number="truck.num40" 
                      :min="0"
                    >
                    </el-input-number>
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <span>45尺：</span>
                    <el-input-number 
                      v-model.number="truck.num45" 
                      :min="0"
                    >
                    </el-input-number>
                  </div>
                  <div class="Home-input-items" style="margin-bottom: 12px">
                    <el-row :gutter="20">
                      <el-col :span="7">
                        <el-button 
                          :disabled="isTruckButton" 
                          type="primary"
                          @click="truckConfirmData('truck')"
                        >
                          确认
                        </el-button>
                      </el-col>
                      <el-col :span="7">
                        <el-button 
                          @click="closePop('truck')"
                        >
                          取消
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="Home-tab-truck Home-tab-date">
              <span>提送地</span>
              <div class="Home-input">
                <el-cascader 
                  ref="cascader"
                  v-model="truckAreaData.truckName"
                  placeholder="请选择提送地"
                  clearable
                  filterable
                  :options="areaInfoArr"
                  @change="handlerChangeTruck"
                >
                </el-cascader>
              </div>
            </div>
            <div class="Home-tab-truck Home-tab-date">
              <span>提送地邮编</span>
              <div class="Home-input">
                <el-input
                  type="number" 
                  v-model.number="truckCode"
                  placeholder="请输入邮政编码"
                  clearable
                  style="line-height: 56px"
                >
                </el-input>
              </div>
            </div>
            <div class="Home-tab-truck Home-tab-date">
              <span>港口</span>
              <div class="Home-input">
                <el-select 
                  v-model="truckPod"
                  filterable
                  remote
                  clearable
                  placeholder="请选择港口"
                  @focus="getLandLockedData('')"
                  :remote-method="remoteLandPod"
                >
                  <el-option 
                    v-for="l in podLandData" 
                    :key="l.F_Id"
                    :value="l.F_Id"
                    :label="l.F_PortEnglish+ ' ' + '(' + l.F_PortName + ' ' + '|' + ' ' + l.F_CountryName + ')'"  
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-truck Home-tab-date">
              <span>港口码头</span>
              <div class="Home-input">
                <el-select 
                  v-model="truckPodId"
                  clearable
                  placeholder="请选择港口码头"
                  @focus="getTruckPodData"
                >
                  <el-option 
                    v-for="t in truckPodData" 
                    :key="t.F_Id"
                    :value="t.F_Id"
                    :label="t.F_PortQuayName + ' ' + '(' + t.F_PortQuayeEnglish + ')'"  
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-btn">
              <el-button 
                style="height: 54px; background: #0081ff" 
                type="primary"
                @click="goToTruckSearchList"
              >
                查询
              </el-button>
            </div>
          </div>
          <!-- 空运业务 -->
          <div v-show="num == 6" class="Home-tab-item">
            <div class="Home-tab-items">
              <span>起运机场</span>
              <div class="Home-input">
                <i>A</i>
                <el-select
                  v-model="flyStartCity"
                  placeholder="选择起运机场"
                  @focus="getAirportPolDataList('', 1)"
                  clearable
                  remote
                  filterable
                  :remote-method="remoteAirPol"
                >
                  <el-option 
                    v-for="airpol in airPlanePolData"
                    :key="airpol.F_Id"
                    :value="airpol.F_Id"
                    :label="airpol.F_Code + ' ' + airpol.F_NameCN"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-items">
              <span>目的机场国家/地区</span>
              <div class="Home-input">
                <i>B</i>
                <el-select 
                  v-model="flyCountryCity" 
                  filterable 
                  remote
                  clearable 
                  placeholder="选择目的机场国家/地区"
                  @focus="getPodCountryData"
                  @change="handlerChangeCountry"
                >
                  <el-option 
                    v-for="c in podCountryArr" 
                    :key="c.F_Id" 
                    :value="c.F_Id" 
                    :label="c.F_CountryEnglishName + ' ' + c.F_CountryName"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-items">
              <span>目的机场</span>
              <div class="Home-input">
                <i>C</i>
                <el-select
                  v-model="flyEndCity" 
                  placeholder="选择目的机场"
                  filterable
                  remote
                  clearable
                  :remote-method="remoteAirPod"
                  @focus="getAirportPodDataList('', 1)"
                >
                  <el-option 
                    v-for="airpod in airPlanePodData" 
                    :key="airpod.F_Id" 
                    :value="airpod.F_Id" 
                    :label="airpod.F_Code + ' ' + airpod.F_NameCN"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="Home-tab-btn">
              <el-button 
                style="height: 54px; background: #0081ff"
                type="primary"
                @click="goToAirList"
              >
                查询
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="Home-swipers">
        <el-carousel 
          type="card" 
          indicator-position="none" 
          :autoplay="true"
          height="200px"
          :interval="5000"
        >
          <el-carousel-item v-for="item in siwperArr" :key="item.id">
            <img 
              :src="item.imgUrl" 
              style="width: 100%;" 
              @click="goToDetails(item.id)" 
            />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <Footer></Footer>
    <Contact></Contact>
    <Tencent></Tencent>
  </div>
</template>

<script>
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Contact from '@/components/Contact/Contact'
import Tencent from '@/components/Tencent/Tencent'

import areaJson from '@/assets/data/area.json'

export default {
  name: 'Home',
  data() {
    return {
      num: 1,
      value: '',
      startCity: '',
      endCity: '',
      startIlclCity: '',
      endIlclCity: '',
      startFCity: '',
      endFCity: '',
      eclCity: '',
      ilclCity: '',
      
      searchPolText: '', //出口拼箱起运港
      searchPodText: '', //出口拼箱目的港
      
      isearchPolText: '', //进口拼箱起运港
      isearchPodText: '', //进口拼箱目的港

      airSearchPolText: '', // 空运起运
      airSearchPodText: '', // 空运目的
      flyCountryCity: '',

      zcode: '',
      landArea: [],
      landInfo: {
        number: '',
        weight: '',
        volume: ''
      },
      truck: {
        num20: '',
        num40: '',
        num45: ''
      },
      truckCode: '',
      truckPod: '',
      truckPodId: '',
      truckPodData: [],
      isTruckButton: true,
      truckShowInfo: '',
      truckAreaData: {truckName: ''},
      landShowInfo: '',
      isLandButton: true,
      podLandData: [],
      landPod: '',
      landAreaData: { areaName: '' },
      siwperArr: [{
        id: 1,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/pinxiang.jpg',
        text: '海运进出口拼箱'
      }, {
        id: 2,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/raillway.jpg',
        text: '多式联运'
      }, {
        id: 3,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/shopping.jpg',
        text: '跨境电商'
      }, {
        id: 4,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/transport.jpg',
        text: '陆运业务'
      }, {
        id: 5,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/supply.jpg',
        text: '供应链管理'
      }, {
        id: 6,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/air.jpg',
        text: '空运/海空联运'
      }, {
        id: 7,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/bonded.jpg',
        text: '综合物流保税'
      }, {
        id: 8,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/transfer.jpg',
        text: '国际中转集拼'
      }, {
        id: 9,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/inspection.jpg',
        text: '报关报检'
      }, {
        id: 10,
        imgUrl: 'https://wxa.worldjaguar.com/webview/images/wj_online/station.jpg',
        text: '拼箱场站'
      }],
      polArr: [],
      podArr: [],
      podCountryArr: [],
      dataArr: [],
      areaInfoArr: [],
      flyStartCity: '',
      flyEndCity: '',
      airPlanePolData: [],
      airPlanePodData: [],
      cityArray: [{
        id: 1,
        name: '胶东机场',
      }, {
        id: 2,
        name: '首都机场',
      }]
    }
  },

  created() {
    // 调用起运港
    this.getPolListData(_ ,this.num)
    // 调用目的港
    this.getPodListData(_ ,this.num)
    // 调用陆运目的港业务
    this.getLandLockedData()
    // 调用码头
    // this.getTruckPodData()
    // 调用国家
    this.getPodCountryData()
    this.areaInfoArr = areaJson

    // 调用机场
    this.getAirportPolDataList('', 1)
    this.getAirportPodDataList('', 1)
  },

  // 监听
  watch: {
    landInfo: {
      deep: true,
      immediate: true,
      handler() {
        if(this.landInfo.number == '' || this.landInfo.weight == '' || this.landInfo.volume == '') {
          this.isLandButton = true
          this.landShowInfo = '件数/重量/体积'
        }else {
          this.isLandButton = false
          this.landShowInfo = this.landInfo.number + '/' + this.landInfo.weight + '/' + this.landInfo.volume
        }
      }
    },

    truck: {
      deep: true,
      immediate: true,
      handler() {
        if(this.truck.num20 == '' && this.truck.num40 == '' && this.truck.num45 == '') {
          this.isTruckButton = true
          this.truckShowInfo = '20尺/40尺/45尺'
        }else {
          this.isTruckButton = false
          this.truckShowInfo = this.truck.num20 + '/' + this.truck.num40 + '/' + this.truck.num45
        }
      }
    }
  },

  methods: {
    showPop(type) {
      if(type == 'land') {
        this.$refs.landModelShow.doShow()
      }else {
        this.$refs.truckModelShow.doShow()
      }
    },

    closePop(type) {
      if(type == 'land') {
        this.$refs.landModelShow.doClose()
      }else {
        this.$refs.truckModelShow.doClose()
      }
    },

    // 陆运件重尺
    landConfirmData() {
      const {number, weight, volume} = this.landInfo
      this.landShowInfo = number + '/' + weight + '/' + volume
      this.closePop('land')
    },

    truckConfirmData() {
      const {num20, num40, num45} = this.truck
      this.truckShowInfo = num20 + '/' + num40 + '/' + num45
      this.closePop('truck')
    },

    goToDetails(id) {
      this.$router.push({
        path: '/Business',
        query: {
          id
        }
      })
    },

    remotePol(query) {
      this.searchPolText = query
      this.getPolListData(query, this.num)
    },

    remotePod(query) {
      this.searchPodText = query
      this.getPodListData(query, this.num)
    },

    remoteImportPol(query) {
      this.isearchPolText = query
      this.getPolListData(query, this.num)
    },

    remoteImportPod(query) {
      this.isearchPodText = query
      this.getPodListData(query, this.num)
    },

    remoteLandPod(query) {
      this.getLandLockedData(query)
    },

    remoteAirPol(query) {
      this.airSearchPolText = query
      this.getAirportPolDataList(query, 1)
    },

    remoteAirPod(query) {
      this.airSearchPodText = query
      this.getAirportPodDataList(query, 1)
    },

    // 获取起运机场
    async getAirportPolDataList(data,flag) {
      const {data: res} = await this.$http.post('data/getAirport', {
        Type: 1,
        Flag: flag,
        SearchText: data? data : '',
      })
      try {
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.airPlanePolData = res.data.data  
      }catch(error) {
        console.log(error)
      }
    },

    async getAirportPodDataList(data,flag) {
      const {data: res} = await this.$http.post('data/getAirport', {
        Type: 2,
        Flag: flag,
        SearchText: data? data : '',
        CountryId: this.flyCountryCity? this.flyCountryCity : ''
      })
      try {
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.airPlanePodData = res.data.data
      }catch(error) {
        console.log(error)
      }
    },

    // 获取国家
    async getPodCountryData() {
      const {data: res} = await this.$http.post('data/getCountry')
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.podCountryArr = res.data
      }catch(error) {
        console.log(error)
      }
    },

    // 起运港列表数据
    async getPolListData(data, flag) {
      const {data: res} = await this.$http.post('Data/getPort', {
        Type: 1,
        Flag: flag,
        SearchText: data? data : '',
        CountryId: this.ilclCity? this.ilclCity : ''
      })
      try{
        if(res.code !== 200) return this.$message({
          message: res.info, 
          duration: 2000, 
          type: 'error'
        })
        this.polArr = res.data.data
      }
      catch(error) {
        console.log(error)
      }
    },

    // 目的港列表数据
    async getPodListData(data, flag) {
      const {data: res} = await this.$http.post('Data/getPort', {
        Type: 2,
        Flag: flag,
        SearchText: data? data : '',
        CountryId: this.eclCity? this.eclCity : ''
      })
      try{
        if(res.code !== 200) return 
        this.podArr = res.data.data
      }
      catch(error) {
        console.log(error)
      }
    },

    handlerChangeCountry() {
      this.endCity = ''
      this.flyEndCity = ''
    },

    handlerChangeIcl() {
      this.startIlclCity = ''
    },

    hanlderChangeArea(value) {
      this.landAreaData.areaName = value? value : ''
    },

    handlerChangeTruck(value) {
      this.truckAreaData.truckName = value? value : ''
    },

    // 陆运中文港口数据
    async getLandLockedData(data) {
      const {data: res} = await this.$http.post('Data/getPortCn', {
        SearchText: data? data : ''
      })
      try{
        if(res.code !== 200) return
        this.podLandData = res.data.data
      }
      catch(err) {
        console.log(err)
      }
    },


    // 集卡码头
    async getTruckPodData() {
      if(this.truckPod == '') {
        this.$message({
          message: '请先选择目的港！',
          type: 'warning',
          duration: 2000
        })
      }else {
        const {data: res} = await this.$http.post('data/getQuayByPort', {
          PortId: this.truckPod
        })
        if(res.code == 200) {
          this.truckPodData = res.data
        }else {
          this.$message({
            message: res.info,
            type: 'error',
            duration: 2000
          })
        }
      }
    },

    // 跳转出口拼箱列表
    async goToSearchList() {
      const {data: res} = await this.$http.post('Exportlcl/index', {
        From: this.startCity,
        To: this.endCity,
        CountryId: this.eclCity
      })
      if(res.code == 200) {
        this.$router.push({
          name: '/LclList',
          params: {
            startCity: this.startCity,
            endCity: this.endCity,
            eclCity: this.eclCity,
            searchPolText: this.searchPolText,
            searchPodText: this.searchPodText
          }
        })
      }else {
        this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
      }
    },

    // 跳转进口拼箱列表
    async goToSearchImportList() {
      const {data :res} = await this.$http.post('Imlcl/index', {
        From: this.startIlclCity,
        To: this.endIlclCity,
        CountryId: this.ilclCity
      })
      if(res.code === 200) {
        this.$router.push({
          name: '/ILclList',
          params: {
            startCity: this.startIlclCity,
            endCity: this.endIlclCity,
            ilclCity: this.ilclCity,
            isearchPolText: this.isearchPolText,
            isearchPodText: this.isearchPodText
          }
        })
      }else {
        this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
      }
    },

    // 跳转出口整箱列表
    async goToSearchFclList() {
      const {data: res} = await this.$http.post('Exportfcl/index', {
        From: this.startFCity,
        To: this.endFCity
      })
      if(res.code === 200) {
        this.$router.push({
          name: '/FclList',
          params: {
            startCity: this.startFCity,
            endCity: this.endFCity,
            searchPolText: this.searchPolText,
            searchPodText: this.searchPodText
          }
        })
      }else {
        this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
      }
    },

    // 跳转散货陆运
    async goToLandSearchList() {
      const {number, weight, volume} = this.landInfo
      const {areaName} = this.landAreaData
      if(number == '' || weight == '' || volume == '') {
        this.$message({
          message: '请输入货物信息',
          type: 'error',
          duration: 2000
        })
      }else if(areaName == '' && this.zcode == '') {
        this.$message({
          message: '请填写发货地或发货地邮政编码',
          type: 'error',
          duration: 2000
        })
      }else if(this.landPod == '') {
        this.$message({
          message: '请选择港口',
          type: 'error',
          duration: 2000
        })
      }else {
        const {data: res} = await this.$http.post('Landtrans/index', {
          AreaId: this.landAreaData.areaName[2],
          PortId: this.landPod,
          Quantity: this.landInfo.number,
          GrossWeight: this.landInfo.weight,
          Volume: this.landInfo.volume,
          PostCode: this.zcode
        })
        if(res.code == 200) {
          this.$router.push({
            name: '/LandList',
            params: {
              landPod: this.landPod,
              areaName: this.landAreaData.areaName,
              number: this.landInfo.number,
              weight: this.landInfo.weight,
              volume: this.landInfo.volume,
              zcode: this.zcode
            }
          })
        }
      }
    },

    // 跳转集卡陆运
    async goToTruckSearchList() {
      const {num20, num40, num45} = this.truck
      const {truckName} = this.truckAreaData
      if(num20 == '' && num40 == '' && num45 == '') {
        this.$message({
          message: '请选择箱型',
          type: 'error',
          duration: 2000
        })
      }else if(truckName == '' && this.truckCode == '') {
        this.$message({
          message: '请填写发货地或发货地邮政编码',
          type: 'error',
          duration: 2000
        })
      }else if(this.truckPod == '') {
        this.$message({
          message: '请选择收货地',
          type: 'error',
          duration: 2000
        })
      }else {
        const {data: res} = await this.$http.post('Landtrans/truckIndex', {
          AreaId: this.truckAreaData.truckName[2],
          PostCode: this.truckCode,
          PortId: this.truckPod,
          QuayId: this.truckPodId,
          Quantity20: this.truck.num20,
          Quantity40: this.truck.num40,
          Quantity45: this.truck.num45
        })
        this.$router.push({
          name: '/TruckList',
          params: {
            truckName: this.truckAreaData.truckName,
            truckCode: this.truckCode,
            truckPod: this.truckPod,
            truckPodId: this.truckPodId,
            num20: this.truck.num20,
            num40: this.truck.num40,
            num45: this.truck.num45
          }
        })
      }
    },

    // 跳转空运列表
    async goToAirList() {
      const {data: res} = await this.$http.post('Exportair/index', {
        From: this.flyStartCity,
        To: this.flyEndCity,
        CountryId: this.flyCountryCity
      })
      if(res.code == 200) {
        this.$router.push({
          name: '/AirList',
          params: {
            flyStartCity: this.flyStartCity,
            flyEndCity: this.flyEndCity,
            flyCountryCity: this.flyCountryCity,
            airSearchPolText: this.airSearchPolText,
            airSearchPodText: this.airSearchPodText,
          }
        })
      }else {
        this.$message({
          message: res.info,
          type: 'error',
          duration: 2000
        })
      }
    }
  },

  components: {
    Header,
    Footer,
    Contact,
    Tencent
  }
}
</script>

<style scoped lang="less">
.Home {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('https://wxa.worldjaguar.com/webview/images/wj_online/bg_home.jpg') no-repeat;
  background-position: top center;
  background-size: 100% 100%;

  .Home-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(1, 5, 17, 0.45);
  }

  .Home-box {
    position: absolute;
    top: 180px;
    left: 50%;
    width: 1200px;
    height: 320px;
    transform: translate(-50%);

    @media screen and (max-width: 1366px) {
      top: 140px;
    }

    .Home-box-title {
      color: #fff;
      text-align: center;
      font-weight: 500;
      font-size: 36px;
      letter-spacing: 3px;
    }

    .Home-box-subtitle {
      text-align: center;
      font-size: 18px;
      color: #fff;
      letter-spacing: 5px;
      margin-top: 6px;
    }

    .Home-tab {
      width: 100%;
      margin: 25px auto 0 auto;

      @media screen and (max-width: 1366px) {
        margin: 12px auto 0 auto;
      }

      .Home-tab-pane {
        width: 760px;
        display: flex;
        align-items: center;

        li {
          width: 33.33%;
          text-align: center;
          color: #fff;
          cursor: pointer;
          font-size: 15px;
        }

        .active {
          // background: rgba(244, 246, 248, .3);
          background: #e9f0f7;
          opacity: 0.95;
          // backdrop-filter: blur(10px) opacity(1);
          padding: 8px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          font-weight: 500;
          color: #0081ff;
        }
      }

      .Home-tab-type {
        height: 100px;
        // background: rgba(244, 246, 248, .3);
        background: #e9f0f7;
        opacity: 0.95;
        // backdrop-filter: blur(12px) opacity(1);
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        padding: 12px 30px 0px 30px;

        .Home-tab-item {
          display: flex;
          justify-content: space-between;
          // align-items: center;

          span {
            display: block;
            margin-bottom: 5px;
            color: #0081ff;
            font-size: 14px;
            font-weight: 500;
          }

          .Home-tab-items {
            width: 31%;

            .Home-input {
              display: flex;
              align-items: center;
              
              i {
                width: 50px;
                background: #fff;
                height: 54px;
                line-height: 54px;
                text-align: center;
                color: #555;
                font-weight: 550;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border: 1px solid #DCDFE6;
                border-right: none;
              }

              .el-select {
                width: 100%;

                /deep/ .el-input__icon {
                  line-height: 56px;
                }
              }
            }

            ::v-deep .el-input__inner {
              height: 56px;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }

          .Home-tab-btn {
            width: 5%;
            margin-top: 24px;
          }

          .Home-tab-itemsFcl {
            width: 46.5%;

            .Home-input {
              display: flex;
              align-items: center;
              
              i {
                width: 50px;
                background: #fff;
                height: 54px;
                line-height: 54px;
                text-align: center;
                color: #555;
                font-weight: 550;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border: 1px solid #DCDFE6;
                border-right: none;
              }

              .el-select {
                width: 100%;

                /deep/ .el-input__icon {
                  line-height: 56px;
                }
              }
            }

            ::v-deep .el-input__inner {
              height: 56px;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }

          .Home-tab-date {
            width: 23%;

            .Home-input {
              display: flex;
              align-items: center;

              span {
                width: 100%;
                display: inline-grid;
              }

              i {
                width: 50px;
                background: #fff;
                height: 54px;
                line-height: 54px;
                text-align: center;
                color: #555;
                font-weight: 550;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border: 1px solid #DCDFE6;
                border-right: none;
              }

              .el-cascader {
                width: 100%;

                /deep/ .el-input__icon {
                  line-height: 56px;
                }
              }

              .el-select {
                width: 100%;

                /deep/ .el-input__icon {
                  line-height: 56px;
                }
              }

              .Home-input-number {
                width: 100%;
                height: 56px;
                line-height: 56px;
                background: #fff;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                color: #C0C4CC;
                line-height: 56px;
                padding: 0 12px;
                box-sizing: border-box;
                // border-left: 1px solid #ccc;
                border: 1px solid #DCDFE6;
              }

              .Home-input-active {
                color: #606266;
                font-size: 14px;
              }
            }


            ::v-deep .el-input__inner {
              height: 56px;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }

            .Home-tab-picker {
              ::v-deep .el-input__inner {
                height: 56px;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
            }
          }

          .Home-tab-truck {
            width: 18.2%;

            .Home-input-number {
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }

            ::v-deep .el-input__inner {
              height: 56px;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
          }
        }
      }
    }

    .Home-swipers {
      margin-top: 30px;

      @media screen and (max-width: 1366px) {
        display: none;
      }

      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
        border-radius: 10px;
        overflow: hidden;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
        border-radius: 10px;
      }

      /deep/ .el-carousel__arrow--right,
      .el-notification.right {
        right: 16px !important;
      }
    }
  }
}


/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

/deep/ .el-input__inner {
  line-height: 1px !important;
}
</style>