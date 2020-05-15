<template>
  <div class='commodityGroup'>
    <div class="title clearfix">
      <span>商品组</span>
      <router-link to="/groupDetail">
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        组合信息：
        <el-input v-model="searchParams.keyword" placeholder="如商品组名称、描述等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        组合状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="启用" value='1'></el-option>
          <el-option label="停用" value='0'></el-option>
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
      <el-table-column prop="name" label="名称" ></el-table-column>
      <el-table-column prop="price" label="图片" >
        <template slot-scope="scope">
            <img style='width:100px;height:100px;' v-if="scope.row.pictureModels!=''" height="100" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.pictureModels[0].imgUrl">
            <span v-else>无</span>
          </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="originalPrice" label="原价"></el-table-column>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='1'" type="success" disable-transitions>启用</el-tag>
          <el-tag v-if="scope.row.status=='0'" type="info" disable-transitions>停用</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="启用中的商品组不予许进行修改" placement="bottom">
            <el-button type="text" @click="edit(scope.row)"><i class="el-icon-tickets"></i>编辑</el-button>
          </el-tooltip>
          <el-button v-if="scope.row.status=='0'" type="text" @click="status(scope.row)"><i class="el-icon-refresh"></i>启用</el-button>
          <el-button v-if="scope.row.status=='1'" type="text" @click="status(scope.row)"><i class="el-icon-refresh"></i>停用</el-button>
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
  name:'commodityGroup',
  data(){
    return {
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
  created(){
    this.getData();
  },
  methods:{
    // 启用和停用
    status(row){
      var title='';
      let params={
        id:row.id
      }
      if(row.status==1){
        title='停用';
        params.status=0;
      }else{
        title='启用';
        params.status=1;
      }
      
      this.$confirm(`确定要${title}该商品组吗？`,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.post('/b2c/commodityGroup/save',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message.success(`${title}成功`)
            this.getData();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        }); 
      })
    },
    // 编辑
    edit(row){
      this.$router.push({
        name:'groupDetail',
        query:{
          id:row.id,
          title:row.name
        }
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
      this.searchParams.status='';
      this.curP=1;
      this.getData();
    },
    search(){
      this.curP=1;
      this.getData();
    },
    getData(){
      // console.log('获取页面数据')
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/commodityGroup/list',{params})
      .then(res=>{
        this.loading = false;
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
  }
}
</script>

<style>

</style>