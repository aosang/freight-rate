<template>
  <div class="Schedule">
    <common-header></common-header>
    <Search>
      <template slot="Search-col">
        <div class="Search-item">
          <span>起运港：</span>
          <div class="Schedule-input">
            <i>A</i>
            <el-select v-model="startShipCity" filterable placeholder="选择起运港">
              <el-option v-for="c in cityArr" :key="c.id" :value="c.id" :label="c.name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>目的港：</span>
          <div class="Schedule-input">
            <i>B</i>
            <el-select v-model="endShipCity" filterable placeholder="选择目的港">
              <el-option v-for="c in cityArr" :key="c.id" :value="c.id" :label="c.name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="Search-item">
          <span>开航日</span>
          <el-date-picker style="width: 340px" type="date" placeholder="选择日期时间" class="Home-tab-picker" v-model="value">
          </el-date-picker>
        </div>
        <el-button 
          class="Search-btn" 
          type="primary" 
          icon="el-icon-search"
        >
        </el-button>
      </template>
    </Search>
    <!-- tab切换 -->
    <div class="Search-date">
      <ul>
        <li v-for="(t, index) in dateArr" :key="index" @click="tabsHandler(index)"
          :class="tabsIndex === index ? 'active' : ''">
          {{ t.date }}
        </li>
      </ul>
    </div>
    <div class="Schedule-table">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="直达方案" name="1">
          <table>
            <thead>
              <tr>
                <th width="90">大船ETD</th>
                <th width="90">总航程</th>
                <th width="90">码头</th>
                <th width="500">共舱船公司(航线代码)</th>
                <th width="230">大船船名/航次</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>周一</td>
                <td>18天</td>
                <td>洛杉矶</td>
                <td>HMM(PS4)/HPL(PS4)/ONE(PS4)/YML(PS4)123123123123</td>
                <td>EVER FUTURE/1288E</td>
                <td><el-tag size="small" effect="dark" type="success">准点</el-tag></td>
              </tr>
              <tr>
                <td>周一</td>
                <td>18天</td>
                <td>深圳</td>
                <td>HMM(PS4)/HPL(PS4)/ONE(PS4)/YML(PS4)123123123123</td>
                <td>EVER FUTURE/1288E</td>
                <td><el-tag size="small" effect="dark" type="success">提前2天</el-tag></td>
              </tr>
            </tbody>
          </table>
        </el-collapse-item>

        <el-collapse-item title="中转方案" name="2">
          <table>
            <thead>
              <tr>
                <th width="90">大船ETD</th>
                <th width="90">总航程</th>
                <th width="90">码头</th>
                <th width="500">共舱船公司(航线代码)</th>
                <th width="230">大船船名/航次</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>周一</td>
                <td>18天</td>
                <td>盐田</td>
                <td>
                  OOCL(PCN1)
                  <span class="中转" style="margin-left: 90px">2程&nbsp;转&nbsp;LONG BEACH,CA</span>
                </td>
                <td>空班</td>
                <td><el-tag size="small" effect="dark" type="danger">延误一天</el-tag></td>
              </tr>
            </tbody>
          </table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <common-footer></common-footer>
    <contact></contact>
  </div>
</template>

<script>
import CommonHeader from '@/components/Header/CommonHeader';
import CommonFooter from '@/components/Footer/CommonFooter'
import Search from '@/components/Search/Search'
import Contact from '@/components/Contact/Contact'
export default {
  name: 'Schedule',
  data() {
    return {
      value: '',
      tabsIndex: 0,
      activeNames: ['1', '2'],
      startShipCity: '',
      endShipCity: '',
      cityArr: [{
        id: 1,
        name: '青岛'
      }, {
        id: 2,
        name: '阿德莱德'
      }],
      dateArr: [{
        id: 1,
        date: '本周 03.13-03.19'
      }, {
        id: 2,
        date: '下一周 03.20-03.26'
      }, {
        id: 3,
        date: '下二周 03.27-04.02'
      }, {
        id: 4,
        date: '下三周 04.03-04.09'
      }]
    }
  },

  methods: {
    tabsHandler(index) {
      this.tabsIndex = index
    }
  },

  components: {
    Search,
    CommonHeader,
    CommonFooter,
    Contact
  }
}
</script>

<style scoped lang="less">
.Search-item {
  width: 32.8%;

  .Schedule-input {
    display: flex;
    align-items: center;

    i {
      width: 50px;
      background: #fff;
      height: 48px;
      line-height: 48px;
      text-align: center;
      color: #555;
      font-weight: 550;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .el-select {
      width: 100%;

      /deep/ .el-input__icon {
        line-height: 50px;
      }
    }

    ::v-deep .el-input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  span {
    font-size: 13px;
    color: #697e9d;
    margin-bottom: 6px;
  }

  ::v-deep .el-input__inner {
    height: 50px;
  }
}

.Search-date {
  position: sticky;
  top: 120px;
  z-index: 3;
  width: 1200px;
  margin: 20px auto;
  background: #fff;
  padding: 15px;
  align-items: center;
  box-sizing: border-box;
  border-radius: 10px;
  border-bottom: 4px solid #eff3f6;

  ul {
    display: flex;

    li {
      flex: 1;
      font-size: 13px;
      text-align: center;
      color: #9ea1b1;
      padding: 6px 0;
      border-radius: 5px;
      cursor: pointer;
    }

    .active {
      color: #395ba6;
      font-weight: 550;
      font-size: 14px;
      background: #b5c2de;
    }
  }
}

.Schedule-table {
  width: 1200px;
  margin: 5px auto 0 auto;
  background: #fff;
  padding: 15px;
  box-sizing: border-box;

  .el-collapse {
    border-top: none;
    /deep/ .el-collapse-item__header {
      border-bottom: 1px solid #eee;
    }
    /deep/ .el-collapse-item__wrap {
      border-bottom: none;
    }
  }

  table {
    width: 100%;
    table-layout: fixed;

    th {
      text-align: left;
    }

    td,
    th {
      white-space: nowrap;
      font-size: 13px;
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #eee
    }
  }
}

/deep/ .el-collapse-item__header {
  font-size: 16px;
  font-weight: 550;
  color: #0081ff;
}
</style>