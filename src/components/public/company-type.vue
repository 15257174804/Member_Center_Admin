<template>
    <el-select v-model="companyType" placeholder="请选择企业类型">
        <el-option v-for="item in companyTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option> 
    </el-select>
</template>    

<script>

export default {
  name: "companyType",
  data() {
    return {
      companyTypeList: [],
    };
  },
  props: ["companyType"],//从父组件接受的数据
  methods: {
    getCompanyList() {
      this.axios
        .get("/crm/corporationType/list", {})
        .then(res => {
          this.companyTypeList = res.data.msg.datas;
        })
        .catch(err => {
            console.log(err);
        });
    },
    // 向父组件传值
    postData() {
      setTimeout(function() {
        this.$emit("companyType", this.companyType);
      }, 10);
    }
  },
  mounted() {
    console.log(this.companyType)
    this.getCompanyList();
  }
};
</script>


