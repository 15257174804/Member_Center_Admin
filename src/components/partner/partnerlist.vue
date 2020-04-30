<template>
  <div class="partnerlist">
    <div class="title clearfix">
      <span>合伙人列表</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        合伙人状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="待审核" value="0"></el-option>
          <el-option label="审核失败" value="2"></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="注销" value="-1"></el-option>
        </el-select>
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
      :data="dataList"
      border 
      stripe
      style="width: 100%">
      <el-table-column prop="id" label="编号" width="60"></el-table-column>
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column prop="partnerCode" label="推荐码"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
      <el-table-column prop="extractAmount" label="可返金额"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ==0" type="danger" disable-transitions>待审核</el-tag>
          <el-tag v-if="scope.row.status ==1" type="success" disable-transitions>正常</el-tag>
          <el-tag v-if="scope.row.status ==2" type="warning" disable-transitions>审核失败</el-tag>
          <el-tag v-if="scope.row.status ==-1" type="info" disable-transitions>已注销</el-tag>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button> -->
          <el-button v-if="scope.row.status ==0" type="text" @click="agree(scope.row)" style="margin-right:13px;">审核</el-button>
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
    <!-- 点击企业预约订单审核订单 -->
    <el-dialog
      title="合伙人审核"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="companyform"  label-width="100px">
        <el-form-item label="是否同意" prop='pass' required>
          <el-radio-group v-model="companyform.pass">
            <el-radio label='是'></el-radio>
            <el-radio label='否'></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop='opinion'>
          <el-input type="textarea" v-model="companyform.opinion" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 佣金计数 -->
    <el-dialog
      title="查看合伙人佣金计数"
      :visible.sync="dialogVisible2"
      width="40%">
      <div>具体内容</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:'partnerlist',
  data(){
    return {
      searchParams:{
        status:""
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      dialogVisible:false,
      dialogVisible2:false,
      companyform:{
        id:'',
        pass:'是',
        opinion:''
      }
    }
  },
  methods:{
    // 查看合伙人佣金计数记录 接口数据有问题，暂时隐藏功能，后期有需求再进行修改
    edit(row){
      // console.log(row)
      this.dialogVisible2=true;
      let params={
        groupId:row.groupId,
        partnerId:row.id,
        status:row.status
      }
      this.rebateOrder(params);
    },
    rebateOrder(obj){
      let params=params;
      this.axios.get('/b2c/rebateOrder/group',{params})
      .then(res=>{
        // console.log(res.data)
      })
    },
    // 企业预约订单审核
    agree(row){
      // console.log(row)
      this.dialogVisible =true;
      this.companyform.id=row.id;
    },
    pass(){
      this.dialogVisible = false;
      let params={
        id:this.companyform.id,
        pass:this.companyform.pass=='是'?true:false,
        opinion:this.companyform.opinion
      }
      // console.log(params)
      this.axios.get('/b2c/partner/audit',{params})
      .then(res=>{
        // console.log(res.data)
        if(res.data.code>0){
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }else{
          this.$message.error(res.data.msg);
        }
        this.getDataList();
      }).catch(err=>{
        console.log(err)
      })
    },
    //表格样式
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
    // 每页展示多少条数据
    handleSizeChange(size) {
      this.pagesize = size;
      this.getDataList();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
    // 第一个获取页面数据
    getDataList(){
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('b2c/partner/list',{params})
      .then(res=>{
        this.loading=false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
        this.dataList = res.data.msg.datas;
        this.totalCount = res.data.msg.totalCount;
      })
    },
    //查询
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      for(let key in this.searchParams){
        this.searchParams[key]=''
      }
      this.getDataList();
    }
  },
  mounted(){
    this.getDataList();
  }
}
</script>

<style scoped>

</style>