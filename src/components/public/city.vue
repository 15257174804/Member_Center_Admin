<template>
  <el-form ref="form" :rules="rules" :model="addrData" label-width="80px">
    <el-row justify="start">
      <el-col :span='8'>
        <el-form-item label="省" prop="province">
          <el-select v-model="addrData.province" placeholder="请选择" class="address_select" @change="getcity(addrData.province,true)" >
            <el-option v-for="item in sheng" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span='8'>
        <el-form-item label="市" prop="city">
          <el-select v-model="addrData.city" placeholder="请选择" class="address_select" @change="getCounty(addrData.city,true)">
            <el-option v-for="item in shi" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span='8'>
        <el-form-item label="区" prop="county">
          <el-select v-model="addrData.county" placeholder="请选择" class="address_select" @change="postData()">
            <el-option v-for="item in qu" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form> 
  <!-- <el-form-item label="省" :label-width="'80px'">
    <el-select v-model="addrData.province" placeholder="请选择省" class="address_select" @change="getcity(addrData.province,true)" >
      <el-option v-for="item in sheng" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="addrData.city" placeholder="请选择市" class="address_select" @change="getarea(addrData.city,true)">
      <el-option v-for="item in shi" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="addrData.area" placeholder="请选择区" class="address_select" @change="postData()">
      <el-option v-for="item in qu" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item> -->
</template>
<script>

export default {
  name: "city",
  data() {
    return {
      sheng: [],
      shi: [],
      qu: [],
      rules: {
        province:[
          { required: true, message: '请选择省', trigger: 'change' }
        ],
        city:[
          { required: true, message: '请选择市', trigger: 'change' }
        ],
        county:[
          { required: true, message: '请选择区', trigger: 'change' }
        ]
      }
    };
  },
  props: ["addrData"],//从父组件接受的数据
  methods: {
    // 获取省
    getsheng() {
      let params = {
          level: 1,
          superiorId: 100000,
          pageSize: 40
        };
        this.axios
        .get("/crm/region/list", {params})
        .then(res => {
            if (res.data.code > 0) {//请求成功
            this.sheng = res.data.msg.datas;//将获取的数据赋值
          } 
        })
        .catch(err => {
            ;
        });
    },
    // 点击地区获取市
    getcity(id, is) {
      if (is) {
        //判断是否点击上一级
        this.addrData.county = "";
        this.addrData.city = "";
      }
      let params = {
          level: 2,
          superiorId: id,
          pageSize: 40
        };
        this.axios
        .get("/crm/region/list", {params})
        .then(res => {
            if (res.data.code > 0) {//请求成功
            this.shi = res.data.msg.datas;//将获取的数据赋值
          } 
        })
        .catch(err => {
            ;
        });
        this.postData();
    },
    // 点击城市获取区
    getCounty(id, is) {
      var _this = this;
      if (is) {
        //判断是否点击上一级
        this.addrData.county = "";
      }
      let params = {
          level: 3,
          superiorId: id,
          pageSize: 40
        };
        this.axios
        .get("/crm/region/list", {params})
        .then(res => {
            if (res.data.code > 0) {//请求成功
            this.qu = res.data.msg.datas;//将获取的数据赋值
            this.postData();
          } 
        })
        .catch(err => {
            ;
        });
    },
    // 向父组件传值
    postData() {
      let _this = this;
      let sheng = this.sheng;
      let shi = this.shi;
      let qu = this.qu;
     
      setTimeout(function() {
        _this.$emit("addrData", _this.addrData);
      }, 10);
    }
  },
  mounted() {
    this.getsheng();
  },
  watch: {
    //监听父组件传值的变化
    addrData: {
      handler: function(val, oldval) {
        this.getcity(val.province, false);
        this.getCounty(val.city, false);
      },
      immediate: true, //关键
      deep: true
    }
  }
};
</script>


