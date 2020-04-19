<template>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width:90%;">
      <el-form-item class="half-form" label="企业名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item class="half-form" label="企业类型" prop="type" @change="getParentCompany(addrData.city,true)">
        <el-select v-model="form.type" placeholder="请选择企业类型">
          <el-option v-for="item in companyTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
        </el-select>
        <!-- <company-type :companyType="form.type"></company-type> -->
      </el-form-item>
      <el-form-item class="half-form" label="企业编码">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item class="half-form" label="简称">
        <el-input v-model="form.abbreviation"></el-input>
      </el-form-item>
      <el-form-item class="half-form" label="拼音码">
        <el-input v-model="form.spellingcode"></el-input>
      </el-form-item>
      <el-form-item class="half-form" label="法人代表" prop="lawMan">
        <el-input v-model="form.lawMan"></el-input>
      </el-form-item>
      <el-form-item class="half-form" label="联系人">
        <el-input v-model="form.linkman"></el-input>
      </el-form-item>
      <el-form-item class="half-form" label="联系方式">
        <el-input v-model="form.contactNumber"></el-input>
      </el-form-item>
      <city @addrData="getCity" :addrData="form"></city>  
      <el-form-item class="half-form" label="详细地址" prop="address">
        <el-input type="textarea" v-model="form.address" style="width: 300px"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item> -->
    </el-form> 
</template>
<script>
import city from "../public/city";
import companyType from "../public/company-type";
export default {
  components: { city,companyType },
  name: "basic",
  data() {
    return {
      companyTypeList:[],//企业类型
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        type:[
          { required: true, message: '请选择企业类型', trigger: 'blur' }
        ],
        lawMan:[
          { required: true, message: '请输入企业法人信息', trigger: 'blur' }
        ],
        address:[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    };
  },
  props: ["form"],//从父组件接受的数据
  mounted() {
    this.getCity(this.form);
    this.getCompanyList();
  },
  methods: {
    // 从子组件获取省市区
    getCity(data) {
      this.province = data.province;
      this.city = data.city;
      this.area = data.area;
    },
    getCompanyList() {
      this.axios
        .get("/crm/corporationType/list", {})
        .then(res => {
          this.companyTypeList = res.data.msg.datas;
        })
        .catch(err => {
        });
    },
  }
};
</script>

