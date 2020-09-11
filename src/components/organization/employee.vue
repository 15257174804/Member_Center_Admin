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
        <el-input v-model="searchParams.keyword" placeholder="请输入用户信息" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <!-- <div class="searchbox">
        所属企业：
        <el-select v-model="searchParams.groupId" :style="{width:'120px',height:'40px'}">
          <el-option v-for='(item,i) of grouplink' :key='i' :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>  -->
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
      <el-table-column prop="username" label="用户名" width="160"></el-table-column>
      <el-table-column prop="workNo" label="工号" width="100"></el-table-column>
      <el-table-column prop="mobilephone" label="手机号码" width="160"></el-table-column>
      <el-table-column prop="enterDate" label="入职时间" width="160"></el-table-column>
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
      width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" style="margin-right:13px;"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" v-if="logingroupId" @click="role(scope.row)" style="margin-right:13px;"><i class="el-icon-bell"></i>角色权限</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link" style="color: #409EFF;cursor: pointer;">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <el-button type="text" @click="partner(scope.row)"><i class="el-icon-user"></i>成为合伙人</el-button>
              </el-dropdown-item>
              <el-dropdown-item >
                <!-- <el-button type="text" v-if="logingroupId" @click="role(scope.row)"><i class="el-icon-bell"></i>角色权限</el-button> -->
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
    <!-- 角色权限弹框 -->
    <el-dialog
      title="角色权限设置"
      :visible.sync="roleDialogVisible"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width="60%">
      <!-- <el-button type="primary" plain @click="addMenu()" style='margin:0 0 10px 0;'>新增菜单</el-button> -->
      <el-table 
        :data="roleData" 
        border>
        <el-table-column type='index' label="序号" width="100"></el-table-column>
        <el-table-column property="roleCode" label="编码" ></el-table-column>
        <el-table-column property="roleName" label="角色名称"></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="delMenu(scope.row)"><i class="el-icon-edit"></i>删除</el-button> -->
            <el-switch
              v-model="scope.row.flag"
              @change='changeRole(scope.row)'
              active-color="#13ce66"
              inactive-color="#DCDFE6">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="roleDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="roleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
export default {
  name: "employee",
  data() {
    return {
      grouplink:[],
      searchParams:{
        keyword:"",
        enterStartTime:"",
        enterEndTime:"",
        isValid:"",
        groupId:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true,
      roleDialogVisible:false,
      roleData:[],
      employeeId:'',
      logingroupId:localStorage.getItem('groupId'),   //平台管理员不能操作角色权限
    };
  },
  // 页面渲染前拿到数据
  mounted() {
    this.getDataList();
    this.getGroup();
  },
  methods: {
    // 角色权限点击打开弹框
    role(row){
      this.roleDialogVisible=true;
      this.employeeId=row.id;
      this.getRoleList();
    },
    // 查询员工角色列表
    getRoleList(){
      let params={
        groupId:localStorage.getItem('groupId'),
        employeeId:this.employeeId
      }
      this.axios.get('/crm/prac/list',{params})
      .then(res=>{
        // console.log(res.data)
        if(res.data.code>0){
          this.roleData=res.data.msg.datas;
        }
      })
    },
    // 改变角色绑定
    changeRole(row){
      if(row.flag){
        // 绑定
        let params={
          employeeId:this.employeeId,
          roleId:row.roleId
        }
        this.axios.post('/crm/prac/save',params)
        .then(res=>{
          if(res.data.code>0){
            // console.log(res.data)
            this.getRoleList();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }else{
        // 解绑
        let params={
          id:row.id
        }
        this.axios.get('/crm/prac/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            // console.log(res.data)
            this.getRoleList();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }
    },
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
    // 获取所有数据
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
            // for(var i=0;i<this.dataList.length;i++){
            //   if(this.dataList[i].clientId){
            //     this.dataList[i].groupId=this.dataList[i].clientId;
            //   }else if(this.dataList[i].corpId){
            //     this.dataList[i].groupId=this.dataList[i].corpId;
            //   }
            // }
            // console.log(this.dataList)
            this.totalCount = res.data.msg.totalCount;
          }
        })
        .catch(err => {
           console.log(err);
        });
    },
    // 获取企业信息
    getGroup(){
      let params={
        status:1,
        pagesize:100,
        pageindex:1
      }
      this.axios.get('/crm/corporation/list',{params})
      .then(res=>{
        if(res.data.code>0){
          this.grouplink=res.data.msg.datas;
          // console.log(this.grouplink)
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
      this.searchParams.enterStartTime = "";
      this.searchParams.enterEndTime = "";
      this.searchParams.isValid = "";
      this.searchParams.groupId='';
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



