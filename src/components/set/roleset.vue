<template>
  <div class="roleset">
    <!-- 标题栏 -->
    <div class="title clearfix">
      <span>角色管理</span>
      <el-button type="success" @click="addrole">
        <i class="el-icon-circle-plus-outline"></i>
        新建
      </el-button>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        角色信息：
        <el-input v-model="searchParams.roleName" placeholder="请输入角色信息" :style="{width:'250px',height:'50px'}"></el-input>
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
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column prop="roleId" label="角色ID" ></el-table-column>
      <el-table-column prop="roleName" label="角色名称" ></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>  
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="280">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" @click="del(scope.row)" disabled>删除</el-button>
          <el-button type="text" disabled>权限修改</el-button>
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

    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'roleset',
  data(){
    return {
      searchParams:{
        roleName:''
      },
      loading: true,
      tableData: [],  //保存表格中的预约列表信息
      // 以下是分页信息
      pageSize:5,
      curP:1,
      totalCount:0,
      title:'角色新增',
      dialogFormVisible:false,
      form:{
        id:'',
        roleName:'',
        roleDesc:''
      }
    }
  },
  methods:{
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
    // 搜索
    search(){
      this.curP=1;
      this.getData();
    },
    // 重置
    reset(){
      for(let key in this.searchParams){
        this.searchParams[key]=''
      }
      this.curP=1;
      this.getData();
    },
    save(){
      this.dialogFormVisible=false;
      let params=this.form;
      this.axios.get('/crm/roles/save',{params})
      .then(res=>{
        // console.log(res.data)
        if(res.data.code > 0){
          this.$message({
            type: 'success',
            message: res.data.msg
          });
        }else{
          this.$message.error(res.data.msg);
        }
        this.getData();
      }).catch(err=>{
        console.log(err);
      })
    },
    // 新增
    addrole(){
      this.title='角色新增';
      this.dialogFormVisible=true;
      this.form.id='';
    },
    // 编辑
    edit(row){
      this.dialogFormVisible=true;
      this.title='角色编辑';
      this.form.roleName=row.roleName;
      this.form.roleDesc=row.roleDesc;
      this.form.id=row.id;
    },
    // 删除
    del(row){},
    // 获取数据预售产品的数据
    getData(){
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios
        .get("/crm/roles",{params})
        .then(res => {
          // console.log("角色列表查询")
          // console.log(res.data)
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            this.tableData = res.data.msg.datas;
            this.totalCount = res.data.msg.totalCount;
          }
        })
        .catch(err => {
           console.log(err);
        });
    },
  },
  mounted(){
    this.getData();
  }
}
</script>

<style>
.searchbox{
  font-size: 14px;
}
</style>