<template>
  <div class="newslist">
    <div class="title clearfix">
      <span>公告列表</span>
      <router-link to="/addnews">
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>
    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        公告标题：
        <el-input v-model="searchParams.title" placeholder="请输入公告标题" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        公告类型：
        <el-select v-model="searchParams.type" :style="{width:'100px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="行业资讯" value="1"></el-option>
          <el-option label="招商信息" value="2"></el-option>
        </el-select>
      </div> 
      <!-- <div class="searchbox">   预留字段
        状态：
        <el-select v-model="searchParams.status" :style="{width:'100px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="行业资讯" value="1"></el-option>
          <el-option label="招商信息" value="2"></el-option>
        </el-select>
      </div>  -->
      <!-- 按钮 -->
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
      stripe 
      style="width: 100%"
      >
      <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
      <el-table-column type="index" label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span>
        </template>
      </el-table-column> 
      <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="type" label="公告类型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type==1">行业资讯</span>
          <span v-if="scope.row.type==2">招商信息</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容">
        <template slot-scope="scope">
          <p v-html="scope.row.context"></p>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" v-if="scope.row.status==0">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" style="margin-right:13px;"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
          <!--  -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>

  </div>
</template>

<script>
export default {
  name:'newslist',
  data(){
    return {
      searchParams:{
        title:"",
        type:'',
        // status:''   //预留字段
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
    }
  },
  methods:{
    del(row){
      let params={
        id:row.id
      }
      this.$confirm('确定要删除该条公告吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('/b2c/news/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('删除成功')
          }else{
            this.$message.error(res.data.msg)
          }
          this.getDataList();
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
      
    },
    edit(row){
      // console.log(row)
      this.$router.push({
        name:'addnews',
        query:{
          id:row.id,
          title:row.title+'编辑'
        }
      })
    },
    // 每页展示多少条数据
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
    handleSizeChange(size) {
      this.pagesize = size;
      this.getDataList();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.title = "";
      this.searchParams.type = "";
      this.getDataList();
    },
    getDataList(){
      // console.log('获取页面元素')
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/b2c/news/list',{params})
      .then(res=>{
        this.loading=false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.dataList = res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
          for(var i=0;i<this.dataList.length;i++){
            if(this.dataList[i].context.length>20){
              this.dataList[i].context=this.dataList[i].context.substr(0,20)+'...'
            }
            // console.log(typeof this.dataList[i].context)
          }
          
        }
      })
    }
  },
  mounted(){
    this.getDataList();
  }
}
</script>

<style>
.searchbox{
  font-size: 14px;
}
</style>