<template>
  <div id="customer">
    <div class="title clearfix">
      <span>我的会员</span>
    </div>

     <!-- search -->
    <div class="search">
      <div class="searchbox">
        会员姓名：
        <el-input v-model="searchParams.corpName" placeholder="请输入企业名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <!-- 状态 -->
      <div class="searchbox">
        企业类型：
        <el-select v-model="searchParams.corpType" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="批发公司" value="1"></el-option>
          <el-option label="连锁总部" value="2"></el-option>
          <el-option label="连锁门店" value="3"></el-option>
          <el-option label="单体门店" value="4"></el-option>
        </el-select>
      </div>
      <!-- 日期 -->
      <div class="searchbox">
        <div class="block">
          注册时间：
          <el-date-picker v-model="searchParams.sdate" type="date" placeholder="开始日期"></el-date-picker>
        </div>
      </div>
       <div class="searchbox">
        <div class="block">
          -
          <el-date-picker v-model="searchParams.edate" type="date" placeholder="结束日期"></el-date-picker> 
        </div>
      </div>
      <!-- 按钮 -->
      <div class="searchbox">
        <el-button type="primary">
          <i class="el-icon-zoom-in"></i>
          查询
        </el-button>
      </div>
      <div class="searchbox">
        <el-button>
          <i class="el-icon-refresh-right"></i>
          重置
        </el-button>
      </div>
    </div>

    <el-table
      :data="pagingtable.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
      border 
      :row-class-name="tableRowClassName" 
      style="width: 100%"
      >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="企业名称"></el-table-column>
      <!-- <el-table-column prop="name" label="企业类型"></el-table-column> -->
      <el-table-column prop="lawMan" label="法人" width="120"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="120"></el-table-column>
      <el-table-column prop="contactNumber" label="联系方式" width="160"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <!-- <el-table-column width="120" prop="tag" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag =='已取消' ? 'danger':'success' "
            disable-transitions
          >{{scope.row.tag}}</el-tag>
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
      :total="pagingtable.length"
    ></el-pagination>
    <!-- total是总数据量 -->
  </div>
</template>


<script>
export default {
  name: "customer",
  data() {
    return {
      searchParams:{
        corpName:"",
        corpType:"",
        sdate:"",
        edate:"",
      },
      pagingtable: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1 // 第几页
    };
  },
  methods: {
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
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    // 获取数据
    getorder() {
      let params = {
        groupId: 1
      };
      this.axios
        .get("/crm/custom/list",{params})
        .then(res => {
          // console.log(res.data);
          this.pagingtable = res.data.msg.datas;
        })
        .catch(err => {
           console.log(err);
        });
    }
  },
  // 页面渲染前拿到数据
  mounted() {
    this.getorder();
  }
};
</script>


<style scoped>
tr,
th,
td {
  color: #303133;
}
.blank {
  background: rgb(240, 243, 244);
  width: 100%;
  height: 50px;
}
.searchbox{
  font-size: 14px;
}
</style>



