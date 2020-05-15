<template>
  <div id="orderdetail">
    <div class="title clearfix">
      <span>{{title}}</span>
    </div>
    <div class="content">
      <div class="top">
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
          <span class="red">￥{{form.amount}}</span>
        </p>
        <p>
          <label>实付金额：</label>
          <span class="red">￥{{form.realPayAmount}}</span>
        </p>
        <p>
          <label>提货方式：</label>
          <el-tag v-if="form.pickupWay =='1'" type="brand">客户自提</el-tag>
          <el-tag v-if="form.pickupWay =='2'" type="brand">快递</el-tag>
        </p>
        <p>
          <label>订单状态：</label>
          <el-tag v-if="form.status =='-1'" type="info">已取消</el-tag>
          <el-tag v-if="form.status =='0'" type="warning">待付款</el-tag>
          <el-tag v-if="form.status =='1'" type="success">已完成</el-tag>
          <el-tag v-if="form.status =='2' && form.pickupWay=='2'" type="danger">待发货</el-tag>
          <el-tag v-if="form.status =='2' && form.pickupWay=='1'" type="danger">待自提</el-tag>
          <el-tag v-if="form.status =='3'" type="brand">待收货</el-tag>
          <el-tag v-if="form.status =='4'" type="brand">待评价</el-tag>
        </p>
      </div>
      <p class="tit">订单明细<el-button v-if="form.clientConfirm=='1' && form.pickupWay == '1'&&(form.status == '2') " type="primary" @click="cancelVerification()">提货确认</el-button></p>
      <el-table
        :data="dataList"
        ref="multipleTable"
        style="width: 100%"
        border 
        @selection-change="handleSelectionChange">
        >
        <el-table-column v-if="form.pickupWay == 1"
          type="selection"
        >
        </el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="imgUrl" label="商品图片" width="100" align="center">
            <template slot-scope="scope">
              <img style="height:60px;width:60px;" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.imgUrl" alt="">
            </template>
        </el-table-column>
        <el-table-column prop="goodName" label="商品名称"></el-table-column>
        <el-table-column prop="spec" label="规格" width="120"></el-table-column>
        <el-table-column prop="price" label="单价" width="100"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
        <!-- ************************************************************************************************** -->
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
</template>

<script>

  export default {
    name: "orderdetail",
    data() {
      return {
        title:"订单详情",
        loading: true,
        dataList: [],
        form:{
          id: ''
        }
      }
    },
    mounted(){
        // 路由参数
        if(this.$route.query.id){
          this.form.id = this.$route.query.id;
          this.title = this.$route.query.title;
          this.getDetailData(this.form.id)
          // this.getDetailDataList(this.form.id);
        }
    },
    methods: {
      getDetailData(id){
        let params = {id: id}
        this.axios
          .get("/b2c/order/list", {params})
          .then(res => {
            this.form = res.data.msg.datas[0];
            this.dataList=res.data.msg.datas[0].orderDetailModelList;
          })
          .catch(err => {
          });
      },
      // 获取数据
      getDetailDataList(id) {
        let params = {
          orderId: id
        }
        this.axios
          .get("/b2c/order/detail/find/by/order/id", {params})
          .then(res => {
            // console.log('获取findbyid')
            // console.log(res.data)
            this.loading = false;
            this.dataList = res.data.msg;
          })
          .catch(err => {
            console.log(err);
          });
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
              this.getDetailData(this.form.id)
            }
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
.content{padding:1rem;}
.content .top label{color: #606266;}
.content .top span.red{color: red;}
.content .tit{font-weight: bold;margin-top: 3rem;border-left: 4px solid #4B9BF7;padding-left: .7rem;}
.content .tit .el-button{float: right;top: -.7rem;position: relative;}
</style>



