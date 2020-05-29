<template>
  <div id="good">
    <div class="title clearfix">
      <span>商品列表</span>
       <router-link to="/goodadd">
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>
     <!-- search -->
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        商品信息：
        <el-input v-model="searchParams.keyword" placeholder="如名称、编码等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        销售状态：
        <el-select v-model="searchParams.isShow" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="在售" value="1"></el-option>
          <el-option label="已下架" value="0"></el-option>
        </el-select>
      </div> 
      <div class="searchbox">
        有无图片：
        <el-select v-model="searchParams.hasPic" :style="{width:'120px',height:'40px'}" >
          <el-option label="所有" value=""></el-option>
          <el-option label="有" value=true></el-option>
          <el-option label="无" value=false></el-option>
        </el-select>
      </div> 
      <div class="searchbox">
        有无价格：
        <el-select v-model="searchParams.hasPrice" :style="{width:'120px',height:'40px'}" >
          <el-option label="所有" value=""></el-option>
          <el-option label="有" value=true></el-option>
          <el-option label="无" value=false></el-option>
        </el-select>
      </div> 
      <br />
      <div class="searchbox">
        有无库存：
        <el-select v-model="searchParams.hasStore" :style="{width:'120px',height:'40px'}" >
          <el-option label="所有" value=""></el-option>
          <el-option label="有" value=true></el-option>
          <el-option label="无" value=false></el-option>
        </el-select>
      </div> 
      <div class="searchbox">
        有无净重：
        <el-select v-model="searchParams.hasWeight" :style="{width:'120px',height:'40px'}" >
          <el-option label="所有" value=""></el-option>
          <el-option label="有" value=true></el-option>
          <el-option label="无" value=false></el-option>
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
          <i class="el-icon-refresh-right" ></i>
          重置
        </el-button>
      </div>
      <div class="searchbox">
        <el-button @click="exportTemp">
          <i class="el-icon-download"></i>
          模板下载
        </el-button>
      </div>
      <div class="searchbox">
        <div>
          <el-upload
            :action="axios.defaults.baseURL +'/b2c/product/good/importdata?token=' + token"
            accept=".xlsx,.xls"
            :multiple='false'
            :limit='1'
            ref="upload"
            :show-file-list="false"
            :on-success='uploadSuccess'
            :on-error='uploadErr'
            :before-upload="beforeAvatarUpload"
            auto-upload>
            <!--  style="padding:12px 20px;background:#fdc52d;border:1px solid #fdc52d;" -->
            <el-button><i class="el-icon-document-add"></i>导入</el-button>
          </el-upload>
        </div>
      </div>
      
    </div>
    <el-table
      v-loading="loading"
      :data="dataList"
      border 
      stripe 
      style="width: 100%"
      >
      <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
      <el-table-column type="index" label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span>
        </template>
      </el-table-column> 
      <el-table-column prop="backImg" label="图片" width="100" align="center" >
          <template slot-scope="scope">
            <img v-if="scope.row.imgUrl" style="width:60px;height:60px;" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.imgUrl">
            <span v-else>无</span>
          </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="corpName" label="所属企业"></el-table-column>
      <el-table-column prop="goodClassName" label="商品分类">
        <!-- <template slot-scope="scope">
          <span v-if='scope.row.goodsClass==""'>{{scope.row.goodClassName}}</span>
          <span v-else>{{scope.row.goodsClass}}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="prodArea" label="产地"></el-table-column>
      <el-table-column prop="producer" label="厂家"></el-table-column>
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="weight" label="净重/g">
        <template slot-scope="scope">
          <span v-if="scope.row.weight">{{scope.row.weight*1000}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="库存"></el-table-column>
      <el-table-column prop="retailPrice" label="价格" width="60"></el-table-column>
      <el-table-column width="120" prop="isShow" label="销售状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isShow =='1' ? 'success':'danger' "
            disable-transitions
            @click="change(scope.row)"
            style="cursor: pointer;"
          >{{scope.row.isShow =='1' ? '在售':'已下架'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row,'basicInfo')" style="margin-right:13px;"><i class="el-icon-edit"></i>编辑</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link" style="color: #409EFF;">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item ><el-button type="text" @click="edit(scope.row,'imgInfo')"><i class="el-icon-picture-outline-round"></i>图片管理</el-button></el-dropdown-item>
              <el-dropdown-item ><el-button type="text" @click="change(scope.row)"><i class="el-icon-refresh"></i>上下架</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

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
    <!-- <el-button style="float:right;margin;margin:-28px 25px 0 0;" type="info" size="mini" @click="leading">导入</el-button> -->
    
  </div>
</template>

<script>
export default {
  name: "good",
  data() {
    return {
      searchParams:{
        redeemFlag:false,
        keyword:"",
        isShow:"",
        hasPic:'',
        hasStore:'',
        hasWeight:'',
        hasPrice:''
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: true,
      fileList:[],
      token: localStorage.getItem('loginToken')
    };
  },
  created(){
    // console.log('created11111')
    if(this.$route.query.pagesize){
      this.pagesize=Number(this.$route.query.pagesize);
      this.currentPage=Number(this.$route.query.currentPage);
    }
    this.getDataList();
  },
  mounted() {
    
  },
  activated(){
    // console.log('acticated222222222')
    if(this.$route.query.pagesize){
      this.pagesize=Number(this.$route.query.pagesize);
      this.currentPage=Number(this.$route.query.currentPage);
    }
    this.getDataList();
  },
  deactivated(){
    // console.log('deactivated33333333333')
    // this.$store.commit('setPagesize',this.pagesize);
    // this.$store.commit('setCurrentPage',this.currentPage);
    // console.log(this.$store.state.pagesize)
    // console.log(this.$store.state.currentPage)
  },
  methods: {
    exportTemp(){
      // console.log(1)
      window.open('http://health.alink365.cn/temp/goodInfoTemp.xlsx')
    },
     // 上传成功
    uploadSuccess (response, file, fileList) {
      // console.log('成功')
      // console.log(file)
      this.$message.success('文件上传成功');
      this.getDataList();
      //if (response.code === 0) {
        //this.row.materialUrl = response.bean
        //this.formTbale.push(this.row)       
      // }
    },
    // 上传失败
    uploadErr (err, file, fileList) {
      // console.log('失败')
      // console.log(file)
      this.$message.error('文件上传失败');
      //this.row.materialUrl = ''
    },
    // 上传之前 (类型检测)
    beforeAvatarUpload (file) {
      // console.log('上传之前检测')
      // console.log(file)
      /*
      let arr = [ `image/png`, `image/jpeg` ]
      let isType = arr.includes(file.type)
      if (!isType) openInfo('只能上传 jpg / png / jpeg 文件', 'w')
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) openInfo('只能上传5MB以内的图片', 'w')
      */
        let extension = file.name.substring(file.name.lastIndexOf('.')+1);
        // let size = file.size / 1024 / 1024;
        if(extension !== 'xlsx' && extension !== 'xls') {
          this.$message.warning('只能上传后缀是.xlsx/.xls的文件');
          return false
        }
        // if(size > 10) {
        //   this.$message.warning('文件大小不得超过10M');
        // }
      return true // isLt5M && isType
    },
    // 商品上下架
    change(row){
      // console.log(row)
      let params={
        id:row.id
      }
      if(row.isShow){
        this.$confirm('确定下架该产品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/b2c/product/good/not/show',params)
          .then(res=>{
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.getDataList();
            }else{
              this.$message.error('出错啦！请重试！')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }else{
        this.$confirm('确定上架该产品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/b2c/product/good/show',params)
          .then(res=>{
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.getDataList();
            }else{
              this.$message.error('出错啦！请重试！')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      }
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
    // 获取数据
    getDataList() {
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      // console.log(params)
      this.axios
        .get("/b2c/product/good/list",{params})
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
    edit(row,type){
      this.$router.push({
        name: 'goodadd',
        query: {
          id: row.id,
          title: "编辑商品",
          tabName: type,
          currentPage:this.currentPage,
          pagesize:this.pagesize
        }
      })
    },
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.searchParams.isshow = "";
      this.searchParams.hasPic = "";
      this.searchParams.hasStore = "";
      this.searchParams.hasWeight = "";
      this.searchParams.hasPrice = "";
      this.getDataList();
    }
  }
};
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
.el-dropdown-link {
  cursor: pointer;
  
}
.searchbox{
  font-size: 14px;
}
</style>



