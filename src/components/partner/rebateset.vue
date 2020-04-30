<template>
  <div class="rebateset">
    <div class="title clearfix">
      <span>返利设置</span>
        <!-- <el-button type="success" @click="set">
          <i class="el-icon-circle-plus-outline"></i>
          按分类设置返利
        </el-button> -->
    </div>

    <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        商品信息：
        <el-input v-model="searchParams.keyword" placeholder="如名称、编码等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        已设置的返利商品：
        <el-select v-model="searchParams.isRebate" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="返利商品" value=true></el-option>
        </el-select>
      </div> 
      <!-- 按钮 -->
      <div class="searchbox">
        <el-button type="primary" @click="search()">
          <i class="el-icon-zoom-in"></i>
          查询
        </el-button>
      </div>
      <div class="searchbox">
        <el-button @click="reset()">
          <i class="el-icon-refresh-right"></i>
          重置
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="dataList"
      border 
      stripe
      style="width: 100%"
      >
      <el-table-column prop="goodCode" label="商品编号" width="100"></el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="goodsClass" label="商品分类"></el-table-column>
      <el-table-column prop="producer" label="厂家"></el-table-column> 
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="retailPrice" label="价格"></el-table-column>
      <el-table-column width="120" prop="isShow" label="销售状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isShow =='1' ? 'success':'danger' "
            disable-transitions
          >{{scope.row.isShow =='1' ? '在售':'已下架'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="rebateRate" label="返利比例"></el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>

    <!-- 返利的弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="150px">
        <!-- <div :class="title=='按商品分类设置返利'?'':'isShow'">
          <el-form-item label="商品分类">
            <el-select v-model="form.fenlei" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </div> -->
        <!-- <el-form-item label="设置方式" :label-width="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="金额" value="price"></el-option>
            <el-option label="百分比" value="percent"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="金额" prop="price">
          <el-input :disabled="form.type=='percent'" v-model="form.price"></el-input>
        </el-form-item> -->
        <el-form-item label="百分比(区间0~1)" prop="rebateRate">
          <el-input v-model="form.rebateRate" type="number"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'rebateset',
  data(){
    var validatePass = (rule, value, callback) => {
      // console.log(this.searchParams.endTime)
      if(!value){
        callback(new Error('请输入返利比例'))
      }else{
        let reg=/^[0,1].\d{1,2}$/;
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error("请输入0~1之间的小数"))
        }
      }
      
    };
    return {
      searchParams:{
        redeemFlag:false,
        isRebate:'',
        keyword:""
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true,
      dialogFormVisible:false,
      title:'商品返利设置',
      form:{
        id:'',
        rebateRate:0
      },
      rules: {
          rebateRate:[
            { validator: validatePass, trigger: 'blur' },
            // { min: 2, max: 8, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
    }
  },
  methods:{
    set(){
      this.title="按商品分类设置返利";
      this.dialogFormVisible=true;
      let obj={}
      // 等后续有商品分类了再完善
    },
    edit(row){
      // console.log(row)
      this.dialogFormVisible=true;
      this.form.id=row.id;
      this.form.rebateRate=row.rebateRate;
      this.title='商品返利设置';
    },
    save(){
      this.dialogFormVisible=false;
      if(this.form.rebateRate==''){
        this.form.rebateRate=0;
      }
      let params=this.form;
      
      this.axios.post('/b2c/product/good/save',params)
      .then(res=>{
        // console.log('设置保存')
        // console.log(res.data)
        if(res.data.code > 0){
          this.$message({
            type: 'success',
            message: '设置成功'
          });
        }else{
          this.$message.error(res.data.msg);
        }
        this.getDataList();
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取数据
    getDataList() {
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios
        .get("b2c/product/good/list",{params})
        .then(res => {
          // console.log(res.data)
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            this.dataList = res.data.msg.datas;
            this.totalCount = res.data.msg.totalCount;
          }
        })
        .catch(err => {
           console.log(err);
        });
    },
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.searchParams.isshow = "";
      this.getDataList();
    },
    // 每页展示多少条数据
    tableRowClassName({row, rowIndex}) {
      if (rowIndex == 0){
        return '';
      }
      else if (rowIndex % 3 == 0) {
        return 'success-row';
      }
      else if (rowIndex % 2 == 0){
        return '';
      } 
      else if (rowIndex % 1 == 0){
        return 'warning-row';
      }
      return '';
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getDataList();
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
  },
  mounted(){
    this.getDataList();
  }
}
</script>

<style>
.isShow{
  display: none;
}
.searchbox{
  font-size: 14px;
}
</style>