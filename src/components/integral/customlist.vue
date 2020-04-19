<template>
  <div class="customlist">
    <div class="title clearfix">
      <span>会员列表</span>
    </div>
    <!-- search -->
    <div class="search">
      <div class="searchbox">
        会员信息：
        <el-input v-model="searchParams.cardNo" placeholder="如卡号、会员名、手机号等" :style="{width:'250px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        <el-button type="primary" @click="search()">
          <i class="el-icon-zoom-in"></i>
          查询
        </el-button>
      </div>
      <div class="searchbox">
        <el-button>
          <i class="el-icon-refresh-right" @click="reset()"></i>
          重置
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="dataList"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="cardNo" label="会员卡号" ></el-table-column>
      <el-table-column prop="baseInfo.username" label="会员名"></el-table-column>  
      <el-table-column prop="baseInfo.sex" label="性别" sortable></el-table-column>  
      <el-table-column prop="baseInfo.mobilephone" label="手机号"></el-table-column>
      <el-table-column prop="baseInfo.birthday" label="生日" sortable></el-table-column>
      <el-table-column prop="score" label="积分" sortable></el-table-column>
      <!-- 预售状态 -->
      <el-table-column width="100" prop="isValid" label="账户状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isValid ? 'success':'danger' "
            disable-transitions
          >{{scope.row.isValid? '正常':'停用'}}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>查看详情</el-button>
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
  name:'customlist',
  data(){
    return {
      searchParams:{
        cardNo:"",
        corpType:"",
        sdate:"",
        edate:"",
      },
      loading: false,
      dataList: [],  //保存表格中的预约列表信息
      // 以下是分页信息
      pageSize:5,
      curP:1,
      totalCount:0,
    }
  },
  methods:{
    // 查看详情
    edit(row){
      console.log('row')
      console.log(row)
      this.$router.push({
        name:'customdetial',
        query:{
          id:row.id
        }
      })
    },
    // 行的背色
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
    //搜索
    search(){
      this.curP=1;
      this.getData();
    },
    //重置
    reset(){
      for(let key in this.searchParams){
        this.searchParams[key]='';
      }
      this.getData();
    },
    getData(){
      console.log('获取页面数据')
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/crm/custom/list',{params})
      .then(res=>{
        this.loading = false;
        console.log(res.data)
        this.dataList=res.data.msg.datas;
        this.totalCount=res.data.msg.totalCount;
        for(var i=0;i<this.dataList.length;i++){
          if(this.dataList[i].baseInfo.sex==1){
            this.dataList[i].baseInfo.sex='男';
          }else{
            this.dataList[i].baseInfo.sex='女';
          }
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