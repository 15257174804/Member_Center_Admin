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
        <el-button @click="reset()">
          <i class="el-icon-refresh-right"></i>
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
      <el-table-column width="100" prop="isValid" label="标签">
        <template slot-scope="scope">
          <el-tag @click="lookLabel(scope.row)" style="cursor: pointer;">查看</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
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

    <!-- 标签列表弹框2 -->
    <el-dialog title="添加标签" :visible.sync="dialogFormVisible">
      <!-- 表单内容 -->
      <div>
        <!-- search -->
        <div class="search">
          <!-- 订单号 -->
          <div class="searchbox">
            标签名称：
            <el-input v-model="searchParams2.keyword" placeholder="请输入标签名称" :style="{width:'180px',height:'40px'}"></el-input>
          </div>
          <!-- 按钮 -->
          <div class="searchbox">
            <el-button type="primary" @click="search2()">
              <i class="el-icon-zoom-in"></i>
              查询
            </el-button>
          </div>
          <div class="searchbox">
            <el-button @click="reset2()">
              <i class="el-icon-refresh-right"></i>
              重置
            </el-button>
          </div>
        </div>
        <!-- 表单内容 -->
        <el-table
          :data="dataList2"
          border 
          stripe
          style="width: 100%">
          <el-table-column type="index" label="序号" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="id" label="标签ID"></el-table-column>
          <el-table-column prop="name" label="标签名称"></el-table-column>
          <el-table-column
          fixed="right"
          label="操作"
          width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="add(scope.row)" :disabled="JSON.stringify(labelList).indexOf(scope.row.name)!=-1">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="currentPage2"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount2"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看会员标签弹框1 -->
    <el-dialog
      title="标签查看"
      :visible.sync="dialogVisiblelook"
      width="30%">
      <div>
        <span>会员标签：
          <el-button type="text" @click="addLabel" ><i class="el-icon-plus"></i>添加标签</el-button>
        </span>
        <div >
          <el-tag
            v-for="(item,i) of labelList" 
            :key="i"
            closable
            :disable-transitions="false"
            @close="del(item.id)"
            style="margin-right:5px;"
          >{{item.labelName}}</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblelook = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisiblelook = false">确 定</el-button>
      </span>
    </el-dialog>

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
      searchParams2:{
        keyword:"",
        status:'1'
      },
      dataList2: [],
      pagesize2: 5, //页面一次展示多少数据
      currentPage2: 1, // 第几页
      totalCount2: 0,
      dialogFormVisible:false,
      dialogVisiblelook:false,
      labelList:[],
      customerUserId:'',
      customerId:''
    }
  },
  methods:{
    // 添加标签
    lookLabel(row){
      // console.log(row)
      this.dialogVisiblelook=true;
      this.customerUserId=row.userId;
      this.customerId=row.id;
      this.searchLabel()
    },
    // 查询会员标签
    searchLabel(){
      let params={
        customerId:this.customerId
      }
      this.axios.get('/crm/memberLabelAssociation/all',{params})
      .then(res=>{
        // console.log(res.data)
        this.labelList=res.data.msg;
      })
    },
    // 添加标签
    addLabel(){
      this.dialogFormVisible=true;
      this.getDataList();
    },
    // 删除标签
    del(tag){
      // console.log(tag)
      let params={
        id:tag
      }
      this.axios.get('/crm/memberLabelAssociation/delete',{params})
      .then(res=>{
        if(res.data.code>0){
          this.$message.success('删除成功')
          this.searchLabel()
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleSizeChange2(size) {
      this.pagesize2 = size;
      this.getDataList();
    },
    // 第几页
    handleCurrentChange2(currentPage) {
      this.currentPage2 = currentPage;
      this.getDataList();
    },
    search2(){
      this.currentPage2 = 1;
      this.getDataList();
    },
    //重置
    reset2(){
      this.searchParams2.keyword = "";
      this.getDataList();
    },
    getDataList(){
      // console.log('获取页面数据')
      let params=this.searchParams2;
      params.pageindex = this.currentPage2;
      params.pagesize = this.pagesize2;
      this.axios.get('/crm/memberLabel/list',{params})
      .then(res=>{
        this.dataList2=res.data.msg.datas;
      })
    },
    add(row){
      // console.log(row)
      let params={
        memberLabelId:row.id,
        customerUserId:this.customerUserId,
        customerId:this.customerId
      }
      this.axios.post('/crm/memberLabelAssociation/save',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message.success('添加成功')
          this.searchLabel()
        }else{
          this.$message.error(res.data.msg)
        }
      })
      // let obj={
      //   memberLabelId:row.id,
      //   customerUserId:this.customerUserId,
      //   customerId:this.customerId,
      //   labelName:row.name
      // }
      // if(this.labelList.length>0){
      //   for(var i=0;i<this.labelList.legnth;i++){
      //     if(this.labelList[i].memberLabelId!=obj.memberLabelId){
      //       this.labelList=this.labelList.concat(obj)
      //     }
      //   }
      // }
    },
    // 查看详情
    edit(row){
      // console.log('row')
      // console.log(row)
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
      // console.log('获取页面数据')
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/crm/custom/list',{params})
      .then(res=>{
        this.loading = false;
        // console.log(res.data)
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
.searchbox{
  font-size: 14px;
}
</style>