<template>
  <div id="goodadd">
     <!-- <el-page-header class="title clearfix" @click="$router.history.go(-1)" :content="title">
      <el-button type="primary" @click="onSubmit">保存信息</el-button>
    </el-page-header> -->
    <div class="title clearfix">
      <span>{{title}}</span>
      <span v-if="form.goodName"><span style="color:#4B9BF7"> | </span>{{form.goodName}}</span>
      <el-button type="primary" @click="onSubmit('form')">保存信息</el-button>
    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" input-width="200px">
      <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInfo">
          <el-form-item class="half-form" label="商品名称" prop="goodName">
            <el-input v-model="form.goodName"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="商品编码" prop="goodCode">
            <el-input v-model="form.goodCode"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="零售价" prop="retailPrice">
            <el-input v-model="form.retailPrice"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="库存" prop="quantity">
            <el-input v-model="form.quantity"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="通用名称">
            <el-input v-model="form.commonName"></el-input>
          </el-form-item>
          <!-- <el-form-item class="half-form" label="化学名称">
            <el-input v-model="form.chemieName"></el-input>
          </el-form-item> -->
          <!-- <el-form-item class="half-form" label="拼音码">
            <el-input v-model="form.spellCode"></el-input>
          </el-form-item> -->
          <el-form-item class="half-form" label="商品条码">
            <el-input v-model="form.barcode"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="医保分类">
            <el-select v-model="form.ybType" placeholder="请选择">
              <el-option label="无" value="无"></el-option>
              <el-option label="甲类" value="甲类"></el-option>
              <el-option label="乙类" value="乙类"></el-option>
              <el-option label="丙类" value="丙类"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="half-form" label="商品分类">
            <!-- <el-input v-model="form.goodsClass"></el-input> -->
            <el-select v-model="form.goodsClass" placeholder="请选择商品分类">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.name"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item class="half-form" label="规格">
            <el-input v-model="form.spec"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="单位">
            <el-input v-model="form.useUnit"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="产地">
            <el-input v-model="form.prodArea"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="厂家">
            <el-input v-model="form.producer"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="剂型">
            <el-input v-model="form.medicalType"></el-input>
          </el-form-item>
          <!-- <el-form-item class="half-form" label="转换比">
            <el-input v-model="form.ratio"></el-input>
          </el-form-item> -->
          <el-form-item class="half-form" label="许可证">
            <el-input v-model="form.license"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="净重/kg" prop="weight">
            <el-input v-model="form.weight" type="number"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="是否上架">
            <el-switch active-color="#13ce66" v-model="form.isShow"></el-switch>
          </el-form-item>
          <el-form-item class="half-form" label="是否药品">
            <el-switch active-color="#13ce66" v-model="form.isMedical"></el-switch>
          </el-form-item>
        </el-tab-pane>
        
        <!-- <el-tab-pane label="业务信息" name="busiInfo">
          
        </el-tab-pane> -->
        <el-tab-pane label="图片管理" name="imgInfo">
          <el-upload
            :action="axios.defaults.baseURL + '/b2c/product/good/picture/imgupload?token=' + token"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="扩展信息" name="assistInfo">
          <el-form-item class="half-form" label="主治功能">
            <el-input type="textarea" v-model="form.attendingFunctions" style="width: 300px"></el-input>
          </el-form-item>
          <!-- <el-form-item class="half-form" label="使用频次">
            <el-input v-model="form.useFrequency"></el-input>
          </el-form-item> -->
          <el-form-item class="half-form" label="用法用量">
            <el-input type="textarea" v-model="form.useTime" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="禁忌">
            <el-input type="textarea" v-model="form.taboo" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="分享介绍">
            <el-input type="textarea" v-model="form.mattersNeedingAttention" style="width: 300px"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  import city from "../public/city";
  import global_ from '../../api/global'

  export default {
    name: "goodadd",
    data() {
      var checkWeight=(rule,value,callback)=>{
        let reg=/^(0|[1-9][0-9]*)(\.\d+)?$/;
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error('请输入正数！'))
        }
      };
      return {
        title:"创建商品",
        tabName: 'basicInfo',//默认选项卡
        dialogImageUrl: '',
        dialogVisible: false,
        fileList:[],
        pictures:[],
        classList:[],  //商品分类
        token: localStorage.getItem('loginToken'),
        // baseUrl: axios.defaults.baseURL,
        form: {
          id:"",
          goodCode:"",//商品编码
          goodName:"",//商品名称
          commonName:"",//通用名称
          // "chemieName":"测试药品001",//化学名称
          goodsClass:"",//分类
          spec:"",//规格
          producer:"",//厂家
          prodArea:"",//产地
          useUnit:"",//单位
          medicalType:"",//剂型
          // "ybType":"无",//医保类型
          ratio:"",//转换比
          // "spellCode":"CSYP001",//拼音码
          license:"",//产品许可证
          barcode:"",//条形码
          retailPrice: "",// 零售价
          attendingFunctions:"",// 主治功能
          useFrequency: "",//使用频次
          useTime:"",//使用时间
          taboo:"",//禁忌
          mattersNeedingAttention:"",//注意事项
          isShow:"",
          weight:'',
          isMedical:''
        },
        rules: {
          goodName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goodCode:[
            { required: true, message: '请输入商品编码', trigger: 'blur' }
          ],
          retailPrice:[
            { required: true, message: '请输入零售价', trigger: 'blur' }
          ],
          quantity:[
            { required: true, message: '请输入库存信息', trigger: 'blur' }
          ],
          weight:[
            { validator: checkWeight, trigger: 'blur' }
          ],
        },
        currentPage:'',
        pagesize:''
      }
    },
    created(){
      // 路由参数
        if(this.$route.query.id){
          this.form.id = this.$route.query.id;
          this.title = this.$route.query.title;
          this.tabName = this.$route.query.tabName;
          this.currentPage=this.$route.query.currentPage;
          this.pagesize=this.$route.query.pagesize;
          this.getData();
          this.getClass();
          // console.log(this.currentPage)
          // console.log(this.pagesize)
        }
    },
    mounted(){
        
    },
    methods: {
      // 获取商品类别
      getClass(){
        let params={
          level:2
        }
        this.axios.get('/b2c/classify/list')
        .then(res=>{
          // console.log('获取树形数据')
          // console.log(res.data.msg.datas)
          this.classList=res.data.msg.datas;
        })
      },
      //tab切换
      handleClick(tab, event) {
      },
      //图片处理
      handleRemove(file, fileList) {
        for(var i=0;i<this.pictures.length;i++){
          if(this.pictures[i].id===file.id){
            this.pictures.splice(i,1)
          }
        }
        if(file.id){
          let params={
            id:file.id
          }
          this.axios.get('/b2c/product/good/picture/delete',{params})
          .then(res=>{
            if(res.data.code>0){
              this.$message.success('删除成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSuccess(response, file, fileList){
        // console.log('file')
        // console.log(file)
        // console.log('fileList')
        // console.log(fileList)
        // console.log('response')
        // console.log(response)
        if(this.form.id!==''){
          let params={
            goodId:this.form.id,
            imgUrl:response.msg.title,
            isMain:false
          }
          this.axios.post('/b2c/product/good/picture/save',params)
          .then(res=>{
            if(res.data.code>0){
              this.$message.success('上传成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }else{
          this.pictures.push({
            name: response.msg.originName,
            isMain: false,
            imgUrl: response.msg.title
          })
        }
        

      },
      // 获取数据
      getData() {
        let params = {
          id: this.form.id
        }
        this.axios
          .get("/b2c/product/good/findbyid", {params})
          .then(res => {
            this.form = res.data.msg;
            this.getfileList();
          })
          .catch(err => {
            console.log(err);
          });
      },
      //获取图片列表信息
      getfileList() {
        let params = {
          goodId: this.form.id
        }
        this.axios
          .get("/b2c/product/good/picture/list", {params})
          .then(res => {
            let data = res.data.msg.datas;
            data.forEach(row => {
              this.fileList.push({
                id:row.id,
                name: row.imgUrl,
                url: global_.baseURL + '/b2c/image/' + row.imgUrl
              })
              this.pictures.push({
                id:row.id,
                name: row.imgUrl,
                isMain: row.isMain,
                imgUrl: row.imgUrl
              })
            })
            // console.log(this.fileList)
            // console.log(this.pictures)
          })
          .catch(err => {
            console.log(err);
          });
      },
      onSubmit(formName) {
        // console.log(this.pictures);
        // return
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.form.pictures = this.pictures;
              if(this.pictures.length==0){
                this.form.imgUrl=''
              }
              //保存
              this.axios
              .post("/b2c/product/good/save", this.form)
              .then(res => {
                if(res.data.code > 0){
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });
                  this.$router.push({path:'/good',query:{pagesize:this.pagesize,currentPage:this.currentPage}})
                }else{
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                  ;
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });          
            });
          } else {
            this.$message.error('请完善内容后提交保存!');
            return false;
          }
        });
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
</style>



