<template>
  <div class="choose">
    <div class="form">
      <h1>请选择管理企业</h1>
      <el-form :model="formData" status-icon class="demo-ruleForm">
        <!-- <el-form-item prop="username">
          <div class="icon">
            <img src="../assets/design/account.png">
          </div>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="手机号"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-select v-model="formData.value" placeholder="请选择管理企业">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formData.value)" :disabled="options.length==0">确定</el-button>
        </el-form-item>
        <div class="reg">还没有企业账号？<span @click="regcompany">注册</span></div>
      </el-form>
    </div> <!--form-->
  </div>
</template>

<script>
export default {
  name:'choose',
  data(){
    return{
      formData:{
        value:''
      },
      options: []
    };
  },
  methods:{
    regcompany(){
      const that=this;
      // console.log(1)
      // console.log(this.)
      that.$router.push({path:'/regcompany'})
      // console.log(2)
    },
    submitForm(corpId) {
      // console.log(corpId);
      if(corpId!=''){
        let params={corpId:corpId} 
        this.axios.get('/crm/user/getUser',{
          params:{
            corpId:corpId
          }
        })
        .then(res=>{
          // console.log(res.data.msg.emp.clientId)
          // console.log(this.formData)
          const token = res.data.msg.token;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
            retrun
          }
          for(var i=0;i<this.options.length;i++){
            if(this.formData.value==this.options[i].value){
              this.$store.dispatch("setGroupInfoFun",this.options[i].label);
            }
          }
          if(res.data.msg.emp.isAdmin){
            this.$store.commit('setAdmin','isAdmin');
          }
          if(res.data.msg.emp.username){
            this.$store.dispatch("setUserInfoFun",res.data.msg.emp.username);
          }
          localStorage.setItem("loginToken", token);
          this.$router.push('/display');
          this.$store.commit('setClientId',res.data.msg.emp.clientId)
          this.$store.commit('setGroupId',res.data.msg.emp.groupId)
          // console.log(this.$store.state.clientId)
          // console.log(this.$store.state.groupId)
        })
        .catch(err=>{
          console.log(err)
        })
      }else{
        this.$message.error('请选择企业')
      }

      // if(options){
      //   this.$router.push("/display")
      // }
    }
  },
  mounted(){
    this.axios.get('/crm/corporation/myGroup')
    .then(res=>{
      // console.log(res.data.msg)
      var _option=[];
      for(let i=0;i<res.data.msg.length;i++){
        var obj={};
        obj.value=res.data.msg[i].groupId;
        obj.label=res.data.msg[i].name;
        _option.push(obj);
      }
      this.options=_option;
      if(this.options.length==1){
        this.formData.value=this.options[0].value
        // this.submitForm(this.formData.value)
      }
      // console.log(this.options)
    })
  }
}
</script>

<style lang="scss" scoped>
  $gray:#bfbfbf;
  .choose{
    width:100%;height:100%;
    background-color: $gray;
    background: url("../assets/pageBg/loginBg.png") no-repeat center center;
    background-size: 100% 100%;
    position: fixed;
    left: 0;right:0;top:0;bottom:0;
    .form{
      width:280px;height:250px;
      position: fixed;
      left: 27%;top:33%;
      padding:20px 35px 20px 10px;
      text-align: center;
      h1{font-size: 1.15rem;margin-bottom: 2.6rem;}
      .el-select{width:100%;}
      .el-button{width:100%;}
      .reg{
        float:right;
        font-size: 13px;
        color:#C0C4CC;
        span{
          font-weight: 600;
          cursor: pointer;
        }
        span:hover{
          color:#409EFF;
          text-decoration: underline;
        }
      }
    }
    button {
      width: 100%;
      background-color: #282A55;
      border-color: #282A55;
      border-radius: 0;
    }
  }
  
</style>