<template>
  <div class="fulldiscount">
    <!-- 标题栏 -->
    <div class="title clearfix">
      <span>优惠券管理</span>
       <router-link to="fulldetail">  
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>

    <!-- 活动搜索 -->
    <div class="search">
      <div class="searchbox">
        优惠券信息：
        <el-input v-model="searchParams.keyword" placeholder="如优惠券名称、描述等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        优惠券类型：
        <el-select v-model="searchParams.ticketType" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="满减" value='1'></el-option>
          <el-option label="满折" value='3'></el-option>
          <el-option label="满赠" value='2'></el-option>
        </el-select>
      </div> 
      <div class="searchbox">
        优惠券状态：
        <el-select v-model="searchParams.ticketStatus" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="初始" value='1'></el-option>
          <el-option label="已发布" value='2'></el-option>
          <el-option label="已废弃" value='-1'></el-option>
        </el-select>
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

    <!-- 列表 -->
    <!-- 里面的具体变量需要修改，等接口完成之后按照接口来改 -->
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="ticketName" label="名称" ></el-table-column>
      <el-table-column prop="startTime" label="领取开始时间"></el-table-column>
      <el-table-column prop="endTime" label="领取结束时间"></el-table-column>
      <el-table-column prop="useStartTime" label="使用开始时间" ></el-table-column>
      <el-table-column prop="useEndTime" label="使用结束时间" ></el-table-column>
      <el-table-column prop="ticketTypeName" label="优惠券类型" ></el-table-column>
      <el-table-column prop="ticketDesc" label="优惠券描述" ></el-table-column>
      <el-table-column prop="discountTicketStatus" label="优惠券状态" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.discountTicketStatus=='2'" type="success" disable-transitions>已发布</el-tag>
          <el-tag v-if="scope.row.discountTicketStatus=='1'" type="brand" disable-transitions>初始</el-tag>
          <el-tag v-if="scope.row.discountTicketStatus=='-1'" type="info" disable-transitions>已废弃</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-tickets"></i>编辑</el-button>
          <el-button v-if="scope.row.discountTicketStatus!='-1'" type="text" @click="publish(scope.row)"><i class="el-icon-refresh"></i>发布/废弃</el-button>
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
  name:'fulldiscount',
  data(){
    return {
      searchParams:{
        keyword:'',
        ticketType:'',
        discountTicketStatus:''
      },
      loading:false,
      tableData:[],  //保存表格数据
      // 以下是分页信息
      pageSize:5,
      curP:1,
      totalCount:0,
    }
  },
  methods:{
    // 跳转到对应预约活动的详情
    edit(row){
      console.log('点击详情，改行的row')
      console.log(row)
      // console.log(row.id)
      this.$router.push({
        name:'fulldetail',
        query:{
          id:row.id,
          title:row.ticketName
        }
      })
    },
    // 停止开启活动状态
    publish(row){
      console.log('这是修改活动状态')
      this.$confirm('确定要发布/废弃该优惠券吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(row.discountTicketStatus=='1'){
          let params={
            ticketId:row.id
          }
          this.axios.get('/b2c/discountTicket/publish',{params})
          .then(res=>{
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }else{
              this.$message.error(res.data.msg);
            }
            this.getData()
          })
        }else if(row.discountTicketStatus=='2'){
          let params=row
          params.discountTicketStatus='-1'
          this.axios.post('/b2c/discountTicket/save',params)
          .then(res=>{
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }else{
              this.$message.error(res.data.msg);
            }
            this.getData()
          })
        }
        
        

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
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
    reset(){
      this.searchParams.keyword='';
      this.searchParams.ticketType='';
      this.searchParams.ticketStatus='';
      this.curP=1;
      this.getData();
    },
    search(){
      this.curP=1;
      this.getData();
    },
    getData(){
      console.log('获取页面数据')
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/discountTicket/list',{params})
      .then(res=>{
        this.loading = false;
        console.log(res.data)
        if(res.data.code>0){
          this.tableData=res.data.msg.datas;
          this.totalCount=res.data.msg.totalCount;
        }else{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
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

</style>