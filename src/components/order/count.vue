<template>
  <div class="count">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>预约产品统计</span>
    </div>

    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        商品名称：
        <el-input v-model="searchParams.goodName" placeholder="请输入商品名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        <div class="block">
          起始时间：
          <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期"></el-date-picker>
        </div>
      </div>
      <div class="searchbox">
        <div class="block">
          截止日期：
          <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期"></el-date-picker> 
        </div>
      </div>
      <div class="searchbox">
        <el-button type="primary" @click="search()">
          <i class="el-icon-zoom-in"></i>
          查询
        </el-button>
      </div>
      <div class="searchbox">
        <el-button @click="reset()">
          <i class="el-icon-refresh-right"></i>
          重置
        </el-button>
      </div>
    </div>

    <!-- 表单 -->
    <!-- 表单信息 -->
    <el-table
      v-loading="loading"
      border
      :data="product"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <!-- <el-table-column prop="preSellName" label="活动名称"></el-table-column> -->
      <el-table-column prop="goodCode" label="商品编号"></el-table-column>
      <el-table-column prop="goodName" label="商品名"></el-table-column>
      <el-table-column prop="price" label="单价" sortable></el-table-column>
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="totalQuantity" label="允许预约总数量" sortable></el-table-column>
      <el-table-column prop="presonalQty" label="个人预约数量" sortable></el-table-column>
      <el-table-column prop="corpQty" label="企业预约数量" sortable></el-table-column>
      <el-table-column prop="quantity" label="已售数量" sortable></el-table-column>
      <el-table-column prop="inventoryQuantity" label="库存" sortable></el-table-column>
      <!-- <el-table-column prop="startTime" label="预约开始时间" sortable></el-table-column> -->
      <!-- <el-table-column prop="endTime" label="预约结束时间" sortable></el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curP"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>

  </div>
</template>

<script>
export default {
  name:'count',
  data(){
    return {
      searchParams:{
        goodName:'',
        startTime:'',
        endTime:''
      },
      product:[],   //保存商品的明细
      loading: true,
      pageSize:5,
      curP:1,
      totalCount:0,
    }
  },
  methods:{
    // 搜索
    search(){
      this.curP=1;
      this.getList();
    },
    // 重置
    reset(){
      this.searchParams.goodName=''
    },
    // 行的背色
    tableRowClassName({row, rowIndex}) {
      if (rowIndex == 0){
        return '';
      }
      else if (rowIndex % 3 == 0) {
        return 'success-row';
      }
      else if (rowIndex % 2 == 0){
        return '';
      } 
      else if (rowIndex % 1 == 0){
        return 'warning-row';
      }
      return '';
    },
    // 每页多少条
    handleSizeChange(size) {
      this.pageSize = size;
      this.getList();
    },
    // 第几页
    handleCurrentChange(curP) {
      this.curP = curP;
      this.getList();
    },
    // 获取所有详细信息
    getList(){
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/statistical/pre/sell/byGood',{params})
      .then(res=>{
        this.loading = false;
        console.log(res.data)
        this.product=res.data.msg.datas;
        this.totalCount=res.data.msg.totalCount;
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
  mounted(){
    this.getList()
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>