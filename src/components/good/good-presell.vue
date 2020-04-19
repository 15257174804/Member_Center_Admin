<template>
  <div class="presell">
    <!-- 标题栏 -->
    <div class="title clearfix">
      <span>商品预约</span>
       <router-link to="goodpreselldetail">  
        <el-button type="success">
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      </router-link>
    </div>
    <!-- 商品搜索 -->
    <div class="search">
      <div class="searchbox">
        商品信息：
        <el-input v-model="searchParams.keyword" placeholder="如预约活动名称等" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        预约状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="预约中" value="1"></el-option>
          <el-option label="已停止" value="0"></el-option>
        </el-select>
      </div> 
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
    <!-- 商品搜索结束 -->

    <!-- 预约产品的列表 -->
    <!-- 里面的具体变量需要修改，等接口完成之后按照接口来改 -->
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="预约名称" ></el-table-column>
      <el-table-column prop="limitType" label="预约类型" sortable></el-table-column>  
      <el-table-column prop="forPurchasing" label="是否限购" sortable></el-table-column>  
      <el-table-column prop="warmUpStartTime" label="预热时间"></el-table-column>
      <el-table-column prop="startTime" label="预约开始时间" sortable></el-table-column>
      <el-table-column prop="endTime" label="预约结束时间" sortable></el-table-column>
      <!-- <el-table-column prop="type" label="预约限制" width="60"></el-table-column> -->
      <!-- 预售状态 -->
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ==1 ? 'success':'danger' "
            disable-transitions
          >{{scope.row.status ==1 ? '预约中':'已停止'}}</el-tag>
          
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" style="margin-right:13px;"><i class="el-icon-edit"></i>编辑</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link" style="color: #409EFF;">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item ><el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button></el-dropdown-item>
              <el-dropdown-item ><el-button type="text" @click="change(scope.row)"><i class="el-icon-refresh"></i>开启/关闭</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curP"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>

  </div>
</template>

<script>
export default {
  name:'goodpresell',
  data(){
    return{
      searchParams:{
        keyword:'',
        status:''
      },
      loading: true,
      tableData: [],  //保存表格中的预约列表信息
      // 以下是分页信息
      pageSize:5,
      curP:1,
      totalCount:0,
    }
  },
  methods:{
    // 点击搜索搜索所有符合条件的商品
    search(){
      this.curP=1;
      this.getData();
    },
    // 重置
    reset(){
      this.searchParams.keyword="";
      this.searchParams.status="";
      // 这里可以加个恢复数据的功能
    },
    // 修改预约活动的状态，开启或关闭预约活动
    change(row){
      console.log('看看row中有没有状态')
      console.log(row)
      this.$confirm('确定要修改该条预约记录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={id:row.id};
        if(row.status==1){   //如果status==1，就是是开启状态的话，就发送关闭预约请求
          this.axios.post('/b2c/preSell/stop',params)
          .then(res=>{
            console.log('当status为1时')
            console.log(res.data)
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: '活动关闭成功'
              });
            }else{
              this.$message.error(res.data.msg);
            }
            this.getData();
          })
        }else{   //如果状态是关闭的话，就发送开启预约请求
          this.axios.post('/b2c/preSell/start',params)
          .then(res=>{
            console.log('当status为0时')
            console.log(res.data)
            if(res.data.code>0){
              this.$message({
                type: 'success',
                message: '活动开启成功'
              });
            }else{
              this.$message.error(res.data.msg);
            }
            this.getData();
          })
        }

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
      
    },
    // 跳转到对应预约活动的详情
    edit(row){
      console.log('这是表格中的row')
      console.log(row)
      // console.log(row.id)
      this.$router.push({
        name:'goodpreselldetail',
        query:{
          forPurchasing:row.forPurchasing,
          id:row.id,
          title:'预约活动详情',
          fform:row
        }
      })
    },
    // 删除预约记录
    del(row){
      this.$confirm('确定要删除该条预约记录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params={id:row.id};
        this.axios.get('/b2c/preSell/delete',{params})
        .then(res=>{
          // console.log(res.data)
          if(res.data.code>0){
            this.$message({
              type: 'success',
              message: res.data.msg
            });
          }else{
            this.$message.error(res.data.msg);
          }
          this.getData();
        })
        
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 获取数据预售产品的数据
    getData(){
      this.loading = true;
      let params = this.searchParams;
      params.pageindex = this.curP;
      params.pagesize = this.pageSize;
      this.axios
        .get("/b2c/preSell/list",{params})
        .then(res => {
          console.log("预约列表查询")
          console.log(res.data)
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            this.tableData = res.data.msg.datas;
            console.log('这是tableData中的数据，预约列表中的数据')
            console.log(this.tableData)
            this.totalCount = res.data.msg.totalCount;
            for(var i=0;i<this.tableData.length;i++){
              var item=this.tableData[i];
              if(item.limitType==1){
                item.limitType="个人预约"
              }else{
                item.limitType="企业预约"
              }
              if(item.type==0){
                item.type='不限制'
              }else if(item.type==1){
                item.type='限制下单数量'
              }else if(item.type==2){
                item.type='限制内容暂定'
              }
              if(item.forPurchasing){
                item.forPurchasing='是'
              }else{
                item.forPurchasing='否'
              }
            }
          }
        })
        .catch(err => {
           console.log(err);
        });
    },
    // 行的背色
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
    // 每页多少条
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData();
    },
    // 第几页
    handleCurrentChange(curP) {
      this.curP = curP;
      this.getData();
    }
  },
  mounted(){
    this.getData();
  } 
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-dropdown-link {
  cursor: pointer;
  
}
</style>