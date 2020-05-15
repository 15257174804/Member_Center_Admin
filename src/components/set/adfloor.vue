<template>
  <div class="adfloor">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>{{title}}</span>
    </div>
    <!-- 表单内容 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" >
      <h1>楼层信息</h1>
        <!-- 输入预约活动名称 -->
        <el-form-item label="楼层名称" prop="floorName">
          <el-input v-model="ruleForm.floorName" placeholder="请输入楼层名称"></el-input>
        </el-form-item>
        <el-form-item label="楼层描述" prop="floorDesc">
          <el-input v-model="ruleForm.floorDesc" placeholder="请输入楼层描述"></el-input>
        </el-form-item>
        <el-form-item label="楼层链接" prop="floorLink">
          <!-- <el-input v-model="ruleForm.floorLink" placeholder="请输入楼层跳转的目标链接"></el-input> -->
          <el-select v-model="ruleForm.floorLink" placeholder="请选择">
            <el-option
              v-for="item in linkoptions"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="楼层类型" prop="floorType">
          <el-select v-model="ruleForm.floorType" placeholder="请选择" @change="changefloortype">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层序号" prop="adSort">
          <el-input v-model="ruleForm.adSort" placeholder="请输入楼层序号"></el-input>
        </el-form-item>
        <el-form-item label="背景色" prop="backColor">
          <colorPicker v-model="ruleForm.backColor" />
        </el-form-item>
        <el-form-item label="背景图" prop="backImg">
          <span style="color:#909399;background-color: #f4f4f5;">广告位图片优先级高于背景图片.</span>
          <!-- 之前的样式,没有删除按钮的样式 -->
          <!-- <el-upload
            class="avatar-uploader"
            :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog> -->
          <el-upload :class="{'hide':hideUpload}"
            :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :limit="1">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form-item>
      

        <h1>广告位信息 <span style="color:#909399;background-color: #f4f4f5;">(楼层类型为商品板块时可选择商品，楼层类型为企业板块时可选择企业)</span></h1>
        <div v-if='ruleForm.floorType==5||ruleForm.floorType==1||ruleForm.floorType==2||ruleForm.floorType==8'>
          <el-row>
            <el-button v-if="ruleForm.floorType==5||ruleForm.floorType==1" style="margin:20px 0 20px 0;" type="primary" size="mini" @click="choose">选择产品<i class="el-icon-plus el-icon--right"></i></el-button>
            <el-button v-else-if="ruleForm.floorType==2" style="margin:20px 0 20px 0;" type="primary" size="mini" @click="choosec">选择企业<i class="el-icon-plus el-icon--right"></i></el-button>
            <el-button v-else-if="ruleForm.floorType==8" style="margin:20px 0 20px 0;" type="primary" size="mini" @click="chooseclass">选择分类<i class="el-icon-plus el-icon--right"></i></el-button>
            <el-button v-else style="margin:20px 0 20px 0;" type="primary" size="mini" @click="choosepicture">选择图片<i class="el-icon-plus el-icon--right"></i></el-button>
          </el-row>
          <!-- 广告位表格 -->
          <el-table
            :data="ruleForm.cells"
            height="250"
            border
            style="width: 100%">
            <el-table-column prop="cellSort" label="序号" width="60"></el-table-column>
            <el-table-column prop="cellGoodId" label="商品ID"  v-if="ruleForm.floorType==5"  width="100"></el-table-column>
            <el-table-column prop="cellCorpId" label="企业ID" v-if="ruleForm.floorType==2"  width="100"></el-table-column>
            <el-table-column prop="goodClassId" label="类别ID" v-if="ruleForm.floorType==8"  width="100"></el-table-column>
            <el-table-column prop="cellName" label="名称"  width="200" ></el-table-column>
            <el-table-column prop="img" label="图片"  width="100">
              <template slot-scope="scope">
                <img v-if="scope.row.img" height="100" :src="axios.defaults.baseURL + '/b2c/image/' + scope.row.img"  class="imgsize"/>
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column prop="cellLink" label="跳转链接" ></el-table-column>
            <el-table-column prop="isLink" label="是否可跳转"  width="100"></el-table-column>
            <el-table-column
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
                <el-button type="text" @click="delgood(scope.row)"><i class="el-icon-delete"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table> 
        </div>

        <!-- 选择产品 -->
        <el-dialog
          title="请选择广告位产品"
          :visible.sync="dialogVisible"
          width="80%">
          <div>
            <div class="search">
              <div class="searchbox">
                商品信息：
                <el-input v-model="searchParams.keyword" placeholder="如名称、编码等" :style="{height:'40px'}"></el-input>
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
            <el-table
              :data="goodlist"
              height="300"
              border
              style="width: 100%">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="imgUrl" label="图片">
                <template slot-scope="scope">
                  <img v-if="scope.row.imgUrl" :src="axios.defaults.baseURL + '/crm/image/' +scope.row.imgUrl" class="imgsize"/>
                  <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column prop="goodCode" label="商品编号"></el-table-column>
              <el-table-column prop="goodName" label="商品名称"></el-table-column>
              <el-table-column prop="corpName" label="所属企业"></el-table-column>
              <el-table-column prop="goodsClass" label="商品分类"></el-table-column>
              <el-table-column prop="spec" label="规格"></el-table-column>
              <el-table-column prop="isShow" label="状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isShow" type="success" disable-transitions>在售</el-tag>
                  <el-tag v-if="!scope.row.isShow" type="danger" disable-transitions>已下架</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <!-- :disabled="JSON.stringify(ruleForm.details).indexOf(scope.row.goodCode)!=-1" -->
                  <el-button type="text" @click="add(scope.row)" :disabled="JSON.stringify(ruleForm.cells).indexOf(scope.row.id)!=-1"><i class="el-icon-edit"></i>添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next"
              :total="totalCount"
            ></el-pagination>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 选择企业 -->
        <el-dialog
          title="请选择广告位企业"
          :visible.sync="dialogVisiblec"
          width="80%">
          <div>
            <div class="search">
              <div class="searchbox">
                企业名称：
                <el-input v-model="searchParams.keyword" placeholder="请输入企业名称" :style="{height:'40px'}"></el-input>
              </div>
              <div class="searchbox">
                <el-button type="primary" @click="searchc()">
                  <i class="el-icon-zoom-in"></i>
                  查询
                </el-button>
              </div>
              <div class="searchbox">
                <el-button @click="resetc()">
                  <i class="el-icon-refresh-right"></i>
                  重置
                </el-button>
              </div>
            </div>
            <el-table
              :data="companylist"
              height="300"
              border
              style="width: 100%">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="logo" label="LOGO">
                <template slot-scope="scope">
                  <img v-if="scope.row.logo" :src="axios.defaults.baseURL + '/crm/image/' +scope.row.logo" class="imgsize"/>
                  <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="企业名称"></el-table-column>
              <el-table-column prop="type" label="企业类型"></el-table-column>
              <el-table-column prop="linkman" label="联系人"></el-table-column>
              <el-table-column prop="contactNumber" label="联系方式"></el-table-column>
              <el-table-column prop="onBusiness" label="营业状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.onBusiness" type="success" disable-transitions>营业中</el-tag>
                  <el-tag v-if="!scope.row.onBusiness" type="warning" disable-transitions>未营业</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <!-- :disabled="JSON.stringify(ruleForm.details).indexOf(scope.row.goodCode)!=-1" -->
                  <el-button type="text" @click="addc(scope.row)" :disabled="JSON.stringify(ruleForm.cells).indexOf(scope.row.name)!=-1"><i class="el-icon-edit"></i>添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next"
              :total="totalCount"
            ></el-pagination>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisiblec = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisiblec = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 选择分类 -->
        <el-dialog
          title="请选择商品分类"
          :visible.sync="dialogVisibleclass"
          width="80%">
          <div>
            <div class="search">
              <div class="searchbox">
                类别检索：
                <el-input v-model="searchParams.keyword" placeholder="如类别名称、编码等" :style="{height:'40px'}"></el-input>
              </div>
              <div class="searchbox">
                <el-button type="primary" @click="searchclass()">
                  <i class="el-icon-zoom-in"></i>
                  查询
                </el-button>
              </div>
              <div class="searchbox">
                <el-button @click="resetclass()">
                  <i class="el-icon-refresh-right"></i>
                  重置
                </el-button>
              </div>
            </div>
            <el-table
              :data="classList"
              height="300"
              border
              style="width: 100%">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="name" label="类别名称"></el-table-column>
              <el-table-column prop="code" label="类别代码"></el-table-column>
              <el-table-column prop="logo" label="图标">
                <template slot-scope="scope">
                  <img v-if="scope.row.logo" :src="axios.defaults.baseURL + '/crm/image/' +scope.row.logo" class="imgsize"/>
                  <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="类别层级"></el-table-column>
              <el-table-column prop="parentName" label="所属类别"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <!-- :disabled="JSON.stringify(ruleForm.details).indexOf(scope.row.goodCode)!=-1" -->
                  <el-button type="text" @click="addclass(scope.row)" :disabled="JSON.stringify(ruleForm.cells).indexOf(scope.row.name)!=-1"><i class="el-icon-edit"></i>添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next"
              :total="totalCount"
            ></el-pagination>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleclass = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisibleclass = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 点击编辑，弹出填写广告位具体内容的弹框 -->
        <el-dialog
          :title="edittitle"
          :visible.sync="dialogVisible2"
          width="45%">
          <el-form :model="numform" status-icon :rules="rules" ref="numform" label-width="200px" >
            <el-form-item label="序号" prop="cellSort">
              <el-input v-model="numform.cellSort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否可跳转" prop="isLink">
              <el-radio-group v-model="numform.isLink">
                <el-radio label='是'></el-radio>
                <el-radio label='否'></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="跳转链接" prop="cellLink">
              <!-- <el-input :disabled="numform.isLink=='否'" v-model="numform.cellLink" autocomplete="off"></el-input> -->
              <el-select :disabled="numform.isLink=='否'" v-model="numform.cellLink" placeholder="请选择">
                <el-option
                  v-for="item in linkoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="img">
              <!-- <el-upload
                class="avatar-uploader"
                :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload">
                <img v-if="imgUrl2" :src="imgUrl2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> -->

              <el-upload :class="{'hide':hideUpload}"
                :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
                list-type="picture-card"
                :on-remove="handleRemove2"
                :on-success="handleAvatarSuccess2"
                :file-list="fileList2"
                :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>

            </el-form-item>
            <el-form-item >
              <el-button type="primary" @click="submit2('numform')">保存</el-button>
              <el-button @click="dialogVisible2 = false">取消</el-button>
            </el-form-item>
          </el-form>

        </el-dialog>
      
      <el-form-item  style="margin:20px 0 20px 0;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
export default {
  name:'adfloor',
  data(){
    return {
      title:'新建楼层',
      edittitle:'',
      token: localStorage.getItem('loginToken'),
      imgUrl:'',
      imgUrl2:'',
      options: [{
          id:0,
          value: 1,
          name: 'banner板块'
        }, 
        // {
        //   id:1,
        //   value: 2,
        //   name: '企业板块'
        // }, 
        // {
        //   id:2,
        //   value: 3,
        //   name: '活动板块'
        // },
        // {
        //   id:3,
        //   value: 4,
        //   name: '热卖商品'
        // },
        {
          id:4,
          value: 5,
          name: '商品板块'
        },
        {
          id:5,
          value: 6,
          name: '秒杀板块'
        },
        // {
        //   id:6,
        //   value: 7,
        //   name: '预售板块'
        // },
        {
          id:7,
          value: 8,
          name: '商品分类板块'
        },
        // {
        //   id:8,
        //   value: 9,
        //   name: '优惠券板块'
        // },
        {
          id:9,
          value: 10,
          name: '公告'
        }
      ],
      linkoptions: [{
          id:0,
          value: 'combinedGoodList',
          name: '组合商品'
        }, {
          id:1,
          value: 'flashSale',
          name: '限时抢购'
        }, {
          id:2,
          value: 'appointment',
          name: '预约商品'
        },{
          id:3,
          value: 'voucherCenter',
          name: '领券中心'
        },
        {
          id:4,
          value: 'integralMall',
          name: '积分商城'
        }
      ],
      dialogVisible:false,    //选择产品
      dialogVisiblec:false,   //选择企业
      dialogVisible2:false,  //广告位表格中的编辑
      dialogVisibleclass:false,  //选择分类
      goodlist:[],  //保存查询到的所有的商品列表
      companylist:[],  //保存企业列表
      classList:[],
      // 背景图相关
      dialogImageUrl: '',
      dialogVisibleImg: false,
      fileList:[],
      fileList2:[],
      hideUpload: false,
      searchParams:{
        keyword:''
      },
      //单个商品id
      pagesize: 5, //页面一次展示多少数据
      currentPage: 1, // 第几页
      totalCount: 0,
      // 最外面的整体表单
      ruleForm:{
        id:'',
        floorName:'',
        floorDesc:'',
        floorLink:'',
        floorType:'',
        adSort:'',
        backColor:'#000',
        backImg:'',
        cells:[]
      },
      // 点击广告位操作栏中的编辑用于保存广告位信息的表单
      numform:{
        cellSort:'',
        isLink:'是',
        cellLink:'',
        img:''
      },
      rules:{
        floorName: [
          { required: true, message: '请输入楼层名称', trigger: 'blur' }
        ],
        floorType: [
          { required: true, message: '请选择楼层类型', trigger: 'change' }
        ],
        adSort:[
          { required: true, message: '请输入楼层序号', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    // 改变楼层类型
    changefloortype(event){
      console.log(event)
      if(this.ruleForm.id==''){
        this.ruleForm.cells.splice(0)
      }
    },
    // 选择分类
    chooseclass(){
      this.dialogVisibleclass = true;
      this.getClassList();
    },
    getClassList(){
      let params=this.searchParams;
      params.status=1;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get('/b2c/classify/list',{params})
      .then(res=>{
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.classList=res.data.msg.datas;
          this.totalCount=res.data.msg.totalCount;
        }
      })
    },
    // 搜索分类
    searchc(){
      this.currentPage = 1;
      this.getClassList();
    },
    //重置
    resetc(){
      this.searchParams.keyword = "";
      this.getClassList();
    },
    //添加分类
    addclass(row){
      // console.log('点击添加')
      // console.log(row)
      let obj={
        goodClassId:row.id,
        cellName:row.name,
        img:row.logo,
        cellType:8
      }
      this.ruleForm.cells=this.ruleForm.cells.concat(obj)
    },
    // 选择企业
    choosec(){
      this.dialogVisiblec = true;
      this.getcList();
    },
    getcList(){
      let params = this.searchParams;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get("/crm/corporation/list",{params})
        .then(res => {
          if(res.data.code < 0){
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }else{
            let _dataList=res.data.msg.datas;
            this.axios.get('/crm/corporationType/list')
            .then(res=>{
              // console.log('企业列表查询')
              // console.log(res.data)
              for(var i=0;i<_dataList.length;i++){
                let index=_dataList[i].type-1;
                _dataList[i].type=res.data.msg.datas[index].name;
              }
              this.companylist = _dataList;
              // console.log(_dataList)
            })
            this.totalCount = res.data.msg.totalCount;
          }
        }).catch(err => {
          console.log(err);
        });
    },
    // 搜索企业
    searchc(){
      this.currentPage = 1;
      this.getcList();
    },
    //重置
    resetc(){
      this.searchParams.keyword = "";
      this.getcList();
    },
    //添加企业
    addc(row){
      // console.log('点击添加')
      // console.log(row)
      let obj={
        cellCorpId:row.id,
        cellName:row.name,
        img:row.logo,
        cellType:2
      }
      this.ruleForm.cells=this.ruleForm.cells.concat(obj)
    },
    // 选择产品
    choose(){
      this.dialogVisible = true;
      this.getDataList();
    },
    // 获取完整详情列表
    getDataList(){
      let params = this.searchParams;
      params.redeemFlag=false;
      params.pageindex = this.currentPage;
      params.pagesize = this.pagesize;
      this.axios.get("/b2c/product/good/list",{params})
      .then(res => {
        // console.log('这是选择产品点开弹框')
        // console.log(res.data)
        if(res.data.code < 0){
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }else{
          this.goodlist = res.data.msg.datas;
          this.totalCount = res.data.msg.totalCount;
        }
      })
      .catch(err => {
          console.log(err);
      });
    },
    // 搜索商品
    search(){
      this.currentPage = 1;
      this.getDataList();
    },
    //重置
    reset(){
      this.searchParams.keyword = "";
      this.getDataList();
    },
    handleSizeChange(size) {
      this.pagesize = size;
      // dialogVisible:false,    //选择产品
      // dialogVisiblec:false,   //选择企业
      // dialogVisibleclass:false,  //选择分类
      if(this.dialogVisible){
        this.getDataList();
      }else if(this.dialogVisiblec){
        this.getcList();
      }else{
        this.getClassList();
      }
    },
    // 第几页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      if(this.dialogVisible){
        this.getDataList();
      }else if(this.dialogVisiblec){
        this.getcList();
      }else{
        this.getClassList();
      }
    },
    //添加商品
    add(row){
      // console.log('点击添加')
      // console.log(row)
      let obj={
        cellGoodId:row.id,
        cellName:row.goodName,
        img:row.imgUrl,
        cellType:5
      }
      this.ruleForm.cells=this.ruleForm.cells.concat(obj)
    },
    // 广告位编辑
    edit(row){
      // console.log('编辑')
      // console.log(row)
      this.fileList2=[];
      this.dialogVisible2=true;
      this.edittitle='编辑'
      this.numform=row;
      if(row.img && row.img!=''){
        // this.imgUrl2=this.axios.defaults.baseURL + '/b2c/image/' + this.numform.img;
        this.fileList2.push({
          name: this.numform.img,
          url: this.axios.defaults.baseURL + '/b2c/image/' + this.numform.img
        })
        this.hideUpload = this.fileList2.length >= 1;
      }else{
        // this.imgUrl2='';
        this.fileList2=[]
        this.hideUpload = this.fileList2.length >= 1;
      }
      // console.log(this.numform)
    },
    delgood(row){
      // console.log('删除')
      // console.log(this.ruleForm.cells)
      // console.log(row)
      this.$confirm('确定要删除该条广告位吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        for(let i=0;i<this.ruleForm.cells.length;i++){
          if(this.ruleForm.cells[i].cellName==row.cellName){
            this.ruleForm.cells.splice(i,1)
            if(row.id){
              let params={
                id:row.id
              }
              this.axios.get('/b2c/adCell/delete',{params})
              .then(res=>{
                if(res.data.code>0){
                  this.$message.success('删除成功')
                }else{
                  this.$message.error(res.data.msg)
                }
              })
            }
          } 
        }
        // console.log(this.ruleForm.cells)

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })

    },
    // 添加图片
    choosepicture(){
      // console.log('添加图片')
      // console.log(this.ruleForm.cells)
      // this.edittitle='新增'
      // this.dialogVisible2=true;
      // this.numform.cellSort='';
      // this.numform.cellLink='';
      // this.numform.img='';
      // this.imgUrl2='';
      // this.fileList2=[];
      // this.numform.cellName='';
      // this.hideUpload = this.fileList2.length >= 1;
      let obj={
        cellName:'图片',
        img:''
      }
      this.ruleForm.cells=this.ruleForm.cells.concat(obj)
    },
    submit2(formName){
      // console.log(this.numform)
      this.dialogVisible2 = false;
      if(this.edittitle=='编辑'){
        for(var i=0;i<this.ruleForm.cells.length;i++){
          if(this.ruleForm.cells[i].cellName==this.numform.cellName){
            this.ruleForm.cells[i]=JSON.parse(JSON.stringify(this.numform));
          }
        }
      }else{
        let obj=JSON.parse(JSON.stringify(this.numform));
        this.ruleForm.cells=this.ruleForm.cells.concat(obj)
      }
      this.fileList2=[]
    },
    // 上传图片成功之后的回调2
    handleAvatarSuccess2(res, file,fileList) {
      // console.log('图片2上传成功')
      this.numform.img=res.msg.fileName;
      this.imgUrl2 = URL.createObjectURL(file.raw);
      this.hideUpload = fileList.length >= 1;
      // console.log(file);
      // console.log(res)
    },
    handleRemove2(file,fileList) {
      // console.log('移除之后的回调')
      // console.log(fileList);
      // console.log(2)
      this.numform.img=''
      // console.log(this.ruleForm.backImg)
      this.hideUpload = fileList.length >= 1;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    handleRemove(file,fileList) {
      // console.log('移除之后的回调')
      // console.log(fileList);
      // console.log(2)
      this.ruleForm.backImg=''
      // console.log(this.ruleForm.backImg)
      this.hideUpload = fileList.length >= 1;
    },
    // 上传背景图成功之后的回调
    handleAvatarSuccess(res, file,fileList) {
      // console.log('图片上传成功')
      this.ruleForm.backImg=res.msg.fileName;
      this.imgUrl = URL.createObjectURL(file.raw);
      // console.log(file);
      // console.log(res);
      // console.log(this.fileList)
      this.hideUpload = fileList.length >= 1;
    },
    // 背景图上传之前的回调
    beforeAvatarUpload(file) {
      // console.log(file)
      // console.log(this.fileList)
      // if(this.fileList.length>0){
      //   this.$message.warning('只允许上传一张图片')
      // }
    },
    // 返回按钮
    goback(){
      this.$router.back(-1);
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for(var i=0;i<this.ruleForm.cells.length;i++){
            if(this.ruleForm.cells[i].isLink=='是'){
              this.ruleForm.cells[i].isLink=true;
            }else{
              this.ruleForm.cells[i].isLink=false;
            }
          }
          let params=this.ruleForm;
          this.axios.post('/b2c/adFloor/save',params)
          .then(res => {
            // console.log('这是保存提交是返回的数据')
            // console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }else{
              this.$message.error(res.data.msg);
            }
            this.$router.push('/bannerlist')
          })
        } else {
          this.$message.error('请完善内容后提交保存!');
          return false;
        }
      });
      
    },
    // 点击编辑跳转过来的页面数据获取
    getData(){
      let params={
        showCells:true,
        id:this.ruleForm.id
      }
      this.axios.get('/b2c/adFloor/findOne',{params})
      .then(res=>{
        // console.log(res.data)
        this.ruleForm=res.data.msg;
        if(this.ruleForm.backImg!=''){
          this.imgUrl =this.axios.defaults.baseURL + '/b2c/image/' + this.ruleForm.backImg;
          this.fileList.push({
            name: this.ruleForm.backImg,
            url: this.axios.defaults.baseURL + '/b2c/image/' + this.ruleForm.backImg
          })
          this.hideUpload = this.fileList.length >= 1;
        }
        for(var i=0;i<this.ruleForm.cells.length;i++){
          if(this.ruleForm.cells[i].isLink){
            this.ruleForm.cells[i].isLink='是'
          }else{
            this.ruleForm.cells[i].isLink='否'
          }
        }
      })
    },
    // 获取楼层
    getOption(){
      let params={
        status:1
      }
      this.axios.get('/b2c/floorType/list',{params})
      .then(res=>{
        if(res.data.msg.datas.length>0){
          this.options=res.data.msg.datas;
        }
      })
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.ruleForm.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.getData();
    }
    // this.getOption();   //先写死，后期有需求可以打开获取自定义楼层类型
  }
}
</script>

<style lang="scss">
  .hide .el-upload--picture-card{
    display: none;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .m-colorPicker .box[data-v-11842410]{
    z-index:10;
  }
 .el-button--primary{
    margin-right:20px !important;
  }
  .imgsize{
    width:50px;
    height:50px;
    border-radius: 5px;
  }
  .m-colorPicker .colorBtn[data-v-11842410]{
    border:1px solid #DCDFE6;
  }
  .searchbox{
  font-size: 14px;
}
</style>