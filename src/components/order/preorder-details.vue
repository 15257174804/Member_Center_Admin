<template>
  <div class="preorderdetail">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>{{title}}</span>
    </div>

    <!-- 主体内容 -->
    <div class="content">
      <div class="top">
        <!-- 订单基础信息 -->
        <p>
          <label>订单编号：</label>
          <span>{{form.orderNo}}</span>
        </p>
        <p>
          <label>下单时间：</label>
          <span>{{form.createTime}}</span>
        </p>
        <p>
          <label>订单金额：</label>
          <span class="red">￥{{form.totalAmount}}</span>
        </p>
        <p>
          <label>预约类型：</label>
          <span>{{form.preType==1?'个人预约':'企业预约'}}</span>
        </p>
        <p v-if="preform.infoType==2">
          <label>企业名称：</label>
          <span>{{preform.name}}</span>
        </p>
        <p>
          <label>预约用户：</label>
          <span>{{preform.procurement}}</span>
        </p>
        <p>
          <label>联系电话：</label>
          <span>{{preform.contactPhoneNumber}}</span>
        </p>
        <p>
          <label>证件号码：</label>
          <span>{{preform.customIdCard}}</span>
        </p>
        <p v-if="preform.infoType==2">
          <label>企业税号：</label>
          <span>{{preform.creditCode}}</span>
        </p>
        <p>
          <label>支付方式：</label>
          <span class="red">{{form.paytype}}</span>
          <el-tag v-if="form.payType =='0'" type="brand">其他支付方式</el-tag>
          <el-tag v-if="form.payType =='10'" type="brand">支付宝</el-tag>
          <el-tag v-if="form.payType =='20'" type="brand">微信</el-tag>
        </p>
        <p>
          <label>提货方式：</label>
          <el-tag v-if="form.pickupWay =='1'" type="brand">客户自提</el-tag>
          <el-tag v-if="form.pickupWay =='2'" type="brand">快递</el-tag>
        </p>
        <p v-if="form.pickupWay =='1'">
          <label>提货门店：</label>
          <span>{{form.pickUpStoreName}}</span>
        </p>
        <p v-if="form.pickupWay =='2'">
          <label>收货地址：</label>
          <span>{{form.city+form.county+form.address}}</span>
        </p>
        <p>
          <label>订单状态：</label>
          <el-tag v-if="form.status =='-1'" type="info">已取消</el-tag>
          <el-tag v-if="form.status =='0'" type="danger">待付款</el-tag>
          <el-tag v-if="form.status =='1'" type="success">已完成</el-tag>
          <el-tag v-if="form.status =='2' && form.pickupWay=='2'" type="danger">待发货</el-tag>
          <el-tag v-if="form.status =='2' && form.pickupWay=='1'" type="danger">待自提</el-tag>
          <el-tag v-if="form.status =='3'" type="warning">待收货</el-tag>
          <el-tag v-if="form.status =='4'" type="warning">待评价</el-tag>
          <el-tag v-if="form.status =='5'" type="danger">待审核</el-tag>
          <el-tag v-if="form.status =='7'" type="info">企业预约审核不通过</el-tag>
        </p>
        
        <!-- 产品明细   -->
        <!-- <p class="tit">产品明细</p> -->
        <p class="tit">订单明细
          <el-tooltip class="item" effect="dark" content="点击确认默认订单交易完成" placement="top-end">
            <div>
            <el-button v-if="form.clientConfirm=='1' &&(form.status == '2' && form.pickupWay == '1')" type="primary" @click="cancelVerification()">提货确认</el-button>
            </div>
          </el-tooltip>
        </p>

        <!-- 产品明细表单 -->
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="dataList"
          style="width: 100%"
          border 
          @selection-change="handleSelectionChange">
          
           <el-table-column
           v-if="form.pickupWay == 1"
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="imgUrl" label="商品图片" width="300">
            <template slot-scope="scope">
              <img height="100" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.imgUrl" alt="">
            </template>
        </el-table-column>
          <el-table-column prop="goodName" label="商品名称"></el-table-column>
          <el-table-column prop="spec" label="规格" width="120"></el-table-column>
          <el-table-column prop="price" label="单价" width="100"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
          <el-table-column prop="orderDetailStatus" label="明细状态" width="160">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderDetailStatus==0">进行中</el-tag>
            <el-tag v-if="scope.row.orderDetailStatus==1" type="success">已完成</el-tag>
            <el-tag v-if="scope.row.orderDetailStatus==2" type="danger">售后中</el-tag>
            <el-tag v-if="scope.row.orderDetailStatus==3" type="info">已退款</el-tag>
          </template>
        </el-table-column>
        </el-table>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name:'preorderdetail',
  data(){
    return {
      title:'预约订单详情',
      loading: false,
      form:{
        id:'',
      },
      preform:{

      },
      dataList:[]
    }
  },
  methods:{
    // 修改支付状态为线下支付
    changepay(){
      this.dialogVisible2 =true;
    },
    ischangepay(){
      this.dialogVisible2=false;
      let params={
        orderId:this.form.id,
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
        this.getDetailData();
      }).catch(err=>{
        console.log(err)
      })

    },
    //核销订单
    cancelVerification(){
      if(!this.multipleSelection){
        this.$notify({
          title: "提示",
          message:
            "请选择需要核销的订单明细哦！",
          type: "warning",
          duartion: 0
        })
        return
      }
      let params = [],tips = "";
      this.multipleSelection.forEach(row => {
        let obj = {
          id: row.orderDetailId,
          quantity:row.quantity
        }; 
        tips += "【" + row.goodName + " " + row.quantity + "】";
        params.push(obj);
      });
      this.$confirm('此次确收收款商品为'+ tips +',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //核销
        this.axios
        .post("/b2c/order/cancelVerification", {orderDetailModelList: params})
        .then(res => {
          if(res.data.code > 0){
            this.$message({
              type: 'success',
              message: res.data.msg
            });
          }
          this.getDetailData();
        })
        .catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    // 产品明细表单的多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
    // 获取页面数据
    getDetailData(id){
      let params = {id: id}
      this.axios
        .get("/b2c/order/list", {params})
        .then(res => {
          console.log('这还页面数据')
          console.log(res.data)
          this.form = res.data.msg.datas[0];
          this.form.preType=res.data.msg.datas[0].orderDetailModelList[0].preType;
          this.dataList=res.data.msg.datas[0].orderDetailModelList;
        })
        .catch(err => {
        });
    },
    // 获取产品明细数据
    getDetailDataList(id) {
      this.loading = true;
      let params = {
        orderId: id
      }
      this.axios
        .get("/b2c/order/detail/find/by/order/id", {params})
        .then(res => {
          this.loading = false;
          console.log('这是产品明细')
          console.log(res.data)
          this.dataList = res.data.msg;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取预约订单相关预约活动信息
    getInfo(id){
      let params={
        id:id
      }
      this.axios.get('/b2c/order/enterprise/info/findbyid',{params})
      .then(res=>{
        console.log('获取预约活动相关信息')
        console.log(res.data)
        this.preform=res.data.msg;
      })
    }
  },
  mounted(){
    // 路由参数
    if(this.$route.query.id){
      this.form.id = this.$route.query.id;
      this.title = this.$route.query.title;
      this.orderEnterpriseInfoId=this.$route.query.orderEnterpriseInfoId;
      this.getDetailData(this.form.id)
      // this.getDetailDataList(this.form.id);
      this.getInfo(this.orderEnterpriseInfoId)
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
    background: #fff;
    width: 100%;
    height: 50px;
  }
  .content{padding:1rem;}
  .content .top label{color: #606266;}
  .content .top span.red{color: red;}
  .content .tit{font-weight: bold;margin-top: 3rem;border-left: 4px solid #4B9BF7;padding-left: .7rem;}
  .content .tit .el-button{float: right;top: -.18rem;position: relative;}
  .item {
    float:right;
  }
</style>