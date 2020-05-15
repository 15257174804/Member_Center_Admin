<template>
  <div class='reduce'>
    <!-- 标题栏 -->
    <div class="title clearfix">
      <span>满减满赠</span>
       <router-link to="/reducedetail">  
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>
    <!-- 活动搜索 -->
    <div class="search">
      <div class="searchbox">
        活动信息：
        <el-input v-model="searchParams.keyword" placeholder="如活动名称、描述等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        活动类型：
        <el-select v-model="searchParams.activityType" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="按金额满减" value='1'></el-option>
          <el-option label="按金额满赠" value='2'></el-option>
          <el-option label="按金额满折" value='3'></el-option>
          <el-option label="按数量满减" value='5'></el-option>
          <el-option label="按数量满赠" value='6'></el-option>
          <el-option label="按数量满折" value='7'></el-option>
          <el-option label="按数量满送" value='9'></el-option>
        </el-select>
      </div> 
      <div class="searchbox">
        活动状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="未发布" value='1'></el-option>
          <el-option label="已发布" value='3'></el-option>
          <el-option label="已停止" value='5'></el-option>
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
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      stripe
      style="width: 100%">
      <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
      <el-table-column type="index" label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(curP - 1) * pageSize + 1}} </span>
        </template>
      </el-table-column> 
      <el-table-column prop="activityName" label="名称" ></el-table-column>
      <el-table-column prop="computeSort" label="优先级" ></el-table-column>
      <el-table-column prop="activityCode" label="活动编码" ></el-table-column>
      <el-table-column prop="preTime" label="预热时间"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="activityType" label="活动类型" >
        <template slot-scope="scope">
          <span v-if="scope.row.activityType=='1'" >按金额满减</span>
          <span v-if="scope.row.activityType=='2'" >按金额满赠</span>
          <span v-if="scope.row.activityType=='3'" >按金额满折</span>
          <span v-if="scope.row.activityType=='5'" >按数量满减</span>
          <span v-if="scope.row.activityType=='6'" >按数量满赠</span>
          <span v-if="scope.row.activityType=='7'" >按数量满折</span>
          <span v-if="scope.row.activityType=='9'" >按数量满送</span>
        </template>
      </el-table-column>
      <el-table-column prop="activityDesc" label="活动描述" ></el-table-column>
      <el-table-column prop="status" label="活动状态" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='3'" type="success" disable-transitions>已发布</el-tag>
          <el-tag v-if="scope.row.status=='1'" type="brand" disable-transitions>未发布</el-tag>
          <el-tag v-if="scope.row.status=='5'" type="info" disable-transitions>已停止</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-tickets"></i>编辑</el-button>
          <el-button v-if="scope.row.status=='1'" type="text" @click="publish(scope.row)"><i class="el-icon-refresh"></i>发布</el-button>
          <el-button v-if="scope.row.status=='3'" type="text" @click="recall(scope.row)"><i class="el-icon-refresh"></i>关闭</el-button>
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
  name:'reduce',
  data(){
    return {
      searchParams:{
        keyword:'',
        activityType:'',
        status:''
      },
      loading:false,
      tableData:[],  //保存表格数据
      // 以下是分页信息
      pageSize:5,
      curP:1,
      totalCount:0,
    }
  },
  created(){
    this.getData();
  },
  methods:{
    // 编辑
    edit(row){
      this.$router.push({
        name:'reducedetail',
        query:{
          id:row.id,
          title:row.activityName
        }
      })
    },
    // 发布
    publish(row){
      let params={
        activityId:row.id
      }
      this.$confirm('确定要发布该活动吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('/b2c/disActivity/publish',{params})
        .then(res=>{
          if(res.data.code > 0){
            this.$message({
              type: 'success',
              message: '发布成功'
            });
          }else{
            this.$message.error(res.data.msg);
          }
          this.getData()
        })
      }).catch(()=>{
        this.$message({
            type: 'info',
            message: '已取消操作'
          }); 
      })
    },
    // 召回
    recall(row){
      let params={
        activityId:row.id
      }
      this.$confirm('确定要关闭该活动吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('/b2c/disActivity/recall',{params})
        .then(res=>{
          if(res.data.code > 0){
            this.$message({
              type: 'success',
              message: '关闭成功'
            });
          }else{
            this.$message.error(res.data.msg);
          }
          this.getData()
        })
      }).catch(()=>{
        this.$message({
            type: 'info',
            message: '已取消操作'
          }); 
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
      this.searchParams.activityType='';
      this.searchParams.status='';
      this.curP=1;
      this.getData();
    },
    search(){
      this.curP=1;
      this.getData();
    },
    timeFormate(val){
      var date=new Date(val)
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + '-' + month + '-' + day;
    },
    getData(){
      // console.log('获取页面数据')
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/disActivity/list',{params})
      .then(res=>{
        this.loading = false;
        // console.log(res.data)
        if(res.data.code>0){
          this.tableData=res.data.msg.datas;
          for(var i=0;i<this.tableData.length;i++){
            this.tableData[i].preTime=this.timeFormate(this.tableData[i].preTime)
            this.tableData[i].startTime=this.timeFormate(this.tableData[i].startTime)
            this.tableData[i].endTime=this.timeFormate(this.tableData[i].endTime)

          }
          this.totalCount=res.data.msg.totalCount;
        }else{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      })
    }
  }
}
</script>

<style>

</style>