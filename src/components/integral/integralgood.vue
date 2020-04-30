<template>
  <div class="integralgood">
    <div class="title clearfix">
      <span>积分商品列表</span>
       <router-link to="/integoodadd">
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
        商品信息：
        <el-input v-model="searchParams.keyword" placeholder="如名称、编码等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        销售状态：
        <el-select v-model="searchParams.isShow" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="在售" value="1"></el-option>
          <el-option label="已下架" value="0"></el-option>
        </el-select>
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
      <el-table-column prop="goodCode" label="商品编码"></el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <!-- <el-table-column prop="corpName" label="所属企业"></el-table-column> -->
      <!-- <el-table-column prop="goodsClass" label="商品分类"></el-table-column> -->
      <el-table-column prop="redeemPrice" label="金额"></el-table-column>
      <el-table-column prop="redeemPoints" label="积分"></el-table-column>
      <el-table-column prop="redeemLimitFlag" label="是否限制兑换量"></el-table-column>
      <el-table-column prop="redeemQuantity" label="个人可兑数量"></el-table-column>
      <el-table-column prop="redeemRemainingQuantity" label="剩余可兑数量"></el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row,'basicInfo')"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="edit(scope.row,'imgInfo')"><i class="el-icon-picture-outline-round"></i>图片管理</el-button>
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
  name:'integralgood',
  data(){
    return {
      searchParams:{
        redeemFlag:true,
        keyword:"",
        isShow:""
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true
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
      this.getDataList();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
    // 获取数据
    getDataList() {
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios
        .get("/b2c/product/good/list",{params})
        .then(res => {
          // console.log(res.data)
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            this.dataList = res.data.msg.datas;
            for(var i=0;i<this.dataList.length;i++){
              if(this.dataList[i].redeemLimitFlag){
                this.dataList[i].redeemLimitFlag='是'
              }else{
                this.dataList[i].redeemLimitFlag='否'
              }
            }
            this.totalCount = res.data.msg.totalCount;
          }
        })
        .catch(err => {
           console.log(err);
        });
    },
    edit(row,type){
      this.$router.push({
          name: 'integoodadd',
          query: {
            id: row.id,
            title: "编辑商品",
            tabName: type
          }
      })
    },
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.searchParams.isShow = "";
      this.getDataList();
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