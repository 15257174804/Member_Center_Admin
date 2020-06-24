<template>
  <div class="preorder">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>预约订单列表</span>
    </div>

    <!-- 订单状态导航 -->
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" @change="chooseOrderStatus">
      <el-radio-button :label="0" >全部订单({{all}})</el-radio-button>
      <el-radio-button :label="5" >待审核({{all1}})</el-radio-button>
      <!-- <el-radio-button :label="6" >审核完成</el-radio-button> -->
      <el-radio-button :label="1" >待付款({{all2}})</el-radio-button>
      <el-radio-button :label="2" >待发货/待自提({{all3}})</el-radio-button>
      <el-radio-button :label="3" >待收货({{all4}})</el-radio-button>
      <el-radio-button :label="4" >交易成功({{all5}})</el-radio-button>
      <!-- <el-radio-button :label="6" >自提待确认{{all6}}</el-radio-button> -->
    </el-radio-group>

    <!-- 搜索 -->
    <div class="search">
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
      
      <!-- <el-button style="padding:12px 20px;background:#fdc52d;border:1px solid #fdc52d;float:right;" type="info" @click="exportExcel">导出</el-button> -->
      <br>
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
      <div class="searchbox">
        预约类型：
        <el-select v-model="searchParams.preType" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="个人预约" value="1"></el-option>
          <el-option label="企业预约" value="2"></el-option>
        </el-select>
      </div><br>
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
        <el-button @click="exportExcel2()">
          <i class="el-icon-document-checked"></i>
          发货单导出
        </el-button>
      </div>
      <div class="searchbox">
        <el-button @click="exportExcel()">
          <i class="el-icon-document-checked"></i>
          订单明细导出
        </el-button>
      </div> 
    </div>

    <!-- 表单信息 -->
    <el-table
      v-loading="loading"
      border
      :data="preorderlist"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="clientName" label="下单门店"></el-table-column>
      <el-table-column prop="createTime" label="下单时间"></el-table-column>
      <el-table-column prop="customerName" label="用户信息" width="110">
        <template slot-scope="scope">
          <p v-html="scope.row.customerName"></p>
          <!-- <p v-else>无</p> -->
        </template>
      </el-table-column>

      <el-table-column prop="pickUpStoreName" label="自提门店"></el-table-column>
      <el-table-column prop="preType" label="预约类型"></el-table-column>
      <el-table-column prop="pickupWay" label="提货方式" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.pickupWay =='2'">快递
            <el-button v-if="scope.row.status=='2'" style="padding-left:8px;" type="text" @click="delivery(scope.row)">发货</el-button>
            <el-button v-if="scope.row.expressCode && scope.row.expressCorp" style="padding-left:8px;" type="text" @click="delivery(scope.row)">发货信息</el-button>
          </span>
          <span v-if="scope.row.pickupWay =='1'">自提</span>
          
        </template>
      </el-table-column>
      <el-table-column prop="receiver" label="收货地址" width="150">
        <template slot-scope="scope">
          <p v-html="scope.row.receiver"></p>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="支付方式"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="status" label="付款状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payed ==true" type="brand" disable-transitions>已付款</el-tag>
          <el-tag v-if="scope.row.payed ==false" type="brand" disable-transitions>未付款</el-tag>
          <br>
          <el-tag v-if="scope.row.returnOrderFlag" type="danger" disable-transitions>有售后</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.status =='-1'" type="info" disable-transitions>已取消</el-tag>
            <el-tag v-if="scope.row.status =='0'" type="warning" disable-transitions>待付款</el-tag>
            <el-tag v-if="scope.row.status =='1'" type="success" disable-transitions>已完成</el-tag>
            <el-tag v-if="scope.row.status =='2' && scope.row.pickupWay=='2'" type="danger" disable-transitions>待发货</el-tag>
            <el-tag v-if="scope.row.status =='2' && scope.row.pickupWay=='1'" type="danger" disable-transitions>待自提</el-tag>
            <el-tag v-if="scope.row.status =='3'" type="warning" disable-transitions>待收货</el-tag>
            <el-tag v-if="scope.row.status =='4'" type="warning" disable-transitions>待评价</el-tag>
            <el-tag v-if="scope.row.status =='5'" type="danger" disable-transitions>待审核</el-tag>
            <el-tag v-if="scope.row.status =='7'" type="info" disable-transitions>审核不通过</el-tag>
          </template>
      </el-table-column>
      <!-- 自提待审核状态，0 待审核  1 确认接单 2 拒绝接单 没有分配门店默认没有值 -->
      <el-table-column prop="clientConfirm" label="门店分配状态">
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
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <p class="pbutton" @click="view(scope.row)">查看详情</p>
          <!--显示条件：待审核 企业预约-->
          <p class="pbutton" v-if="scope.row.status=='5' &&scope.row.preType=='企业预约'" @click="agree(scope.row)">企业预约审核</p>  
          <!--自提 待付款或待发货 ，后期通过权限来控制-->
          <p class="pbutton" v-if="scope.row.pickupWay=='1'&& scope.row.clientConfirm!='1' && (scope.row.status=='0'||scope.row.status=='2')" @click="manage(scope.row)">分配门店</p> 
          <p class="pbutton" v-if="scope.row.pickupWay=='1' && (scope.row.status=='2'|| scope.row.status=='0')" @click="notice(scope.row)">自提通知</p>
          <!--自提待审核状态  必须是门店账号，登录时把clientId保存到state中，与订单中的pickUpStore相等说明是自提门店的订单-->
          <p class="pbutton" v-if="scope.row.clientConfirm=='0'&& scope.row.pickUpStore==clientid" @click="clientConfirm(scope.row)">自提门店确认</p>  
          <p class="pbutton" v-if="scope.row.clientConfirm=='1' &&scope.row.status == '2' && scope.row.pickupWay == '1'" @click="cancelVerification(scope.row)">确认提货</p>
          <!--待付款 确认接单 支付方式为其他-->
          <p class="pbutton" v-if="scope.row.status=='0' && scope.row.clientConfirm =='1' && scope.row.payType=='其他'" @click="changepay(scope.row)">转线下支付</p> 
          
          <!-- scope.row.pickupWay=='1' &&  -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击发货 -->
    <el-dialog :title="deliverytitle" :visible.sync="dialogFormVisible2">
      <el-form :model="dform" :rules="rules" label-width="100px">
        <el-form-item label="快递单号" prop="expressCode">
          <el-input v-model="dform.expressCode" :disabled="deliverytitle=='货运单信息'" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="expressCorp">
          <!-- <el-input v-model="dform.expressCorp" :disabled="deliverytitle=='货运单信息'" autocomplete="off"></el-input> -->
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
    <!-- 点击企业预约订单审核订单 -->
    <el-dialog
      title="企业预约订单审核"
      :visible.sync="dialogVisible3"
      width="30%">
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
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
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
    <!-- 点击确认指定自提门店审核 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible5"
      width="30%"
      :before-close="handleClose">
      <span>是否确认接单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noreceive">拒 绝</el-button>
        <el-button type="primary" @click="receive">确 定</el-button>
      </span>
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
  </div>
</template>

<script>
export default {
  name:'preorder',
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
      clientid:this.$store.state.clientId,
      form:{
        corpId:''
      },
      dform:{
        orderId:'',
        expressCode:'',
        expressCorp:''
      },
      dialogFormVisible: false, //订单管理的对话框
      dialogFormVisible2:false,
      deliverytitle:'',
      dialogVisible3:false,
      dialogVisible4:false,
      dialogVisible5:false,
      dialogVisible6:false,
      rowid:'',  //点击企业预约确认，吧改行id暂存，等点击pass事件作为参数
      rowid2:'',  //点击自提确认，吧该行订单id暂存，等点击receive和noreceive事件作为参数
      payform:{
        payed:false
      },
      companyform:{   //企业预约审核表单
        orderId:'',
        pass:'是',
        opinion:''
      },
      isCollapse: 0,   //导航按钮
      searchParams:{  //保存搜索框中的内容
        orderTypeFlag:1,  //订单类型  1代表是预约订单
        orderNo:'',  //订单编号
        keyword:'',
        // phone:'',
        // name:'',
        pickupWay:'',
        status:'',
        preType:'',
        clientConfirm:'',
        startTime:"",
        endTime:""
      },
      loading: false,
      preorderlist:[],   //保存所有的表单信息
      pageSize:5,    //分页：当前页展示信息条数
      curP:1,   //分页：第几页
      totalCount:0,   //分页：总共多少条信息
      companyDataList:[],//企业列表
      multipleSelection: [],  //多选
      rules:{
        expressCode: [
          { required: true, message:'请输入快递单号', trigger: "blur" }
        ],
        expressCorp: [
          { required: true, message:'请输入快递公司名称', trigger: "blur" }
        ],
      },
      memoForm:{
        id:'',
        memo:''
      },
    }
  },
  methods:{
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
          this.getList();
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
        preType:this.searchParams.preType,
        clientConfirm:this.searchParams.clientConfirm,
        orderTypeFlag:1
      }
      this.axios.get('b2c/order/export',{params})
      .then(res=>{
        // console.log(res)
        var blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
        // console.log(blob)
        var downloadElement = document.createElement('a');
        var href=res.request.responseURL;
        // console.log(href)

        downloadElement.style.display = 'none';
        downloadElement.href = href;
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      })
    },
    // 最新的订单明细导出
    exportExcel(){
      let params={
        queryType:2,
        status:this.searchParams.status,
        startTime:this.searchParams.startTime,
        endTime:this.searchParams.endTime,
        orderTypeFlag:1,   //0 普通订单  1 预约订单
        preType:this.searchParams.preType,
        id:this.searchParams.orderNo,
        pickupWay:this.searchParams.pickupWay,
        clientConfirm:this.searchParams.clientConfirm,
      }
      this.axios.get('/b2c/order/detail/export',{params})
      .then(res=>{
        console.log(res)
        var downloadElement = document.createElement('a');
        var href=res.request.responseURL;
        downloadElement.style.display = 'none';
        downloadElement.href = href;
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
            this.getList();
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
        this.getList();
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
        this.getList();
      })
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
        this.getList();
      }).catch(err=>{
        console.log(err)
      })

    },
    // 企业预约订单审核
    agree(row){
      // console.log('ok')
      this.dialogVisible3 =true;
      this.rowid=row.id;
    },
    pass(){
      this.dialogVisible3 = false;
      let params={
        orderId:this.rowid,
        pass:this.companyform.pass=='是'?true:false,
        opinion:this.companyform.opinion
      }
      this.axios.get('/b2c/order/audit',{params})
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
        this.getList();
      }).catch(err=>{
        console.log(err)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 如果快递的且待发货的显示发货
    delivery(row){
      this.dialogFormVisible2 = true;
      if(row.expressCode && row.expressCorp){
        this.deliverytitle='货运单信息'
      }else{
        this.deliverytitle='请输入货运单信息'
      }
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
          this.getList();
        }else{
          this.$message.error('请核运单信息是否正确');
        }
      })
    },
    // 发送通知,
    notice(row){
      // console.log(this.multipleSelection)
      // console.log(row)
      let orderIds=[];
      orderIds.push(row.orderId)
      for(let i=0;i<this.multipleSelection.length;i++){
        let item=this.multipleSelection
        orderIds.push(item[i].orderId)
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
        this.getList();
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
    // 查看详情，应该吧产品的识别信息一起带过去
    view(row){
      // console.log('点击查看详情')
      // console.log(row)
      this.$router.push({
        name:'preorderdetail',
        query:{
          id:row.id,  //订单id
          title:'预约订单详情',
          orderEnterpriseInfoId:row.orderEnterpriseInfoId
        }
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
      this.getList()
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
    // 按关键信息快速搜索订单
    search(){
      // console.log('搜索内容是否正确')
      // console.log(this.searchParams)
      this.curP=1;
      this.getList();
    },
    // 清空搜索框中的数据
    reset(){
      // this.searchParams.orderNo='';
      // this.searchParams.phone='';
      // this.searchParams.uname='';
      // this.searchParams.quhuofansghi='';
      // this.searchParams.limitType='';
      for(let key in this.searchParams){
        this.searchParams[key]=''
      }
      this.searchParams.orderTypeFlag=1;
      this.getList();
    },
    getList(){
      this.loading=true;  //加载中，等获取信息成功后关闭this.loading=false;
      var params=this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get("/b2c/order/list", {params})
      .then(res => {
        this.loading = false;
        // console.log('预约订单列表查询')
        // console.log(res.data)
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.preorderlist = res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
          // 数据处理
          for(var i=0;i<this.preorderlist.length;i++){
            var item=this.preorderlist[i];
            if(item.receiver){
              item.receiver=item.receiver+'<br/>'+item.linkCall+'<br/>'+item.province+item.city+item.county+item.address;
            }
            if(item.customerName){
              item.customerName=item.customerName+'<br/>'+item.customMobile
            }
            if(item.payType==0){
              item.payType='其他'
            }else if(item.payType==10){
              item.payType='支付宝'
            }else if(item.payType==20){
              item.payType='微信'
            }
            if(item.amount>0){
              item.amount=item.amount.toFixed(2)
            }
            if(item.preType==1){
              item.preType='个人预约'
            }else{
              item.preType='企业预约'
            }
          }
        }
      })
      .catch(err => {
          console.log(err);
      });
    },
    // 获取所有订单的数量统计
    getAllNum(){
      let params={
        groupId:this.$store.state.groupId,
        orderTypeFlag:1  //订单类型  1代表是预约订单
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
  },
  mounted(){
    if(this.$route.query.flag){
      if(this.$route.query.status){
        this.searchParams.status=this.$route.query.status
        this.isCollapse=this.$route.query.status
      }
    }
    this.getList();
    this.getAllNum();
  },
  created(){
    
  },
  beforeRouteLeave(to,from,next){
    to.meta.keepAlive=true;
    next()
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
  .title{
    margin-bottom: 20px; 
  }
  .el-tag{
    margin:0 5px 0 5px;
  }
  .pbutton{
    margin:0;
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }
  .searchbox{
  font-size: 14px;
  }
  .el-form-item{
    margin-bottom:0;
  }
</style>