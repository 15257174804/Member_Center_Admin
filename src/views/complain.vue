<template>
  <div class="complain">
    <div class="title clearfix">
      <span>意见反馈</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        意见内容：
        <el-input v-model="searchParams.keyword" placeholder="如关键词、标题名称等" :style="{width:'250px',height:'40px'}"></el-input>
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
      :row-class-name="tableRowClassName" 
      style="width: 100%"
      >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" width="230"></el-table-column>
      <el-table-column prop="content" label="反馈内容"></el-table-column>
      <el-table-column prop="mobilePhone" label="反馈人手机号" width="200"></el-table-column>
      <!-- <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
        </template>
      </el-table-column> -->
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
  name:'complain',
  data(){
    return {
      searchParams:{
        keyword:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
    }
  },
  methods:{
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
      this.getList();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    search(){
      this.currentPage = 1;
      this.getList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.getList();
    },
    // 获取页面数据
    getList(){
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('crm/suggest/list',{params})
      .then(res=>{
        console.log(res.data)
        this.loading=false;
        this.dataList=res.data.msg.datas;
        this.totalCount=res.data.msg.totalCount;
      })
    }
  },
  mounted(){
    this.getList()
  }
}
</script>

<style scoped>

</style>