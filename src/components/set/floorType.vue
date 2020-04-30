<template>
  <div class="floortype">
    <div class="title clearfix">
      <span>楼层类型列表(谨慎设置，value值不允许重复，且必须按文档要求配置)</span>
      <el-button type="success" @click="addmark">
        <i class="el-icon-circle-plus-outline"></i>
        新建
      </el-button>
    </div>
    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        楼层信息：
        <el-input v-model="searchParams.keyword" placeholder="请楼层信息" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        楼层状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
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
    <!-- 表单内容 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      border 
      stripe
      style="width: 100%">
      <el-table-column type="index" label="序号" width="120"></el-table-column>
      <el-table-column prop="id" label="楼层ID"></el-table-column>
      <el-table-column prop="name" label="楼层名称"></el-table-column>
      <el-table-column prop="value" label="楼层value值"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="change(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button :disabled="scope.row.status==-1" type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
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
    <!-- 弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form"  label-width="100px">
        <el-form-item label="楼层名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="楼层value值" prop="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <!-- <el-form-item label="平台楼层类型" prop="platformFlag">
          <el-radio-group v-model="form.platformFlag">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item> -->
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
  name:'floortype',
  data(){
    return {
      searchParams:{
        keyword:"",
        status:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      dialogFormVisible:false,
      title:'新增楼层类型',
      form:{
        id:'',
        name:'',
        value:'',
        // platformFlag:''
      } 
    }
  },
  methods:{
    // 保存新建或编辑修改标签
    save(){
      this.dialogFormVisible=false;
      let params=this.form;
      if(this.$store.state.group_name=='平台管理员'){
        params.platformFlag=true
      }else{
        params.platformFlag=false
      }
      this.axios.post('/b2c/floorType/save',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message.success('保存成功');
          this.getDataList();
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    // 新建楼层
    addmark(){
      this.dialogFormVisible=true;
      this.title='新增楼层类型';
      this.form.id='';
      this.form.name='';
      this.form.value='';
      // this.form.platformFlag='';
    },
    edit(row){
      // console.log(row)
      this.dialogFormVisible=true;
      this.title='编辑楼层';
      this.form.id=row.id;
      this.form=row;
    },
    del(row){
      this.$confirm('确定要删除该条楼层类型吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={
          id:row.id
        }
        this.axios.get('/b2c/floorType/delete',{params})
        .then(res=>{
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
    change(row){
      // console.log(row)
      let params={
        id:row.id,
        status:row.status
      }
      // if(row.status==1){
      //   params.status=0
      // }else{
      //   params.status=1
      // }
      this.axios.post('/b2c/floorType/save',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message.success('修改成功')
          this.getDataList();
        }else{
          this.$message.error(res.data.msg)
        }
      })
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
      this.status=''
      this.getDataList();
    },
    getDataList(){
      // console.log('获取页面数据')
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      if(this.$store.state.group_name=='平台管理员'){
        params.platformFlag=true
      }else{
        params.platformFlag=false
      }
      this.axios.get('/b2c/floorType/list',{params})
      .then(res=>{
        this.loading=false;
        this.dataList=res.data.msg.datas;
        this.totalCount=res.data.msg.totalCount;
        for(var i=0;i<this.dataList.length;i++){
          if(this.dataList[i].status==1){
            this.dataList[i].status=true
          }else{
            this.dataList[i].status=false
          }
        }
      })
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