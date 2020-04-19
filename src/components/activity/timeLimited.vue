<template>
  <div class="timelimited">
    <!-- 标题栏 -->
    <div class="title clearfix">
      <span>限时抢购</span>
       <router-link to="limiteddetail">  
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>
    <!-- 活动搜索 -->
    <div class="search">
      <div class="searchbox">
        活动名称：
        <el-input v-model="searchParams.keyword" placeholder="如活动名称、编号等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        活动状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="进行中" value='1'></el-option>
          <el-option label="已停止" value='0'></el-option>
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
    <!-- 商品搜索结束 -->

    <!-- 预约产品的列表 -->
    <!-- 里面的具体变量需要修改，等接口完成之后按照接口来改 -->
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%">
      <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
      <el-table-column prop="name" label="活动名称" ></el-table-column>
      <el-table-column prop="warmUpTime" label="预热时间" sortable></el-table-column>
      <el-table-column prop="startTime" label="抢购开始时间" sortable></el-table-column>
      <el-table-column prop="endTime" label="抢购结束时间" sortable></el-table-column>
      <el-table-column width="160" prop="status" label="活动状态" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ==1 ? 'success':'danger' "
            disable-transitions
          >{{scope.row.status ==1 ? '进行中':'已停止'}}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="stop(scope.row)"><i class="el-icon-refresh"></i>结束/开启</el-button>
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
  name:'timelimited',
  data(){
    return{
      searchParams:{
        keyword:'',
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
  methods:{
    // 跳转到对应预约活动的详情
    edit(row){
      console.log('点击详情，改行的row')
      console.log(row)
      // console.log(row.id)
      this.$router.push({
        name:'limiteddetail',
        query:{
          id:row.id,
          title:row.name
        }
      })
    },
    // 停止活动状态
    stop(row){
      console.log('这是修改活动状态')
      this.$confirm('确定要停止/启动该活动吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={
          id:row.id
        }
        if(row.status==1){  //关闭活动
          this.axios.post('/b2c/discount/stop',params)
          .then(res=>{
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: res.data.errmsg
              });
            }else{
              this.$message.error(res.data.errmsg);
            }
            this.getData();
          })
        }else{  //开启活动
          this.axios.post('/b2c/discount/start',params)
          .then(res=>{
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: res.data.errmsg
              });
            }else{
              this.$message.error(res.data.errmsg);
            }
            this.getData();
          })
        }
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    search(){
      this.curP=1;
      this.getData();
    },
    // 重置
    reset(){
      this.searchParams.keyword="";
      this.searchParams.status="";
      this.curP=1;
      this.getData();
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
    getData(){
      console.log('获取页面数据')
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      console.log(params)
      this.axios.get('/b2c/discount/list',{params})
      .then(res=>{
        this.loading = false;
        console.log(res.data)
        if(res.data.code>0){
          this.tableData=res.data.msg.datas;
        }else{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      }).catch(err=>{
        console.log(err)
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