<template>
  <div class="freight">
    <!-- 标题栏 -->
    <div class="title clearfix">
      <span>运费管理</span>
       <!-- <router-link to="">   -->
        <el-button type="success" @click="newpost">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      <!-- </router-link> -->
    </div>
    <!-- dialog弹出框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%">
      <!-- 子组件 -->
      <dilog ref="getform" :parentform="parentform"></dilog>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rset">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
    
    

    <!-- 活动搜索 -->
    <div class="search">
      <div class="searchbox">
        模板名称：
        <el-input v-model="searchParams.name" placeholder="请输入模板名称" :style="{width:'180px',height:'40px'}"></el-input>
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
    <!-- 预约产品的列表 -->
    <el-table
      v-loading="loading"
      border
      :data="dataList"
      style="width: 100%">
      <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
      <el-table-column prop="id" label="编号" width="60"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="115" sortable></el-table-column>
      <el-table-column prop="name" label="模板名称"></el-table-column>
      <el-table-column prop="sendInDays" label="几天内发货" sortable></el-table-column>
      <el-table-column prop="valuationMethods" label="计价方式" sortable></el-table-column>
      <el-table-column prop="weatherItIsFree" label="是否包邮" sortable></el-table-column>
      <el-table-column width="110" prop="isDefault" label="是否默认" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isDefault ==1 ? 'success':'danger' "
            disable-transitions
          >{{scope.row.isDefault ==1 ? '是':'否'}}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="260">
        <template slot-scope="scope">
          <el-button type="text" @click="defaul(scope.row)"><i class="el-icon-thumb"></i>设为默认</el-button>
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
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
  </div>
</template>

<script>
import dilog from './dialog.vue';

export default {
  name:'freight',
  components:{
    dilog
  },
  data(){
    return {
      title:'新建运费模板',
      dialogVisible:false,
      searchParams:{
        name:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      parentform:{},  //保存父组件查询单个策略明细的详细数据，传递给子组件显示
      
    }
  },
  methods:{
    newpost(){
      let row={}
      this.title='新建运费模板';
      this.dialogVisible = true;
      this.parentform=Object.assign({},row)
    },
    rset(){
      this.dialogVisible = false;
      // this.$refs[this.$refs.getform.ruleForm].resetFields();
    },
    // 保存弹框中表单信息
    save(){
      this.dialogVisible = false;
      // 发送请求，保存数据
      console.log(this.$refs.getform.ruleForm)
      let params=this.$refs.getform.ruleForm;
      this.axios.post('/b2c/postage/policy/save',params)
      .then(res=>{
        console.log('保存新建的模板信息')
        console.log(res.data)
        if(res.data.code>0){
          this.$message({
            type: 'success',
            message: res.data.msg
          });
        }else{
          this.$message.error(res.data.msg);
        }
        this.getData();
      }).catch(err=>{
        console.log(err)
      })
      // this.$refs[this.$refs.getform.ruleForm]
    },
    // 设为默认模板，有问题，需要修改，加载页面中的数据怎么判断哪条数据是默认运费模板
    defaul(row){
      let params={
        id:row.id
      }
      this.axios.get('/b2c/postage/policy/set/default',{params})
      .then(res=>{
        if(res.data.code>0){
          this.$message({
            type: 'success',
            message: res.data.msg
          });
        }else{
          this.$message.error(res.data.msg);
        }
        this.getData();
      })
    },
    // 查看详情
    edit(row){
      console.log('查看详情')
      this.title='运费详情';
      this.dialogVisible=true;
      
      let params={
        id:row.id
      }
      this.axios.get('/b2c/postage/policy/findbyid',{params})
      .then(res=>{
        console.log('这是查看当个策略明细的数据')
        console.log(res.data)
        this.parentform=Object.assign({},res.data.msg)
      }).catch(err=>{
        console.log(err)
      })
    },
    // 删除模板
    del(row){
      console.log('delete')
      let params={
        id:row.id
      }
      this.$confirm('确定要删除该运费模板吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('/b2c/postage/policy/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.$message({
              type: 'success',
              message: res.data.msg
            });
          }else{
            this.$message.error(res.data.msg);
          }
          this.getData();
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
      
    },
    //查询
    search(){
      this.currentPage = 1;
      this.getData();
    },
    //重置
    reset(){
      this.searchParams.name = "";
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
    //获取页面数据
    getData(){
      console.log('获取页面数据')
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      console.log(params)
      this.axios.get('/b2c/postage/policy/list',{params})
      .then(res=>{
        console.log(res.data)
        let obj=res.data.msg.datas;
        for(var key in obj){
          if(obj[key].valuationMethods==1){
            obj[key].valuationMethods='按件数'
          }else{
            obj[key].valuationMethods='按重量'
          }
          if(obj[key].weatherItIsFree==1){
            obj[key].weatherItIsFree='自定义运费'
          }else{
            obj[key].weatherItIsFree='卖家包邮'
          }
        }
        this.dataList=res.data.msg.datas;
      }).catch(err=>{
        console.log(err)
      })
    } 
  },
  mounted(){
    this.getData()
  }
}
</script>

<style>

.blank {
  background: rgb(240, 243, 244);
  width: 100%;
  height: 50px;
}
</style>