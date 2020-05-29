<template>
  <div class='reducedetail'>
    <!-- 标题 -->
    <div class="title clearfix">
      <!-- 标题内容需要修改，根据presell页面的预约活动标题来命名 -->
      <!-- 如：预约产品|3.8节预约 -->
      <span>活动设置</span>
      <span><span style="color:#4B9BF7"> | </span>{{title}}</span>
    </div>

    <!-- 主体内容 -->
    <el-form :model="Form" :rules="rules" ref="Form" label-width="150px" >
      <h1>基础信息</h1>
      <el-form-item label="活动名称" prop="activityName">
        <el-input v-model="Form.activityName" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动编码" prop="activityCode">
        <el-input v-model="Form.activityCode" placeholder="请输入活动编码"></el-input>
      </el-form-item>
      <el-form-item label="活动描述" prop="activityDesc">
        <el-input v-model="Form.activityDesc" placeholder="请输入活动描述"></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="computeSort">
        <el-input v-model="Form.computeSort" type='number' :min='0' placeholder="请输入计算活动价格时的优先级"></el-input>
      </el-form-item>
      <!-- 时间 -->
      <el-form-item label="预热时间" prop='preTime'>
        <el-date-picker
          v-model="Form.preTime"
          type="datetime"
          :picker-options='pickerOptions'
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择预热时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开始时间" prop='startTime'>
        <el-date-picker
          v-model="Form.startTime"
          type="datetime"
          :picker-options='pickerOptions'
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择活动开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop='endTime'>
        <el-date-picker
          v-model="Form.endTime"
          type="datetime"
          :picker-options='pickerOptions'
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择活动结束时间">
        </el-date-picker>
      </el-form-item>
      <!-- 活动标签，优惠方式，优惠力度都要改，对应的数据变量也需要改 -->
      <el-form-item label="优惠方式" prop='countType'>
        <el-radio-group v-model="Form.countType">
          <el-radio label='按金额'></el-radio>
          <el-radio label='按数量'></el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if='Form.countType=="按金额"'>
        <!-- 活动标签 -->
        <el-form-item label="活动类型" prop='activityType'>
          <el-radio-group v-model="Form.activityType">
            <el-radio label='满减'></el-radio>
            <el-radio label='满折'></el-radio>
            <el-radio label='满赠'></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 如果是满减满折才显示 -->
        <el-form-item label="优惠力度" required>
          <!-- 按金额 -->
          <span v-if="Form.activityType=='满减'" style="color:#606266;">
            满 <input type="number" min='0' v-model="Form.useMinMoney" @blur="check1" ref='money1' style='bprder:1px solid #DCDFE6;width:80px;'>元，减<input @blur="check2" ref='money2' style='bprder:1px solid #DCDFE6;width:80px;' type="number" min='1' :max='Form.useMinMoney' v-model="Form.discount">元
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
          </span>
          <span v-else-if="Form.activityType=='满折'" style="color:#606266;">
            满 <input style='bprder:1px solid #DCDFE6;width:80px;' @blur="check11" ref='money11' type="number" min='0' v-model="Form.useMinMoney">元，折扣率<input @blur="check22" ref='money22' type="number" min='0' max='1' step='0.01' v-model="Form.discountRate">  (折扣率为0-1之间小数，如0.8代表打八折)
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
          </span>
          <span v-else-if="Form.activityType=='满赠'" style="color:#606266;">
            满 <input style='bprder:1px solid #DCDFE6;width:80px;' @blur="check111" ref='money111' type="number" min='0' v-model="Form.useMinMoney">元送赠品
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
            <br/>
            <el-tag
              style="cursor: pointer;"
              @click="gift"
              closable>
              {{Form.giftGoodId}}
              {{Form.giftGoodName}}
            </el-tag>
          </span>
          <span v-else style="color:#606266;">请先选择活动类型</span>
        </el-form-item>
      </div>
      <div v-if='Form.countType=="按数量"'>
        <!-- 活动标签 -->
        <el-form-item label="活动类型" prop='activityType'>
          <el-radio-group v-model="Form.activityType">
            <el-radio label='满减'></el-radio>
            <el-radio label='满折'></el-radio>
            <el-radio label='满赠'></el-radio>
            <el-radio label='满送'></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 如果是满减满折才显示 -->
        <el-form-item label="优惠力度" required>
          <span v-if="Form.activityType=='满减'" style="color:#606266;">
            满 <input type="number" v-model="Form.goodCount" @blur="check3" ref='money3' style='bprder:1px solid #DCDFE6;width:80px;'>件，减<input @blur="check4" ref='money4' style='bprder:1px solid #DCDFE6;width:80px;' type="number" min='1' :max='Form.useMinMoney' v-model="Form.discount">元
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
          </span>
          <span v-else-if="Form.activityType=='满折'" style="color:#606266;">
            满 <input style='bprder:1px solid #DCDFE6;width:80px;' @blur="check3" ref='money3' type="number" v-model="Form.goodCount">件，折扣率<input @blur="check44" ref='money44' style='bprder:1px solid #DCDFE6;width:80px;' type="number" min='0' max='1' step='0.01' v-model="Form.discountRate">  (折扣率为0-1之间小数，如0.8代表打八折)
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
          </span>
          <span v-else-if="Form.activityType=='满赠'" style="color:#606266;">
            满 <input style='bprder:1px solid #DCDFE6;width:80px;' @blur="check3" ref='money3' type="number" min='0' v-model="Form.goodCount">件送赠品
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
            <br/>
            <el-tag
              style="cursor: pointer;"
              @click="gift"
              closable>
              {{Form.giftGoodId}}
              {{Form.giftGoodName}}
            </el-tag>
          </span>
          <span v-else-if="Form.activityType=='满送'" style="color:#606266;">
            满 <input style='bprder:1px solid #DCDFE6;width:80px;' @blur="check3" ref='money3' type="number" v-model="Form.goodCount">件，送1件(赠同商品)&nbsp;&nbsp;
            赠送上限<input @blur="check4444" style='bprder:1px solid #DCDFE6;width:80px;' ref='money4444' type="number" v-model="Form.maxGiftCount">件  
            <span v-if='innerMsg!=""' style='color:#f56c6c;font-size:14px;'>{{innerMsg}}</span>
          </span>
          <span v-else style="color:#606266;">请先选择活动类型</span>
        </el-form-item>
      </div>

      <!-- 全店通用 -->
      <el-form-item v-if="!flag" label="全店产品通用" prop='allGoods'>
        <el-switch
          v-model="Form.allGoods"
          @change="addAll"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="其他活动通用" prop='isTogether'>
        <el-switch
          v-model="Form.isTogether"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item  label="活动限制次数" prop="useCount">
        <el-input v-model="Form.useCount" placeholder="请输入该活动限制次数"></el-input>
      </el-form-item>

      <div v-if='!Form.allGoods'>
        <h1>活动产品</h1>
        <!-- 选择产品,弹出产品所有产品列表 -->
        <el-button style="margin-bottom:20px;" type="primary" size="mini" @click="choose">选择产品<i class="el-icon-plus el-icon--right"></i></el-button>
        <!-- 表单中产品明细表格展示 -->
        <el-table
          :data="goods"
          height="250"
          border
          style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="goodId" label="ID" width="100"></el-table-column>
          <el-table-column prop="goodName" label="商品名称"></el-table-column>
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
      </div>
      <el-form-item style="margin-top:20px;">
        
        <el-tooltip v-if='Form.status&&Form.status==3' class="item" effect="dark" content="已发布的活动不允许进行修改" placement="bottom">
          <div style="display:inline-block;width:70px;margin-right:10px;">
            <el-button type="primary" @click="submitForm('Form')" :disabled='isDisabled'>保存</el-button>
          </div>
        </el-tooltip>
        <el-button v-else type="primary" @click="submitForm('Form')" :disabled='isDisabled'>保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
    </el-form>
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
          <el-table-column type="index" label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span>
            </template>
          </el-table-column> 
          <el-table-column prop="goodCode" label="商品编号"></el-table-column>
          <el-table-column prop="goodName" label="商品名称"></el-table-column>
          <el-table-column prop="retailPrice" label="金额"></el-table-column>
          <el-table-column prop="spec" label="规格"></el-table-column>
          <el-table-column width="120" prop="isShow" label="销售状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isShow =='1' ? 'success':'danger' "
                disable-transitions
              >{{scope.row.isShow =='1' ? '在售':'已下架'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button v-if="protitle=='选择活动商品'" type="text" @click="add(scope.row)" :disabled="JSON.stringify(goods).indexOf(scope.row.id)!=-1"><i class="el-icon-edit"></i>添加</el-button>
              <el-button v-if="protitle=='选择赠品(注：只允许选择一个商品)'" type="text" @click="addgift(scope.row)" :disabled="Form.giftGoodId==scope.row.id"><i class="el-icon-edit"></i>添加</el-button>
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
  </div>
</template>

<script>
export default {
  name:'reducedetail',
  data(){
    var checkPreTime = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择活动预热时间'));
      }else{
        this.tempTime=value;
        callback();
      }
    };
    var checkStareTime = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择活动开始时间'));
      }
      if (Date.parse(value)<Date.parse(this.tempTime)) {
        return callback(new Error('活动开始时间不能早于预热时间'));
      }else{
        this.tempTime=value;
        callback();
      }
    };
    var checkEndTime = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请选择活动结束时间'));
      }
      if (Date.parse(value)<Date.parse(this.tempTime)) {
        return callback(new Error('活动结束时间不能早于开始时间'));
      }else{
        callback();
      }
    };
    var checkSort= (rule, value, callback) => {
      let reg=/^[+]{0,1}(\d+)$/;
      if(!value){
        return callback(new Error('请输入活动优先级'));
      }else{
        if(reg.test(value)){
          callback()
        }else{
          return callback(new Error('请输入正整数'));
        }
      }
    };
    return {
      isDisabled:false,  //控制保存按钮的禁用
      innerMsg:'',  //自定义表单验证
      title:'新建活动',
      tempTime:'',
      flag:false,  //添加删除产品时，如果是新增时不调接口，如果是修改时调用接口
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now()- 8.64e7;
        }
      },
      Form:{
        id:'',
        activityName:'',
        activityCode:'',
        activityDesc:'',
        countType:'',   //1 是按件数 2 按金额
        activityType:'',
        preTime:'',
        startTime:'',
        endTime:'',
        useMinMoney:'',  //按金额的门槛
        discount:'',
        discountRate:'',
        giftGoodId:'',
        giftGoodName:'请选择赠品',
        goodCount:'',   //按件数的门槛
        maxGiftCount:'',  //增同产品数量
        allGoods:true,
        isTogether:true,
        useCount:'',
        goods:[]
      },
      rules:{
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        activityCode:[
          { required: true, message: '请输入活动编码', trigger: 'blur' }
        ],
        preTime: [
          { required: true,validator: checkPreTime, trigger: 'blur' }
        ],
        startTime: [
          { required: true,validator: checkStareTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true,validator: checkEndTime, trigger: 'blur' }
        ],
        activityType:[
          { required: true, message: '请选择优惠券类型', trigger: 'change'}
        ],
        useCount: [
          { required: true, message: '请输入活动使用限制次数', trigger: 'blur' }
        ],
        computeSort: [
          {  required: true,validator: checkSort, trigger: 'blur' }
        ]
      },
      dialogVisible:false,
      protitle:'',
      goodlist:[],  //保存查询到的所有的商品列表
      searchParams:{
        redeemFlag:false,
        keyword:'',
        isShow:1
      },
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      goods:[]
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.Form.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.flag=true;
      this.getData();
      this.getGoods();
    }
  },
  methods:{
    // 自定义表单验证
    check1(){
      let reg=/^(0|[1-9][0-9]*)(\.\d+)?$/;
      if(this.Form.useMinMoney==''){
        this.innerMsg='活动金额不能为空';
        this.$refs.money1.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.useMinMoney)){
        this.innerMsg='活动金额只能为正数';
        this.$refs.money1.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money1.style.border='1px solid #DCDFE6';
      }
    },
    check2(){
      let reg=/^([1-9][0-9]*)(\.\d+)?$/;
      if(this.Form.discount==''){
        this.innerMsg='优惠金额不能为空';
        this.$refs.money2.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.discount)){
        this.innerMsg='优惠金额只能为大于0的正数';
        this.$refs.money2.style.border='1px solid #F56C6C';
      }else if(Number(this.Form.discount)>Number(this.Form.useMinMoney)){
        this.innerMsg='优惠金额不能大于活动金额';
        this.$refs.money2.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money2.style.border='1px solid #DCDFE6';
      }
    },
    check11(){
      let reg=/^(0|[1-9][0-9]*)(\.\d+)?$/;
      if(this.Form.useMinMoney==''){
        this.innerMsg='活动金额不能为空';
        this.$refs.money11.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.useMinMoney)){
        this.innerMsg='活动金额只能为正数';
        this.$refs.money11.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money11.style.border='1px solid #DCDFE6';
      }
    },
    check22(){
      let reg=/^0(\.[1-9]{1,2})+$/;
      if(this.Form.discountRate==''){
        this.innerMsg='活动折扣不能为空';
        this.$refs.money22.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.discountRate)){
        this.innerMsg='请输入0~1之间小数';
        this.$refs.money22.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money22.style.border='1px solid #DCDFE6';
      }
    },
    check111(){
      let reg=/^(0|[1-9][0-9]*)(\.\d+)?$/;
      if(this.Form.useMinMoney==''){
        this.innerMsg='活动金额不能为空';
        this.$refs.money111.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.useMinMoney)){
        this.innerMsg='活动金额只能为正数';
        this.$refs.money111.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money111.style.border='1px solid #DCDFE6';
      }
    },
    check3(){
      let reg=/^[1-9]\d*$/;
      if(this.Form.goodCount==''){
        this.innerMsg='优惠件数不能为空';
        this.$refs.money3.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.goodCount)){
        this.innerMsg='优惠件数只能为大于0的正整数';
        this.$refs.money3.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money3.style.border='1px solid #DCDFE6';
      }
    },
    check4(){
      let reg=/^([1-9][0-9]*)(\.\d+)?$/;
      if(this.Form.discount==''){
        this.innerMsg='优惠金额不能为空';
        this.$refs.money4.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.discount)){
        this.innerMsg='优惠金额只能为大于0的正数';
        this.$refs.money4.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money4.style.border='1px solid #DCDFE6';
      }
    },
    check44(){
      let reg=/^0(\.[1-9]{1,2})+$/;
      if(this.Form.discountRate==''){
        this.innerMsg='活动折扣不能为空';
        this.$refs.money44.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.discountRate)){
        this.innerMsg='请输入0~1之间小数';
        this.$refs.money44.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money44.style.border='1px solid #DCDFE6';
      }
    },
    check4444(){
      let reg=/^[1-9]\d*$/;
      if(this.Form.maxGiftCount==''){
        this.innerMsg='赠送件数不能为空';
        this.$refs.money4444.style.border='1px solid #F56C6C';
      }else if(!reg.test(this.Form.maxGiftCount)){
        this.innerMsg='赠送件数只能为大于0的正整数';
        this.$refs.money4444.style.border='1px solid #F56C6C';
      }else{
        this.innerMsg=''
        this.$refs.money4444.style.border='1px solid #DCDFE6';
      }
    },
    // 时间处理
    timeFormate(val){
      var date=new Date(val)
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + '-' + month + '-' + day;
    },
    // 获取单条活动详细信息
    getData(){
      let params={
        id:this.Form.id
      }
      this.axios.get('/b2c/disActivity/detail',{params})
      .then(res=>{
        console.log(res.data)
        this.Form=res.data.msg;
        if(this.Form.countType==2){
          this.Form.countType='按金额';
        }else if(this.Form.countType==1){
          this.Form.countType='按数量'
        }

        if(this.Form.activityType==1||this.Form.activityType==5){
          this.Form.activityType='满减'
        }else if(this.Form.activityType==2||this.Form.activityType==6){
          this.Form.activityType='满赠'
        }else if(this.Form.activityType==3||this.Form.activityType==7){
          this.Form.activityType='满折'
        }else if(this.Form.activityType==9){
          this.Form.activityType='满送'
        }
        
        if(this.Form.status==3){
          this.isDisabled=true
        }
        // this.Form.preTime=this.timeFormate(this.Form.preTime);
        // this.Form.startTime=this.timeFormate(this.Form.startTime);
        // this.Form.endTime=this.timeFormate(this.Form.endTime);
      })
    },
    getGoods(){
      let params={
        activityId:this.Form.id
      }
      this.axios.get('/b2c/disGood/list',{params})
      .then(res=>{
        this.goods=res.data.msg.datas;
      })
    },
    addAll(){
      if(this.flag){
        if(this.Form.allGoods){
          this.axios({
            method: 'get',
            url:'/b2c/disActivity/addAll/'+this.Form.id
          })
          .then(res=>{
            console.log(res.data)
          })
        }
        
      }
    },
    // 选择赠品
    gift(){
      this.dialogVisible = true;
      this.protitle='选择赠品(注：只允许选择一个商品)';
      this.searchParams.keyword = "";
      this.getDataList();
    },
    // 选择产品
    choose(){
      this.dialogVisible = true;
      this.protitle='选择活动商品';
      this.searchParams.keyword = "";
      this.getDataList();
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
    // 分页函数
    handleSizeChange(size) {
      this.pagesize = size;
      this.getDataList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
    // 添加赠品
    addgift(row){
      this.Form.giftGoodId=row.id;
      this.Form.giftGoodName=row.goodName;
    },
    // 添加活动产品
    add(row){
      let params={
        goodId:row.id,
        goodName:row.goodName
      }
      if(this.flag){
        // 调增加活动产品的接口
        this.axios({
          method: 'post',
          url:'/b2c/disActivity/addGood/'+this.Form.id,
          data:[{
            goodId:row.id
          }]
        })
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('添加成功')
          }else{
            this.$message.error('请重试')
          }
        })
      }
      this.goods=this.goods.concat(params);
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
            url:'/b2c/disActivity/delGood/'+this.Form.id,
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
        for(let i=0;i<this.goods.length;i++){
          if(this.goods[i].goodId==row.goodId){
            this.goods.splice(i,1)
          } 
        }
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
          this.isDisabled=true;
          setTimeout(()=>{
            this.isDisabled=false;
          },5000)
          // 按正确接口来修改
          if(this.Form.countType=='按金额'&&this.Form.activityType=='满减'){
            this.Form.activityType=1
          }else if(this.Form.countType=='按金额'&&this.Form.activityType=='满赠'){
            this.Form.activityType=2
          }else if(this.Form.countType=='按金额'&&this.Form.activityType=='满折'){
            this.Form.activityType=3
          }else if(this.Form.countType=='按数量'&&this.Form.activityType=='满减'){
            this.Form.activityType=5
          }else if(this.Form.countType=='按数量'&&this.Form.activityType=='满赠'){
            this.Form.activityType=6
          }else if(this.Form.countType=='按数量'&&this.Form.activityType=='满折'){
            this.Form.activityType=7
          }else if(this.Form.countType=='按数量'&&this.Form.activityType=='满送'){
            this.Form.activityType=9
          }

          if(this.Form.countType=='按金额'){
            this.Form.countType=2;
          }else if(this.Form.countType=='按数量'){
            this.Form.countType=1
          }

          this.Form.goods=this.goods;
          this.axios.post('/b2c/disActivity/save',this.Form)
          .then(res=>{
            // console.log('这是保存提交是返回的数据')
            // console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.$router.push('/reduce')
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
  }
}
</script>

<style>

</style>