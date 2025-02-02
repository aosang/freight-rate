<template>
  <div class="Filters">
    <div class="Filters-l">
      <div class="Filters-item-icon">
        <el-icon class="el-icon-s-order"></el-icon>
        <span>筛选</span>
      </div>
    </div>
    <div class="Filters-r">
      <div class="Filters-item">
        <el-select v-model="consignee" class="Filters-item-input" placeholder="请选择收货人类型">
          <el-option value="同行"></el-option>
          <el-option value="直客"></el-option>
        </el-select>
      </div>
      <div class="Filters-item">
        <el-select v-model="transport" class="Filters-item-input" placeholder="请选择运输方式">
          <el-option value="直拼"></el-option>
          <el-option value="转拼"></el-option>
        </el-select>
      </div>
      <div class="Filters-item">
        <el-input class="Filters-item-input" placeholder="请选择中转港">
          
        </el-input>
      </div>
      <div class="Filters-item">
        <el-input class="Filters-item-input" placeholder="请选择接货仓库">
          
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  data() {
    return {
      consignee: '',
      transport: ''
    }
  }
}
</script>

<style scoped lang="less">
.Filters {
  display: flex;
  width: 1200px;
  margin: 12px auto 0 auto;
  background: #fff;
  box-shadow: 5px 5px 20px #e1e1e1;
  padding: 12px 15px;
  align-items: center;
  box-sizing: border-box;

  .Filters-l {
    width: 5%;
    .Filters-item-icon {
      display: flex;
      align-items: center;
      color: #073290;
      font-size: 15px;
    }
  }

  .Filters-r {
    display: flex;
    width: 95%;
    justify-content: space-between;
    .Filters-item {
      width: 24.5%; 
      .Filters-item-input {
        width: 100%;
      } 
    }
  }
}
</style>