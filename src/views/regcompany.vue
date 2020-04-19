<template>
  <div class="regcompamy">
    <div class="form">
      <h1>企业注册</h1>
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业编码" prop="code">
              <el-input v-model="form.code" autocomplete="off" placeholder="请输入企业编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入企业名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择企业类型" style="width:100%;">
                <el-option v-for="item in companyTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="form.contactNumber" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="省" prop="province">
              <el-select v-model="form.province" placeholder="请选择" class="address_select" @change="getcity(form.province,true)" style="width:100%;">
                <el-option v-for="item in sheng" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="abbreviation">
              <el-input v-model="form.abbreviation" placeholder="请输入企业简称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="市" prop="city">
              <el-select v-model="form.city" placeholder="请选择" class="address_select" @change="getCounty(form.city,true)" style="width:100%;">
                <el-option v-for="item in shi" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司法人" prop="lawMan">
              <el-input v-model="form.lawMan" placeholder="请输入企业法人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区" prop="county">
              <el-select v-model="form.county" placeholder="请选择" class="address_select" style="width:100%;">
                <el-option v-for="item in qu" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="form.linkman" placeholder="请输入企业联系人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="postcode">
              <el-input v-model="form.postcode" placeholder="请输入邮编"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

          <!-- <el-form-item label="营业执照" prop="businessLicense">
            <el-input v-model="form.businessLicense" placeholder="请输入执照编号"></el-input>
          </el-form-item> -->
          <el-form-item label="营业执照" prop="businessLicense">
            <div class="license-group clearfix" >
              <div class="img-box">
                <el-upload
                  class="avatar-uploader"
                  :action="axios.defaults.baseURL + '/b2c/product/good/picture/imgupload?token=' + token"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  >
                  <img v-if="form.businessLicense.picture" :src="axios.defaults.baseURL + '/crm/image/' + form.businessLicense.picture" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <div class="info-box">
                <el-form ref="form" :model="form.businessLicense" label-width="80px" size="mini">
                  <el-form-item label="证照类型">
                    <el-input v-model="form.businessLicense.typeName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="证照号码">
                    <el-input v-model="form.businessLicense.memo" placeholder="请输入证件号码"></el-input>
                  </el-form-item>
                  <el-form-item label="生效日期">
                    <el-date-picker type="date" placeholder="请选择" v-model="form.businessLicense.startTime"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="截止日期">
                    <el-date-picker type="date" placeholder="请选择" v-model="form.businessLicense.validDate"></el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">注册</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
          
      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  name:'regcompamy',
  data(){
    var checkPhone = (rule, value, callback) => {
      let phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      let phoneReg2=/^[0][1-9]{2,3}-[0-9]{5,10}$/;
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else {
        if (phoneReg.test(value)||phoneReg2.test(value)) {
          callback()
        } else {
          callback(new Error('电话号码格式不正确'))
        }
      }
    };
    return {
      sheng: [],
      shi: [],
      qu: [],
      companyTypeList:[],
      token: localStorage.getItem('loginToken'),
      uploadImageIndex:"",//当前上传图片的索引
      form:{
        code:'',
        name:'',
        province:'',
        abbreviation:'',
        city:'',
        lawMan:'',
        county:'',
        linkman:'',
        address:'',
        postcode:'',
        contactNumber:'',
        businessLicense:{
          picture:'',
          typeName:'经营许可证',
          memo:'',
          startTime:"",
          validDate:''
        }
      },
      rules: {
        code: [
          { required:true,message:'企业编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required:true,message:'企业名称不能为空', trigger: 'blur' }
        ],
        businessLicense: [
          { required:true, message:'营业执照不能为空', trigger: 'blur' }
        ],
        contactNumber: [
          { required:true, validator: checkPhone, trigger: 'blur' }
        ],
        type: [
          { required:true, message:'请选择企业类型', trigger: 'change' }
        ]
      }
    }
  },
  methods:{
    //添加证照
    // 选择图片
    handleAvatarSuccess(response, file, fileList){
      this.form.businessLicense.picture = response.msg.title;
      console.log(this.form.businessLicense);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post('/crm/corporation/register',this.form)
          .then(res=>{
            console.log(res.data)
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: '企业注册成功!'
              });
              this.$router.push('/login')
            }else{
              this.$message.error('出错啦！请重试！')
            }
          })
        } else {
          this.$message.err('请完善内容！')
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取省
    getsheng() {
      let params = {
          level: 1,
          superiorId: 100000,
          pageSize: 40
        };
        this.axios
        .get("/crm/region/list", {params})
        .then(res => {
            if (res.data.code > 0) {//请求成功
            this.sheng = res.data.msg.datas;//将获取的数据赋值
          } 
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击地区获取市
    getcity(id, is) {
      if (is) {
        //判断是否点击上一级
        this.form.county = "";
        this.form.city = "";
      }
      let params = {
          level: 2,
          superiorId: id,
          pageSize: 40
        };
        this.axios
        .get("/crm/region/list", {params})
        .then(res => {
            if (res.data.code > 0) {//请求成功
            this.shi = res.data.msg.datas;//将获取的数据赋值
          } 
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击城市获取区
    getCounty(id, is) {
      var _this = this;
      if (is) {
        //判断是否点击上一级
        this.form.county = "";
      }
      let params = {
          level: 3,
          superiorId: id,
          pageSize: 40
        };
        this.axios
        .get("/crm/region/list", {params})
        .then(res => {
            if (res.data.code > 0) {//请求成功
            this.qu = res.data.msg.datas;//将获取的数据赋值
          } 
        })
        .catch(err => {
          console.log(err);
        });
    },
    //切换企业类型
    getCompanyTypeList() {
      this.axios
      .get("/crm/corporationType/list", {})
      .then(res => {
        this._companyTypeList = res.data.msg.datas;
        for(let i=0;i<this._companyTypeList.length;i++){
          if(this._companyTypeList[i].currentLevel==1){
            this.companyTypeList.push(this._companyTypeList[i])
          }
        }
      })
      .catch(err => {
      });
    },
  },
  mounted(){
    this.getsheng();
    this.getCompanyTypeList();
  }
}
</script>

<style lang="scss">
  .regcompamy{
    background-color: #fff;
    width:100%;height:100%;
    // background: url("../assets/pageBg/loginBg.png") no-repeat center center;
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    .form{
      h1{
        font-size:28px;
        padding-bottom: 2.6rem;
        // border-bottom:1px solid #d9d9d9;
        text-align: center;
        margin-bottom: 2.5rem;
        box-shadow: 0px 8px 18px -8px  #d9d9d9;
      }
      background-color: #fffffe;
      padding:15px;
      position: fixed;
      width:60%;
      height:80%;
      margin:auto;
      left:0;
      right:0;
      top:0;
      bottom:0;
      border:1px solid #8c939d;
      border-radius: 5px;
    }
    .el-form{
      width:100%;
      max-height:70%;
      overflow: auto;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .license-group{width: 85%;border: 1px solid #DCDFE6;border-radius: 4px;padding: 1rem;margin-top: 1rem;height:182px;}
    .license-group .img-box{width: 32%;float: left;}
    .license-group .info-box{width: 68%;float: left;}
    .el-input{
      width:75%;
    }
  }
</style>