<template>
  <div class='rolePower'>
    <div class="title clearfix">
      <span>角色权限</span>
      <!-- <router-link to="/adPower"> -->
        <el-button type="success" @click='adPower'>
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      <!-- </router-link> -->
    </div>
    <!-- 搜搜 -->
    <div class="search">
      <div class="searchbox">
        角色名称：
        <el-input v-model="searchParams.name" placeholder="请输入角色名称" :style="{width:'180px',height:'40px'}"></el-input>
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
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      border
      stripe
      :data="dataList"
      style="width: 100%">
      <el-table-column prop="code" label="角色编码" align='center' width="150"></el-table-column>
      <el-table-column prop="name" label="角色名称" align='center' width="250"></el-table-column>
      <el-table-column prop="description" label="角色描述" align='center'></el-table-column>
      <el-table-column prop="status" label="状态" align='center' width="150">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ==1 ? 'success':'info' "
            disable-transitions
          >{{scope.row.status ==1 ? '正常':'已删除'}}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        align='center'
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
          <el-button type="text" @click="menu(scope.row)">菜单权限</el-button>
          <!-- <el-button v-if="scope.row.status ==1" type="text" @click="change(scope.row)"><i class="el-icon-refresh"></i>禁用</el-button> -->
          <!-- <el-button v-if="scope.row.status ==0" type="text" @click="change(scope.row)"><i class="el-icon-refresh"></i>启用</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
    <!-- 弹框新增的 -->
    <el-dialog 
      :title="menuTitle" 
      :visible.sync="dialogFormVisible"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width='40%'>
      <el-form :model="menuForm" ref="menuForm" :rules="rules" label-width="120px">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="menuForm.code" style='width:80%;' placeholder="请输入角色编码，不允许有重复"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="menuForm.name" style='width:80%;' placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="menuForm.description" style='width:80%;' placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveMenu('menuForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色菜单关联树状图 -->
    <el-dialog
      title="菜单权限设置"
      :visible.sync="powerDialogVisible"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width="60%">
      <!-- <el-table 
        :data="powerData" 
        border
        row-key="id"
        default-expand-all
        :tree-props="{children: 'childNotes', hasChildren: 'hasChildren'}">
        <el-table-column prop="grade" label="等级">
          <template slot-scope="scope">
            <span v-if="scope.row.grade==1">一级菜单</span>
            <span v-if="scope.row.grade==2">二级菜单</span>
          </template>
        </el-table-column>
        <el-table-column property="name" label="菜单名称"></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.flag"
              @change='changeMenu(scope.row)'
              active-color="#13ce66"
              inactive-color="#DCDFE6">
            </el-switch>
          </template>
        </el-table-column>
      </el-table> -->
      <div class="digcontent">
        <div class="conline" v-for="(val,index) of powerData" :key="index">
          <div class="gradeone" @click="checkmeun(val.flag,val.id,val.roleMenuId)">
            <i :class="['meunnocheck',{'menucheck':val.flag}]"></i>
            <span>{{val.name}}</span>
          </div>

          <ul class="gradetwo">
            <li v-for="(v,i) of val.childNotes" :key="i"  @click="checkmeun(v.flag,v.id,v.roleMenuId)">
              <i :class="['meunnocheck',{'menucheck':v.flag}]"></i>
              <span>{{v.name}}</span>
            </li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="powerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增菜单 -->
    <!-- <el-dialog 
      :visible.sync="addMeunDialog"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width='35%'>
      <el-form :model="menuForm2" :rules="rules" ref="menuForm2" label-width="120px">
        <el-form-item label="菜单" prop="menuId">
          <el-select v-model="menuForm2.menuId" placeholder="请选择" style='width:80%;'>
            <el-option v-for="(val,i) of menuLink" :key='i' :label="val.name" :value="val.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMeunDialog=false">取 消</el-button>
        <el-button type="primary" @click="saveMenu2('menuForm2')">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name:'rolePower',
  data(){
    return {
      loading:false,
      dataList:[],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      searchParams:{
        keyword:""
      },
      menuTitle:'',
      dialogFormVisible:false,
      menuForm:{
        id:'',
        code:'',
        description:'',
        name:'',
        groupId:'',
      },
      rules:{
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        menuId:[
          { required: true, message: '请选择菜单', trigger: 'blur' }
        ]
      },
      powerDialogVisible:false,
      powerData:[],
      addMeunDialog:false,
      menuLink:[],
      menuForm2:{
        menuId:'',
        roleId:'',
      },
      groupId:localStorage.getItem('groupId'),
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    // 选择菜单
    checkmeun(flag,id,roleMenuId){
      if(flag){
        let params={
          id:roleMenuId
        }
        this.axios.get('crm/rmac/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.getRoleMeun();
            console.log(res.data)
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }else if(!flag){
        let params={
          menuId:id,
          roleId:this.menuForm2.roleId
        }
        this.axios.post('/crm/rmac/save',params)
        .then(res=>{
          if(res.data.code>0){
            console.log(res.data)
            this.getRoleMeun();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    // 菜单权限
    menu(row){
      this.powerDialogVisible=true;
      this.menuForm2.roleId=row.id;
      this.getRoleMeun();
    },
    // 获取角色菜单关联树状图
    getRoleMeun(){
      let params={
        roleId:this.menuForm2.roleId,
        groupId:this.groupId
      }
      this.axios.get('/crm/permission/roleMenu',{params})
      .then(res=>{
        // console.log(res.data)
        this.powerData=res.data.msg;
      })
    },
    // 菜单权限开关
    changeMenu(row){
      // console.log(row)
      if(row.flag){
        // 绑定
        let params={
          menuId:row.id,
          roleId:this.menuForm2.roleId
        }
        this.axios.post('/crm/rmac/save',params)
        .then(res=>{
          if(res.data.code>0){
            console.log(res.data)
            this.getRoleMeun();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }else{
        let params={
          id:row.roleMenuId
        }
        this.axios.get('crm/rmac/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.getRoleMeun();
            console.log(res.data)
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    // 删除
    del(row){
      this.$confirm('确定要删除该角色吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={
          id:row.id
        }
        this.axios.get('/crm/role/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('删除成功')
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
    // 修改
    edit(row){
      this.menuTitle='角色编辑';
      this.dialogFormVisible=true;
      this.menuForm=JSON.parse(JSON.stringify(row));
    },
    // 新增
    adPower(){
      this.menuTitle='角色新增';
      this.dialogFormVisible=true;
      this.menuForm.code='';
      this.menuForm.description='';
      this.menuForm.name='';
      this.menuForm.groupId=this.groupId;
    },
    // 保存新增的菜单
    saveMenu(formName){
      this.$refs[formName].validate((valid) =>{
        if (valid){
          // console.log(this.menuForm)
          let params=this.menuForm;
          this.axios.post('/crm/role/save',params)
          .then(res=>{
            if(res.data.code>0){
              this.dialogFormVisible=false;
              this.$message.success('保存成功')
              this.getData();
            }else{
              this.$message.error(res.data.msg)
            }
          })
          
        }else {
            this.$message.error('请完善内容后保存!');
            return false;
          }
      })
    },
    getData(){
      let params=this.searchParams;
      params.groupId=this.groupId;
      this.axios.get('/crm/role/list',{params})
      .then(res=>{
        // console.log(res.data)
        this.dataList=res.data.msg.datas;
        this.totalCount=res.data.msg.totalCount;
      })
    },
    search(){
      this.currentPage = 1;
      this.getData();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.getData();
    },
    // 每页展示多少条数据
    handleSizeChange(size) {
      this.pagesize = size;
      this.getData();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    },
  }
}
</script>

<style lang="scss">
  ul{
    margin:0;
    padding: 0;
    list-style: none;
  }
  .digcontent{
    width:98%;
  }
  .meunnocheck{
    display: inline-block;
    width:18px;
    height:18px;
    background: url("../../assets/menunocheck.png") no-repeat center center;
    background-size: contain;
    margin-right: 6px;
    vertical-align: middle;
    cursor: pointer;
  }
  .menucheck{
    background: url("../../assets/menucheck.png") no-repeat center center;
    background-size: contain;
  }
  .conline{
    display: flex;
    flex-wrap: nowrap;
    padding: 13px 0 13px 50px;
    border-bottom:1px solid #efefef;
    .gradeone{
      width: 100px;
      margin-right: 50px;
      font-weight: bold;
      font-size: 15px;
      span{
        display: inline-block;
        vertical-align: middle;
      }
    }
    .gradetwo{
      display: flex;
      flex-wrap: wrap;
      li{
        margin-right: 15px;
        width: 100px;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  
</style>