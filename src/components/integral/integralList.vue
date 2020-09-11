<template>
  <div class="integralList">
    <div class="title clearfix">
      <span>积分订单列表</span>
    </div>
    <!-- 订单状态导航 -->
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" @change="chooseOrderStatus">
      <el-radio-button :label="8" >全部订单({{all}})</el-radio-button>
      <el-radio-button :label="0" >待付款({{all2}})</el-radio-button>
      <el-radio-button :label="2" >待发货/待自提({{all3}})</el-radio-button>
      <el-radio-button :label="3" >待收货({{all4}})</el-radio-button>
      <el-radio-button :label="1" >交易成功({{all5}})</el-radio-button>
    </el-radio-group> -->
    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        订单编号：
        <el-input v-model="searchParams.orderNo" placeholder="请输入订单编号" :style="{width:'160px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        订单状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="待付款" :value="0"></el-option>
          <el-option label="已完成" :value="1"></el-option>
          <el-option label="待发货/待自提" :value="2"></el-option>
          <el-option label="待收货" :value="3"></el-option>
          <el-option label="待评价" :value="4"></el-option>
          <el-option label="交易关闭" :value="8"></el-option>
        </el-select>
      </div>
      <el-form status-icon :rules="rules2" style="display:inline-block;">
        <el-form-item  style="display:inline-block;">
          <div class="searchbox">
            起始时间：
            <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期" :style="{width:'160px',height:'40px'}" :picker-options='pickerOptions'></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endTime" style="display:inline-block;">
          <div class="searchbox">
            截止日期：
            <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期" :style="{width:'160px',height:'40px'}"></el-date-picker> 
          </div>
        </el-form-item>
      </el-form>
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
      stripe
      style="width: 100%">
      <el-table-column prop="orderNo" label="订单编号" width="100"></el-table-column>
      <el-table-column prop="clientName" label="下单门店"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="100"></el-table-column>
      <el-table-column prop="customerName" label="用户信息" width="110">
        <template slot-scope="scope">
          <p v-html="scope.row.customerName"></p>
        </template>
      </el-table-column>
      <el-table-column prop="pickUpStoreName" label="自提门店" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.pickUpStoreName">{{scope.row.pickUpStoreName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="pickUpTime" label="自提时间" width="100"></el-table-column>
      <el-table-column prop="pickupWay" label="提货方式">
        <template slot-scope="scope">
          <span v-if="scope.row.pickupWay =='2'">快递
          </span>
          <span v-if="scope.row.pickupWay =='1'">客户自提</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiver" label="收货地址" width="150">
        <template slot-scope="scope">
          <p v-html="scope.row.receiver"></p>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="fareAmount" label="运费"></el-table-column>
      <el-table-column prop="status" label="付款状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payed ==true" disable-transitions>已付款</span>
          <span v-if="scope.row.payed ==false" disable-transitions>未付款</span>
          <br>
          <el-tag v-if="scope.row.returnOrderFlag" type="danger" disable-transitions>有售后</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payBillCode" label="支付单号" align='center' width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.payBillCode" disable-transitions style="text-align:left;">{{scope.row.payBillCode}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态" align="center" width=''>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status =='-1'" type="info" disable-transitions>已取消</el-tag>
          <el-tag v-if="scope.row.status =='0'" type="warning" disable-transitions>待付款</el-tag>
          <el-tag v-if="scope.row.status =='1'" type="success" disable-transitions>已完成</el-tag>
          <el-tag v-if="scope.row.status =='2' && scope.row.pickupWay=='2'" type="danger" disable-transitions>待发货</el-tag>
          <el-tag v-if="scope.row.status =='2' && scope.row.pickupWay=='1'" type="danger" disable-transitions>待自提</el-tag>
          <el-tag v-if="scope.row.status =='3'" type="brand" disable-transitions>待收货</el-tag>
          <el-tag v-if="scope.row.status =='4'" type="brand" disable-transitions>待评价</el-tag>
          <el-tag v-if="scope.row.status =='8'" type="info" disable-transitions>交易关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <p class="pbutton" @click="showDetail(scope.row)" style="margin-right:13px;"><i class="el-icon-edit"></i>详情</p>

          <el-dropdown trigger="click" v-if="scope.row.status!='-1' || scope.row.status!='1'">
            <span class="el-dropdown-link" style="color: #409EFF;">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.pickUpStore==clientid && scope.row.clientConfirm =='0'" @click="clientConfirm(scope.row)">自提门店确认</p> 
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.pickupWay=='1' && scope.row.clientConfirm =='1'&&(scope.row.status=='2'|| scope.row.status=='0')" @click="notice(scope.row)">自提通知</p>
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.clientConfirm=='1' &&(scope.row.status == '2' && scope.row.pickupWay == '1')" @click="cancelVerification(scope.row)">确认提货</p>
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.pickupWay=='1' && scope.row.payed ==false &&scope.row.clientConfirm =='1'&& scope.row.payType==1" @click="changepay(scope.row)">转线下支付</p>  
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.status=='2'&&scope.row.pickupWay=='2'" @click="delivery(scope.row)">发货</p> 
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.expressCode && scope.row.expressCorp" @click="delivery(scope.row)">发货信息</p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <!-- 点击确认指定自提门店审核 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible5"
      width="30%">
      <span>是否确认接单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noreceive">拒 绝</el-button>
        <el-button type="primary" @click="receive">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击转线下支付 -->
    <el-dialog :visible.sync="dialogVisible4">
      <el-form :model="payform">
        <el-form-item label="是否已经线下支付">
          <el-radio-group v-model="payform.payed">
            <el-radio label=true>是</el-radio>
            <el-radio label=false>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="ischangepay">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 点击发货 -->
    <el-dialog :title="deliverytitle" :visible.sync="dialogFormVisible2" :close-on-click-modal='false' :close-on-press-escape='false'>
      <el-form :model="dform" :rules="rules" label-width="100px">
        <el-form-item label="快递单号" prop="expressCode">
          <el-input v-model="dform.expressCode" :disabled="deliverytitle=='货运单信息'" autocomplete="off"></el-input>
        </el-form-item>
        <div style='height:20px;'></div>
        <el-form-item label="快递公司" prop="expressCorp">
          <el-select v-model="dform.expressCorp" placeholder="请选择" :disabled="deliverytitle=='货运单信息'">
            <el-option
              v-for="item in deliveryoptions"
              :key="item.id"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submit2">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:'integralList',
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
      searchParams:{
        orderNo:'',
        status:'',
        startTime:'',
        endTime:'',
      },
      loading:false,
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      clientid:sessionStorage.getItem("pickupstoreid"),
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
      dialogVisible5:false,
      rowid2:'',  //点击自提确认，吧该行订单id暂存，等点击receive和noreceive事件作为参数
      dialogVisible4:false,
      rowid:'',  //点击企业预约确认，吧改行id暂存，等点击pass事件作为参数
      deliverytitle:'',
      dform:{
        orderId:'',
        expressCode:'',
        expressCorp:''
      },
      dialogFormVisible2:false,
      rules:{
        expressCode: [
          { required: true, message:'请输入快递单号', trigger: "blur" }
        ],
        expressCorp: [
          { required: true, message:'请输入快递公司名称', trigger: "blur" }
        ],
      },
      deliveryoptions:[
        {
          id:1,
          label:'顺丰快递'
        },
        {
          id:2,
          label:'EMS'
        },
        {
          id:3,
          label:'申通快递'
        },
        {
          id:4,
          label:'韵达快递'
        },
        {
          id:5,
          label:'中通快递'
        },
        {
          id:6,
          label:'圆通快递'
        },
        {
          id:7,
          label:'汇通快递'
        },
        {
          id:8,
          label:'天天快递'
        },
        {
          id:9,
          label:'宅急送'
        },
        {
          id:10,
          label:'丹鸟快递'
        },
        {
          id:11,
          label:'京东快递'
        },
        {
          id:12,
          label:'其他快递'
        },
      ],
      payform:{
        payed:false
      },
    }
  },
  created(){
    if(this.$route.query.flag=='1'){
      this.searchParams.status=this.$route.query.status;
      this.searchParams.startTime=this.$route.query.startTime;
      this.searchParams.endTime=this.$route.query.endTime;
    }
    this.getDataList();
  },
  methods:{
    //查看详情
    showDetail(row){
      this.$router.push({
          name: 'orderdetail',//换路径***************************************
          // 参数
          query: {
            id: row.id,
            title: "订单详情"
          }
      })
    },
    // 门店自提审核确认
    clientConfirm(row){
      // console.log('自提审核确认')
      // console.log(row)
      this.dialogVisible5 =true;
      this.rowid2=row.id;
    },
    receive(){
      this.dialogVisible5 =false;
      let params={
        id:this.rowid2,
        clientConfirm:1
      }
      this.axios.post('/b2c/order/clientConfirm',params)
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
    },
    noreceive(){
      this.dialogVisible5 =false;
      let params={
        id:this.rowid2,
        clientConfirm:2
      }
      this.axios.post('/b2c/order/clientConfirm',params)
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
    },
    // 发送通知,
    notice(row){
      let orderIds=[];
      orderIds.push(row.orderId);
      let params={
        orderIds:orderIds,
        //msgType:1,//预留字段 用来区分发送的平台是短信还是微信
        //notifyType:1//通知的类型 到货通知，发货通知，等 预留字段
      }
      this.axios.post('/b2c/order/notify',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
    //核销订单
    cancelVerification(row){
      this.$confirm('确定核销该笔订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params={
          id:row.id
        }
        //核销
        this.axios
        .get("/b2c/order/cancelVerificationAll", {params})
        .then(res => {
          if(res.data.code > 0){
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.getDataList();
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    changepay(row){
      this.dialogVisible4 =true;
      this.rowid=row.id;
    },
    ischangepay(){
      this.dialogVisible4=false;
      let params={
        orderId:this.rowid,
        payed:JSON.parse(this.payform.payed)
      }
      this.axios.get('/b2c/order/payed',{params})
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
      }).catch(err=>{
        console.log(err)
      })

    },
    // 如果快递的且待发货的显示发货
    delivery(row){
      if(row.expressCode && row.expressCorp){
        this.deliverytitle='货运单信息'
      }else{
        this.deliverytitle='请输入货运单信息'
      }
      this.dialogFormVisible2 = true;
      this.dform.orderId=row.orderId;
      this.dform.expressCode=row.expressCode;
      this.dform.expressCorp=row.expressCorp;
    },
    submit2(){
      this.dialogFormVisible2=false;
      let params=this.dform;
      if(this.deliverytitle=='请输入货运单信息'){
        this.axios.get('/b2c/order/delivery',{params})
        .then(res=>{
          if(res.data.code>0){
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.getDataList();
          }else{
            this.$message.error('请核运单信息是否正确');
          }
        })
      }
      
    },
    getDataList(){
      this.loading=true;
      let params=this.searchParams;
      params. orderType=3;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/b2c/order/list',{params})
      .then(res=>{
        this.loading=false;
        if(res.data.code>0){
          this.dataList=res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
          for(var i=0;i<this.dataList.length;i++){
              var item=this.dataList[i]
              if(item.receiver){
                item.receiver=item.receiver+'<br/>'+item.linkCall+'<br/>'+item.province+item.city+item.county+item.address;
              }
              if(item.customerName && item.customerPhone){
                item.customerName=item.customerName+'<br/>'+item.customerPhone
              }else if(item.customerPhone){
                item.customerName=item.customerPhone
              }
              item.amount=item.amount.toFixed(2);
              item.fareAmount=item.fareAmount.toFixed(2);
          }
        }else{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      }).catch(err => {
          console.log(err);
      });

    },
    // 点击订单状态导航，获取对应状态的订单，全部订单  待付款  待发货  待收货
    chooseOrderStatus(value){
      // alert(value)
      if(value==0){   //待付款
        this.searchParams.status=0;
      }else if(value==2){  //待发货
        this.searchParams.status=2;
      }else if(value==3){  //待收货
        this.searchParams.status=3;
      }else if(value==1){  //交易完成
        this.searchParams.status=1;
      }else if(value==5){  //待审核
        this.searchParams.status=5;
      }else{
        this.searchParams.status='';
      }
      this.getDataList();
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
  }
}
</script>

<style scoped>
tr,
th,
td {
  color: #303133;
}
.blank {
  background: rgb(240, 243, 244);
  width: 100%;
  height: 50px;
}
.pbutton{
  color: #409EFF;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin:0;
  display: inline-block;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-tag{
  margin:0 5px 0 5px;
}
.title{
  margin-bottom: 20px; 
}
.searchbox{
  font-size: 14px;
}
.el-form-item{
  margin-bottom:0;
}
</style>