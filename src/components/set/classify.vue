<template>
  <div class="classify">
    <div class="title clearfix">
      <span>商品分类</span>
      <el-button type="success" @click="addclass">
        <i class="el-icon-circle-plus-outline"></i>
        新建
      </el-button>
    </div>
    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        类别检索：
        <el-input v-model="searchParams.keyword" placeholder="如类别名称、编码等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        类别层级：
        <el-select v-model="searchParams.level" :style="{width:'100px',height:'40px'}">
          <el-option label="1级" value="1"></el-option>
          <el-option label="2级" value="2"></el-option>
          <el-option label="3级" value="3"></el-option>
          <el-option label="4级" value="4"></el-option>
          <el-option label="5级" value="5"></el-option>
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
      style="width: 100%"
      row-key="id"
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="类别名称"></el-table-column>
      <el-table-column prop="code" label="类别代码"></el-table-column>
      <el-table-column prop="logo" label="图标">
        <template slot-scope="scope">
          <img v-if="scope.row.logo" :src="axios.defaults.baseURL + '/crm/image/' +scope.row.logo" class="imgsize"/>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="类别层级"></el-table-column>
      <!-- 类型是预留字段，现在只有1 商品分类 -->
      <el-table-column prop="type" label="类别类型"></el-table-column>   
      <el-table-column prop="parentName" label="所属类别">
        <template slot-scope="scope">
          <span v-if="scope.row.parentName">{{scope.row.parentName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>

    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form"  label-width="80px">
        <el-form-item label="类别代码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="logo">
          <el-upload
            class="avatar-uploader"
            :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="类别层级" prop="level">
          <el-select v-model="form.level" placeholder="请选择" @change="changeLevel($event)">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类别" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择所属类别" :disabled="form.level == 1" @change="changeType">
            <el-option v-for="item in parentList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
          </el-select>
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
  name:'classify',
  data(){
    return {
      imgUrl:'',
      token: localStorage.getItem('loginToken'),
      searchParams:{
        keyword:"",
        level:'',
        // status:1
      },
      dataList: [],
      pagesize:100, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      dialogFormVisible:false,
      title:'',
      form:{
        id:'',
        code:'',
        name:'',
        logo:'',
        level:'',
        type:1,
        parentId:'',
        parentName:''
      },
      parentList:[]  //所属类别
    }
  },
  methods:{
    // 上传背景图成功之后的回调
    handleAvatarSuccess(res, file) {
      // console.log('图片上传成功')
      this.form.logo=res.msg.fileName;
      this.imgUrl = URL.createObjectURL(file.raw);
      // console.log(file);
      // console.log(res)
    },
    // 背景图上传之前的回调
    beforeAvatarUpload(file) {
      // console.log(file)
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      // return isJPG && isLt2M;
      return isLt2M;
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.searchList();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.searchList();
    },
    addclass(){
      this.dialogFormVisible=true;
      this.title='新增商品类别';
      this.form={
        code:'',
        name:'',
        level:'',
        logo:'',
        type:1,
        parentId:'',
        parentName:''
      }
    },
    edit(row){
      // console.log(row)
      this.dialogFormVisible=true;
      this.title=row.name;
      this.form.id=row.id;
      this.form.code=row.code;
      this.form.name=row.name;
      this.form.level=row.level;
      this.form.logo=row.logo;
      if(this.form.logo&&this.form.logo!=''){
        this.imgUrl =this.axios.defaults.baseURL + '/b2c/image/' + this.form.logo;
      }else{
        this.imgUrl='';
      }
      if(row.type=='商品分类'){
        this.form.type=1
      }
      this.form.parentId=row.parentId;
      this.form.parentName=row.parentName;
      this.getparentList();
    },
    save(){
      this.dialogFormVisible=false;
      let params=this.form;
      this.axios.post('/b2c/classify/save',params)
      .then(res=>{
        // console.log(res.data);
        if(res.data.code > 0){
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getDataList();
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
    // 删除商品类别
    del(row){
      console.log(row)
      let params={
        id:row.id
      }
      this.$confirm('确定要删除该条商品分类吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('b2c/classify/delete',{params})
        .then(res=>{
          // console.log(res.data)
          if(res.data.code>0){
            this.$message.success('删除成功')
            this.getDataList();
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
    search(){
      this.currentPage = 1;
      this.searchList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.searchParams.level = "";
      this.getDataList();
    },
    // 深度遍历树形数据修改属性值
    ergodic(node){
      for(var i=0;i<node.length;i++){
        if(node[i].type==1){
          node[i].type='商品分类'
        }
        if(node[i].children.length>0){
          this.ergodic(node[i].children)
        }
      }
      return node
    },
    // 获取数据
    // getDataList() {
    //   this.loading = true;
    //   let params = this.searchParams;
    //   params.pageindex = this.currentPage;
    //   params.pagesize = this.pagesize;
    //   this.axios
    //     .get("/b2c/classify/list",{params})
    //     .then(res => {
    //       console.log('获取页面列表数据')
    //       console.log(res.data)
    //       this.loading = false;
    //       if(res.data.code < 0){
    //         this.$notify.error({
    //           title: '错误',
    //           message: res.data.msg
    //         })
    //       }else{
    //         let params={
    //           levelScan:this.searchParams.level,
    //           // status:1
    //         }
    //         this.axios.get('/b2c/classify/tree',{params})
    //         .then(res=>{
    //           console.log('获取树形数据')
    //           console.log(res.data.msg)
    //           this.dataList=res.data.msg;
    //           this.ergodic(this.dataList)
    //         })
    //         this.totalCount = res.data.msg.totalCount;
    //       }
    //     })
    //     .catch(err => {
    //        console.log(err);
    //     });
    // },
    getDataList(){
      this.loading = true;
      let params={
        levelScan:5,
        status:1
      }
      this.axios.get('/b2c/classify/tree',{params})
      .then(res=>{
        this.loading = false;
        this.dataList=res.data.msg;
        this.ergodic(this.dataList)
        this.searchList()
      })
    },
    searchList(){
      let params=this.searchParams;
      params.status=1;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/b2c/classify/list',{params})
      .then(res=>{
        if(this.searchParams.keyword==''&&this.searchParams.level==''){
          this.totalCount=res.data.msg.totalCount;
          // this.pagesize=res.data.msg.totalCount;
          this.currentPage=1;
        }else{
          this.dataList=res.data.msg.datas;
          for(var i=0;i<this.dataList.length;i++){
            if(this.dataList[i].type==1){
              this.dataList[i].type='商品分类';
            }
          }
          this.totalCount=res.data.msg.totalCount;
        }
        
      })
    },
    // 获取所属类别
    getparentList(){
      let params={
        status:1,
        level:this.form.level-1
      }
      this.axios.get('/b2c/classify/list',{params})
      .then(res=>{
        this.parentList=res.data.msg.datas;
        // console.log('获取parentList')
        // console.log(this.parentList)
      })
    },
    // 改变层级
    changeLevel(i){
      // console.log(i)
      this.getparentList();
    },
    // 改变所属类别
    changeType($event){
      // console.log($event)
      let obj={};
      obj=this.parentList.find(item=>{
        return item.id===$event
      })
      // console.log('obj')
      // console.log(obj)
      this.form.parentName=obj.name;
    }
  },
  mounted(){
    this.getDataList();
    this.getparentList();
  }
}
</script>

<style>
.imgsize{
  width:50px;
  height:50px;
  border-radius: 5px;
}
.searchbox{
  font-size: 14px;
}
</style>