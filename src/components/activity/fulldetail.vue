<template>
  <div class="fulldetail">
    <!-- 标题 -->
    <div class="title clearfix">
      <!-- 标题内容需要修改，根据presell页面的预约活动标题来命名 -->
      <!-- 如：预约产品|3.8节预约 -->
      <span>优惠券详情设置</span>
      <span><span style="color:#4B9BF7"> | </span>{{title}}</span>
    </div>

    <!-- 主体内容 -->
    <el-form :model="Form" :rules="rules" ref="Form" label-width="150px" >
      <h1>基础信息</h1>
      <el-form-item label="优惠券名" prop="ticketName">
        <el-input v-model="Form.ticketName" placeholder="请输入优惠券名称"></el-input>
      </el-form-item>
      <el-form-item label="优惠券描述" prop="ticketDesc">
        <el-input v-model="Form.ticketDesc" placeholder="请输入优惠券描述"></el-input>
      </el-form-item>
      <!-- 选择领取时间 -->
      <el-form-item label="领取开始时间" prop='startTime'>
        <el-date-picker
          v-model="Form.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始领取开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="领取截止时间" prop='endTime'>
        <el-date-picker
          v-model="Form.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束日期时间">
        </el-date-picker>
      </el-form-item>
      <!-- 使用时间 -->
      <el-form-item label="使用开始时间" prop='useStartTime'>
        <el-date-picker
          v-model="Form.useStartTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择预使用开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="使用结束时间" prop='useEndTime'>
        <el-date-picker
          v-model="Form.useEndTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择预使用结束时间">
        </el-date-picker>
      </el-form-item>
      <!-- 活动标签，优惠方式，优惠力度都要改，对应的数据变量也需要改 -->
      <!-- 活动标签 -->
      <el-form-item label="优惠券类型" prop='ticketType'>
        <el-radio-group v-model="Form.ticketType">
          <el-radio label='满减'></el-radio>
          <el-radio label='满折'></el-radio>
          <el-radio label='满赠'></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 如果是满减满折才显示 -->
      <el-form-item label="优惠力度">
        <span v-if="Form.ticketType=='满减'" style="color:#606266;">满 <input type="text" v-model="Form.useMinMoney">元，减<input type="text" v-model="Form.discount">元</span>
        <span v-else-if="Form.ticketType=='满折'" style="color:#606266;">满 <input type="text" v-model="Form.useMinMoney">元，折扣率<input type="text" v-model="Form.discountRate">  (折扣率为0-1之间小数，如0.8代表打八折)</span>
        <span v-else-if="Form.ticketType=='满赠'" style="color:#606266;">满 <input type="text" v-model="Form.useMinMoney">元送赠品
          <br/>
          <el-tag
            style="cursor: pointer;"
            @click="gift"
            closable>
            {{Form.giftGoodId}}
            {{Form.giftGoodName}}
          </el-tag>
        </span>
        <span v-else style="color:#606266;">请先选择优惠券类型</span>
      </el-form-item>
      <!-- 优惠券领取限制 -->
      <el-form-item label="优惠限制" prop="limitType">
        <el-select v-model="Form.limitType" placeholder="请选择优惠券领取限制">
          <el-option label="不限制" value="0"></el-option>
          <el-option label="每日领取限额" value="1"></el-option>
          <el-option label="每月领取限额" value="2"></el-option>
          <el-option label="领取总数限额" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="Form.limitType!=0" label="限领数量" prop="limitCount">
        <el-input v-model="Form.limitCount" placeholder="请输入优惠券限领数量"></el-input>
      </el-form-item>
      <el-form-item  label="优惠券总数量" prop="ticketTotal" required>
        <el-input v-model="Form.ticketTotal" placeholder="请输入优惠券总数量"></el-input>
      </el-form-item>
    

      <h1>产品明细</h1>
      <!-- 选择产品,弹出产品所有产品列表 -->
      <el-button style="margin-bottom:20px;" type="primary" size="mini" @click="choose">选择产品<i class="el-icon-plus el-icon--right"></i></el-button>
      <el-dialog
        :title="protitle"
        :visible.sync="dialogVisible"
        width="80%">
        <!-- 所有的产品列表 -->
        <div>
          <!-- 搜索 -->
          <div class="search">
            <!-- 订单号 -->
            <div class="searchbox">
              商品名称：
              <el-input v-model="searchParams.keyword" placeholder="请输入商品名称" :style="{height:'40px'}"></el-input>
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
          </div>
          <!-- 商品详细表格 -->
          <el-table
            v-loading="loading"
            :data="goodlist"
            height="300"
            border
            style="width: 100%">
            <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
            <el-table-column type="index" label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span>
              </template>
            </el-table-column> 
            <el-table-column prop="goodCode" label="商品编号"></el-table-column>
            <el-table-column prop="goodName" label="商品名称"></el-table-column>
            <el-table-column prop="retailPrice" label="金额"></el-table-column>
            <el-table-column prop="spec" label="规格"></el-table-column>
            <el-table-column
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button v-if="protitle=='选择活动商品'" type="text" @click="add(scope.row)" :disabled="JSON.stringify(Form.goods).indexOf(scope.row.id)!=-1"><i class="el-icon-edit"></i>添加</el-button>
                <el-button v-if="protitle=='选择赠品(住：只允许选择一个商品)'" type="text" @click="addgift(scope.row)" :disabled="Form.giftGoodId==scope.row.id"><i class="el-icon-edit"></i>添加</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next"
            :total="totalCount"
          ></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 表单中产品明细表格展示 -->
      <el-table
        :data="Form.goods"
        height="250"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="goodCode" label="商品编号" width="100"></el-table-column>
        <el-table-column prop="goodName" label="商品名称"></el-table-column>
        <el-table-column prop="spec" label="商品规格"></el-table-column>
        <el-table-column prop="retailPrice" label="原价"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>修改</el-button> -->
            <el-button type="text" @click="delgood(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item style="margin-top:20px;">
        <el-button type="primary" @click="submitForm('Form')">保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'fulldetail',
  data(){
    var checkStareTime = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择优惠券领取开始时间'));
      }else{
        this.tempTime=value;
        callback();
      }
    };
    var checkValidDate = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择优惠券领取结束时间'));
      }
      if (Date.parse(value)<Date.parse(this.tempTime)) {
        callback(new Error('截止日期不能早于开始日期'));
      }else{
        callback();
      }
    };
    var checkUseStart = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择优惠券使用开始时间'));
      }
      if (Date.parse(value)<Date.parse(this.tempTime)) {
        callback(new Error('使用开始时间不能早于领取开始时间'));
      }else{
        this.tempTime=value;
        callback();
      }
    };
    var checkUseEnd = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择优惠券使用结束时间'));
      }
      if (Date.parse(value)<Date.parse(this.tempTime)) {
        callback(new Error('使用结束时间不能早于使用开始时间'));
      }else{
        this.tempTime=value;
        callback();
      }
    };
    return {
      tempTime:'',
      flag:false,
      title:'新建优惠券',
      dialogVisible:false,
      protitle:'',
      tags:[],
      Form:{
        id:'',
        giftGoodId:'',
        giftGoodName:'请选择赠品',
        ticketName:'',
        ticketDesc:'',
        startTime:'',
        endTime:'',
        useStartTime:'',
        useEndTime:'',
        ticketType:'',
        useMinMoney:'',
        discount:'',
        discountRate:'',
        limitType:'',
        limitCount:'',
        ticketTotal:'',
        goods:[]
      },
      rules:{
        ticketName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        ticketDesc:[
          { required: true, message: '请输入优惠券描述', trigger: 'blur' }
        ],
        startTime: [
          { required: true,validator: checkStareTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true,validator: checkValidDate, trigger: 'blur' }
        ],
        useStartTime: [
          { required: true,validator: checkUseStart, trigger: 'blur' }
        ],
        useEndTime: [
          { required: true,validator: checkUseEnd, trigger: 'blur' }
        ],
        ticketType:[
          { required: true, message: '请选择优惠券类型', trigger: 'change'}
        ],
        ticketTotal: [
          { required: true, message: '请输入优惠券总数量', trigger: 'blur' }
        ]
      },
      goodlist:[],  //保存查询到的所有的商品列表
      searchParams:{
        redeemFlag:false,
        keyword:''
      },
      //单个商品id
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
    }
  },
  methods:{
    gift(){
      this.dialogVisible = true;
      this.protitle='选择赠品(住：只允许选择一个商品)';
      this.getDataList();
    },
    addgift(row){
      this.Form.giftGoodId=row.id;
      this.Form.giftGoodName=row.goodName;
    },
    // 点击获取商品详情信息
    choose(){
      this.dialogVisible = true;
      this.protitle='选择活动商品';
      this.searchParams.keyword = "";
      this.getDataList();
    },
    // 搜索商品
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.getDataList();
    },
    //添加商品
    add(row){
      // console.log(row)
      let data=[{
        "goodId":row.id,//商品id
        "goodName":row.goodName,//商品名
        "groupId":row.groupId,//集团id
        "corpId":row.corpId,
        "clientId":row.clientId,//门店id
        "goodCode":row.goodCode,//商品编码
        "retailPrice":row.retailPrice,//商品价格
        "commonName":row.commonName,//通用名
        "chemieName":row.chemieName,//化学名
        "goodsClass":row.goodsClass,//商品分类
        "spec":row.spec,//规格
        "producer":row.producer,//生产产家
        "prodArea":row.prodArea,//产地
        "useUnit":row.useUnit,//单位
        "medicalType":row.medicalType,//剂型
        "ybType":row.ybType,//医保类型
        "license":row.license,//生产许可证
        "barcode":row.barcode//条形码
      }];
      // data.push(row)
      // console.log(data)
      if(this.flag){
        this.axios({
          method: 'post',
          url:'/b2c/discountTicket/addGood?ticketId='+this.Form.id,
          data
        })
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('添加成功')
          }else{
            this.$message.error('请重试')
          }
        })
      }
      let goodform={}
      goodform.corpId=row.corpId;
      goodform.goodId=row.id;
      goodform.goodCode=row.goodCode;
      goodform.goodName=row.goodName;
      goodform.spec=row.spec;
      goodform.retailPrice=row.retailPrice;
      this.Form.goods=this.Form.goods.concat(goodform);
    },
    // 删除商品
    delgood(row){
      this.$confirm('确定要删除该条商品吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(this.flag){
          let params={
            goodId:row.goodId
          }
          this.axios({
            method: 'post',
            url:'/b2c/discountTicket/delGood?ticketId='+this.Form.id,
            data:[{
              goodId:row.goodId
            }]
          })
          .then(res=>{
            if(res.data.code>0){
              this.$message.success('删除成功')
            }else{
              this.$message.error('请重试')
            }
          })
        }
        for(let i=0;i<this.Form.goods.length;i++){
          if(this.Form.goods[i].goodId==row.goodId){
            this.Form.goods.splice(i,1)
          } 
        }
        // console.log(this.Form.goods)
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 保存提交,重写
    submitForm(formName) {
      this.$refs[formName].validate((valid)=>{
        if (valid){
          // 按正确接口来修改
          if(this.Form.ticketType=='满折'){
            this.Form.ticketType=3;
          }else if(this.Form.ticketType=='满减'){
            this.Form.ticketType=1
          }else{
            this.Form.ticketType=2
          }
          if(this.Form.limitType=='每日领取限额'){
            this.Form.limitType=1
          }else if(this.Form.limitType=='每月领取限额'){
            this.Form.limitType=2
          }else{
            this.Form.limitType=3
          }
          this.axios.post('/b2c/discountTicket/save',this.Form)
          .then(res=>{
            // console.log('这是保存提交是返回的数据')
            // console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.$router.push('/fulldiscount')
            }else{
              this.$message.error(res.data.msg);
            }
          })
        }else{
            this.$message.error('请完善信息内容');
            return false
          }
        })
    },
    // 返回按钮
    goback(){
      this.$router.back(-1);
    },
    // 获取完整详情列表。点击添加产品
    getDataList(){
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get("/b2c/product/good/list",{params})
      .then(res => {
        // console.log('这是选择产品点开弹框')
        // console.log(res.data)
        this.loading = false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.goodlist = res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
        }
      })
      .catch(err => {
          console.log(err);
      });
    },
    // 弹框关闭前的回调
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 分页函数
    handleSizeChange(size) {
      this.pagesize = size;
      this.getDataList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
    getData(){
      let params={
        id:this.Form.id
      }
      this.axios.get('/b2c/discountTicket/detail',{params})
      .then(res=>{
        // console.log('券详情，还需要具体数据处理')
        // console.log(res.data)
        this.Form=res.data.msg
        if(this.Form.limitType==1){
          this.Form.limitType='每日领取限额'
        }else if(this.Form.limitType==2){
          this.Form.limitType='每月领取限额'
        }else if(this.Form.limitType==3){
          this.Form.limitType='领取总数限额'
        }else{
          this.Form.limitType='不限制'
        }
        if(this.Form.ticketType==1){
          this.Form.ticketType='满减'
        }else if(this.Form.ticketType==3){
          this.Form.ticketType='满折'
        }else{
          this.Form.ticketType='满赠'
        }
      })
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.Form.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.flag=true;
      this.getData();
    }
  }
}
</script>

<style>
.isShow{
  display: none;
}
input{
  
  border:1px solid #DCDFE6;
  width:50px;
}
.searchbox{
  font-size: 14px;
}
/* span{
  color:#606266;
  font-size: 14px;
} */
</style>