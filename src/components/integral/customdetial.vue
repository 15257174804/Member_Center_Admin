<template>
  <div class="customdetial">
    <div class="title clearfix">
      <span>会员详情</span>
      <span v-if="form.baseInfo.username"><span style="color:#4B9BF7"> | </span>{{form.baseInfo.username}}</span>
      <!-- <el-button type="primary" @click="onSubmit('form')">保存信息</el-button> -->
    </div>
    <!-- 主体表单内容 -->
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" input-width="200px">
      <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInfo">

          <el-form-item class="half-form" label="用户名" prop="username">
            <el-input v-model="form.baseInfo.username" placeholder="请输入用户名" disabled></el-input>
          </el-form-item>

          <el-form-item class="half-form" label="手机号码" prop="mobilephone">
            <el-input v-model="form.baseInfo.mobilephone" placeholder="请输入手机号" disabled></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="身份证号" prop="idCard">
            <el-input v-model="form.baseInfo.idCard" placeholder="请输入身份证号" disabled></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="年龄" prop="age">
            <el-input v-model="form.baseInfo.age" placeholder="请输入年龄" disabled></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="生日"  prop='birthday'>
            <el-date-picker
              disabled
              v-model="form.baseInfo.birthday"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择出生日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="half-form" label="性别" prop="sex">
            <el-radio-group v-model="form.baseInfo.sex" disabled>
              <el-radio label='1'>男</el-radio>
              <el-radio label='0'>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="half-form" label="会员卡号">
            <el-input v-model="form.cardNo" placeholder="请输入会员卡号" disabled></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="积分总数">
            <el-input v-model="form.score" placeholder="请输入积分总数" disabled></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="是否启用">
            <el-switch active-color="#13ce66" v-model="form.baseInfo.isValid" disabled></el-switch>
          </el-form-item>
          <el-form-item class="half-form" label="积分余额">
            <el-input v-model="form.scoreBalance" placeholder="请输入积分余额" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item class="half-form" label="会员标签">
            <el-button type="text" @click="addLabel"><i class="el-icon-plus"></i>添加</el-button>
            <br/>
            <el-tag>标签一</el-tag>
          </el-form-item> -->
        </el-tab-pane>
        <el-tab-pane label="积分明细" name="assistInfo">
          <el-table
            :data="details"
            border
            style="width: 98%">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="operTime" label="消费时间"></el-table-column>
            <el-table-column prop="score" label="积分"></el-table-column>
            <el-table-column prop="recordType" label="积分类型"></el-table-column>
            <el-table-column prop="memo" label="备注" ></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="curP"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalCount"
          ></el-pagination>

        </el-tab-pane>
      </el-tabs>
    </el-form>

  </div>
</template>

<script>
export default {
  name:'customdetial',
  data(){
    return {
      
      tabName: 'basicInfo',//默认选项卡
      details:[],  //积分明细
      curP:1,
      pageSize:10,
      totalCount:0,
      form:{
        id:'',
        baseInfo:{
          username:'',
          mobilephone:'',
          idCard:'',
          age:'',
          birthday:'',
          sex:'1',
          isValid:true
        },
        cardNo:'',
        score:'',
        scoreBalance:''
      },
      rules: {
        // username:[
        //   { required: true, message: '请输入用户名', trigger: 'blur' }
        // ]
      }
    }
  },
  methods:{
    //tab切换
    handleClick(tab, event) {
    },
    // 第几页
    handleCurrentChange(curP) {
      this.curP = curP;
      this.getScore(this.form.id);
    },
    onSubmit(form){
      // console.log('保存')
      this.$refs[form].validate((valid) =>{
        if (valid){
          this.$confirm('是否提交保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.axios.post('/crm/custom/update',this.form)
            .then(res=>{
              // console.log(res.data)
              if(res.data.code>0){
                this.$message({
                  type: 'success',
                  message: res.data.msg
                });
                this.$router.push('/customlist')
              }else{
                this.$message.error(res.data.msg);
              }
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });          
          });
        }else {
          this.$message.error('请完善内容后提交保存!');
          return false;
        }
      })
    },
    getDetailData(id){
      let params={
        id:id
      }
      this.axios.get('/crm/custom/detail',{params})
      .then(res=>{
        // console.log('加载页面数据')
        // console.log(res.data)
        this.form=res.data.msg;
        this.form.baseInfo.sex=this.form.baseInfo.sex.toString();
      })
    },
    //获取积分明细
    getScore(id){
      let params={
        customId:id,
      }
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios.get('/crm/scoreRecord/list',{params})
      .then(res=>{
        console.log('积分列表')
        console.log(res.data)
        this.details=res.data.msg.datas;
        for(var i=0;i<this.details.length;i++){
          if(this.details[i].recordType==1){
            this.details[i].recordType='获得积分'
          }else{
            this.details[i].recordType='消费积分'
          }
        }
        this.totalCount=res.data.msg.totalCount;
      })
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.form.id = this.$route.query.id;
      // this.title = this.$route.query.title;
      this.getDetailData(this.form.id);
      this.getScore(this.form.id);
    }
  }
}
</script>

<style>

</style>