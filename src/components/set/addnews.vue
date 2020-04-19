<template>
  <div class="addnews">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>{{title}}</span>
    </div>
    <!-- 表单内容 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" >
      
        <!-- 输入预约活动名称 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题图片" prop="titlePic">
          <el-upload
            class="avatar-uploader"
            :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 后期有要求可使用富文本编辑器  https://www.jianshu.com/p/d0c1884505f1 -->
        <el-form-item label="内容" prop="context">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="ruleForm.context" placeholder="请输入公告内容"></el-input>
        </el-form-item>
      
      <el-form-item  style="margin:20px 0 20px 0;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
export default {
  name:'addnews',
  data(){
    return {
      title:'新增公告',
      token: localStorage.getItem('loginToken'),
      imgUrl:'',
      options: [{
          value: 1,
          label: '行业资讯'
        }, {
          value: 2,
          label: '招商信息'
        }
      ],
      ruleForm:{
        id:'',
        title:'',
        type:'',
        titlePic:'',
        context:''
      },
      rules:{
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择公告类型', trigger: 'change' }
        ],
        context: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    // 上传背景图成功之后的回调
    handleAvatarSuccess(res, file) {
      console.log('图片上传成功')
      this.ruleForm.titlePic=res.msg.fileName;
      this.imgUrl = URL.createObjectURL(file.raw);
      console.log(file);
      console.log(res)
    },
    // 背景图上传之前的回调
    beforeAvatarUpload(file) {
      console.log(file)
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      // return isJPG && isLt2M;
      return isLt2M
    },
    // 返回按钮
    goback(){
      this.$router.back(-1);
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params=this.ruleForm;
          this.axios.post('/b2c/news/save',params)
          .then(res => {
            console.log('这是保存提交是返回的数据')
            console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.$router.push('/newslist')
            }else{
              this.$message.error(res.data.msg);
            }
          })
        } else {
          this.$message.error('请完善内容后提交保存!');
          return false;
        }
      });
    },
    getData(){
      console.log('获取页面元素')
      let params={
        id:this.ruleForm.id
      }
      this.axios.get('/b2c/news/newsDetail',{params})
      .then(res=>{
        this.ruleForm=res.data.msg;
        this.imgUrl=this.axios.defaults.baseURL + '/b2c/image/' + this.ruleForm.titlePic;
      })
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.ruleForm.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.getData();
    }
  }
}
</script>

<style lang='scss'>
.el-textarea__inner{
  width:50%;
}
</style>