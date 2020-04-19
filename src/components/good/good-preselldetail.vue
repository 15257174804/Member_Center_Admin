<template>
  <div class="preselldetail">
    <!-- 标题 -->
    <div class="title clearfix">
      <!-- 标题内容需要修改，根据presell页面的预约活动标题来命名 -->
      <!-- 如：预约产品|3.8节预约 -->
      <span>商品预约</span>
      <span><span style="color:#4B9BF7"> | </span>{{title}}</span>
    </div>

    <!-- 表单内容 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" >
      <h1>基础信息</h1>
        <!-- 输入预约活动名称 -->
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入预约活动名称"></el-input>
        </el-form-item>
        <!-- 预热时间 -->
        <el-form-item label="预热时间"  prop='warmUpStartTime'>
          <el-date-picker
            v-model="ruleForm.warmUpStartTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择预热日期时间">
          </el-date-picker>
        </el-form-item>
        <!-- 选择开始时间 -->
        <el-form-item label="开始时间" required prop='startTime'>
          <el-date-picker
            v-model="ruleForm.startTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期时间">
          </el-date-picker>
        </el-form-item>
        <!-- 选择结束时间 -->
        <el-form-item label="结束时间" required prop='endTime'>
          <el-date-picker
            v-model="ruleForm.endTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期时间">
          </el-date-picker>
        </el-form-item>
        <!-- 预计发货时间 -->
        <el-form-item label="预计发货" required prop='deliveryTime'>
          <el-date-picker
            v-model="ruleForm.deliveryTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择预计发货日期">
          </el-date-picker>
        </el-form-item>
        <!-- 预约方式控制个人和企业的预约数量的显示隐藏 -->
        <el-form-item label="预约类型" prop="limitType">
          <el-radio-group v-model="ruleForm.limitType">
            <el-radio label="个人预约"></el-radio>
            <el-radio label="企业预约"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否限购" prop="forPurchasing">
          <el-radio-group v-model="ruleForm.forPurchasing" @change="isPurchasing($event)">
            <el-radio label='是'></el-radio>
            <el-radio label='否'></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <div class="tip"><span style="color:#F56C6C;">*</span> 如果是限购活动请填写间隔天数和下单次数，如果是非限购活动，请忽略</div> -->
        <!-- 间隔天数 -->
        <el-form-item label="下单间隔天数" prop="intervalDays">
          <el-input v-model="ruleForm.intervalDays" :disabled="ruleForm.forPurchasing=='否'" placeholder="请输入下单间隔天数"></el-input>
        </el-form-item>
        <!-- 单次 -->
        <el-form-item label="间隔天数内下单次数" prop="orderNumber">
          <el-input v-model="ruleForm.orderNumber" :disabled="ruleForm.forPurchasing=='否'" placeholder="请输入间隔天数内允许下单的次数"></el-input>
        </el-form-item>
      
      

      <h1>产品信息</h1>
        <el-button style="margin:20px 0 20px 0;" type="primary" size="mini" @click="choose">选择产品<i class="el-icon-plus el-icon--right"></i></el-button>
        <el-dialog
          title="请选择预约产品"
          :visible.sync="dialogVisible"
          width="80%"
          :before-close="handleClose">
          <!-- 所有的产品列表 -->
          <div>
            <!-- 搜索 -->
            <div class="search">
              <!-- 订单号 -->
              <div class="searchbox">
                商品信息：
                <el-input v-model="searchParams.keyword" placeholder="如名称、编码等" :style="{height:'40px'}"></el-input>
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
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="goodCode" label="商品编号"></el-table-column>
              <el-table-column prop="goodName" label="商品名称"></el-table-column>
              <el-table-column prop="corpName" label="所属企业"></el-table-column>
              <el-table-column prop="goodsClass" label="商品分类"></el-table-column>
              <el-table-column prop="spec" label="规格"></el-table-column>
              <!-- <el-table-column prop="useUnit" label="单位" width="60"></el-table-column> -->
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="add(scope.row)" :disabled="JSON.stringify(ruleForm.details).indexOf(scope.row.goodCode)!=-1"><i class="el-icon-edit"></i>添加</el-button>
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

        <el-table
          :data="ruleForm.details"
          height="250"
          border
          style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="goodCode" label="商品编号" width="100"></el-table-column>
          <el-table-column prop="goodName" label="商品名称"></el-table-column>
          <!-- 添加商品排序 -->
          <el-table-column prop="sort" label="排序" ></el-table-column>
          <el-table-column prop="totalQuantity" label="预约总数量" ></el-table-column>
          <el-table-column prop="purchasingQuantity" label="限购数量"></el-table-column>
          <!-- <el-table-column prop="remainingQuantity" label="剩余数量"></el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
              <el-button type="text" @click="delgood(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 点击修改弹出对应产品数据的限售数量 -->
        <el-dialog
          :visible.sync="dialogVisible2"
          width="45%"
          :before-close="handleClose">
          <el-form :model="numform" status-icon :rules="rules" ref="numform" label-width="200px" >
            <el-form-item label="输入该产品序号" prop="sort">
              <el-input v-model="numform.sort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="输入该产品预约总数量" prop="totalQuantity">
              <el-input v-model="numform.totalQuantity" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <div class="tip"><span style="color:#F56C6C;">*</span> 如果是限购活动请填写产品限购数量，如果是非限购活动，请忽略</div> -->
            <el-form-item label="输入该产品限购数量" prop="purchasingQuantity">
              <el-input :disabled="ruleForm.forPurchasing=='否'" v-model="numform.purchasingQuantity" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" @click="submit2('numform')">保存</el-button>
              <el-button @click="dialogVisible2 = false">取消</el-button>
            </el-form-item>
          </el-form>

        </el-dialog>
      
      <el-form-item  style="margin:20px 0 20px 0;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
      
    </el-form>

  </div>
</template>

<script>
export default {
  name:'goodpreselldetail',
  data(){
    return{
      title:'新建预售活动',
      dialogVisible: false,  //控制弹框的隐藏显示
      dialogVisible2:false,
      goodlist:[],  //保存查询到的所有的商品列表
      fform:{},  //保存从前一页点击详情进来的穿过来的数据，需要对应显示在页面上
      numform:{   //点击修改弹出的表单的信息
        totalQuantity:0,
        sort:1,
        purchasingQuantity:0,
        remainingQuantity:0 
      },
      ruleForm:{
        status:0,
        id:'',
        name:'', //预约活动名称
        startTime:'',  //活动开始日期
        endTime:'',  //活动开始时间
        warmUpStartTime:'',  //预热时间
        deliveryTime:'',  //预计发货时间
        intervalDays:'',  //隔几天
        orderNumber:'',  //下单次数
        limitType:"个人预约",  //预约类型（个人/企业）
        forPurchasing:'否',
        pxnum:'',  //个人最大预约数量
        cxnum:'',  //企业最大预约数量
        // total:10,  //预约总数量,应该由计算获得
        details:[],  //保存详细的产品信息,
        // detailModel:[]
      },
      rules:{
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期时间', trigger: 'blur' }
        ],
        // warmUpStartTime: [
        //   { type: 'stdatetimering', required: true, message: '请选择预约日期时间', trigger: 'change' }
        // ],
        deliveryTime: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ],
        limitType: [
          { required: true, message: '请选择预约方式', trigger: 'change' }
        ],
        totalQuantity:[
          { required: true, message: '请输入预约总数量', trigger: 'blur'}
        ],
        forPurchasing:[
          { required: true, message: '请选择是否限购', trigger: 'change'}
        ]
      },
      searchParams:{
        redeemFlag:false,
        keyword:''
      },
      //单个商品id
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true
    }
  },
  methods:{
    // 是否限购改变时，控制下单天数和下单次数和产品限购数量
    isPurchasing(i){
      if(i=='否'){
        this.ruleForm.intervalDays=0;
        this.ruleForm.orderNumber=0;
        for(var item=0;item<this.ruleForm.details.length;item++){
          this.ruleForm.details[item].purchasingQuantity=0;
        }
      }
    },
    delgood(row){
      this.$confirm('确定要删除该条商品吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        for(let i=0;i<this.ruleForm.details.length;i++){
          if(this.ruleForm.details[i].goodId==row.goodId){
            this.ruleForm.details.splice(i,1)
          } 
        }
        console.log(this.ruleForm.details)

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })

    },
    // 点击修改弹出可以修改数据的弹出框
    edit(row){
      this.dialogVisible2=true;
      // console.log('点击修改，获取该行数据信息')
      // console.log(row)
      this.numform=row;
    },
    submit2(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('这是填写排序和总限售数量之后保存获得的numform')
          console.log(this.numform)
          this.dialogVisible2 = false;
          for(let i=0;i<this.ruleForm.details.length;i++){
            let item=this.ruleForm.details[i];
            console.log(this.ruleForm.details)
            console.log(item.goodId)
            if(item.goodId==this.numform.goodId){
              item.totalQuantity=Number(this.numform.totalQuantity);
              item.sort=this.numform.sort;
              item.purchasingQuantity=Number(this.numform.purchasingQuantity);
              item.remainingQuantity=Number(this.numform.remainingQuantity);
              return
            }
          }
        } else {
          this.$message.error('请完善内容后提交保存!');
          return false;
        }
      });
    },
    //添加商品
    add(row){
      console.log('点击添加')
      console.log(row)
      
      let params={
        id:row.id
      }
      let goodform={}
      // console.log('点击添加获取改行商品的信息')
      // console.log(row)
      this.axios.get('/b2c/product/good/findbyid',{params})
      .then(res=>{
        // console.log('这是添加商品查询出来的单个商品信息')
        // console.log(res.data)
        // goodform.id=this.ruleForm.id;
        goodform.goodId=res.data.msg.id;
        goodform.goodCode=res.data.msg.goodCode;
        goodform.goodName=res.data.msg.goodName;
        // console.log('这是保存到goodform中的单个商品的数据')
        // console.log(this.goodform)
        this.ruleForm.details=this.ruleForm.details.concat(goodform);
        console.log(this.ruleForm.details)
      })
    },
    // 搜索商品
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
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
    // 点击获取商品详情信息
    choose(){
      this.dialogVisible = true;
      this.getDataList();
    },
    // 获取完整详情列表
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
    
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for(let i=0;i<this.ruleForm.details.length;i++){
            if(!this.ruleForm.details[i].totalQuantity){
              this.$message.error('请完善信息内容');
              return false
            }
          }
          if(this.ruleForm.limitType=='个人预约'){
            this.ruleForm.limitType=1
          }else if(this.ruleForm.limitType=='企业预约'){
            this.ruleForm.limitType=2
          }
          if(this.ruleForm.forPurchasing=='是'){
            this.ruleForm.forPurchasing=true
          }else{
            this.ruleForm.forPurchasing=false
          }
          let params=this.ruleForm;
          this.axios.post('/b2c/preSell/save',params)
          .then(res => {
            console.log('这是保存提交是返回的数据')
            console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }else{
              this.$message.error(res.data.msg);
            }
            this.$router.push('/goodpresell')
          })
        } else {
          this.$message.error('请完善内容后提交保存!');
          return false;
        }
      });
      
    },
    // 返回按钮
    goback(){
      this.$router.back(-1);
    },
    // 获取数据
    getData(){
      let params={
        id:this.ruleForm.id
      }
      this.axios.get("/b2c/preSell/list",{params})
      .then(res => {
        console.log("这是预约详情里面的返回值")
        console.log(res.data)
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.totalCount=res.data.msg.totalCount;
          let _ruleForm=res.data.msg.datas[0];
          if(_ruleForm.limitType==1){
            this.$set(_ruleForm,'limitType','个人预约')
          }else{
            this.$set(_ruleForm,'limitType','企业预约')
          }
          if(_ruleForm.forPurchasing){
            this.$set(_ruleForm,'forPurchasing','是')
          }else{
            this.$set(_ruleForm,'forPurchasing','否')
          }
          this.ruleForm=_ruleForm;
          this.numform=this.ruleForm.details;
          console.log(this.ruleForm)
        }
      })
      .catch(err => {
          console.log(err);
      });
    }
  },
  mounted(){
    //  获取从presell传过来的参数
    if(this.$route.query.id){
      this.ruleForm.id = this.$route.query.id;
      // this.ruleForm.forPurchasing=(this.$route.query.forPurchasing=='是'?'true':'false');  //从列表跳转过来时有吧该数据保存进来，之后后面查找数据时，又覆盖掉了，所以需要后端添加一个forPurchasing字段
      this.title=this.$route.query.title;
      this.fform=this.$route.query.fform;
      this.getData();
    }
  },
  computed:{
    // total:function(){
    //   var sum=0;
    //   for(let i=0;i<this.ruleForm.details.length;i++){
    //     let item=this.ruleForm.details[i];
    //     if(item.totalQuantity==''||item.totalQuantity==undefined){
    //       item.totalQuantity=0;
    //     }
    //     sum+=Number(item.totalQuantity);
    //   }
    //   return sum
    // }
  }
}
</script>

<style lang='scss' scoped>
  .isShow{
    display: none;
  }
  .tip{
    width:460px;
    color:#909399;
    font-size: 12px;
    font-family: Helvetica, ‘Hiragino Sans GB’, ‘Microsoft Yahei’, ‘微软雅黑’,
    Arial, sans-serif;
    text-align: left;
    vertical-align: middle;
    background-color: #f4f4f5;
    margin:0 0 20px 25px;
  }
</style>