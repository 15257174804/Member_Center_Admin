<template>
  <div id="company">
    <div class="title clearfix">
      <span>订单列表</span>
    </div>
    <!-- 订单状态导航 -->
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" @change="chooseOrderStatus">
      <el-radio-button :label="0" >全部订单({{all}})</el-radio-button>
      <!-- <el-radio-button :label="5" >待审核{{all1}}</el-radio-button> -->
      <!-- <el-radio-button :label="6" >审核完成</el-radio-button> -->
      <el-radio-button :label="1" >待付款({{all2}})</el-radio-button>
      <el-radio-button :label="2" >待发货/待自提({{all3}})</el-radio-button>
      <el-radio-button :label="3" >待收货({{all4}})</el-radio-button>
      <el-radio-button :label="4" >交易成功({{all5}})</el-radio-button>
      <!-- <el-radio-button :label="6" >自提待确认{{all6}}</el-radio-button> -->
    </el-radio-group>
     <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        订单编号：
        <el-input v-model="searchParams.orderNo" placeholder="请输入订单编号" :style="{width:'160px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        手机号码：
        <el-input v-model="searchParams.keyword" placeholder="请输入手机号" :style="{width:'160px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        提货方式：
        <el-select v-model="searchParams.pickupWay" :style="{width:'120px',height:'40px'}" @change="changepick($event)">
          <el-option label="所有" value=""></el-option>
          <el-option label="到店自取" value="1"></el-option>
          <el-option label="快递" value="2"></el-option>
        </el-select>
      </div> 
      <div class="searchbox">
        自提确认：
        <el-select v-model="searchParams.clientConfirm" :style="{width:'120px',height:'40px'}" :disabled="searchParams.pickupWay=='2'">
          <el-option label="所有" value=""></el-option>
          <el-option label="待自提确认" value="0"></el-option>
          <el-option label="确认接单" value="1"></el-option>
          <el-option label="拒绝接单" value="3"></el-option>
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
      <div class="searchbox">
        <el-button @click="exportExcel()">
          <i class="el-icon-document-checked"></i>
          导出
        </el-button>
      </div>
      <!-- <el-button style="padding:12px 20px;background:#fdc52d;border:1px solid #fdc52d;float:right;" type="info" @click="exportExcel">导出</el-button> -->
      <br>
      <el-form status-icon :rules="rules2">
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
      
    </div>

    <el-table
      v-loading="loading"
      :data="dataList"
      border 
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="clientName" label="下单门店"></el-table-column>
      <el-table-column prop="createTime" label="下单时间"></el-table-column>
      <el-table-column prop="creatorName" label="用户信息" width="150">
        <template slot-scope="scope">
          <p v-html="scope.row.creatorName"></p>
        </template>
      </el-table-column>
      <el-table-column prop="pickUpStoreName" label="自提门店"></el-table-column>
      <el-table-column prop="pickupWay" label="提货方式" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.pickupWay =='2'">快递
            <el-button v-if="scope.row.status=='2' || scope.row.status=='0'" style="padding-left:8px;" type="text" @click="delivery(scope.row)">发货</el-button>
            <el-button v-if="scope.row.expressCode && scope.row.expressCorp" style="padding-left:8px;" type="text" @click="delivery(scope.row)">发货信息</el-button>
          </span>
          <span v-if="scope.row.pickupWay =='1'">客户自提</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="支付方式"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="status" label="付款状态">
        <template slot-scope="scope">
          <span v-if="scope.row.payed ==true" disable-transitions>已付款</span>
          <span v-if="scope.row.payed ==false" disable-transitions>未付款</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status =='-1'" type="info" disable-transitions>已取消</el-tag>
            <el-tag v-if="scope.row.status =='0'" type="warning" disable-transitions>待付款</el-tag>
            <el-tag v-if="scope.row.status =='1'" type="success" disable-transitions>已完成</el-tag>
            <el-tag v-if="scope.row.status =='2' && scope.row.pickupWay=='2'" type="danger" disable-transitions>待发货</el-tag>
            <el-tag v-if="scope.row.status =='2' && scope.row.pickupWay=='1'" type="danger" disable-transitions>待自提</el-tag>
            <el-tag v-if="scope.row.status =='3'" type="brand" disable-transitions>待收货</el-tag>
            <el-tag v-if="scope.row.status =='4'" type="brand" disable-transitions>待评价</el-tag>
            <el-tag v-if="scope.row.returnOrderFlag" type="info" disable-transitions>有售后</el-tag>
          </template>
        </el-table-column>
        <!-- 自提待审核状态，0 待审核  1 确认接单 2 拒绝接单 没有分配门店默认没有值 -->
      <el-table-column prop="clientConfirm" label="门店分配状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.clientConfirm =='0'">待自提确认</span>
          <span v-else-if="scope.row.clientConfirm =='1'">确认接单</span>
          <span v-else-if="scope.row.clientConfirm =='2'">拒绝接单</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderMemo" label="备注">
        <template slot-scope="scope">
          <span v-if="scope.row.orderMemo" style="display:block;">{{scope.row.orderMemo|titleFormate}}</span>
          <el-button type="text" @click="memo(scope.row)" >{{scope.row.orderMemo?'修改':'添加'}}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
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
                <p class="pbutton" v-if="scope.row.pickupWay=='1'&& scope.row.clientConfirm!='1'  && (scope.row.status=='0'||scope.row.status=='2')" @click="manage(scope.row)">分配门店</p>
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.clientConfirm=='0'&& scope.row.pickUpStore==clientid && scope.row.status!='-1'" @click="clientConfirm(scope.row)">自提门店确认</p> 
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.pickupWay=='1' && (scope.row.status=='2'|| scope.row.status=='0')" @click="notice(scope.row)">自提通知</p>
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.clientConfirm=='1' &&(scope.row.status == '2' && scope.row.pickupWay == '1')" @click="cancelVerification(scope.row)">确认提货</p>
              </el-dropdown-item>
              <el-dropdown-item >
                <p class="pbutton" v-if="scope.row.status=='0' && scope.row.clientConfirm =='1'" @click="changepay(scope.row)">转线下支付</p>  
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 后期通过权限来控制 -->
           
          <!--自提待审核状态  必须是门店账号，登录时把clientId保存到state中，与订单中的pickUpStore相等说明是自提门店的订单-->
          
          
          
          <!--待付款 确认接单 支付方式为其他-->
          
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
    <!-- total是总数据量 -->

    <!-- 点击发货 -->
    <el-dialog :title="deliverytitle" :visible.sync="dialogFormVisible2">
      <el-form :model="dform" :rules="rules" label-width="100px">
        <el-form-item label="快递单号" prop="expressCode">
          <el-input v-model="dform.expressCode" :disabled="deliverytitle=='货运单信息'" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="expressCorp">
          <!-- <el-input v-model="dform.expressCorp" :disabled="deliverytitle=='货运单信息'" autocomplete="off"></!--> 
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
    <!-- 点击分配门店 -->
    <el-dialog title="分配门店" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form">
        <el-form-item label="预约门店" prop="parentId">
          <el-select v-model="form.corpId" placeholder="请选择" :disabled="form.level == 1">
            <el-option v-for="item in companyDataList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
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
    <!-- 点击添加备注 -->
    <el-dialog title="订单备注" :visible.sync="dialogVisible6">
      <el-form :model="dform" :rules="rules" label-width="100px">
        <el-form-item label-width="0">
          <el-input type="textarea" v-model="memoForm.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible6 = false">取 消</el-button>
        <el-button type="primary" @click="saveMemo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: "company",
  data() {
    var validatePass = (rule, value, callback) => {
      // console.log(this.searchParams.endTime)
        if (Date.parse(this.searchParams.endTime)<Date.parse(this.searchParams.startTime)) {
          callback(new Error('截止日期不能早于开始日期'));
        }else{
          callback();
        }
    };
    return {
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
      all:0,
      all1:0,
      all2:0,
      all3:0,
      all4:0,
      all5:0,
      isCollapse: 0,   //导航按钮
      clientid:this.$store.state.clientId,
      searchParams:{
        orderTypeFlag:0,
        orderNo:"",
        keyword:'',
        pickupWay:'',
        status:"",
        startTime:"",
        endTime:"",
        clientConfirm:'',
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true,
      dialogFormVisible2:false,
      dialogFormVisible:false,
      dialogVisible5:false,
      dialogVisible4:false,
      dialogVisible6:false,
      rowid:'',  //点击企业预约确认，吧改行id暂存，等点击pass事件作为参数
      rowid2:'',  //点击自提确认，吧该行订单id暂存，等点击receive和noreceive事件作为参数
      payform:{
        payed:false
      },
      companyDataList:[],//企业列表
      form:{
        corpId:''
      },
      deliverytitle:'',
      dform:{
        orderId:'',
        expressCode:'',
        expressCorp:''
      },
      memoForm:{
        id:'',
        memo:''
      },
      multipleSelection: [],  //多选
      rules:{
        expressCode: [
          { required: true, message:'请输入快递单号', trigger: "blur" }
        ],
        expressCorp: [
          { required: true, message:'请输入快递公司名称', trigger: "blur" }
        ],
      }
    };
  },
  // 页面渲染前拿到数据
  mounted() {
    if(this.$route.query.flag=='1'){
      this.searchParams.status=this.$route.query.status;
      this.searchParams.pickupWay=this.$route.query.pickupWay;
      this.isCollapse=this.$route.query.status
    }else if(this.$route.query.flag=='2'){
      this.searchParams.status=this.$route.query.status;
      this.searchParams.pickupWay=this.$route.query.pickupWay;
      this.isCollapse=this.$route.query.status
    }else if(this.$route.query.flag=='3'){
      this.searchParams.pickupWay=this.$route.query.pickupWay;
    }else if(this.$route.query.flag=='4'){
      this.searchParams.clientConfirm=this.$route.query.clientConfirm;
    }
    this.getDataList();
    this.getAllNum();
  },
  methods: {
    // 备注
    memo(row){
      console.log(row)
      this.dialogVisible6=true;
      this.memoForm.id=row.id;
      this.memoForm.memo=row.orderMemo;
    },
    saveMemo(){
      this.dialogVisible6=false;
      let params={
        id:this.memoForm.id,
        orderMemo:this.memoForm.memo
      }
      this.axios.post('/b2c/order/save',params)
      .then(res=>{
        if(res.data.code>0){
          this.$message.success('添加成功')
          this.getDataList();
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    changepick(i){
      // console.log(i)
      if(i==2){
        this.searchParams.clientConfirm=''
      }
    },
    // 导出订单
    exportExcel(){
      let params={
        queryType:2,
        status:this.searchParams.status,
        startTime:this.searchParams.startTime,
        endTime:this.searchParams.endTime,
        id:this.searchParams.orderNo,
        pickupWay:this.searchParams.pickupWay,
        clientConfirm:this.searchParams.clientConfirm,
        orderTypeFlag:0
      }
      this.axios.get('b2c/order/export',{params})
      .then(res=>{
        // console.log(res)
        var blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
        // console.log(blob)
        // var contentDisposition = res.headers['Content-Disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
        // console.log(contentDisposition)
        // var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        // console.log(patt)
        // var result = patt.exec(contentDisposition);
        // console.log(result)
        // var filename = result[1];
        var downloadElement = document.createElement('a');
        // var href = window.URL.createObjectURL(blob); //创建下载的链接
        var href=res.request.responseURL;
        // console.log(href)

        downloadElement.style.display = 'none';
        downloadElement.href = href;
        // downloadElement.download =filename ; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象

        

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
    // 获取所有订单的数量统计
    getAllNum(){
      let params={
        groupId:this.$store.state.groupId,
        orderTypeFlag:0
      }
      this.axios.get('/b2c/order/group',{params})
      .then(res=>{
        // console.log('统计')
        // console.log(res.data)
        let obj=res.data.msg.datas;
        this.all=0;
        for(var i=0;i<obj.length;i++){
          let item=obj[i];
          this.all+=Number(item.orderCount);
          if(item.status==0){
            this.all2=item.orderCount;
          }else if(item.status==1){
            this.all5=item.orderCount;
          }else if(item.status==2){
            this.all3=item.orderCount;
          }else if(item.status==3){
            this.all4=item.orderCount;
          }else if(item.status==5){
            this.all1=item.orderCount;
          }
        }
        // console.log('all')
        // console.log(this.all)
      }).catch(err=>{
        console.log(err)
      })
    },
    // 点击订单状态导航，获取对应状态的订单，全部订单  待付款  待发货  待收货
    chooseOrderStatus(value){
      // alert(value)
      if(value==1){   //待付款
        this.searchParams.status=0;
      }else if(value==2){  //待发货
        this.searchParams.status=2;
      }else if(value==3){  //待收货
        this.searchParams.status=3;
      }else if(value==4){  //交易完成
        this.searchParams.status=1;
      }else if(value==5){  //待审核
        this.searchParams.status=5;
      }else{
        this.searchParams.status='';
      }
      this.getDataList();
    },
    // 修改支付状态为线下支付
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
      // console.log(this.multipleSelection)
      // console.log(row)
      let orderIds=[];
      if(this.multipleSelection.length>0){
        for(let i=0;i<this.multipleSelection.length;i++){
          let item=this.multipleSelection[i]
          orderIds.push(item.orderId)
        }
      }else{
        orderIds.push(row.orderId)
      }
      // console.log(orderIds)
      let params={
        orderIds:orderIds,
        //msgType:1,//预留字段 用来区分发送的平台是短信还是微信
        //notifyType:1//通知的类型 到货通知，发货通知，等 预留字段
      }
      this.axios.post('/b2c/order/notify',params)
      .then(res=>{
        // console.log(res)
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 如果快递的且待发货的显示发货
    delivery(row){
      // console.log('发货')
      // console.log(row)
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
    },
    // 指定门店信息保存提交
    submit(){
      this.dialogFormVisible=false;
      let params=this.form
      this.axios.get('/b2c/order/pickUpStore',{params})
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
      })
    },
    // 管理订单
    manage(row){
      // console.log('分配门店row')
      // console.log(row)
      this.form.orderId=row.orderId;
      this.dialogFormVisible = true;
      let params={
        // id:row.corpId
        level:3
      }
      this.axios.get('/crm/corporation/list',{params})
      .then(res=>{
        // console.log('查询企业列表')
        // console.log(res.data)
        this.companyDataList = res.data.msg.datas;    //数据需要核对，是否只展示相关门店数据
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
    //操作某行
    handleClick(row) {
    },
    //查看详情
    showDetail(row){
      this.$router.push({
          name: 'orderdetail',//跳转路径的name值，不写跳转后页面取不到参数
          // 参数
          query: {
            id: row.id,
            title: "订单详情"
          }
      })
    },
    // 获取列表数据
    getDataList() {
      this.loading = true;
      var params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios
        .get("/b2c/order/list", {params})
        .then(res => {
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            this.dataList = res.data.msg.datas;
            this.totalCount = res.data.msg.totalCount;
            
            for(var i=0;i<this.dataList.length;i++){
              var item=this.dataList[i]
              if(item.payType==0){
                item.payType='其他'
              }else if(item.payType==10){
                item.payType='支付宝'
              }else if(item.payType==20){
                item.payType='微信'
              }
              // if(item.pickupWay==1){
              //   item.creatorName=item.creatorName+'<br/>'+item.customMobile
              // }else if(item.pickupWay==2){
              //   item.receiver=item.receiver+'<br/>'+item.customMobile+'<br/>'+item.city+item.county+item.address;
              // }
              if(item.receiver){
                if(item.linkCall){
                  item.creatorName=item.receiver+'<br/>'+item.linkCall+'<br/>'+item.city+item.county+item.address;
                }else{
                  item.creatorName=item.receiver+'<br/>'+item.customerPhone+'<br/>'+item.city+item.county+item.address;
                }
                
              }else if(item.creatorName){
                item.creatorName=item.creatorName+'<br/>'+item.customerPhone
              }else{
                item.creatorName=item.customerPhone
              }
              item.amount=item.amount.toFixed(2);
            }
          }
        })
        .catch(err => {
           console.log(err);
        });
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
};
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
.el-dropdown-link {
  cursor: pointer;
  
}
.searchbox{
  font-size: 14px;
}
</style>



