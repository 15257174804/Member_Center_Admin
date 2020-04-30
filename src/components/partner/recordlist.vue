<template>
  <div class="recordlist">
    <div class="title clearfix">
      <span>提现管理</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        状态：
        <el-select v-model="searchParams.status" :style="{width:'100px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="待审核" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>
          <el-option label="审核失败" value="2"></el-option>
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
      border
      :data="dataList"
      style="width: 100%"
      stripe>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="extractDate" label="申请时间"></el-table-column>
      <el-table-column prop="partnerId" label="合伙人"></el-table-column>
      <el-table-column prop="extractedAmount" label="提现金额"></el-table-column>
      <el-table-column prop="receiptType" label="提现方式"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="danger" disable-transitions>待审核</el-tag>
          <el-tag v-if="scope.row.status==1" type="success" disable-transitions>审核成功</el-tag>
          <el-tag v-if="scope.row.status==2" type="info" disable-transitions>审核失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAccount" label="是否已提现"></el-table-column>
      <el-table-column prop="auditOpinion" label="审核意见"></el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==1&&scope.row.isAccount=='是'" @click="record(scope.row)" style="margin-right:13px;"><i class="el-icon-coordinate"></i>提现</el-button>
          <el-button type="text" v-if="scope.row.status==0" @click="audi(scope.row)" style="margin-right:13px;"><i class="el-icon-coordinate"></i>审核</el-button>
          <!-- <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button> -->
          <!--  -->
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
    <!-- 点击企业审核 -->
    <el-dialog
      title="提现审核"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form"  label-width="100px">
        <el-form-item label="是否同意" prop='isPass' required>
          <el-radio-group v-model="form.isPass">
            <el-radio label='是'></el-radio>
            <el-radio label='否'></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop='auditOpinion'>
          <el-input type="textarea" v-model="form.auditOpinion" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'recordlist',
  data(){
    return {
      searchParams:{
        status:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      dialogVisible:false,
      form:{
        id:'',
        isPass:'是',
        auditOpinion:''
      }
    }
    
  },
  methods:{
    record(row){
      // console.log(row)
      this.$confirm('确定执行提现操作吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={
          id:row.id
        }
        this.axios.post('/b2c/partnerExtractRecord/withdraw',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('提现成功');
          }else{
            this.$message.error(res.data.msg);
          }
          this.getDataList();
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 审核
    audi(row){
      this.form.id=row.id;
      this.dialogVisible =true;
    },
    pass(){
      let params=this.form;
      this.dialogVisible =false;
      if(this.form.isPass=='是'){
        this.axios.post('/b2c/partnerExtractRecord/auditSuccess',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
          }else{
            this.$message.error(res.data.msg);
          }
          this.getDataList();
        })
      }else{
        this.axios.post('/b2c/partnerExtractRecord/auditFail',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
          }else{
            this.$message.error(res.data.msg);
          }
          this.getDataList();
        })
      }
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
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.status = "";
      this.getDataList();
    },
    // 获取页面数据
    getDataList(){
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/b2c/partnerExtractRecord/list',{params})
      .then(res=>{
        this.loading=false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.dataList = res.data.msg.datas;
          for(var i=0;i<this.dataList.length;i++){
            if(this.dataList[i].isAccount){
              this.dataList[i].isAccount='已提现';
            }else{
              this.dataList[i].isAccount='未提现';
            }
            if(this.dataList[i].receiptType==20){
              this.dataList[i].receiptType='微信';
            }else if(this.dataList[i].receiptType==10){
              this.dataList[i].receiptType='支付宝';
            }
          }
          this.totalCount = res.data.msg.totalCount;
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