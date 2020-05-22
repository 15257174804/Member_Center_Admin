<template>
  <div class='groupDetail'>
    <!-- 标题 -->
    <div class="title clearfix">
      <!-- 标题内容需要修改，根据presell页面的预约活动标题来命名 -->
      <!-- 如：预约产品|3.8节预约 -->
      <span>商品组设置</span>
      <span><span style="color:#4B9BF7"> | </span>{{title}}</span>

      <!-- <el-button type="primary" @click="onSubmit('form')">保存信息</el-button> -->
      <el-tooltip style='float:right;' v-if='form.status&&form.status==1' class="item" effect="dark" content="启用中的商品组不允许进行修改" placement="bottom">
        <div style="display:inline-block;width:70px;">
          <el-button type="primary" @click="onSubmit('form')" disabled>保存信息</el-button>
        </div>
      </el-tooltip>
      <el-button v-else type="primary" @click="onSubmit('form')">保存信息</el-button>

    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" input-width="200px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="baseinfo">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入商品组名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入商品组描述"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" placeholder="请输入商品组价格"></el-input>
          </el-form-item>
          <el-form-item label="原价" prop="originalPrice">
            <el-input v-model="form.originalPrice" placeholder="请参考商品明细里的总价"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品明细 -->
        <el-tab-pane label="商品明细" name="product">
          <el-button style="margin-bottom:20px;" type="primary" size="mini" @click="choose">选择产品<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-dialog
            title="选择商品组产品"
            :visible.sync="dialogVisible2"
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
                <el-table-column
                  label="操作"
                  width="150">
                  <template slot-scope="scope">
                    <el-button type="text" @click="add(scope.row)" :disabled="JSON.stringify(products).indexOf(scope.row.id)!=-1"><i class="el-icon-edit"></i>添加</el-button>
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
              <el-button @click="dialogVisible2 = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
            </span>
          </el-dialog>
          <el-table
            border
            :data="products"
            stripe
            style="width: 100%">
            <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
            <el-table-column type="index" label="序号" width="50"></el-table-column> 
            <el-table-column prop="goodName" label="名称" ></el-table-column>
            <el-table-column prop="goodCode" label="编码" width="100"></el-table-column>
            <el-table-column prop="spec" label="规格" width="100"></el-table-column>
            <el-table-column prop="goodPrice" label="价格" width="100"></el-table-column>
            <el-table-column prop="goodIsShow" label="状态"  width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.goodIsShow" type="success" disable-transitions>在售</el-tag>
                <el-tag v-if="!scope.row.goodIsShow" type="info" disable-transitions>下架</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="160">
              <template slot-scope="scope">
                <input type="number" min='1' v-model="scope.row.quantity" @blur="addcomfirm(scope.row)" style='width:100px;border:1px solid #DCDFE6;'>
                <span style="color:#f56c6c;font-size:14px;display:block;">{{scope.row.innerMsg}}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row)">删除</el-button>
                <!-- <el-button v-if="scope.row.status=='1'" type="text" @click="publish(scope.row)"><i class="el-icon-refresh"></i>发布</el-button>
                <el-button v-if="scope.row.status=='3'" type="text" @click="recall(scope.row)"><i class="el-icon-refresh"></i>关闭</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <span style='color:#555;font-size:18px;display:block;margin-top:15px;font-weight:700;'>总计：￥{{all}}</span>
        </el-tab-pane>
        <!-- 图片管理 -->
        <el-tab-pane label="图片管理" name="picture">
          <el-upload
            :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </div>
</template>

<script>
import global_ from '../../api/global';
export default {
  name:'groupDetail',
  data(){
    var checkPrice=(rule,value,callback)=>{
      let reg=/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if(!value){
        callback(new Error('内容不能为空'))
      }else{
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error('请输入正确的价格格式:整数或者保留两位小数'))
        }
      }
    };
    return {
      title:'新建商品组',
      flag:false,
      activeName:'baseinfo',
      form:{
        id:'',
        name:'',
        description:'',
        price:'',
        originalPrice:'',
        pictures:[],
        products:[]
      },
      rules:{
        name: [
          { required: true, message: '请输入商品组名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入商品组描述', trigger: 'blur' }
        ],
        price: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        originalPrice: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ]
      },
      // 图片管理
      token: localStorage.getItem('loginToken'),
      dialogImageUrl: '',
      dialogVisible: false,
      fileList:[],
      pictures:[],
      // 商品组产品
      dialogVisible2:false,
      products:[],
      goodlist:[],
      searchParams:{
        redeemFlag:false,
        keyword:'',
        isShow:1
      },
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
    }
  },
  computed:{
    all(){
      let result=0;
      for(var i=0;i<this.products.length;i++){
        if(this.products[i].quantity){
          result+=(this.products[i].goodPrice*this.products[i].quantity)
        }else{
          result=0
        }
        
      }
      return result.toFixed(2)
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.form.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.flag=true;
      this.getData();
      this.getPic();
    }
  },
  methods:{
    // 获取图片列表
    getPic(){
      let params={
        id:this.form.id
      }
      this.axios.get('/b2c/cgPic/byCgID',{params})
      .then(res=>{
        console.log(res.data)
      })
    },
    getData(){
      let params={
        id:this.form.id
      }
      this.axios.get('/b2c/commodityGroup/detail',{params})
      .then(res=>{
        if(res.data.code>0){
          this.form=res.data.msg;
          this.form.products=res.data.msg.productsModels;
          this.products=res.data.msg.productsModels;
          this.products.forEach(val=>{
            val.innerMsg=''
          })
          for(var i=0;i<res.data.msg.pictureModels.length;i++){
            this.fileList.push({
              id:res.data.msg.pictureModels[i].id,
              name:res.data.msg.pictureModels[i].imgUrl,
              url:this.axios.defaults.baseURL + '/b2c/image/' +res.data.msg.pictureModels[i].imgUrl
            })
            this.pictures.push({
              imgUrl:res.data.msg.pictureModels[i].imgUrl,
              id:res.data.msg.pictureModels[i].id,
            })
          }
          console.log(this.fileList)
        }
      })
    },
    // 商品明细的删除操作
    edit(row){
      console.log(row)
      let params={
        id:row.id
      }
      this.$confirm('确定要删除该条商品吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(this.flag){
          this.axios.get('/b2c/cgp/delete',{params})
          .then(res=>{
            if(res.data.code>0){
              this.$message.success('删除成功')
            }else{
              this.$message.error('出错啦！请重试！')
            }
          })
        }
        for(var i=0;i<this.products.length;i++){
          if(this.products[i].goodId==row.goodId){
            this.products.splice(i,1)
          }
        }
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 选择产品
    choose(){
      this.dialogVisible2 = true;
      this.searchParams.keyword = "";
      this.searchParams.isShow='1'
      this.getDataList();
    },
    // 添加活动产品
    add(row){
      let obj={
        goodIsShow:row.isShow,
        goodName:row.goodName,
        goodId:row.id,
        goodCode:row.goodCode,
        spec:row.spec,
        goodPrice:row.retailPrice,
        quantity:1,
        innerMsg:''
      }
      if(this.flag){
        let params={
          commodityGroupId:this.form.id,
          goodId:row.id,
          quantity:1
        }
        this.axios.post('/b2c/cgp/add',params)
        .then(res=>{
          if(res.data.code>0){
            console.log(res.data)
            this.getData();
          }else{
            console.log(res.data.msg)
          }
        })
      }
      this.products=this.products.concat(obj)
    },
    // 修改商品组时增加商品数量
    addcomfirm(row){
      console.log(row)
      let reg=/^[1-9]\d*$/;
      console.log()
      if(row.quantity==''){
        row.innerMsg='商品数量不能为空';
        // this.$refs.qty.style.border='1px solid #F56C6C';
        return
      }else if(!reg.test(row.quantity)){
        row.innerMsg='请输入正整数，最小为1';
        // this.$refs.qty.style.border='1px solid #F56C6C';
        return
      }else{
        row.innerMsg=''
        // this.$refs.qty.style.border='1px solid #DCDFE6';
      }
      if(this.flag){
        let params={
          id:row.id,
          quantity:row.quantity
        }
        this.axios.post('/b2c/cgp/save',params)
        .then(res=>{
          if(res.data.code>0){
            console.log(res.data)
          }else{
            console.log(res.data.msg)
          }
        })
      }
    },
    // 获取完整详情列表。点击添加产品
    getDataList(){
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get("/b2c/product/good/list",{params})
      .then(res => {
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
    // 图片管理  移除  预览
    handleSuccess(file,fileList){
      console.log('成功')
      console.log(file,fileList)
      if(this.flag){
        let params={
          commodityGroupId:this.form.id,
          imgUrl:file.msg.fileName
        }
        this.axios.post('/b2c/cgPic/save',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('上传成功')
            // this.getData();
            // this.activeName='picture';
            this.pictures.push({
              id:res.data.msg.id,
              imgUrl:res.data.msg.imgUrl
            })
            this.fileList.push({
              id:res.data.msg.id,
              name:res.data.msg.imgUrl,
              url:this.axios.defaults.baseURL + '/b2c/image/' +res.data.msg.imgUrl,
              imgUrl:res.data.msg.imgUrl
            })
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }else{
        this.pictures.push({
          name:file.msg.originName,
          imgUrl:file.msg.fileName
        })
      }
      // console.log(this.pictures)
    },
    handleRemove(file, fileList) {
      console.log('移除')
      console.log(file,fileList)
      for(var i=0;i<this.pictures.length;i++){
        if(this.pictures[i].name==file.name){
          this.pictures.splice(i,1)
        }
      }
      if(this.flag){
        if(file.id){
          let params={
            id:file.id
          }
          this.axios.get('/b2c/cgPic/delete',{params})
          .then(res=>{
            if(res.data.code>0){
              this.$message.success('删除成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      }
      // console.log(this.pictures)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 保存
    onSubmit(formName){
      this.$refs[formName].validate((valid) =>{
         if (valid){
            this.form.pictures=this.pictures;
            this.form.products=this.products;
            let params=this.form;
            this.axios.post('/b2c/commodityGroup/save',params)
            .then(res=>{
              if(res.data.code>0){
                this.$message.success('保存成功');
                this.$router.push('/commodityGroup')
              }else{
                this.$message.error(res.data.msg)
              }
            })
         }else {
            this.$message.error('请完善内容后提交保存!');
            return false;
          }
        });
    },
    // 面板切换
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
}
</script>

<style>

</style>