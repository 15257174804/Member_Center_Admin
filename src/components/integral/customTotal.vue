<template>
  <div class="customTotal">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>会员统计</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        <el-date-picker
          v-model="searchParams.time"
          type="daterange"
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
      <el-table-column prop="clientName" label="门店" width="250" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.clientName">{{scope.row.clientName}}</span>
          <span v-else>{{group_name?group_name:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="statisticalCount" label="新增会员数" align="center"></el-table-column>
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
  name:'customTotal',
  data(){
    return {
      searchParams:{
        time:[]
      },
      pickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now()+86400000;
        }
      },
      dataList:[],
      loading:false,
      group_name:sessionStorage.getItem('group_name'),
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    edit(row){
      console.log(row)
      let startTime='';
      let endTime='';
      if(this.searchParams.time.length>0){
        startTime=this.dateToStr(this.searchParams.time[0]);
        endTime=this.dateToStr(this.searchParams.time[1]);
      }else{
        startTime='2019-11-20 00:00:00';
        endTime=this.dateToStr();
      }
      this.$router.push({
        path:'/customlist',
        query: {
          flag:'2',
          clientId:row.clientId?row.clientId:'',
          startTime:startTime,
          endTime:endTime
        }
      })
    },
    getData(){
      this.loading=true;
      let params={}
      if(this.searchParams.time.length>0){
        params.startTime=this.dateToStr(this.searchParams.time[0]);
        params.endTime=this.dateToStr(this.searchParams.time[1]);
      }else{
        params.startTime='2019-11-20 00:00:00';
        params.endTime=this.dateToStr();
      }
      this.axios.get('/crm/custom/group',{params})
      .then(res=>{
        this.loading=false;
        if(res.data.code>0){
          this.dataList=res.data.msg.datas;
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    search(){
      this.getData();
    },
    reset(){
      this.searchParams.time=[];
      this.getData();
    },
    dateToStr(datetime){
      if(datetime){
        var dateTime = new Date(datetime);
      }else{
        var dateTime = new Date();
      }
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
  }
}
</script>

<style>

</style>