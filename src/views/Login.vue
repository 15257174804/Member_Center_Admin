<template>
  <div id="login">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="logo">
        <img src="../assets/logo.png" width="142">
      </div>
      <el-form-item prop="username" :error="errorMsg1">
        <div class="icon">
          <img src="../assets/design/account.png">
        </div>
        <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="手机号" @keyup.enter.native="sendform('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item prop="password" :error="errorMsg2">
        <div class="icon">
          <img src="../assets/design/password.png">
        </div>
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码" @keyup.enter.native="sendform('ruleForm')"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="sendform('ruleForm')">登录</el-button>
        <vcode :show="isShow" @onSuccess="onSuccess" @onClose="onClose" />
      </el-form-item>
      <div class="reg">
        <!-- <div style="margin-right:10px;">用户注册</div> -->
        <!-- <div @click="regcompany">企业注册</div> -->
      </div>
    </el-form>
  </div>
</template>


<script>
import vcode from "vue-puzzle-vcode";

export default {
  nameL: "login",
  components: {
    vcode
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入用户名"));
      } else {
        if (this.ruleForm.username !== "") {
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.password !== "") {
        }
        callback();
      }
    };
    return {
      errorMsg1:'',
      errorMsg2:'',
      isShow: false, // 验证码模态框是否出现
      key: 0, //开关
      // 表单
      ruleForm: {
        username: "",
        password: ""
      },
      // 规则
      rules: {
        username: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    regcompany(){
      const that=this;
      // console.log(1)
      // console.log(this.)
      that.$router.push({path:'/regcompany'})
      // console.log(2)
    },
    reguser(){
      this.$router.push('/reguer')
    },
    //页面自动获取数据,直接登录
    // getform() {
    //   this.axios
    //     .post("/login")
    //     .then(res => {
    //       this.ruleForm = res.data.data.form;
    //     })
    //     .catch(err => {
    //        ;
    //     });
    // },
    // 登录发送数据
    sendform() {
      // this.onSubmit();
      // if (this.key == 1) {
        if (this.ruleForm.username == "" || this.ruleForm.password == "") {
          alert("请输入手机号或者密码");
        } else {
          if(this.key==0){
            this.onSubmit()
          }else if(this.key==1){
            let params = {
            userName: this.ruleForm.username,
            // password: Base64.encode(this.encryptDes(this.ruleForm.password,'')),
            password: this.ruleForm.password,
          };
          this.axios
            .post("/crm/user/login", params)
            .then(res => {
              // console.log('登录时获取的数据')
              // console.log(res.data)
              const token = res.data.msg.token;
              if(res.data.code < 0){
                this.$notify.error({
                  title: '错误',
                  message: res.data.msg
                })
                // debugger
                if(res.data.msg=="密码不正确"){
                  this.errorMsg2=res.data.msg;
                }else if(res.data.msg=="账号不存在"){
                  this.errorMsg1=res.data.msg;
                }
                return
              }
              if(!res.data.msg.isValid){
                this.$notify.error({
                  title: '错误',
                  message: '用户状态无效，登录失败！'
                })
                return
              }
              window.localStorage.setItem("deliver", res.data.msg.mobilephone);
              console.log(res.data.msg.mobilephone)
              this.$store.dispatch("setUserInfoFun",res.data.msg.username);
              localStorage.setItem("loginToken", token);
              localStorage.setItem("userInfo", JSON.stringify(res.data.msg));
              // console.log(res.data.msg)
              // console.log(this.$store.state.user_name)
              
              this.global.token = token;
              this.$store.getters.change;
              if(res.data.msg.systemAdministrator){
                this.$router.push("/display");
                this.$store.commit('setGroupInfo','平台管理员')
                this.$store.commit('setAdmin','systemAdmin')
              }else{
                this.$router.push("/choose");
              }
              
            })
            .catch(err => {
               console.log(err);
            });
          }
          
        }
      
    },
    onSubmit() {
      this.isShow = true;
    },
    // 用户通过了验证
    onSuccess(msg) {
      this.isShow = false; // 通过验证后，需要手动隐藏模态框
      this.key = 1;
      this.sendform();
    },
    // 用户点击遮罩层，应该关闭模态框
    onClose() {
      this.isShow = false;
    }
  },
  mounted() {
    // this.$notify({
    //   title: "提示",
    //   message:
    //     "目前有两个账号可以登录，分别收管理员和用户，用户名分别是admin,user密码都为：123456",
    //   type: "warning",
    //   duartion: 0
    // })
      // this.getform();
  }
};
</script>

<style scoped>
#login {
  width: 100%;
  height: 100%;
  background: url("../assets/pageBg/loginBg.png") no-repeat center center;
  background-size: 100% 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 50%;
  text-align: center;
  margin-bottom: 40px;
}
.reg{
  margin-left:7%;
  font-size: 13px;
  color:#C0C4CC;
  display: flex;
}
.reg div{
  font-weight: 600;
  cursor: pointer;
}
.reg div:hover{
  color:#409EFF;
  text-decoration: underline;
}
.demo-ruleForm {
  /* background: #fff;
  border-radius: 20px;
  padding: 50px; */
  height: 30%;
  width:52%;
}
h1 {
  margin-left: -50px;
  font-family: Helvetica, ‘Hiragino Sans GB’, ‘Microsoft Yahei’, ‘微软雅黑’,
    Arial, sans-serif;
}

.el-form-item {
  width: 36%;
  font-weight: 500;
  background-color: #F7F8FA;
  margin-left: 7%;
}

.el-form-item .icon{
  float: left;
  width: 20%;
  height: 40px;
  text-align: center;
  position: relative;
}

.el-form-item img{
  position: absolute;
  top:50%; 
  left:50%;
  transform: translate(-50%,-50%);
}

#login >>> .el-form-item__content{
  margin-left: 0 !important;
  height: 40px;
}

#login >>> .el-input__inner{
 border: 0;
 background-color: #F7F8FA;
}

.el-input{
  float: left;
  width:80%;
}

button {
  width: 100%;
  background-color: #282A55;
  border-color: #282A55;
  border-radius: 0;
}
</style>