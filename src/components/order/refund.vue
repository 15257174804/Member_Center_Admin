<template>
  <div class="refund">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>售后管理</span>
    </div>
    <!-- 订单状态导航 -->
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" @change="chooseOrderStatus">
      <el-radio-button :label="0" >全部订单</el-radio-button>
      <el-radio-button :label="1" >未发货退款</el-radio-button>
      <el-radio-button :label="2" >已发货退款</el-radio-button>
      <el-radio-button :label="3" >退货退款</el-radio-button>
      <el-radio-button :label="4" >换货</el-radio-button>
      <el-radio-button :label="5" >补寄</el-radio-button>
    </el-radio-group> -->
    <!-- 搜索 -->
    <div class="search">
      <div class="searchbox">
        订单信息：
        <el-input v-model="searchParams.keyword" placeholder="如订单编号、买家信息、退货运单号等" :style="{width:'250px',height:'50px'}"></el-input>
      </div>
      <div class="searchbox">
        申请单状态：
        <el-select v-model="searchParams.status" :style="{width:'100px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="待审核" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>
          <el-option label="审核不通过" value="2"></el-option>
          <el-option label="待买家发货" value="3"></el-option>
          <el-option label="待卖家收货" value="4"></el-option>
          <el-option label="待退款" value="5"></el-option>
          <el-option label="已退款" value="6"></el-option>
          <el-option label="退款关闭" value="-1"></el-option>
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
      <br>
      <!-- <div class="searchbox">
        起始时间：
        <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期" :style="{width:'185px',height:'40px'}"></el-date-picker>
      </div>
      <div class="searchbox">
        截止日期：
        <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期" :style="{width:'185px',height:'40px'}"></el-date-picker> 
      </div> -->

      <el-form status-icon :rules="rules2">
        <el-form-item  style="display:inline-block;">
          <div class="searchbox">
            起始时间：
            <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期" :style="{width:'185px',height:'40px'}" :picker-options='pickerOptions'></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endTime" style="display:inline-block;">
          <div class="searchbox">
            截止日期：
            <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期" :style="{width:'185px',height:'40px'}"></el-date-picker> 
          </div>
        </el-form-item>
      </el-form>
      
    </div>
    <!-- 表单信息 -->
    <el-table
      v-loading="loading"
      border
      :data="datalist"
      style="width: 100%"
      stripe>
      <el-table-column prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column prop="creatorName" label="用户信息" width="110">
        <template slot-scope="scope">
          <p v-html="scope.row.creatorName"></p>
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额"></el-table-column> 
      <el-table-column prop="totalPayAmount" label="退款金额"></el-table-column> 
      <el-table-column prop="payMethod" label="支付方式"></el-table-column>
      <el-table-column prop="payed" label="支付状态"></el-table-column>
      <el-table-column prop="goodStatus" label="货物状态"></el-table-column>
      <el-table-column prop="returnCode" label="退货运单号"></el-table-column>
      <el-table-column prop="returnReceive" label="退货确认"></el-table-column>
      <el-table-column prop="reason" label="退款原因"></el-table-column>
      <el-table-column prop="memo" label="退款说明"></el-table-column>
      <el-table-column prop="status" label="退款状态" width="135">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.status =='-1'" type="info" disable-transitions>退款关闭</el-tag>
            <el-tag v-if="scope.row.status =='0'" type="warning" disable-transitions>待审核</el-tag>
            <el-tag v-if="scope.row.status =='1'" type="success" disable-transitions>审核通过</el-tag>
            <el-tag v-if="scope.row.status =='2'" type="danger" disable-transitions>审核不通过</el-tag>
            <el-tag v-if="scope.row.status =='3'" type="warning" disable-transitions>待买家发货</el-tag>
            <el-tag v-if="scope.row.status =='4'" type="warning" disable-transitions>待卖家收货</el-tag>
            <el-tag v-if="scope.row.status =='5'" type="warning" disable-transitions>待退款</el-tag>
            <el-tag v-if="scope.row.status =='6'" type="success" disable-transitions>已退款</el-tag>
          </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="view(scope.row)">编辑</el-button> -->
          <p v-if="scope.row.status==0" class="pbutton" @click="agree1(scope.row)">审核</p>
          <p v-else-if="scope.row.status==4" class="pbutton" @click="agree2(scope.row)">确认收货</p>
          <p v-else-if="scope.row.status==5 ||scope.row.status==1" class="pbutton" @click="agree3(scope.row)">退款</p>
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
    <!-- 点击申请审核按钮 -->
    <el-dialog :visible.sync="dialogVisible1" width="45%" title="退款申请审核">
      <el-form :model="reform"  label-width="150px" status-icon :rules="rules" ref="reform">
        <el-form-item label="通过申请" prop='isAgree'>
          <el-radio-group v-model="reform.isAgree">
            <el-radio label='是'></el-radio>
            <el-radio label='否'></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop='auditOpinion'>
          <el-input type="textarea" v-model="reform.auditOpinion" placeholder="请输入审核意见"></el-input>
        </el-form-item>
        <el-form-item label="退货地址" prop='receiveAddress' :required='isRequired'>
          <el-input type="textarea" :disabled="reform.isAgree=='否'" v-model="reform.receiveAddress" placeholder="请输入买家退货时卖家的收货地址，如卖家未发货，不用输入收货地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1=false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 点击确认收货 -->
    <el-dialog :visible.sync="dialogVisible2" width="45%">
      <span>请确认是否收到退款货品</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2=false">取 消</el-button>
        <el-button type="primary" @click="yes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 点击退款 -->
    <el-dialog :visible.sync="dialogVisible3" width="45%">
      <span>请确认是否退款</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3=false">取 消</el-button>
        <el-button type="primary" @click="returnMoney">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'refund',
  data(){
    var validatePass = (rule, value, callback) => {
      // console.log(this.searchParams.endTime)
        if (Date.parse(this.searchParams.endTime)<Date.parse(this.searchParams.startTime)) {
          return callback(new Error('截止日期不能早于开始日期'));
        }else{
          callback();
        }
    };
    return {
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules2:{
        endTime:[
          { validator: validatePass, trigger: 'change' }
        ]
      },
      isCollapse: 0,   //导航按钮
      searchParams:{
        keyword:'',
        status:'',
        startTime:'',
        endTime:''
      },
      loading: false,
      datalist:[{
        orderNo:123456789,
        createTime:'2020-3-22'
      }],   //保存所有的表单信息
      pageSize:5,    //分页：当前页展示信息条数
      curP:1,   //分页：第几页
      totalCount:0,   //分页：总共多少条信息
      reform:{
        id:'',  //申请单id
        isAgree:'是',
        auditOpinion:'',  //审核意见
        receiveAddress:''  //退货地址
      },
      rules:{
        isAgree:[
          { required: true, message: '请选择是否同意', trigger: 'change'}
        ]
      },
      dialogVisible1:false,
      dialogVisible2:false,
      dialogVisible3:false,
      isRequired:false
    }
  },
  methods:{
    // 编辑
    view(row){
      // console.log('点击编辑')
    },
    agree1(row){
      // console.log('是否同意退款申请')
      this.dialogVisible1=true;
      this.reform.id=row.id;
      // console.log(row)
    },
    pass(){
      this.dialogVisible1=false;
      let params={
        id:this.reform.id,
        auditOpinion:this.reform.auditOpinion,
        receiveAddress:this.reform.receiveAddress
      }
      if(this.reform.isAgree=='是'){
        this.axios.post('/b2c/order/cancel/auditSuccess',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
          }else{
            this.$message.error(res.data.msg);
          }
          this.getList();
        })
      }else{
        this.axios.post('/b2c/order/cancel/auditFail',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
          }else{
            this.$message.error(res.data.msg);
          }
          this.getList();
        })
      }
    },
    agree2(row){
      // console.log('确认收货')
      this.dialogVisible2=true;
      this.reform.id=row.id;
    },
    yes(){
      this.dialogVisible2=false;
      let params={
        id:this.reform.id
      }
      this.axios.post('/b2c/order/cancel/returnReceive',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }else{
          this.$message.error(res.data.msg);
        }
        this.getList();
      })
    },
    agree3(row){
      // console.log('是否同意退款申请')
      this.dialogVisible3=true;
      this.reform.id=row.id;
    },
    returnMoney(){
      this.dialogVisible3=false;
      let params={
        id:this.reform.id
      }
      this.axios.post('/b2c/order/cancel/returnMoney',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }else{
          this.$message.error(res.data.msg);
        }
        this.getList();
      })
    },
    // 点击订单状态导航，获取对应状态的订单，全部订单  仅退款 退货退款 补寄等
    chooseOrderStatus(value){
      alert(value)
      // if(value==1){   //未发货退款
      //   this.searchParams.status=0;
      // }else if(value==2){   //已发货退款
      //   this.searchParams.status=2;
      // }else if(value==3){   //退货退款
      //   this.searchParams.status=3;
      // }else if(value==4){   //换货
      //   this.searchParams.status=1;
      // }else if(value==5){   //补寄
      //   this.searchParams.status=5;
      // }else{                //全部订单
      //   this.searchParams.status=''
      // }
      // this.getList()
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
    // 第几页
    handleCurrentChange(curP){
      this.curP = curP;
      this.getList();
    },
    // 每页多少条
    handleSizeChange(size){
      this.pageSize = size;
      this.getList();
    },
    search(){
      this.curP=1;
      this.getList();
    },
    reset(){
      for(let key in this.searchParams){
        this.searchParams[key]=''
      }
      this.curP=1;
      this.getList();
    },
    getList(){
      // console.log('获取所有页面数据数据')
      this.loading=true;  //加载中，等获取信息成功后关闭this.loading=false;
      var params=this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/b2c/order/cancel/list',{params})
      .then(res=>{
        // console.log(res.data)
        this.loading = false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.datalist=res.data.msg.datas;
          this.totalCount=res.data.msg.totalCount;
          for(var i=0;i<this.datalist.length;i++){
            if(this.datalist[i].payMethod==20){
              this.datalist[i].payMethod='微信';
            }else if(this.datalist[i].payMethod==10){
              this.datalist[i].payMethod='支付宝';
            }else{
              this.datalist[i].payMethod='其他';
            }
            if(this.datalist[i].returnReceive){
              this.datalist[i].returnReceive='退货已收货'
            }else{
              this.datalist[i].returnReceive='退货未收货'
            }
            if(this.datalist[i].payed){
              this.datalist[i].payed='买家已付款'
            }else{
              this.datalist[i].payed='买家未付款'
            }
            if(this.datalist[i].receiver && this.datalist[i].customMobile){
              this.datalist[i].creatorName=this.datalist[i].receiver+'<br/>'+this.datalist[i].customMobile
            }else if(this.datalist[i].receiver &&!this.datalist[i].customMobile){
              this.datalist[i].creatorName=this.datalist[i].receiver
            }else if(!this.datalist[i].receiver && this.datalist[i].customMobile){
              this.datalist[i].creatorName=this.datalist[i].creatorName+'<br/>'+this.datalist[i].customMobile
            }
            

            this.datalist[i].goodName=this.datalist[i].goodName+"×"+this.datalist[i].quantity;
            this.datalist[i].orderAmount=this.datalist[i].orderAmount.toFixed(2);
          }
        }
      })
    }
  },
  mounted(){
    this.getList();
  }
}
</script>

<style>
.title{
  margin-bottom: 20px; 
}
tr,
th,
td {
  color: #303133;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.pbutton{
  color: #409EFF;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.searchbox{
  font-size: 14px;
}
</style>