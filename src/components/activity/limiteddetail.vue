<template>
  <div class="limiteddetail">
    <!-- 标题 -->
    <div class="title clearfix">
      <!-- 标题内容需要修改，根据presell页面的预约活动标题来命名 -->
      <!-- 如：预约产品|3.8节预约 -->
      <span>活动详情设置</span>
      <span><span style="color:#4B9BF7"> | </span>{{title}}</span>
    </div>

    <!-- 主体内容 -->
    <el-form :model="Form" :rules="rules" ref="Form" label-width="100px" >
      <h1>基础信息</h1>
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="Form.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <!-- 选择开始时间 -->
      <el-form-item label="开始时间" required prop='startTime'>
        <el-date-picker
          v-model="Form.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始日期时间">
        </el-date-picker>
      </el-form-item>
      <!-- 选择结束时间 -->
      <el-form-item label="结束时间" required prop='endTime'>
        <el-date-picker
          v-model="Form.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束日期时间">
        </el-date-picker>
      </el-form-item>
      <!-- 预热时间 -->
      <el-form-item label="预热时间" required prop='warmUpTime'>
        <el-date-picker
          v-model="Form.warmUpTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择预热日期时间">
        </el-date-picker>
      </el-form-item>

      <h1>产品明细</h1>
      <!-- 选择产品,弹出产品所有产品列表 -->
      <el-button style="margin-bottom:20px;" type="primary" size="mini" @click="choose">选择产品<i class="el-icon-plus el-icon--right"></i></el-button>
      <el-dialog
        title="请选择活动商品"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose">
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
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="goodCode" label="商品编号"></el-table-column>
            <el-table-column prop="goodName" label="商品名称"></el-table-column>
            <el-table-column prop="retailPrice" label="价格"></el-table-column>
            <el-table-column prop="spec" label="规格"></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="add(scope.row)" :disabled="JSON.stringify(Form.details).indexOf(scope.row.goodCode)!=-1"><i class="el-icon-edit"></i>添加</el-button>
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
      <!-- 商品详细列表弹出框结束 -->
      <!-- 表单中产品明细表格展示 -->
      <el-table
        :data="Form.details"
        height="250"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="goodCode" label="商品编号" width="100"></el-table-column>
        <el-table-column prop="goodName" label="商品名称"></el-table-column>
        <el-table-column prop="spec" label="商品规格"></el-table-column>
        <el-table-column prop="originalPrice" label="原价"></el-table-column>
        <!-- 添加商品排序 -->
        <!-- *********************  核对字段是否限购和限购数量************************************************************************** -->
        <el-table-column prop="discountPrice" label="抢购价"></el-table-column>
        <el-table-column prop="sort" label="排序" ></el-table-column>
        <el-table-column prop="forPurchasingFlag" label="是否限购" ></el-table-column>
        <el-table-column prop="forPurchasingQuantity" label="限购数量"></el-table-column>
        <el-table-column prop="quantity" label="总数量"></el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
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
        <el-form :model="numform" status-icon ref="numform" :rules="rules" label-width="200px" >
          <el-form-item label="产品序号" prop="sort">
            <el-input v-model="numform.sort" autocomplete="off" placeholder="请输入产品序号"></el-input>
          </el-form-item>
          <el-form-item label="抢购价" prop="discountPrice">
            <el-input v-model="numform.discountPrice" autocomplete="off" placeholder="请输入抢购价"></el-input>
          </el-form-item>
          <el-form-item label="是否限购" prop="forPurchasingFlag">
            <el-radio-group v-model="numform.forPurchasingFlag">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限购数量" prop="forPurchasingQuantity">
            <el-input :disabled="numform.forPurchasingFlag=='否'" v-model="numform.forPurchasingQuantity" autocomplete="off" placeholder="请输入限购数量"></el-input>
          </el-form-item>
          <el-form-item label="总数量" prop="quantity">
            <el-input v-model="numform.quantity" autocomplete="off" placeholder="请输入总数量"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="numform.memo"  placeholder="请输入备注信息"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit2('numform')">保存</el-button>
            <el-button @click="dialogVisible2 = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-form-item style="margin-top:20px;">
        <el-button type="primary" @click="submitForm('Form')">保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'limiteddetail',
  data(){
    return{
      title:'新建活动',
      dialogVisible: false,  //控制弹框的隐藏显示
      dialogVisible2:false,
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
      numform:{   //点击修改弹出的表单的信息
        sort:'',      //排序
        discountPrice:'',  //抢购价
        forPurchasingFlag:"否",     //是否限购
        forPurchasingQuantity:'',  //限购数量
        quantity:'',  //总数量
        memo:''      //备注
      },
      Form:{
        id:'',
        name:'', //活动名称
        startTime:'',  //活动开始日期
        endTime:'',  //活动开始时间
        warmUpTime:'',  //预热时间
        details:[],  //保存详细的产品信息
      },
      rules:{
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        startTime: [
          { type: 'string', required: true, message: '请选择开始日期时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'string', required: true, message: '请选择结束日期时间', trigger: 'change' }
        ],
        warmUpTime: [
          { type: 'string', required: true, message: '请选择预约日期时间', trigger: 'change' }
        ],
        discountPrice:[
          { required: true, message: '请输入产品抢购价', trigger: 'blur' }
        ],
        forPurchasingFlag:[
          { required: true, message: '请选择是否限购', trigger: 'change' }
        ]
      },
    }
  },
  methods:{
    // 保存提交,重写
    submitForm(formName) {
      this.$refs[formName].validate((valid)=>{
        if (valid){
          
          for(var i=0;i<this.Form.details.length;i++){
            if(!this.Form.details[i].discountPrice){
              this.$message.error('请完善信息内容');
              return false
            }
            if(this.Form.details[i].forPurchasingFlag=='是'){
              this.Form.details[i].forPurchasingFlag=true
            }else{
              this.Form.details[i].forPurchasingFlag=false
            }
          }
          let params=this.Form;
          this.axios.post('/b2c/discount/save',params)
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
            this.$router.push('/timelimited')
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
    submit2(formName){
      this.$refs[formName].validate((valid)=>{
        if (valid){
          // console.log('这是填写排序和总限售数量之后保存获得的numform')
          // console.log(this.numform)
          this.dialogVisible2 = false;
          for(let i=0;i<this.Form.details.length;i++){
            if(this.Form.details[i].goodId==this.numform.goodId){
              this.Form.details[i].discountPrice=this.numform.discountPrice;
              this.Form.details[i].sort=this.numform.sort;

              // this.numform.forPurchasingFlag=='是'?this.numform.forPurchasingFlag=true:this.numform.forPurchasingFlag=false;
              this.Form.details[i].forPurchasingFlag=this.numform.forPurchasingFlag;
              this.Form.details[i].forPurchasingQuantity=this.numform.forPurchasingQuantity;
              this.Form.details[i].quantity=this.numform.quantity;
              this.Form.details[i].memo=this.numform.memo;
            }
          }
        }else{
          this.$message.error('请完善信息内容');
          return false
        }
      })
    },
    // 点击获取商品详情信息
    choose(){
      this.dialogVisible = true;
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
    },
    // 获取完整详情列表。点击添加产品
    getDataList(){
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get("/b2c/product/good/list",{params})
      .then(res => {
        console.log('这是选择产品点开弹框')
        console.log(res.data)
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
    //添加商品
    add(row){
      console.log('点击添加')
      console.log(row)
      
      // let params={
      //   id:row.id
      // }
      let goodform={}
      // console.log('点击添加获取改行商品的信息')
      // console.log(row)
      // this.axios.get('/b2c/product/good/findbyid',{params})
      // .then(res=>{
        // console.log('这是添加商品查询出来的单个商品信息')
        // console.log(res.data)
        goodform.goodId=row.id;
        goodform.goodCode=row.goodCode;
        goodform.goodName=row.goodName;
        goodform.spec=row.spec;
        goodform.originalPrice=row.retailPrice;
        this.Form.details=this.Form.details.concat(goodform);
      // })
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
    // 删除商品
    delgood(row){
      this.$confirm('确定要删除该条商品吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        for(let i=0;i<this.Form.details.length;i++){
          if(this.Form.details[i].goodId==row.goodId){
            this.Form.details.splice(i,1)
          } 
        }
        // console.log(this.Form.details)
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 修改商品信息
    edit(row){
      console.log(row)
      this.dialogVisible2=true;
      this.numform=row;
      this.numform.goodId=row.goodId;
    },
    getData(){
      let params={
        id:this.Form.id
      }
      this.axios.get('/b2c/discount/list',{params})
      .then(res=>{
        console.log(res.data)
        if(res.data.code>0){
// ****************************************************************************************要修改的保存数据和页面数据处理
          
          this.Form=res.data.msg.datas[0];
          for(var i=0;i<this.Form.details.length;i++){
            if(this.Form.details[i].forPurchasingFlag){
              this.$set(this.Form.details[i],'forPurchasingFlag','是')
            }else{
              this.$set(this.Form.details[i],'forPurchasingFlag','否')
            }
            
          }
        }else{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.Form.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.getData();
    }
  }
}
</script>

<style>

</style>