<template>
  <div class="orderTotal">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>订单汇总</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        订单类型：
        <el-select v-model="searchParams.orderType" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" :value="0"></el-option>
          <el-option label="普通订单" :value="1"></el-option>
          <el-option label="预约订单" :value="2"></el-option>
          <el-option label="积分订单" :value="3"></el-option>
        </el-select>
      </div>
      <div class="searchbox">
        时间范围：
        <el-select v-model="searchParams.statisticalType" :style="{width:'120px',height:'40px'}">
          <el-option label="当天" :value="1"></el-option>
          <el-option label="前三天" :value="2"></el-option>
          <el-option label="前七天" :value="3"></el-option>
          <el-option label="本月" :value="4"></el-option>
          <el-option label="本年" :value="5"></el-option>
          <el-option label="自定义" :value="6"></el-option>
        </el-select>
      </div>
      <div class="searchbox" v-if="searchParams.statisticalType==6">
        <el-date-picker
          v-model="searchParams.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
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
      :data="dataList"
      border
      show-summary
      style="width: 100%"> 
      <!-- <el-table-column type="index" label="序号" width="100" align="center"></el-table-column> -->
      <el-table-column prop="status" label="订单状态" width="250" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">未付款</span>
          <span v-else-if="scope.row.status==2">已支付</span>
          <span v-else-if="scope.row.status==3">已发货</span>
          <span v-else-if="scope.row.status==4">已完成</span>
          <span v-else-if="scope.row.status==8">已关闭</span>
          <span v-else-if="scope.row.status==5">企业预约订单待审核</span>
          <span v-else-if="scope.row.status==1">已核销</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderCount" label="订单数" width="150" align="center"></el-table-column>
      <el-table-column prop="detailCount" label="订单明细数量" width="150" align="center"></el-table-column>
      <el-table-column prop="goodCount" label="商品数" width="150" align="center"></el-table-column>
      <el-table-column prop="amount" label="总金额" align="center"></el-table-column>
      <el-table-column
        align='center'
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-view"></i>查看</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name:'orderTotal',
  data(){
    return {
      searchParams:{
        orderType:0,
        statisticalType:5,
        time:[]
      },
      loading:false,
      dataList:[],
      pickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now();
        }
      }
    }
  },
  created(){
    this.getDataList();
  },
  methods:{
    edit(row){
      console.log(row)
      let params={
        orderType:this.searchParams.orderType,
        statisticalType:this.searchParams.statisticalType
      }
      if(params.statisticalType==6){
        params.startTime=this.dateToStr(this.searchParams.time[0]);
        params.endTime=this.dateToStr(this.searchParams.time[1]);
      }
      this.axios.get('/b2c/statistical/order/summaryTimeRange',{params})
      .then(res=>{
        if(res.data.code>0){
          let startTime=res.data.msg.startTime;
          let endTime=res.data.msg.endTime;
          if(this.searchParams.orderType==0){
            this.$message.warning('请先选择订单类型')
            return
          }else if(this.searchParams.orderType==1){   //普通订单
            this.$router.push({
              path:'/order',
              query: {
                flag:'5',
                status:row.status,
                startTime:startTime,
                endTime:endTime
              }
            })
          }else if(this.searchParams.orderType==2){  //预约订单
            this.$router.push({
              path:'/preorder',
              query: {
                flag:'2',
                status:row.status,
                startTime:startTime,
                endTime:endTime
              }
            })
          }else if(this.searchParams.orderType==3){  //积分订单
            this.$router.push({
              path:'/integralList',
              query: {
                flag:'1',
                status:row.status,
                startTime:startTime,
                endTime:endTime
              }
            })
          }
        }
      })
      
    },
    getDataList(){
      this.loading = true;
      let params={
        orderType:this.searchParams.orderType,
        statisticalType:this.searchParams.statisticalType
      };
      if(params.statisticalType==6){
        params.startTime=this.dateToStr(this.searchParams.time[0]);
        params.endTime=this.dateToStr(this.searchParams.time[1]);
      }
      this.axios.get('/b2c/statistical/order/summary',{params})
      .then(res=>{
        this.loading=false;
        if(res.data.code>0){
          this.dataList=res.data.msg;
          // this.totalCount=res.data.
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    dateToStr(datetime){
        var dateTime = new Date(datetime);
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;//js从0开始取
        var date = dateTime.getDate();
        var hour = dateTime.getHours();
        var minutes = dateTime.getMinutes();
        var second = dateTime.getSeconds();
 
        if(month<10){
            month = "0" + month;
        }
        if(date<10){
            date = "0" + date;
        }
        if(hour <10){
            hour = "0" + hour;
        }
        if(minutes <10){
            minutes = "0" + minutes;
        }
        if(second <10){
            second = "0" + second ;
        }
 
        return year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second;
    },
    //查询
    search(){
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.orderType=0;
      this.searchParams.statisticalType=1;
      this.getDataList();
    }
  }
}
</script>

<style lang="scss">
.searchbox{
  font-size: 14px;
}

</style>