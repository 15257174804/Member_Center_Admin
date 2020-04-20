<template>
  <div class="rebatelist">
    <div class="title clearfix">
      <span>返利明细</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        订单号：
        <el-input v-model="searchParams.orderNo" placeholder="请输入订单号" :style="{width:'160px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        起始时间：
        <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期" :style="{width:'160px',height:'40px'}"></el-date-picker>
      </div>
      <div class="searchbox">
        截止日期：
        <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期" :style="{width:'160px',height:'40px'}"></el-date-picker> 
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

    <el-table
      v-loading="loading"
      border
      :data="product"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column prop="orderTime" label="创建时间"></el-table-column>
      <el-table-column prop="goodsPic" label="商品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.goodsPic" height="100" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.goodsPic">
            <span v-else>暂无</span>
          </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="goodPrice" label="商品价格"></el-table-column>
      <!-- <el-table-column prop="orderCount" label="数量"></el-table-column> -->
      <el-table-column prop="orderAmount" label="订单金额" sortable></el-table-column>
      <el-table-column prop="rebateAmount" label="返利金额" sortable></el-table-column>
      <!-- <el-table-column prop="rebateRate" label="返利比例" sortable></el-table-column> -->
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
  name:'rebatelist',
  data(){
    return {
      searchParams:{
        orderNo:'',
        startTime:'',
        endTime:''
      },
      product:[],   //保存商品的明细
      loading: false,
      pageSize:5,
      curP:1,
      totalCount:0,
    }
  },
  methods:{
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
      this.getData();
    },
    // 第几页
    handleCurrentChange(curP) {
      this.curP = curP;
      this.getData();
    },
    search(){
      this.curP=1;
      this.getData();
    },
    reset(){
      this.searchParams.orderNo='';
      this.searchParams.startTime='';
      this.searchParams.endTime='';
      this.getData();
    },
    getData(){
      console.log('获取所有页面信息')
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/rebateOrder/list',{params})
      .then(res=>{
        console.log(res.data)
        this.loading=false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.product = res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
        }
      })
    }
  },
  mounted(){
    this.getData();
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