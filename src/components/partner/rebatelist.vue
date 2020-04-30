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
      <!-- <div class="searchbox">
        起始时间：
        <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期" :style="{width:'160px',height:'40px'}"></el-date-picker>
      </div>
      <div class="searchbox">
        截止日期：
        <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期" :style="{width:'160px',height:'40px'}"></el-date-picker> 
      </div> -->
      <el-form status-icon :rules="rules2" style="display:inline-block;">
        <el-form-item  style="display:inline-block;">
          <div class="searchbox">
            起始时间：
            <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期" :style="{width:'160px',height:'40px'}" :picker-options='pickerOptions'></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endTime" style="display:inline-block;">
          <div class="searchbox">
            截止日期：
            <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期" :style="{width:'160px',height:'40px'}"></el-date-picker> 
          </div>
        </el-form-item>
      </el-form>

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
      stripe>
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
      <el-table-column prop="isCompute" label="是否已核算"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" sortable></el-table-column>
      <el-table-column prop="rebateAmount" label="返利金额" sortable></el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isCompute=='否'" type="text" @click="compute(scope.row)" style="margin-right:13px;">核算</el-button>
        </template>
      </el-table-column>
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
    var validatePass = (rule, value, callback) => {
      // console.log(this.searchParams.endTime)
        if (Date.parse(this.searchParams.endTime)<Date.parse(this.searchParams.startTime)) {
          callback(new Error('截止日期不能早于开始日期'));
        }else{
          callback();
        }
    };
    return {
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules2:{
        endTime:[
          { validator: validatePass, trigger: 'change' }
        ]
      },
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
    compute(row){
      this.$confirm(`确定返利佣金为${row.rebateAmount}元吗？`,{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
        let params=[{
          id:row.id,
          computeAmount:row.rebateAmount
        }]
        this.axios.post('/b2c/rebateOrder/compute',params)
        .then(res=>{
          // console.log(res.data)
          if(res.data.code>0){
            this.$message.success('佣金核算成功')
          }
        })
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消操作'
        })
      })
      
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
      // console.log('获取所有页面信息')
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/rebateOrder/list',{params})
      .then(res=>{
        // console.log(res.data)
        this.loading=false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.product = res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
          for(var i=0;i<this.product.length;i++){
            if(this.product[i].isCompute){
              this.product[i].isCompute="是"
            }else{
              this.product[i].isCompute="否"
            }
          }
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
.searchbox{
  font-size: 14px;
}
</style>