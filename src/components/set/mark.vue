<template>
  <div class="markset">
    <div class="title clearfix">
      <span>会员标签</span>
      <el-button type="success" @click="addmark">
        <i class="el-icon-circle-plus-outline"></i>
        新建
      </el-button>
    </div>
    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        标签名称：
        <el-input v-model="searchParams.keyword" placeholder="请输入标签名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
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
    <!-- 表单内容 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      border 
      style="width: 100%">
      <el-table-column prop="name" label="类别名称"></el-table-column>
      <el-table-column prop="code" label="类别代码"></el-table-column>
      <el-table-column prop="level" label="类别层级"></el-table-column>
      <el-table-column prop="type" label="类别类型"></el-table-column>   
      <el-table-column prop="parentName" label="所属类别"></el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <!-- <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button> -->
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
  name:'markset',
  data(){
    return {
      searchParams:{
        keyword:"",
        level:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
    }
  },
  methods:{
    // 新建标签
    addmark(){
      
    },
    edit(row){

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
      this.searchParams.keyword = "";
      this.getDataList();
    },
    getDataList(){
      console.log('获取页面数据')
    }
  },
  mounted(){
    this.getDataList();
  }
}
</script>

<style>

</style>