<template>
  <div id="employeeadd">
    <div class="title clearfix">
      <span>{{title}}</span>
      <span v-if="form.username"><span style="color:#4B9BF7"> | </span>{{form.username}}</span>
      <el-button type="primary" @click="onSubmit('form')">保存信息</el-button>
    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" input-width="200px">
      <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInfo">
          <el-form-item class="half-form" label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <!-- ********************************角色维护**************************************************************************** -->
          <!-- <el-form-item class="half-form" label="角色" prop="roleName">
            <el-select v-model="form.roles" placeholder="请选择角色">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="half-form" label="手机号码" prop="mobilephone">
            <el-input v-model="form.mobilephone" :disabled="form.id != ''" placeholder="请输入手机号"></el-input>
          </el-form-item>

          <!-- 所属企业可修改 -->
          <el-form-item  class="half-form" label="所属企业" prop="orgId">
            <el-select v-model="form.orgId" placeholder="请选择所属企业" filterable>
              <el-option v-for="(item,i) in companyDataList" :key="i" :label="item.name" :value="item.id"></el-option> 
            </el-select>
          </el-form-item>
          <!-- 所属企业不可修改 -->
          <!-- <div>
            <el-form-item v-if="form.id==''" class="half-form" label="所属企业" prop="orgId">
              <el-select v-model="form.orgId" placeholder="请选择所属企业" filterable>
                <el-option v-for="item in companyDataList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
              </el-select>
            </el-form-item>
            <el-form-item v-else class="half-form" label="所属企业" prop="orgId">
              <el-input v-model="form.orgName" :disabled="form.id != ''"></el-input>
            </el-form-item>
          </div> -->
          <!-- 111111111111111暂不设置1111111111111111111111111111111111111111111111111111111 -->
          <!-- <el-form-item class="half-form" label="权限设置" prop="menu">
            <el-input v-model="form.menu" placeholder="暂不可设置" disabled></el-input>
          </el-form-item> -->

          <el-form-item class="half-form" label="企业工号" prop="workNo">
            <el-input v-model="form.workNo" placeholder="请输入企业工号" :disabled="form.id != ''"></el-input>
          </el-form-item>
           <el-form-item class="half-form" label="入职日期">
            <el-col>
              <el-date-picker type="date" placeholder="选择入职日期" v-model="form.enterDate" :picker-options='pickerOptions'></el-date-picker>
            </el-col>
          </el-form-item>
          <!-- <el-form-item class="half-form" label="所属企业类型">
            <el-select v-model="form.corpType" placeholder="所属企业类型" @change="changeCompanyType($event)">
              <el-option v-for="item in companyTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
            </el-select>
          </el-form-item> -->
          <el-form-item class="half-form" label="是否管理员">
            <el-switch v-model="form.isAdmin"></el-switch>
          </el-form-item>
          <el-form-item class="half-form" label="是否启用">
            <el-switch active-color="#13ce66" v-model="form.isValid"></el-switch>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="辅助信息" name="assistInfo">
          <!-- <el-form-item class="half-form" label="性别">
            <el-select v-model="form.sex">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="half-form" label="身份证号">
            <el-input v-model="form.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="民族">
            <el-input v-model="form.nation" placeholder="请输入民族"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="籍贯">
            <el-input v-model="form.nativePlace" placeholder="请输入籍贯"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="生日">
            <el-col>
              <el-date-picker type="date" placeholder="选择生日" v-model="form.birthday" :picker-options='pickerOptions'></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item class="half-form" label="学历">
            <el-select v-model="form.education">
              <el-option label="无" value="无"></el-option>
              <el-option label="小学" value="小学"></el-option>
              <el-option label="初中" value="初中"></el-option>
              <el-option label="高中" value="高中"></el-option>
              <el-option label="中专" value="中专"></el-option>
              <el-option label="职校" value="职校"></el-option>
              <el-option label="专科" value="专科"></el-option>
              <el-option label="本科" value="本科"></el-option>
              <el-option label="研究生" value="研究生"></el-option>
              <el-option label="硕士" value="硕士"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="half-form" label="毕业院校">
            <el-input v-model="form.school" placeholder="请输入毕业院校"></el-input>
          </el-form-item>
           <el-form-item class="half-form" label="专业信息">
            <el-input v-model="form.subject" placeholder="请输入专业信息"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="爱好">
            <el-input v-model="form.speciality" placeholder="请输入爱好"></el-input>
          </el-form-item>
           <el-form-item class="half-form" label="联系电话">
            <el-input v-model="form.linkCall" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="宅电">
            <el-input v-model="form.homePhone" placeholder="请输入固定电话"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="详细地址" prop="address">
            <el-input type="textarea" v-model="form.address" style="width: 300px" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item class="half-form" label="备注" prop="address">
            <el-input type="textarea" v-model="form.note" style="width: 300px" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "employeeadd",
    data() {
      var checkPhone = (rule, value, callback) => {
        const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
        if (!value) {
          return callback(new Error('电话号码不能为空'))
        }
        setTimeout(() => {
          // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
          // 所以我就在前面加了一个+实现隐式转换
          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
          }
        }, 100)
      }
      return {
        title:"新建员工",
        tabName: 'basicInfo',//默认选项卡
        companyTypeList:[],//企业类型
        companyDataList:[],//企业列表
        form:{
          id:"",
          address: "",//雇员地址
          password:"",//密码
          birthday: "",//生日
          idCard: "",//身份证号
          isValid: true,
          linkCall: "",//联系电话
          mobilephone: "",//手机号
          note: "",//备注
          sex: "",//性别
          username: "",//用户名
          clientId: "",//门店id
          corpId: "",//连锁id
          education: "",//学历
          empType: 1,//雇员类型
          enterDate: "",//入职日期
          groupId: "",//集团id
          orgId:'',  
          orgName:'',
          groupName:'',
          homePhone: "",//宅电
          isAdmin: true,//是否管理员
          nation: "",//民族
          nativePlace: "",//籍贯
          position: 1,//职位
          school: "",//毕业院校
          speciality: "",//爱好
          stationLevel: 1,//职称
          subject: "",//专业信息
          workNo:"",//工号
          roles:''
        },
        rules: {
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            // { min: 2, max: 8, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          mobilephone:[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: checkPhone, trigger: 'blur' }
          ],
          groupId:[
            { required: true, message: '请选择所属企业', trigger: 'blur' },
          ],
          workNo:[
            { required: true, message: '请输入工号', trigger: 'blur' },
          ],
        },
        options:[],
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() > Date.now();
         }
        },
      }
    },
    mounted(){
        // 路由参数
        if(this.$route.query.id){
          this.form.id = this.$route.query.id;
          this.title = this.$route.query.title;
          this.getDetailData(this.form.id);
        }
        // console.log(this.form)
        this.getCompanyTypeList();
        this.getCompanyDataList();
        this.getRole();
    },
    methods: {
      getRole(){
        this.axios.get('/crm/roles',{})
        .then(res=>{
          this.options=res.data.msg.datas;
        })
      },
      getDetailData(id){
        let params = {id: id}
        this.axios
          .get("/crm/emp/detail", {params})
          .then(res => {
            // console.log('查看详细信息')
            // console.log(res.data)
            if(res.data.code > 0){
              this.form = res.data.msg;
              this.form.roles=res.data.msg.role[0].id;
            }
          })
          .catch(err => {
          });
      },
      //tab切换
      handleClick(tab, event) {
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
      getCompanyDataList(level) {
        var params = {
          level: level,
          pageindex: 1,
          pagesize: 200
        }
        this.axios
          .get("/crm/corporation/list", {params})
          .then(res => {
            for(var i=0;i<res.data.msg.datas.length;i++){
              var obj={};
              obj.id=res.data.msg.datas[i].id;
              obj.name=res.data.msg.datas[i].name;
              this.companyDataList.push(obj);
              if(obj.name==this.form.lastOrgName){
                this.form.orgId=obj.id
              }
              // console.log(this.form.orgId)
            }
            // console.log('查看所属企业信息')
            // console.log(this.companyDataList)
          })
          .catch(err => {
          });
      },
      changeCompanyType(i){
        // console.log(i);
          this.form.corpId = "";
          this.getCompanyDataList(this.companyTypeList[i-1].superiorLevel)
      },
      onSubmit(formName) {
        // console.log(this.form)
        let typeName = this.form.id?'update':'regist';
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //保存
              this.axios
              .post("/crm/emp/" + typeName, this.form)
              .then(res => {
                // console.log(res.data)
                if(res.data.code > 0){
                  let params={
                    roleName:this.form.roleName,
                    roleDesc:this.form.roleDesc
                  }
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });
                  this.$router.push('/employee')

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

    }
  }
</script>


<style scoped>
tr,
th,
td {
  color: #303133;
}
.blank {
  background: rgb(240, 243, 244);
  width: 100%;
  height: 50px;
}
</style>



