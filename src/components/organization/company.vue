<template>
  <div id="company">
    <div class="title clearfix">
      <span>我的企业</span>
      <router-link to="/companyadd">
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
        <label>企业名称：</label>
        <el-input v-model="searchParams.keyword" placeholder="请输入企业名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <div class="searchbox">
        <label>法人：</label>
        <el-input v-model="searchParams.lawMan" placeholder="请输入法人姓名" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <!-- 状态 -->
      <div class="searchbox">
        <label>企业状态：</label>
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="待审核" value="2"></el-option>
          <el-option label="审核失败" value="30"></el-option>
          <!-- <el-option label="废弃" value="-1"></el-option> -->
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
      <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
      <el-table-column type="index" label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span>
        </template>
      </el-table-column> 
      <el-table-column prop="name" label="企业名称" width="250"></el-table-column>
      <el-table-column prop="name" label="企业二维码" width="120">
        <template slot-scope="scope">
          <!-- <img style="display:block;cursor:pointer;" src="../../assets/qrcode.png" alt="" @mouseenter="showQr(scope.row)" @mouseleave="hidQr"> -->
          
          <el-dropdown  trigger="click" placement="bottom">
            <span class="el-dropdown-link">
              <img style="display:block;cursor:pointer;" src="../../assets/qrcode.png" alt="" @click="showQr(scope.row)">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <img style="width:100px;height:100px;vertical-align: middle;" :src="qrUrl" alt="" :onerror='defaultImg'>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
          <!-- <div style="width:100px;height:100px;background:#faa;display:none;float:left;z-index:999;" @mouseenter="showQr(scope.row)" @mouseleave="hidQr" v-show="qrimg===scope.row.id &&qrUrl">
            <img style="width:100%;height:100%;" :src="qrUrl" alt="" :onerror='defaultImg'>
          </div> -->
          <!-- position:absolute;top: 72px;left: 54px; -->
        </template>
      </el-table-column>
      <el-table-column prop="type" label="企业类型" width="200">
        <template slot-scope="scope">
          <span v-if='scope.row.type==1'>集团</span>
          <span v-else-if='scope.row.type==2'>集团下连锁药店总部</span>
          <span v-else-if='scope.row.type==3'>集团下连锁药店门店</span>
          <span v-else-if='scope.row.type==4'>集团下连锁门诊</span>
          <span v-else-if='scope.row.type==5'>集团下连锁门诊门店</span>
          <span v-else-if='scope.row.type==6'>集团下互联网医院</span>
          <span v-else-if='scope.row.type==7'>单体互联网医院</span>
          <span v-else-if='scope.row.type==8'>单体药店</span>
          <span v-else-if='scope.row.type==9'>单体门诊</span>
          <span v-else-if='scope.row.type==10'>单体连锁药店总部</span>
          <span v-else-if='scope.row.type==11'>单体连锁药店门店</span>
          <span v-else-if='scope.row.type==12'>单体连锁门诊总部</span>
          <span v-else-if='scope.row.type==13'>单体连锁门诊门店</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lawMan" label="法人" width="100"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="100">
        <template slot-scope="scope">
          <span v-if='scope.row.linkman'>{{scope.row.linkman}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactNumber" label="联系方式" width="160">
        <template slot-scope="scope">
          <span v-if='scope.row.contactNumber'>{{scope.row.contactNumber}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="onBusiness" label="营业状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.onBusiness" type="success" disable-transitions>营业中</el-tag>
          <el-tag v-if="!scope.row.onBusiness" type="warning" disable-transitions>未营业</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="企业状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success" disable-transitions>正常</el-tag>
          <el-tag v-if="scope.row.status==2" type="warning" disable-transitions>待审核</el-tag>
          <el-tag v-if="scope.row.status==30" type="warning" disable-transitions>审核失败</el-tag>
          <el-tag v-if="scope.row.status==-1" type="warning" disable-transitions>废弃</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row,'basicInfo')"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="text" @click="onBusiness(scope.row)" style="margin-right:13px;"><i class="el-icon-refresh"></i>营业修改</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link" style="color: #409EFF;">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <el-button type="text" @click="del(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
              </el-dropdown-item>
              <el-dropdown-item >
                <el-button v-if="(scope.row.status==2 &&scope.row.realLevel==1 && isAdmin=='systemAdmin') || (scope.row.status==2 &&scope.row.realLevel!=1 && isAdmin=='isAdmin')" type="text" @click="audit(scope.row)"><i class="el-icon-coordinate"></i>企业审核</el-button>
              </el-dropdown-item>
              <el-dropdown-item ><el-button type="text" @click="edit(scope.row,'busiInfo')"><i class="el-icon-shopping-cart-1"></i>经营范围</el-button></el-dropdown-item>
              <el-dropdown-item ><el-button type="text" @click="edit(scope.row,'cardInfo')"><i class="el-icon-picture-outline-round"></i>证照管理</el-button></el-dropdown-item>
              <el-dropdown-item ><el-button type="text" @click="onBusiness(scope.row)"><i class="el-icon-refresh"></i>营业修改</el-button></el-dropdown-item>
              <!-- 只有平台管理员可以操作企业菜单分配 -->
              <el-dropdown-item ><el-button type="text" v-if="!logingroupId" @click="power(scope.row)"><i class="el-icon-bell"></i>菜单权限</el-button></el-dropdown-item>
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
    <!-- total是总数据量 -->
    <!-- <span>{{isAdmin}}</span> -->

    <!-- 点击企业审核 -->
    <el-dialog
      title="企业审核"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="companyform"  label-width="100px">
        <el-form-item label="是否同意" prop='isPass' required>
          <el-radio-group v-model="companyform.isPass">
            <el-radio label='是'></el-radio>
            <el-radio label='否'></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop='opinion'>
          <el-input type="textarea" v-model="companyform.opinion" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 企业权限管理 -->
    <el-dialog
      title="菜单权限设置"
      :visible.sync="powerDialogVisible"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width="60%">
      <!-- <el-button type="primary" plain @click="addMenu()" style='margin:0 0 10px 0;'>新增菜单</el-button> -->
      <el-table 
        :data="powerData" 
        border
        v-loading="loading2"
        row-key="id"
        :tree-props="{children: 'childNodes', hasChildren: 'hasChildren'}">
        <el-table-column property="sort" label="序号" width="100"></el-table-column>
        <el-table-column property="code" label="编码" ></el-table-column>
        <el-table-column prop="grade" label="等级">
          <template slot-scope="scope">
            <span v-if="scope.row.grade==1">一级菜单</span>
            <span v-if="scope.row.grade==2">二级菜单</span>
          </template>
        </el-table-column>
        <el-table-column property="name" label="菜单名称"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status ==1 ? 'success':'danger' "
              disable-transitions
            >{{scope.row.status ==1 ? '正常':'停用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="delMenu(scope.row)"><i class="el-icon-edit"></i>删除</el-button> -->
            <el-switch
              v-model="scope.row.distributionFlag"
              @change='changeMenu(scope.row)'
              active-color="#13ce66"
              inactive-color="#DCDFE6">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="powerDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="powerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog 
      :visible.sync="dialogFormVisible"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width='35%'>
      <el-form :model="menuForm" ref="menuForm" label-width="120px">
        <el-form-item label="菜单" prop="menuId">
          <el-select v-model="menuForm.menuId" placeholder="请选择" style='width:80%;'>
            <el-option v-for="(val,i) of menuLink" :key='i' :label="val.name" :value="val.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('menuForm')">取 消</el-button>
        <el-button type="primary" @click="saveMenu('menuForm')">确 定</el-button>
      </div>
    </el-dialog> -->

  </div>
</template>


<script>
import global_ from '../../api/global'
export default {
  name: "company",
  data() {
    return {
      searchParams:{
        keyword:"",
        lawMan:"",
        status:''
      },
      dataList: [],
      companyType:[],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      loading: false,
      dialogVisible:false,
      companyform:{   //企业预约审核表单
        corpId:'',
        isPass:'是',
        opinion:''
      },
      isAdmin:this.$store.state.isAdmin,
      powerDialogVisible:false,   //控制权限的弹窗
      powerData:[],
      dialogFormVisible:false,
      menuForm:{
        id:'',
        groupId:'',
        menuId:''
      },
      menuLink:[],
      loading2:false,
      logingroupId:localStorage.getItem('groupId'),
      qrimg:-1,
      qrUrl:'',
      defaultImg:'this.src="'+require('../../assets/nopicture.png')+'"',
    };
  },
  methods: {
    // 显示店铺二维码
    showQr(row){
      console.log(row)
      // this.qrimg=row.id;
      let params={
        url:global_.baseURL+"/?source=clientIdQr&clientId="+row.id,
        logoUrl:global_.baseURL +'/b2c/image/'+row.logo,
        size:800
      }
      this.axios.post('/crm/qr',params)
      .then(res=>{
        console.log(res.data)
        if(res.data.code>0){
          this.qrUrl=res.data.msg;
        }
      })
    },
    hidQr(){
      this.qrimg=-1;
    },
    // 企业权限管理-平台
    power(row){
      // console.log(row)
      this.powerDialogVisible=true;
      this.loading2=true;
      this.menuForm.groupId=row.groupId;
      this.getCorpMenu();
    },
    // 获取企业菜单
    getCorpMenu2(){
      let params={
        groupId:this.menuForm.groupId
      }
      this.axios.get('/crm/emac/list',{params})
      .then(res=>{
        if(res.data.code>0){
          this.powerData=res.data.msg.datas;
        }
      })
    },
    // 获取企业树状图菜单
    getCorpMenu(){
      let params={
        groupId:this.menuForm.groupId,
        grade:1
      }
      this.axios.get('/crm/menu/treeWithDistribution',{params})
      .then(res=>{
        if(res.data.code>0){
          this.loading2=false;
          this.powerData=res.data.msg;
          // console.log(res.data)
        }
      })
    },
    // 改变菜单的开关
    changeMenu(row){
      // console.log(row)
      if(!row.distributionFlag){
        let params={
          id:row.enterpriseMenuId
        }
        this.axios.get('/crm/emac/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            // this.$message.success('删除成功');
            this.getCorpMenu();
          }else{
            this.$message.error(res.data.errmsg);
          }
        })
      }else{
        let params={
          id:row.enterpriseMenuId,   // 企业菜单id 新增时不传  修改时 必传
          groupId:this.menuForm.groupId,
          menuId:row.id   //平台菜单id
        }
        this.axios.post('crm/emac/save',params)
        .then(res=>{
          if(res.data.code>0){
            // this.dialogFormVisible=false;
            this.getCorpMenu();
          }else{
            this.$message.error(res.data.errmsg);
          }
        })
      }
    },
    // 删除菜单
    // delMenu(row){
    //   this.$confirm('确定要删除该菜单吗？','提示',{
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(()=>{
    //     let params={
    //       id:row.id
    //     }
    //     this.axios.get('/crm/emac/delete',{params})
    //     .then(res=>{
    //       if(res.data.code>0){
    //         this.$message.success('删除成功');
    //         this.getCorpMenu();
    //       }
    //     })
    //   }).catch(()=>{
    //     this.$message({
    //       type: 'info',
    //       message: '已取消操作'
    //     });
    //   })
    // },
    // 新增菜单
    // addMenu(){
    //   this.dialogFormVisible=true;
    //   this.getMenulist();
    // },
    // 获取平台菜单列表
    // getMenulist(){
    //   let params={
    //     status:1
    //   }
    //   this.axios.get('/crm/menu/list',{params})
    //   .then(res=>{
    //     if(res.data.code>0){
    //       this.menuLink=res.data.msg.datas;
    //     }
    //   })
    // },
    // 保存新增的菜单
    // saveMenu(formName){
    //   this.$refs[formName].validate((valid) =>{
    //     if (valid){
    //       let params=this.menuForm;
    //       this.axios.post('crm/emac/save',params)
    //       .then(res=>{
    //         if(res.data.code>0){
    //           this.dialogFormVisible=false;
    //           this.getCorpMenu();
    //         }
    //       })
    //     }else {
    //         this.$message.error('请完善内容后保存!');
    //         return false;
    //       }
    //   })
    // },
    // 取消
    cancel(formName){
      this.menuForm.id='';
      this.menuForm.menuId='';
      this.dialogFormVisible=false;
    },
    // 删除企业
    del(row){
      let params={
        id:row.id
      }
      this.$confirm('确定要删除该店铺吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios.get('/crm/corporation/delete',{params})
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('删除成功')
            this.getDataList();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 修改企业营业状态
    onBusiness(row){
      // console.log(row)
      let params={
        id:row.id
      }
      if(row.onBusiness){
        params.onBusiness=false;
      }else{
        params.onBusiness=true;
      }
      this.$confirm(`确定要修改${row.name}的营业状态吗？`,{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
        this.axios.post('/crm/corporation/save',params)
        .then(res=>{
          // console.log(res.data)
          if(res.data.code>0){
            this.$message.success('修改成功');
          }else{
            this.$message.error('修改失败，请重试');
          }
          this.getDataList();
        }).catch(err=>{
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
      
    },
    // 企业审核
    audit(row){
      // console.log(row)
      this.dialogVisible =true;
      this.companyform.corpId=row.id;
    },
    pass(){
      this.dialogVisible =false;
      let params={
        corpId:this.companyform.corpId,
        isPass:this.companyform.isPass=='是'?true:false,
        opinion:this.companyform.opinion
      }
      this.axios.get('/crm/corporation/audit',{params})
      .then(res=>{
        if(res.data.code>0){
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }else{
          this.$message.error(res.data.msg);
        }
        this.getDataList();
      }).catch(err=>{console.log(err)})
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
    //编辑某行
    edit(row,type){
      this.$router.push({
          // path:'/goodadd',//跳转路径
          name: 'companyadd',//跳转路径的name值，不写跳转后页面取不到参数
          // 参数
          query: {
            id: row.id,
            title: "编辑企业信息",
            tabName: type
          }
      })
    },
    // 获取数据
    getDataList() {
      this.loading = true;
      // console.log(1)
      // console.log(this.searchParams)
      let params =JSON.parse(JSON.stringify(this.searchParams));
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      if(params.status===''){
        params.showAll=true;
      }
      // console.log(2)
      // console.log(params)
      this.axios
        .get("/crm/corporation/list",{params})
        .then(res => {
          // console.log('企业信息')
          // console.log(res.data)
          this.loading = false;
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            let _dataList=res.data.msg.datas;
            // this.getCompanyType();
            // _dataList.forEach(item=>{
            //   this.companyType.forEach(item2=>{
            //     if(item.type && item.type==item2.id){
            //       item.type=item2.name;
            //     }
            //   })
            // })
            // console.log(_dataList)
            this.dataList = _dataList;
            this.totalCount = res.data.msg.totalCount;
            
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCompanyType(){
      this.axios.get('/crm/corporationType/list')
      .then(res=>{
        this.companyType=res.data.msg.datas;
      })
    },
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      // for(let key in this.searchParams){
      //   this.searchParams[key]=''
      // }
      this.searchParams.keyword='';
      this.searchParams.lawMan='';
      this.searchParams.status='';
      this.getDataList();
    }
  },
  // 页面渲染前拿到数据
  created() {
    // console.log(this.form);
    this.getDataList();
    // console.log(1)
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
.el-dropdown-menu__item{
  padding:0 10px;
}
</style>



