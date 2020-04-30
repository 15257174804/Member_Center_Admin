<template>
  <div class="integralset">
    <div class="title clearfix">
      <span>积分设置</span>
    </div>
    <div class="tip">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" >
        <!-- 输入预约活动名称 -->
        <!-- <el-form-item label="消费1元获取多少积分" prop="scoreRate">
          <el-input v-model="ruleForm.scoreRate" placeholder="消费1元获取多少积分"></el-input>
        </el-form-item> -->
        <el-form-item label="兑换比例" prop="scoreRate">
          <span style="color:#606266;">消费 <input type="number" v-model="ruleForm.scoreRate">元，获取1个积分</span>
        </el-form-item>
        <!-- 预约方式控制个人和企业的预约数量的显示隐藏 -->
        <el-form-item label="小数舍入方式" prop="roundType">
          <el-select v-model="ruleForm.roundType" placeholder="请选择">
            <el-option label="舍去小数点" value="1"></el-option>
            <el-option label="进位" value="2"></el-option>
            <el-option label="四舍五入" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- <span>{{ruleForm.roundType}}</span> -->
        <!--策略描述 -->
        <el-form-item label="备注" prop="strategyName">
          <el-input v-model="ruleForm.strategyName" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-switch active-color="#13ce66" v-model="ruleForm.isValid"></el-switch>
        </el-form-item>
        <el-form-item  style="margin:20px 0 20px 0;">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="reset('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'integralset',
  data(){
    return {
      
      ruleForm:{
        scoreRate:'',
        roundType:'',
        strategyName:'',
        isValid:true
      },
      rules:{
        scoreRate: [
          { required: true, message: '请输入积分比列', trigger: 'blur' }
        ],
        roundType: [
          { required: true, message: '请选择小数点舍入方式', trigger: 'change' }
        ],
        isValid:[
          { required: true, message: '请选择是否可用', trigger: 'change'}
        ]
      },
    }
  },
  methods:{
    reset(formName){
      this.$refs[formName].resetFields();
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          let params=JSON.parse(JSON.stringify(this.ruleForm));
          if(params.roundType=="舍去小数点"){
            params.roundType=1
          }else if(params.roundType=="进位"){
            params.roundType=2
          }else if(params.roundType=="四舍五入"){
            params.roundType=3
          }
          this.axios.post('/crm/scoreStrategy/save',params)
          .then(res => {
            // console.log('这是积分策略保存')
            // console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
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
      this.axios.get('/crm/scoreStrategy/list',{})
      .then(res=>{
        // console.log('获取页面数据')
        // console.log(res.data)
        if(res.data.msg.datas.length==0){
          return
        }else{
          this.ruleForm=res.data.msg.datas[0];
          if(this.ruleForm.roundType==1){
            this.ruleForm.roundType="舍去小数点"
          }else if(this.ruleForm.roundType==2){
            this.ruleForm.roundType="进位"
          }else{
            this.ruleForm.roundType="四舍五入"
          }
        }
      })
    }
  },
  mounted(){
    this.getData();
  }
}
</script>

<style>
.tip{
  margin-top:50px;
}
input{
  padding-left:15px;
  border:1px solid #DCDFE6;
  width:66px;
  border-radius: 3px;
}
</style>