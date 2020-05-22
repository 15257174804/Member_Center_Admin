<template>
  <div class="personal">
    <div class="contain" style="padding:40px;">
      <div class="img">
        <img src="../assets/personal/user01.jpg" />
      </div>
      <div class="message">
        <div class="user">{{this.$store.state.user_name}}</div>
        <!-- <div class="icon">
          <i class="iconfont">&#xe626;</i>
          <i class="iconfont">&#xe625;</i>
          <i class="iconfont">&#xe65c;</i>
        </div>
        <div class="title">suibianshuidiansmdouhaodya</div> -->
      </div>
      <!-- <div class="hobby">
        <span>
          <i class="el-icon-star-on"></i>Collection
        </span>
        <span>
          <i class="el-icon-chat-line-round"></i>Message
        </span>
      </div> -->
    </div>

    <el-tabs>
      <el-tab-pane label="基础资料">
        
      </el-tab-pane>
      <el-tab-pane label="密码修改">
        <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px" class="demo-passForm">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="passForm.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="passForm.newPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
            <el-button @click="resetForm('passForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          width="30%">
          <div style="font-size:18px;">
            <i class="el-icon-circle-check" style="color:#67C23A;"></i>
            密码修改成功
            <br />
            <div style="padding-left:18px;"><el-button type="text" @click="toLogin">重新登录</el-button></div>
            
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "personal",

  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'));
      } else {
        const reg=/^\w{6,}$/;
        if(reg.test(value)){
          callback();
        }else{
          return callback(new Error('请输入至少6位密码(数字、大小写字母或下划线_)'));
        }
      }
    };
    return {
      dialogVisible:false,
      count:3,
      token: localStorage.getItem('loginToken'),
      passForm:{
        oldPassword:'',
        newPassword:''
      },
      rules:{
        oldPassword:[
          { required:true,validator: validatePass, trigger: 'blur' }
        ],
        newPassword:[
          { required:true,validator: validatePass, trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params=this.passForm;
          this.axios({
            method:'post',
            url:'/crm/user/updatePwd',
            params:{
              newPassword:this.passForm.newPassword,
              oldPassword:this.passForm.oldPassword
            }
          })
          .then(res=>{
            // console.log('修改密码保存成功')
            // console.log(res.data)
            if(res.data.code>0){
              // 需要退出重新登录
              this.dialogVisible=true;
              localStorage.removeItem("loginToken");
            }else{
              this.$message.error(res.data.msg)
            }
          })
        } else {
          this.$message.error('内容有误，请重新输入')
          return false;
        }
      });
    },
    toLogin(){
      
      this.$router.push('/login')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang='scss'>
.personal{
  padding:13px 35px 0 13px;
  width:100%;
}
/* 容器 */
.contain {
  display: flex;
  border:1px solid #f3f4f5;
  border-radius: 4px;
  box-shadow: 7px 6px 19px 1px #f3f4f5;
}
/* 头像 */
.img{
  margin-right:25px;
}
.img img {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  
}
/* 中间信息 */
.message{
  padding-top:1rem;
}
.user {
  font-size: 2rem;
  font-weight: bold;
}
.el-dialog__header{
  padding:0;
}



</style>