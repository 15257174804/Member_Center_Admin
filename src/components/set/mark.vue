<template>
  <div class="markset">
    <div class="title clearfix">
      <span>会员标签</span>
      <el-button type="success" @click="addmark">
        <i class="el-icon-circle-plus-outline"></i>
        新建
      </el-button>
    </div>
    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        标签名称：
        <el-input v-model="searchParams.keyword" placeholder="请输入标签名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        标签状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="已删除" value="-1"></el-option>
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
      
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="id" label="标签ID"></el-table-column>
      <el-table-column prop="name" label="标签名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==-1" type="danger">已删除</el-tag>
          <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
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
      <el-form :model="form"  label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name"></el-input>
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
  name:'markset',
  data(){
    return {
      searchParams:{
        keyword:"",
        status:'1'
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      dialogFormVisible:false,
      title:'新增标签',
      form:{
        id:'',
        name:''
      }
    }
  },
  methods:{
    // 保存新建或编辑修改标签
    save(){
      this.dialogFormVisible=false;
      let params=this.form;
      this.axios.post('/crm/memberLabel/save',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message.success('保存成功');
          this.getDataList();
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    // 新建标签
    addmark(){
      this.dialogFormVisible=true;
      this.title='新增标签';
      this.form.id='';
      this.form.name='';
    },
    edit(row){
      this.dialogFormVisible=true;
      this.title='编辑标签';
      this.form.id=row.id;
      this.form.name=row.name;
    },
    del(row){
      this.$confirm('确定要删除该条商品分类吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={
          id:row.id
        }
        this.axios.get('/crm/memberLabel/delete',{params})
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
      this.getDataList();
    },
    getDataList(){
      // console.log('获取页面数据')
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/crm/memberLabel/list',{params})
      .then(res=>{
        this.loading=false;
        this.dataList=res.data.msg.datas;
        this.totalCount=res.data.msg.totalCount;
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