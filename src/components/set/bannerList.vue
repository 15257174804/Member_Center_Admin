<template>
  <div class="bannerlist">
    <div class="title clearfix">
      <span>广告楼层</span>
      <router-link to="/adfloor">
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
        广告位名称：
        <el-input v-model="searchParams.keyword" placeholder="请输入广告位名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <!-- <div class="searchbox">
        状态：
        <el-select v-model="searchParams.status" :style="{width:'100px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </div>  -->
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
      <div class="searchbox">
        <!-- 链接暂时是测试环境的，后期需要更改 -->
        <el-button @click="showIframe('http://health.alink365.cn/#/showHomePage?groupId='+groupId)" class="showIframe">
          <i class="el-icon-view"></i>
          预览
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="dataList"
      border 
      stripe 
      style="width: 100%">
      <el-table-column prop="adSort" label="序号" width="60"></el-table-column>
      <el-table-column prop="floorType" label="楼层类型">
        <template slot-scope="scope">
          <span v-if="scope.row.floorType==1">banner板块</span>
          <span v-if="scope.row.floorType==2">企业板块</span>
          <span v-if="scope.row.floorType==3">活动板块</span>
          <span v-if="scope.row.floorType==4">热卖商品板块</span>
          <span v-if="scope.row.floorType==5">商品板块</span>
          <span v-if="scope.row.floorType==6">秒杀板块</span>
          <span v-if="scope.row.floorType==7">预售板块</span>
          <span v-if="scope.row.floorType==8">商品分类板块</span>
          <span v-if="scope.row.floorType==9">优惠券板块</span>
        </template>
      </el-table-column>
      <el-table-column prop="floorName" label="楼层名称"></el-table-column>
      <el-table-column prop="floorLink" label="楼层链接"></el-table-column>
      <el-table-column prop="floorDesc" label="楼层描述"></el-table-column>
      <el-table-column prop="backColor" label="背景色">
        <template slot-scope="scope">
          <div class="bgcolor" :style="{background:scope.row.backColor}"></div>
        </template>
      </el-table-column>
      <el-table-column prop="backImg" label="背景图" width="300">
          <template slot-scope="scope">
            <img v-if="scope.row.backImg" height="100" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.backImg">
            <span v-else>无</span>
          </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="danger" disable-transitions>停用</el-tag>
          <el-tag v-if="scope.row.status==1" type="success" disable-transitions>启用</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
      fixed="right"
      label="操作"
      width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
          <!--  -->
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

  </div>
</template>

<script>
export default {
  name:'bannerlist',
  data(){
    return {
      groupId:this.$store.state.groupId,
      searchParams:{
        keyword:"",
        status:'',
        showCells:true
      },
      dataList: [],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
    }
  },
  methods:{
    showIframe(url){
      $("<div id='showMobilePreview'>" +
          "<div class='mobile_preview_header'><i class='mobile_preview_header_icon'></i></div>" +
          "<div class='mobile_preview_frame'><iframe id='YuFrameMobilePreview' name='YuFrameMobilePreview' ></iframe></div>" + 
          "<div class='mobile_preview_footer'><i class='mobile_preview_footer_icon'></i></div>" +
      "</div>").prependTo('body');
       $("#YuFrameMobilePreview").attr("src", url);  
      //添加背景遮罩
      $("<div id='YuFrameMobilePreviewBg' style='cursor:pointer;width:100%;height:100%;background-color: Gray;display:block;z-index:9998;position:absolute;left:0px;top:0px;filter:Alpha(Opacity=30);/* IE */-moz-opacity:0.4;/* Moz + FF */opacity: 0.4; '/>").prependTo('body'); 
      //点击背景遮罩移除iframe和背景
      $("#YuFrameMobilePreviewBg").click(function() {
        $("#showMobilePreview").remove();
        $("#YuFrameMobilePreviewBg").remove();
      });
    },
    del(row){
      let params={
        id:row.id
      }
      this.$confirm('确定要删除该条楼层吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('/b2c/adFloor/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('删除成功')
          }else{
            this.$message.error(res.data.msg)
          }
          this.getDataList();
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
      
    },
    edit(row){
      // console.log(row)
      this.$router.push({
        name:'adfloor',
        query:{
          id:row.id,
          title:row.floorName+'楼层编辑'
        }
      })
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
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.searchParams.status = "";
      this.getDataList();
    },
    getDataList(){
      // console.log('获取页面数据')
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/b2c/adFloor/list',{params})
      .then(res=>{
        // console.log(res.data)
        this.loading=false;
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this._dataList = res.data.msg.datas;
          if(this.$store.state.isAdmin=='systemAdmin'){
            this.dataList=this._dataList.filter((val,i,arr)=>{
              return val.groupId==0
            })
          }else{
            this.dataList=this._dataList
          }
          // console.log(this.dataList)
          this.totalCount = res.data.msg.totalCount;
        }
      })
    }
  },
  mounted(){
    this.getDataList();
  }
}
</script>

<style>
.bgcolor{
  width:20px;
  height:20px;
  border:1px solid black;
}
#showMobilePreview{
  z-index: 9999;
  width:391px;
  height:768px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  opacity: 1;
  text-align: center;
}
.mobile_preview_header{
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  width: 387px;
  background: #eeeff2;
  text-align: center;
  line-height: 40px;
  border-top-right-radius: 50px;
  border-top-left-radius: 50px;
}
.mobile_preview_header_icon {
  display: inline-block;
  width: 65px;
  height: 10px;
  background: #c8c9cc;
  border-radius: 9px;
  vertical-align: middle;
  margin-top: 18px; 
}
.mobile_preview_frame {
  width: 375px;
  min-height: 294px;
  height: 667px;
  max-height: calc(100vh - 166px);
  top: 40px;
  left: 0;
  border: 6px solid #eeeff2;
  position: relative;
  background-color: #fff;
  display: block;
}
#YuFrameMobilePreview {
  border: none;
  width: 375px;
  height: 100%;
}
.mobile_preview_header_icon {
  display: inline-block;
  width: 65px;
  height: 10px;
  background: #c8c9cc;
  border-radius: 9px;
  vertical-align: middle;
  margin-top: 18px;
}
.mobile_preview_frame {
  width: 375px;
  min-height: 294px;
  height: 667px;
  max-height: calc(100vh - 166px);
  top: 40px;
  left: 0;
  border: 6px solid #eeeff2;
  position: relative;
  background-color: #fff;
  display: block;
}
#YuFrameMobilePreview {
  border: none;
  width: 375px;
  height: 100%;
}
.mobile_preview_footer {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 52px;
  width: 387px;
  background: #eeeff2;
  text-align: center;
  line-height: 45px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
}
.mobile_preview_footer_icon {
  display: inline-block;
  width: 43px;
  height: 43px;
  background: #c8c9cc;
  border-radius: 50%;
  vertical-align: middle;
}
.searchbox{
  font-size: 14px;
}
</style>