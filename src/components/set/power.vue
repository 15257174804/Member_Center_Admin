<template>
  <div class="power">
    <div class="title clearfix">
      <span>菜单权限</span>
      <!-- <router-link to="/adPower"> -->
        <el-button type="success" @click='adPower'>
          <i class="el-icon-circle-plus-outline"></i>
          新建
        </el-button>
      <!-- </router-link> -->
    </div>
    <!-- 搜搜 -->
    <div class="search">
      <div class="searchbox">
        状态：
        <el-select v-model="searchParams.status" :style="{width:'120px',height:'40px'}">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
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
    <!-- 表格2 -->
    <div v-if="groupId">
      <el-table
        v-loading="loading"
        border
        stripe
        :data="dataList2"
        style="width: 100%">
        <el-table-column prop="menuSort" label="序号" width="100" align='center'></el-table-column>
        <el-table-column prop="menuCode" label="编码" align='center'></el-table-column>
        <el-table-column prop="menuGrade" label="等级" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.menuGrade==1">一级菜单</span>
            <span v-if="scope.row.menuGrade==2">二级菜单</span>
          </template>
        </el-table-column>
        <el-table-column prop="menuName" label="菜单名称" align='center'></el-table-column>
        <!-- <el-table-column prop="parentId" label="上级菜单">
          <template slot-scope="scope">
            <span v-if="scope.row.grade==1">-</span>
            <span v-else>{{scope.row.parentId}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status ==1 ? 'success':'danger' "
              disable-transitions
            >{{scope.row.status ==1 ? '正常':'停用'}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格 -->
    <div v-else>
      <el-table
        v-loading="loading"
        border
        stripe
        :data="dataList"
        style="width: 100%">
        <el-table-column prop="sort" label="序号" width="100" align='center'></el-table-column>
        <el-table-column prop="code" label="编码" align='center'></el-table-column>
        <el-table-column prop="grade" label="等级" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.grade==1">一级菜单</span>
            <span v-if="scope.row.grade==2">二级菜单</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜单名称" align='center'></el-table-column>
        <!-- <el-table-column prop="parentId" label="上级菜单">
          <template slot-scope="scope">
            <span v-if="scope.row.grade==1">-</span>
            <span v-else>{{scope.row.parentId}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status ==1 ? 'success':'danger' "
              disable-transitions
            >{{scope.row.status ==1 ? '正常':'停用'}}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          align='center'
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
            <el-button v-if="scope.row.status ==1" type="text" @click="change(scope.row)"><i class="el-icon-refresh"></i>禁用</el-button>
            <el-button v-if="scope.row.status ==0" type="text" @click="change(scope.row)"><i class="el-icon-refresh"></i>启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
    <!-- 弹框新增的 -->
    <el-dialog 
      :title="menuTitle" 
      :visible.sync="dialogFormVisible"
      append-to-body
      :close-on-click-modal='false' 
      :show-close="false"
      width='40%'>
      <el-form :model="menuForm" ref="menuForm" :rules="rules" label-width="120px">
        <el-form-item label="序号" prop="sort">
          <el-input v-model="menuForm.sort" style='width:80%;' placeholder="请输入菜单序号"></el-input>
        </el-form-item>
        <el-form-item label="菜单编码" prop="code">
          <el-input v-model="menuForm.code" style='width:80%;' placeholder="请输入菜单编码，不允许有重复"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" style='width:80%;' placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接" prop="link">
          <el-select v-model="menuForm.link" placeholder="请选择" style='width:80%;'>
            <el-option v-for="(val,i) of menuLink" :key='i' :label="val.label" :value="val.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" style='width:80%;' placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="菜单等级" prop="grade">
          <el-select v-model="menuForm.grade" placeholder="请选择" style='width:80%;'>
            <el-option label="一级菜单" value="1"></el-option>
            <el-option label="二级菜单" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" v-if="menuForm.grade==2" prop="parentId">
          <el-select v-model="menuForm.parentId" placeholder="请选择" style='width:80%;' :disabled="menuTitle=='菜单编辑'">
            <el-option v-for="(val,i) of parentLink" :key='i' :label="val.name" :value="val.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基础菜单">
          <el-switch
            v-model="menuForm.defaultToEnterprise"
            active-color="#13ce66"
            inactive-color="#EBEEF5">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('menuForm')">取 消</el-button>
        <el-button type="primary" @click="saveMenu('menuForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:"power",
  data(){
    var checkSort =(rule,value,callback)=>{
      if(!value){
        return callback(new Error('请输入序号'))
      }else{
        let reg=/^\d*$/;
        if(reg.test(value)){
          callback();
        }else{
          return callback(new Error('请输入正整数'))
        }
      }
    };
    return {
      menuTitle:'',
      dialogFormVisible:false,
      menuLink:[
        {
          value: 'home',
          label: '首页'
        },
        {
          value: 'company',
          label: '我的企业'
        },
        {
          value: 'employee',
          label: '我的员工'
        },
        {
          value: 'good',
          label: '商品列表'
        },
        {
          value: 'goodpresell',
          label: '预约管理'
        },
        {
          value: 'order',
          label: '订单列表'
        },
        {
          value: 'preorder',
          label: '预约订单'
        },
        {
          value: 'count',
          label: '预约汇总'
        },
        {
          value: 'orderTotal',
          label: '订单汇总'
        },
        {
          value: 'refund',
          label: '退款管理'
        },
        {
          value: 'timelimited',
          label: '限时抢购'
        },
        {
          value: 'fulldiscount',
          label: '优惠券'
        },
        {
          value: 'reduce',
          label: '满减满赠'
        },
        {
          value: 'commodityGroup',
          label: '商品组'
        },
        {
          value: 'integralset',
          label: '积分设置'
        },
        {
          value: 'integralgood',
          label: '兑换商品'
        },
        {
          value: 'customlist',
          label: '会员列表'
        },
        {
          value: 'customtotal',
          label: '会员统计'
        },
        {
          value: 'integralList',
          label: '积分订单'
        },
        {
          value: 'classify',
          label: '商品分类'
        },
        {
          value: 'freight',
          label: '运费管理'
        },
        {
          value: 'bannerlist',
          label: '广告管理'
        },
        {
          value: 'newslist',
          label: '公告管理'
        },
        {
          value: 'markset',
          label: '标签管理'
        },
        {
          value: 'floortype',
          label: '楼层类型'
        },
        {
          value: 'rebateset',
          label: '返利设置'
        },
        {
          value: 'partnerlist',
          label: '合伙人列表'
        },
        {
          value: 'recordlist',
          label: '提现管理'
        },
        {
          value: 'rebatelist',
          label: '返利明细'
        },
        {
          value: 'power',
          label: '菜单权限'
        },
        {
          value: 'rolePower',
          label: '角色权限'
        },
        {
          value: 'complain',
          label: '意见反馈'
        },
      ],
      parentLink:[],  //上级菜单列表
      menuForm:{
        id:'',
        sort:'',
        code:'',
        name:'',
        icon:'',
        grade:"",
        link:'',
        parentId:'', 
        defaultToEnterprise:false,
        type:1,  // 菜单类型 目前 默认传1 代表菜单
      },
      rules:{
        sort: [
          { required: true,message: '请输入菜单序号' ,  trigger: 'blur' }   //validator: checkSort
        ],
        code: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请选择菜单等级', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请选择菜单链接', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
      },
      loading:false,
      dataList:[],
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      searchParams:{
        status:""
      },
      dataList2:[],   //企业菜单
      groupId:localStorage.getItem('groupId')
    }
  },
  mounted(){
    if(localStorage.getItem('groupId')){
      this.getCorpMeun();
    }else{
      this.getMenu();
      this.gettreeMenu();
    }
  },
  methods:{
    //    启用  禁用
    change(row){
      if(row.status==1){
        let params={
          id:row.id,
          status:0
        }
        this.axios.post('/crm/menu/save',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('禁用成功');
            this.getMenu();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      }else if(row.status==0){
        let params={
          id:row.id,
          status:1
        }
        this.axios.post('/crm/menu/save',params)
        .then(res=>{
          if(res.data.code>0){
            this.$message.success('启用成功');
            this.getMenu();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      }
    },
    // 编辑
    edit(row){
      // console.log(row)
      this.menuTitle='菜单编辑';
      this.dialogFormVisible=true;
      this.getParent();
      this.menuForm=JSON.parse(JSON.stringify(row));
      if(this.menuForm.grade==1){
        this.$set(this.menuForm,'grade','1')
      }else if(this.menuForm.grade==2){
        this.$set(this.menuForm,'grade','2')
      }
    },
    // 新增平台菜单
    adPower(){
      this.menuTitle='菜单新增';
      this.dialogFormVisible=true;
      this.menuForm={
        id:'',
        sort:'',
        code:'',
        name:'',
        grade:"",
        link:'',
        parentId:'', 
        defaultToEnterprise:false,
        type:1,  // 菜单类型 目前 默认传1 代表菜单
      },
      this.getParent();
    },
    getParent(){
      let params={
        status:1,
        grade:1
      }
      this.axios.get('/crm/menu/list',{params})
      .then(res=>{
        if(res.data.code>0){
          this.parentLink=res.data.msg.datas;
          // let item=res.data.msg.datas;
          // console.log(res.data)
          // this.parentLink= item.filter((val,i,arr)=>{
          //   return val.grade==1
          // })
          // console.log(this.parentLink)
        }
      })
    },
    // 保存新增的菜单
    saveMenu(formName){
      this.$refs[formName].validate((valid) =>{
        if (valid){
          // console.log(this.menuForm)
          let params=this.menuForm;
          this.axios.post('/crm/menu/save',params)
          .then(res=>{
            if(res.data.code>0){
              this.dialogFormVisible=false;
              this.$message.success('保存成功')
              this.getMenu();
            }else{
              this.$message.error(res.data.msg)
            }
          })
          
        }else {
            this.$message.error('请完善内容后保存!');
            return false;
          }
      })
    },
    // 取消
    cancel(formName){
      this.$refs[formName].resetFields();
      this.dialogFormVisible=false;
    },
    // 获取企业菜单列表
    getCorpMeun(){
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      params.groupId=localStorage.getItem('groupId');
      this.axios.get('/crm/emac/list',{params})
      .then(res=>{
          this.loading=false;
          this.dataList2=res.data.msg.datas;
          this.totalCount=res.data.msg.totalCount;
      })
    },
    // 获取平台菜单列表
    getMenu(){
      this.loading=true;
      let params=this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/crm/menu/list',{params})
      .then(res=>{
        if(res.data.code>0){
          this.loading=false;
          this.dataList=res.data.msg.datas;
          this.totalCount=res.data.msg.totalCount;
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取树状图数据
    gettreeMenu(){
      let params={
        grade:1
      }
      this.axios.get('/crm/menu/tree',{params})
      .then(res=>{
        // console.log(res.data)
      })
    },
    search(){
      this.currentPage = 1;
      if(localStorage.getItem('groupId')){
        this.getCorpMeun();
      }else{
        this.getMenu();
      }
    },
    //重置
    reset(){
      this.searchParams.status = "";
      if(localStorage.getItem('groupId')){
        this.getCorpMeun();
      }else{
        this.getMenu();
      }
    },
    // 每页展示多少条数据
    handleSizeChange(size) {
      this.pagesize = size;
      if(localStorage.getItem('groupId')){
        this.getCorpMeun();
      }else{
        this.getMenu();
      }
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      if(localStorage.getItem('groupId')){
        this.getCorpMeun();
      }else{
        this.getMenu();
      }
    },
  }
}
</script>

<style>

</style>