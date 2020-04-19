<template>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width:90%;">
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="简称">
        <el-input v-model="form.abbreviation" placeholder="请输入企业简称"></el-input>
      </el-form-item>
      <el-form-item label="企业类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择企业类型" @change="changeCompanyType($event)">
          <el-option v-for="item in companyTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
        </el-select>
      </el-form-item>
      <div :class="form.realLevel == 1?'hide':''">
        <el-form-item label="所属企业" prop="parentId">
          <!-- v-model="form.parentId=0?'':form.parentId" -->
          <el-select v-model="form.parentId" placeholder="请选择所属企业" :disabled="form.realLevel == 1 ||form.type==''">
            <el-option v-for="item in companyDataList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
          </el-select>
        </el-form-item>
      </div>
      
      
      <el-form-item label="企业编码">
        <el-input v-model="form.code" placeholder="请输入企业编码"></el-input>
      </el-form-item>
      <el-form-item label="法人代表" prop="lawMan">
        <el-input v-model="form.lawMan"  placeholder="请输入法人代表"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="form.linkman" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.contactNumber" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="营业时间" required prop="businessHours">
        <el-input v-model="form.businessHours" placeholder="请输入营业时间"></el-input>
      </el-form-item>
      <city @addrData="getCity" :addrData="form"></city>  
      <el-form-item label="详细地址" prop="address">
        <el-input type="textarea" v-model="form.address" style="width: 300px" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item> -->
      <el-form-item label="企业logo" prop="logo">
        <el-upload
          :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :file-list="fileList"
          :limit="1">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

      </el-form-item>
    </el-form> 
</template>
<script>
import city from "../public/city";
import global_ from '../../api/global'
// import companyType from "../public/company-type";
export default {
  components: { city },
  name: "basic",
  data() {
    return {
      token: localStorage.getItem('loginToken'),
      fileName:'',
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      fileList:[],
      limitCount:1,
      companyTypeList:[],//企业类型
      companyDataList:[],//企业列表
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          // { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        type:[
          { required: true, message: '请选择企业类型', trigger: 'blur' }
        ],
        lawMan:[
          { required: true, message: '请输入企业法人信息', trigger: 'blur' }
        ],
        address:[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        businessHours:[
          { required: true, message: '请输入企业营业时间', trigger: 'blur' }
        ]
      }
    };
  },
  props: ["form"],//从父组件接受的数据
  mounted() {
    this.getCity(this.form);
    this.getCompanyTypeList();
    this.getCompanyDataList();
    // console.log(1)
    // console.log(this.form.logo)
    if(this.form.logo!=''){
      this.fileName=this.form.logo;
      this.fileList.push({
        name: this.form.logo,
        url: global_.baseURL + '/b2c/image/' + this.form.logo
      })
    }
  },
  watch:{
    form:function(){
      this.getCompanyDataList();
      // let obj={
      //   name:this.form.logo,
      //   url:global_.baseURL + '/b2c/image/' + this.form.logo
      // }
      // this.fileList[0].name=this.form.logo
      // this.fileList[0].url=global_.baseURL + '/b2c/image/' + this.form.logo
      // console.log('watch中的数据')
      // console.log(this.form)
    }
  },
  methods: {
    // 是否确认移除图片
    beforeRemove(file,fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file,fileList) {
      // console.log('移除之后的回调')
      // console.log(file);
    },
    handleAvatarSuccess(file,fileList){
      // console.log('上传成功之后的回调')
      // console.log(file)
      // console.log(fileList)
      this.fileName=file.msg.fileName;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // handleChange(file, fileList) {
    //   console.log('change之后的回调')
    //   console.log(file)
    //   console.log(fileList)
    //   // this.fileName=file.msg.fileName;
    //   this.fileList = fileList;
    // },
    // 从子组件获取省市区
    getCity(data) {
      this.province = data.province;
      this.city = data.city;
      this.area = data.area;
    },
    getCompanyTypeList() {
      this.axios
        .get("/crm/corporationType/list", {})
        .then(res => {
          this.companyTypeList = res.data.msg.datas;
        })
        .catch(err => {
        });
    },
    //获取店铺列表
    getCompanyDataList() {
      var params = {
        level: this.form.level-1
      }
      this.axios
        .get("/crm/corporation/list", {params})
        .then(res => {
          this.companyDataList = res.data.msg.datas;
          // console.log('查看所属企业')
          // console.log(this.companyDataList)
        })
        .catch(err => {
        });
    },
    //切换企业类型
    changeCompanyType(i){
      this.form.parentId = "";
      this.form.level = this.companyTypeList[i-1].virtualLevel;
      // console.log(this.form)
      this.getCompanyDataList();
    }
  }
};
</script>
<style>
.hide .el-upload--picture-card {
    display: none;
}
.avatar-uploader .el-upload {
  border: 0px;
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
</style>

