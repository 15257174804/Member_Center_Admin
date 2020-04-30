<template>
  <div id="employee">
    <div class="title clearfix">
      <span>我的员工</span>
      <router-link to="/employeeadd">
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
        用户名：
        <el-input v-model="searchParams.keyword" placeholder="请输入用户名" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        状态：
        <el-select v-model="searchParams.isValid" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="true"></el-option>
          <el-option label="停用" value="false"></el-option>
        </el-select>
      </div> 
      <!-- 状态 -->
      <!-- <div class="searchbox">
        角色类型：
        <el-select v-model="searchParams.corpType" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="批发公司" value="1"></el-option>
          <el-option label="连锁总部" value="2"></el-option>
          <el-option label="连锁门店" value="3"></el-option>
          <el-option label="单体门店" value="4"></el-option>
        </el-select>
      </div> -->
      <!-- 日期 -->
      <!-- </br>
      <div class="searchbox">
        <div class="block">
          入职时间：
          <el-date-picker v-model="searchParams.enterStartTime" type="date" placeholder="开始日期"></el-date-picker>
        </div>
      </div>
      <span class="line">-</span>
      <div class="searchbox">
        <div class="block">
          <el-date-picker v-model="searchParams.enterEndTime" type="date" placeholder="结束日期"></el-date-picker> 
        </div>
      </div> -->
      <!-- 按钮 -->
      <div class="searchbox">
        <el-button type="primary" @click="search()">
          <i class="el-icon-zoom-in"></i>
          查询
        </el-button>
      </div>
      <div class="searchbox">
        <el-button @click="reset()">
          <i class="el-icon-refresh-right" ></i>
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
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="workNo" label="工号"></el-table-column>
      <el-table-column prop="mobilephone" label="手机号码"></el-table-column>
      <el-table-column prop="enterDate" label="入职时间"></el-table-column>
      <el-table-column prop="lastOrgName" label="所属企业"></el-table-column>
      <!-- <el-table-column prop="role[0].roleName" label="角色"></el-table-column> -->
      <el-table-column width="120" prop="isValid" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isValid ? 'success':'danger' "
            disable-transitions
          >{{scope.row.isValid? '正常':'停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" style="margin-right:13px;"><i class="el-icon-edit"></i>编辑</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link" style="color: #409EFF;cursor: pointer;">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <el-button type="text" @click="partner(scope.row)"><i class="el-icon-user"></i>成为合伙人</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <!-- total是总数据量 -->
  </div>
</template>


<script>
export default {
  name: "employee",
  data() {
    return {
      searchParams:{
        keyword:"",
        enterStartTime:"",
        enterEndTime:"",
        isValid:""
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true
    };
  },
  // 页面渲染前拿到数据
  mounted() {
    this.getDataList();
  },
  methods: {
    // 成为合伙人
    partner(row){
      // console.log(row)
      this.$confirm(`确定将员工${row.username}转为合伙人吗？`,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={};
        if(row.groupId){
          params={
            groupId:row.groupId,
            userId:row.baseInfo.id
          }
        }else if(row.corpId){
          params={
            groupId:row.corpId,
            userId:row.baseInfo.id
          }
        }else if(row.clientId){
          params={
            groupId:row.clientId,
            userId:row.baseInfo.id
          }
        }else{
          this.$message.error('请先分配员工的所属企业')
          return
        }

        this.axios.post('/b2c/partner/save',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('设置成功')
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
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
    //编辑某行
    edit(row){
      // console.log(row)
        this.$router.push({
          name: 'employeeadd',//跳转路径的name值，不写跳转后页面取不到参数
          // 参数
          query: {
            id: row.id,
            title: "编辑员工信息"
          }
        })
    },
    // 获取所有单位数据
    getDataList() {
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios
        .get("/crm/emp/list",{params})
        .then(res => {
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            this.dataList = res.data.msg.datas;
            this.totalCount = res.data.msg.totalCount;
          }
        })
        .catch(err => {
           console.log(err);
        });
    },
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.searchParams.enterStartTime = "";
      this.searchParams.enterEndTime = "";
      this.searchParams.isValid = "";
      this.getDataList();
    }
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



