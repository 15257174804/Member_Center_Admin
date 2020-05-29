<template>
  <div class="reguser">
    <div class="form">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobilephone">
          <el-input v-model="ruleForm.mobilephone"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" style="width:65%;"></el-input><span class="sbtn" @click="getCode">{{codetitle}}</span>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'reguser',
  data(){
    var checkPhone = (rule, value, callback) => {
      let phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (value === '') {
        return callback(new Error('手机号不能为空'));
      } else {
        if (phoneReg.test(value)) {
          callback()
        } else {
          return callback(new Error('电话号码格式不正确'))
        }
      }
    };
    return {
      codetitle:'获取验证码',
      ruleForm:{
        username:'',
        password:'',
        mobilephone:'',
        code:''
      },
      rules: {
        username: [
          { required:true,message:'用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required:true,message:'密码不能为空', trigger: 'blur' }
        ],
        mobilephone: [
          { required:true, validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    getCode(){
      let params={
        telephone:this.ruleForm.mobilephone
      }
      this.axios.get('/crm/sms/sendCode',{params})
      .then(res=>{
        if(res.data.code>0){
          this.$message('验证码发送成功');
          this.codetitle='已发送';
        }else{
          this.$message('出错啦！请重新发送');
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted(){

  }
}
</script>

<style lang="scss" soped>
.reguser{
  width: 100%;
  height: 100%;
  background: url("../assets/pageBg/loginBg.png") no-repeat center center;
  position: relative;
}
.form{
  width:25%;
  position: absolute;
  left: 19%;
  top:35%;
  .sbtn{
    width:85px;
    text-align: center;
    float:right;
    border: 1px solid #DCDFE6;
    background-color: #DCDFE6;
    border-radius: 3px;
    color:#909399;
    cursor: pointer;
  }
}
</style>