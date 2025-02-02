<template>
  <div class="Subscribe">
    <el-card class="subscribe-card">
      <span>LCL Subscribe</span>
    </el-card>
    <el-card class="subscribe-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <el-button type="primary" size="mini">Add</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini">Edit</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="danger" size="mini">Delete</el-button>
        </el-col>
        <el-col :span="5" style="margin-left: 20px">
          <el-alert 
            title="Each user can subscribe up to 10 freight rates"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <p style="margin-top: 10px; font-size: 13px; color: #909399">Developing...</p>
      <!-- <el-table :data="tableData" :stripe="true" fit class="subscribe-table">
        <el-table-colm type="selection"></el-table-colm>
        <el-table-column min-width="300" prop="startCity" label="起运港"></el-table-column>
        <el-table-column min-width="300" prop="endCity" label="目的港"></el-table-column>
        <el-table-column min-width="300" prop="isEmail" label="邮件"></el-table-column>
        <el-table-column min-width="300" prop="maskText" label="备注"></el-table-column>
      </el-table> -->
    </el-card>  
  </div>
</template>

<script>
export default {
  name: 'Subscribe',
  data() {
    return {
      tableData: [{
        startCity: 'SHANGHAI 上海',
        endCity: 'ROTTERDAM 鹿特丹',
        isEmail: true,
        maskText: ''
      }]
    }
  }
}
</script>

<style scoped lang="less">
.subscribe-card {
  font-size: 15px;
}

.subscribe-box {
  margin-top: 20px;

  .el-alert {
    padding: 4px 0;
  }

  .subscribe-table {
    margin-top: 20px;
  }
}
</style>