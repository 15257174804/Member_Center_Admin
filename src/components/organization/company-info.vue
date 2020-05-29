<template>
  <div id="companyadd">
    <div class="title clearfix">
      <span>{{title}}</span>
      <span v-if="form.name"><span style="color:#4B9BF7"> | </span>{{form.name}}</span>
      <el-button type="primary" @click="onSubmit()" style='position:fixed;z-index:1000;right:5px;top:100px;'>保存信息</el-button>
      <!-- <el-button>取消</el-button> -->
    </div>
    <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="basicInfo">
        <basic v-if="flag" :form="form" :title="title" ref="getlogo"></basic>
      </el-tab-pane>
      <el-tab-pane label="经营范围" name="busiInfo">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleBusiScopeAllChange" border>全选</el-checkbox>
        <el-checkbox-group v-model="busiScopeCheckList" @change="handleCheckedBusiScopeChange">
          <el-checkbox v-for="(v,i) in busiScopeList" :label="v.id" :key="i" border>{{v.name}}</el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
      <el-tab-pane label="证照管理" name="cardInfo">
        <!-- <el-button @click="addLicense()">添加证照</el-button> -->
        <span v-if='innerMsg' style='color:#f56c6c;font-size:14px;'>*经营许可证信息为必填</span>
        <div class="license-group clearfix" v-for="(v,i) in licenses" :key="i">
          <div @click="getImageTypeIndex(i)" class="img-box">
            <el-upload
              class="avatar-uploader"
              :action="axios.defaults.baseURL + '/b2c/product/good/picture/imgupload?token=' + token"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              >
              <img v-if="v.picture" :src="axios.defaults.baseURL + '/crm/image/' + v.picture" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="info-box">
            <el-form ref="form" :rules="rules" :model="v" label-width="80px" size="mini">
              <el-form-item label="证照类型">
                 <el-input v-model="v.typeName" placeholder="可输入许可证或经营许可证" disabled></el-input>
              </el-form-item>
              <el-form-item label="证照号码">
                <el-input v-model="v.memo" placeholder="请输入证件号码"></el-input>
              </el-form-item>
              <el-form-item label="生效日期" prop="startTime">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="请选择生效日期" v-model="v.startTime"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="截止日期" prop="validDate">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="请选择截止日期" v-model="v.validDate"></el-date-picker>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  
  import basic from "./company-add-basic";

  export default {
    components: { basic },
    name: "companyadd",
    data() {
      var checkStareTime = (rule, value, callback) => {
        if(!value){
          return callback(new Error('开始日期不能为空'));
        }else{
          this.tempTime=value;
          callback();
        }
      };
      var checkValidDate = (rule, value, callback) => {
        if(!value){
          return callback(new Error('截止日期不能为空'));
        }
        if (Date.parse(value)<Date.parse(this.tempTime)) {
          return callback(new Error('截止日期不能早于开始日期'));
        }else{
          callback();
        }
      };
      return {
        innerMsg:false,
        tempTime:'',
        title: "新建企业",
        checkAll: false,
        tabName: 'basicInfo',//默认选项卡
        busiScopeList:[],//经营范围列表
        busiScopeListIds:[],
        licenseTypeList:[],
        isIndeterminate:true,
        busiScopeCheckList:[],
        licenses:[
          {
            type:'1',
            picture:'',
            typeName:'经营许可证',
            memo:'',
            startTime:"",
            validDate:'',
            whetherMust:true
          },
          {
            type:'2',
            picture:'',
            typeName:'许可证',
            memo:'',
            startTime:"",
            validDate:'',
            whetherMust:false
          },
        ],
        form: {
          id:'',
          name: '',
          code: '',
          abbreviation: '',
          corpId:"",
          // spellingcode: 'ccxdyyf',
          type: '',
          lawMan: '',
          linkman: '',
          contactNumber: '',
          province: '',
          city: '',
          county: '',
          address: '',
          parentId: '',
          licenses:[],
          businessScope:[],
          scopeConfigIdsStr:'',
          level:'',
          realLevel:'',
          logo:''
        },
        rules: {
          startTime:[
            { validator: checkStareTime, trigger: 'change' }
          ],
          validDate:[
            { validator: checkValidDate, trigger: 'change' }
          ],
          memo:[
            { required: true,message: '证件号码不能为空', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        uploadDisabled: false,
        token: localStorage.getItem('loginToken'),
        uploadImageIndex:"",//当前上传图片的索引
        flag:false,
        companyDataList:''
      }

    },
    created() {
      // 路由参数
      if(this.$route.query.id){
        this.form.id = this.$route.query.id;
        this.title = this.$route.query.title;
        this.tabName = this.$route.query.tabName;
        this.getDetailData(this.form.id);
      }else{
        this.flag=true
      }
      this.getBusinessScopeList();//获取所有经营范围类型
    },
    methods: {
      //获取企业信息
      getDetailData(id){
        let params = {id: id}
        this.axios
          .get("/crm/corporation/back/findOne", {params})
          .then(res => {
            // console.log('获取单个企业信息')
            // console.log(res.data)
            this.form = res.data.msg[0];
            if(this.form.province==0){
              this.form.province='';
              this.form.city='';
              this.form.county='';
            }
            // console.log(this.form)
            this.busiScopeCheckList = _.pluck(this.form.businessScope, 'id');//初始化经营范围
            this.getCorpLicenses(this.form.id);
            this.flag=true;
          })
          .catch(err => {
          });
      },
      //获取平台所有经营范围和证照
      getBusinessScopeList() {
        this.axios
          .get("/crm/baseBusinessScopeConfig/list", {})
          .then(res => {
            this.busiScopeList = res.data.msg.datas;
            this.busiScopeListIds = _.pluck(this.busiScopeList, 'id');//所有经营范围id
          })
          .catch(err => {
          });
      },
      getLicenseType() {
        this.axios
          .get("/crm/licenseType/list", {})
          .then(res => {
            // console.log('查询企业证照类型')
            // console.log(res.data)
            this.licenseTypeList = res.data.msg.datas;
            // this.form.licenses = []?this.licenseTypeList:[];
          })
          .catch(err => {
          });
      },
      // 选择图片
      handleAvatarSuccess(response, file, fileList){
        this.licenses[this.uploadImageIndex].picture = response.msg.title;
        // console.log(this.form.licenses);
      },
      getImageTypeIndex(i) {
        this.uploadImageIndex = i;
      },
      //经营范围全选操作
      handleBusiScopeAllChange(val) {
        this.busiScopeCheckList = val ? this.busiScopeListIds : [];
        this.isIndeterminate = false;
        this.form.scopeConfigIdsStr = this.busiScopeCheckList.join(";");
      },
      //经营范围选择
      handleCheckedBusiScopeChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.busiScopeListIds.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.busiScopeListIds.length;
        this.form.businessScope = value;
        this.form.scopeConfigIdsStr = value.join(";");
      },
      //tab切换
      handleClick(tab, event) {
      },
      //添加证照
      addLicense(){
        var obj = {
          'corpId':'',
          "type":"",
          "startTime":'',
          "validDate":"",
          "memo":"",
          "picture": ""
        }
        if(this.form.id!=''){
          obj['corpId']=this.form.id
        }
        this.licenses.push(obj);
      },
      //获得当前企业证照列表
      getCorpLicenses(corpId) {
        let params = {
          corpId:corpId
        };
        this.axios
          .get("/crm/corporationLicense/list", {params})
          .then(res => {
            // console.log('获得当前企业证照列表')
            // console.log(res.data.msg.datas)
            this.licenses = res.data.msg.datas
          })
          .catch(err => {
            console.log(err);
          });
      },
      //保存
      onSubmit() {
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
            this.$confirm('是否提交保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              
              for(var i=0;i<this.licenses.length;i++){
                if(this.licenses[i].whetherMust){
                  if(this.licenses[i].memo=='' || this.licenses[i].startTime=='' || this.licenses[i].validDate==''){
                    this.$message.error('请完善营业执照信息')
                    this.tabName='cardInfo';
                    this.innerMsg=true;
                    return
                  }
                }
              }
              this.form.licenses = this.licenses;
              this.form.logo=this.$refs.getlogo.fileName;
              //保存
              this.axios
              .post("/crm/corporation/create", this.form)
              .then(res => {
                // console.log(res.data)
                if(res.data.code > 0){
                  this.$message({
                    type: 'success',
                    message: '提交保存成功'
                  });
                  this.$router.push('/company')
                }else{
                  this.$message.error('请完善内容后提交保存!');
                }
              })
              .catch(err => {
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });          
            });
        //   } else {
        //     this.$message.error('请完善内容后提交保存!');
        //     return false;
        //   }
        // });
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
.el-checkbox__label{
  font-size: 20px;
}
.el-checkbox{
  margin-bottom : 30px;
}

/* el-upload */

.license-group{width: 80%;border: 1px solid #DCDFE6;border-radius: 4px;padding: 1rem;margin-top: 1rem}
.license-group .img-box{width: 30%;float: left;}
.license-group .info-box{width: 50%;float: left;}


</style>



