<template>
  <div class="integoodadd">
    <div class="title clearfix">
      <span>{{title}}</span>
      <span v-if="form.goodName"><span style="color:#4B9BF7"> | </span>{{form.goodName}}</span>
      <el-button type="primary" @click="onSubmit('form')">保存信息</el-button>
    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" input-width="200px">
      <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInfo">
          <el-form-item class="half-form" label="商品名称" prop="goodName">
            <el-input v-model="form.goodName" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="商品编码" prop="goodCode">
            <el-input v-model="form.goodCode" placeholder="请输入商品编码"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="兑换方式" prop="redeemType" required>
            <el-radio-group v-model="form.redeemType">
              <el-radio label='积分'></el-radio>
              <el-radio label='积分+现金'></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="half-form" label="是否限制兑换量" prop="redeemLimitFlag">
            <el-radio-group v-model="form.redeemLimitFlag">
              <el-radio label='是'></el-radio>
              <el-radio label='否'></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="half-form" label="金额" prop="redeemPrice">
            <el-input :disabled="form.redeemType=='积分'" v-model="form.redeemPrice" placeholder="请输入商品兑换所需金额"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="个人可兑数量">
            <el-input :disabled="form.redeemLimitFlag=='否'" v-model="form.redeemQuantity" placeholder="请输入个人可兑换数量"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="积分" prop="redeemPoints">
            <el-input v-model="form.redeemPoints" placeholder="请输入商品兑换所需积分"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="总数量" prop='redeemRemainingQuantity'>
            <el-input v-model="form.redeemRemainingQuantity" placeholder="请输入可兑换总数量"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="通用名称">
            <el-input v-model="form.commonName" placeholder="请输入通用名称"></el-input>
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
            <!-- <el-input v-model="form.goodsClass" placeholder="请选择产品分类"></el-input> -->
            <el-select v-model="form.goodsClass" placeholder="请选择商品分类">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.name"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item class="half-form" label="规格">
            <el-input v-model="form.spec" placeholder="请输入产品规格"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="产地">
            <el-input v-model="form.prodArea" placeholder="请输入产地"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="厂家">
            <el-input v-model="form.producer" placeholder="请输入厂家"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="剂型">
            <el-input v-model="form.medicalType" placeholder="请输入剂型"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="许可证">
            <el-input v-model="form.license" placeholder="请输入许可证"></el-input>
          </el-form-item>
          

        </el-tab-pane>
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
import global_ from '../../api/global';
export default {
  name:'integoodadd',
  data(){
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
        redeemFlag:true,
        id:"",
        goodCode:"",//商品编码
        goodName:"",//商品名称
        commonName:"",//通用名称
        quantity:'',  //库存
        goodsClass:"",//分类
        spec:"",//规格
        producer:"",//厂家
        prodArea:"",//产地
        useUnit:"",//单位
        medicalType:"",//剂型
        license:"",//产品许可证
        barcode:"",//条形码
        redeemPrice: "",// 活动价
        redeemPoints:'',
        redeemLimitFlag:'否',
        redeemQuantity:'',
        redeemRemainingQuantity:'',  //剩余可兑数量
        attendingFunctions:"",// 主治功能
        useFrequency: "",//使用频次
        useTime:"",//使用时间
        taboo:"",//禁忌
        mattersNeedingAttention:"",//注意事项
        ybType:'',
        redeemType:''  //兑换方式  积分或积分+现金
      },
      rules: {
        goodName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodCode:[
          { required: true, message: '请输入商品编码', trigger: 'blur' }
        ],
        redeemPoints:[
          { required: true, message: '请输入兑换商品所需积分', trigger: 'blur' }
        ],
        redeemLimitFlag:[
          { required: true, message: '请选择是否限制兑换量', trigger: 'change'}
        ],
        // redeemQuantity:[
        //   { required: true, message: '请输入个人可兑数量', trigger: 'blur' }
        // ],
        redeemRemainingQuantity:[
          { required: true, message: '请输入可兑换总数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    // 获取商品类别
    getClass(){
      let params={
        levelScan:5
      }
      this.axios.get('/b2c/classify/tree',{params})
      .then(res=>{
        // console.log('获取树形数据')
        // console.log(res.data.msg)
        this.classList=res.data.msg;
      })
    },
    //tab切换
      handleClick(tab, event) {
      },
      //图片处理
      handleRemove(file, fileList) {
        // let _list = [];
        // this.pictures.forEach(row => {
        //   fileList.forEach(row1 => {
        //     if(row.name == row1.name){
        //       _list.push({
        //         isMain: row.isMain,
        //         imgUrl: row.url
        //       })
        //     }
        //   })
        // })
        // this.pictures = _list;
        for(var i=0;i<this.pictures.length;i++){
          if(this.pictures[i].id===file.id){
            this.pictures.splice(i,1)
          }
        }
        console.log(file)
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
        // this.pictures.push({
        //   name: response.msg.originName,
        //   isMain: false,
        //   imgUrl: response.msg.title
        // })
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
            if(this.form.redeemLimitFlag){
              this.form.redeemLimitFlag='是'
            }else{
              this.form.redeemLimitFlag='否'
            }
            if(this.form.redeemPrice==0||this.form.redeemPrice==''){
              this.$set(this.form,'redeemType','积分')
            }else{
              this.$set(this.form,'redeemType','积分+现金')
            }
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
              if(this.form.redeemLimitFlag=='是'){
                this.form.redeemLimitFlag=true
              }else{
                this.form.redeemLimitFlag=false
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
                  this.$router.push('/integralgood')
                }else{
                  this.$message.error(res.data.msg);
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
          } else {
            this.$message.error('请完善内容后提交保存!');
            return false;
          }
        });
      }
  },
  mounted(){
    // 路由参数
    if(this.$route.query.id){
      this.form.id = this.$route.query.id;
      this.title = this.$route.query.title;
      this.tabName = this.$route.query.tabName;
      this.getData();
    }
    this.getClass();
  }
}
</script>

<style>
.isShow{
  display: none;
}
</style>