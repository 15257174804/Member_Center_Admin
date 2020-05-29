<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="模板名称" prop="name" placeholder="请输入模板名称">
        <el-input v-model="ruleForm.name" placeholder="请输入模板名称"></el-input>
      </el-form-item>
      <el-form-item label="发货时间" prop="sendInDays">
        <el-select v-model="ruleForm.sendInDays" placeholder="请选择发货时间">
          <el-option label="1天内发货" value=1></el-option>
          <el-option label="2天内发货" value=2></el-option>
          <el-option label="3天内发货" value=3></el-option>
          <el-option label="4天内发货" value=4></el-option>
          <el-option label="5天内发货" value=5></el-option>
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="是否包邮" prop="weatherItIsFree">
        <el-radio-group v-model="ruleForm.weatherItIsFree">
          <el-radio :label="1">自定义运费</el-radio>
          <el-radio :label="2">卖家承担运费</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 是否显示隐藏以下区域 -->
      <div :class="ruleForm.weatherItIsFree==2?'isShow':''">

        <el-form-item label="计价方式" prop="valuationMethods">
          <el-radio-group v-model="ruleForm.valuationMethods">
            <el-radio :label="1">按件数</el-radio>
            <el-radio :label="2">按重量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="add1" style="margin:10px 0 10px 0;">请设置区域运费计价方式 <i class="el-icon-plus"></i></el-button>
        
        <el-table
          border
          :data="ruleForm.postageCalculateList"
          height="200"
          :header-cell-style="headClass"
          style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="effectiveAreaName" label="运送区域"></el-table-column>
          <el-table-column prop="defaultQuantity" label="首件数/首重kg"></el-table-column>
          <el-table-column prop="defaultPrice" label="首费"></el-table-column>
          <el-table-column prop="increaseQuantity" label="续件数/续重kg"></el-table-column>
          <el-table-column prop="increasePrice" label="续费" ></el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="edit1(scope.$index,scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
              <el-button type="text" @click="del1(scope.$index, scope.row)"><i class="el-icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 弹出框1 -->
        <el-dialog title='请设置区域运费计价方式' :visible.sync="dialogFormVisible1" append-to-body width="40%" :close-on-click-modal='false' :show-close="false">
          <el-form :model="form1" label-width="120px" ref="form1">
            <el-form-item label="配送区域" prop="effectiveArea">
              <el-select v-model="form1.effectiveArea" multiple placeholder="请选择" style="width:90%;">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首件数/首重kg" prop="defaultQuantity">
              <el-input v-model="form1.defaultQuantity" autocomplete="off" style='width:90%;'></el-input>
            </el-form-item>
            <el-form-item label="首费" prop="defaultPrice">
              <el-input v-model="form1.defaultPrice" autocomplete="off" style='width:90%;'></el-input>
            </el-form-item>
            <el-form-item label="续件数/续重kg" prop="increaseQuantity">
              <el-input v-model="form1.increaseQuantity" autocomplete="off" style='width:90%;'></el-input>
            </el-form-item>
            <el-form-item label="续费" prop="increasePrice">
              <el-input v-model="form1.increasePrice" autocomplete="off" style='width:90%;'></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="rset1('form1')">取 消</el-button>
            <el-button type="primary" @click="save1('form1')">确 定</el-button>
          </div>
        </el-dialog>

        <el-button type="primary" @click="add2" style="margin:10px 0 10px 0;">请设置免邮条件 <i class="el-icon-plus"></i></el-button>
        
        <el-table
          border
          :data="ruleForm.postageFreeList"
          height="200"
          :header-cell-style="headClass"
          style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="effectiveAreaName" label="运送区域"></el-table-column>
          <el-table-column prop="quantity" label="满多少件包邮">
            <template slot-scope="scope">
              <span v-if="scope.row.quantity!=''">{{scope.row.quantity}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="满多少元包邮">
            <template slot-scope="scope">
              <span v-if="scope.row.amount!=''">{{scope.row.amount}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="edit2(scope.$index,scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
              <el-button type="text" @click="del2(scope.$index,scope.row)"><i class="el-icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 弹出框2 -->
        <el-dialog title='请设置免邮条件' :visible.sync="dialogFormVisible2" append-to-body width="40%" :close-on-click-modal='false' :show-close="false">
          <el-form :model="form2" label-width="120px" ref="form2">
            <el-form-item label="配送区域" prop="effectiveArea">
              <el-select v-model="form2.effectiveArea" multiple placeholder="请选择" style='width:90%;'>
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="包邮方式">
              <el-radio-group v-model="form2.packageMailConditions" @change="changeType($event)">
                <el-radio label=2>按金额</el-radio>
                <el-radio label=1>按件数</el-radio>
                <el-radio label=3>金额+件数</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="满多少件包邮" prop="quantity">
              <el-input v-model="form2.quantity" :disabled="form2.packageMailConditions=='2'" style='width:90%;'></el-input>
            </el-form-item>
            <el-form-item label="满多少元包邮" prop="amount">
              <el-input v-model="form2.amount" :disabled="form2.packageMailConditions=='1'" style='width:90%;'></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="rset2('form2')">取 消</el-button>
            <el-button type="primary" @click="save2('form2')">确 定</el-button>
          </div>
        </el-dialog>

      </div>
      
      
    </el-form>
  </div>
</template>

<script>
export default {
  name:'dilog',
  props:{
    parentform:Object
  },
  data(){
    return {
      dialogFormVisible1:false,
      dialogFormVisible2:false,
      cityVisible1:false,
      cityVisible2:false,
      options:[],  //保存城市信息
      form1:{
        id:'',
        defaultQuantity:'',
        defaultPrice:'',
        increaseQuantity:'',
        increasePrice:'',
        effectiveArea:'',
        effectiveAreaName:''
      },
      form2:{
        id:'',
        quantity:'',
        amount:'',
        effectiveArea:'',
        effectiveAreaName:'',
        packageMailConditions:'',
      },
      ruleForm:{
        name:'',
        sendInDays:1,
        weatherItIsFree:1,   //是否包邮
        valuationMethods:1,  //按件数1
        postageCalculateList:[],  //运费计算方式
        postageFreeList:[]   //免邮条件
      },
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        weatherItIsFree: [
          { required: true, trigger: 'change' }
        ]
      },

    }
  },
  watch:{
    parentform(){  //监听父组件中是否有数据
      this.getparentform()
    }
  },
  methods:{
    // 切换免邮方式
    changeType(e){
      // console.log(e)
      this.form2.quantity='';
      this.form2.amount='';
    },
    getparentform(){
      this.$nextTick(function(){
        // console.log('监听父组件是否有参数传过来')
        if(this.parentform.id){
          // console.log(this.parentform)
          this.ruleForm=this.parentform;
          this.ruleForm.sendInDays=this.ruleForm.sendInDays.toString()
        }
        else{
          this.ruleForm={
            name:'',
            sendInDays:'',
            weatherItIsFree:1,   //是否包邮
            valuationMethods:1,  //按件数1
            postageCalculateList:[],  //运费计算方式
            postageFreeList:[]   //免邮条件
          }
        }
      })
    },
    // 获取省
    getsheng() {
      let params = {
        level: 1,
        superiorId: 100000,
        pagesize: 40
      };
      this.axios
      .get("/crm/region/list", {params})
      .then(res => {
          if (res.data.code > 0) {//请求成功
            this.options = res.data.msg.datas;//将获取的数据赋值
          } 
          // console.log(this.options)
      })
      .catch(err => {
          console.log(err);
      });
    },
    add1(){
      let obj={
        id:'',
        effectiveArea:'',
        defaultQuantity:'',
        defaultPrice:'',
        increaseQuantity:'',
        increasePrice:'',
        effectiveAreaName:''
      }
      this.ruleForm.postageCalculateList.push(obj)
    },
    edit1(index,row){
      // console.log(row)
      this.dialogFormVisible1=true;
      this.form1=row;
      if(this.form1.id==''){
        this.form1.id=index;
      }
      if(this.form1.effectiveArea!=''){
        this.form1.effectiveArea=this.form1.effectiveArea.toString();
        this.form1.effectiveArea=this.form1.effectiveArea.split(',');
        this.form1.effectiveArea=this.form1.effectiveArea.map(Number)
      }
      // console.log(this.form1)
      // console.log(this.form1.effectiveArea[0],typeof this.form1.effectiveArea[0])
      this.getsheng();
    },
    save1(formName){
      this.dialogFormVisible1=false;
      this.form1.effectiveAreaName='';
      for(let i=0;i<this.form1.effectiveArea.length;i++){
        for(let j=0;j<this.options.length;j++){
          if(this.form1.effectiveArea[i]==this.options[j].id){
            this.form1.effectiveAreaName=this.form1.effectiveAreaName+' '+this.options[j].name
          }
        }
      }
      for(let i=0;i<this.ruleForm.postageCalculateList.length;i++){
        if(this.ruleForm.postageCalculateList[i].id==this.form1.id){
          this.ruleForm.postageCalculateList[i]=this.form1;    //JSON.parse(JSON.stringify( this.form1 )); 
          if(this.ruleForm.postageCalculateList[i].effectiveArea.length>0){
            this.ruleForm.postageCalculateList[i].effectiveArea=this.ruleForm.postageCalculateList[i].effectiveArea.join(',')
          }
        }
      }
      // console.log(this.ruleForm.postageCalculateList)
    },
    rset1(formName){
      this.dialogFormVisible1 = false;
      for(let i=0;i<this.ruleForm.postageCalculateList.length;i++){
        if(this.ruleForm.postageCalculateList[i].id==this.form1.id){
          this.ruleForm.postageCalculateList[i]=this.form1;  //JSON.parse(JSON.stringify( this.form1 ));
          if(this.ruleForm.postageCalculateList[i].effectiveArea.length>0){
            this.ruleForm.postageCalculateList[i].effectiveArea=this.ruleForm.postageCalculateList[i].effectiveArea.join(',')
          }
        }
      }
      // console.log(this.ruleForm.postageCalculateList)
      // this.$refs[formName].resetFields();
    },
    handleClose1(){
      for(let i=0;i<this.ruleForm.postageCalculateList.length;i++){
        if(this.ruleForm.postageCalculateList[i].id==this.form1.id){
          this.ruleForm.postageCalculateList[i]=this.form1;   //JSON.parse(JSON.stringify( this.form1 ));
          if(this.ruleForm.postageCalculateList[i].effectiveArea.length>0){
            this.ruleForm.postageCalculateList[i].effectiveArea=this.ruleForm.postageCalculateList[i].effectiveArea.join(',')
          }
        }
      }
      // console.log(this.ruleForm.postageCalculateList)
    },
    del1(index,row){
      // console.log(row)
      this.$confirm('确定要删除该条记录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.ruleForm.postageCalculateList.splice(index,1)
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    add2(){
      let obj={
        id:'',
        effectiveArea:'',
        effectiveAreaName:'',
        quantity:'',
        amount:'',
        packageMailConditions:'',
        transportMethod:1
      }
      this.ruleForm.postageFreeList.push(obj)
    },
    edit2(index,row){
      // console.log(row)
      this.dialogFormVisible2=true;
      this.form2=row;
      if(this.form2.id==''){
        this.form2.id=index;
      }
      if(this.form2.effectiveArea!=''){
        this.form2.effectiveArea=this.form2.effectiveArea.toString();
        this.form2.effectiveArea=this.form2.effectiveArea.split(',');
        this.form2.effectiveArea=this.form2.effectiveArea.map(Number)
      }
      this.form2.packageMailConditions=this.form2.packageMailConditions.toString()
      this.getsheng();
    },
    save2(formName){
      this.dialogFormVisible2=false;
      // console.log('save2')
      // console.log(11111)
      this.form2.effectiveAreaName='';
      for(let i=0;i<this.form2.effectiveArea.length;i++){
        for(let j=0;j<this.options.length;j++){
          if(this.form2.effectiveArea[i]==this.options[j].id){
            this.form2.effectiveAreaName=this.form2.effectiveAreaName+' '+this.options[j].name
          }
        }
      }
      for(let i=0;i<this.ruleForm.postageFreeList.length;i++){
        if(this.ruleForm.postageFreeList[i].id==this.form2.id){
          this.ruleForm.postageFreeList[i]=this.form2;  //JSON.parse(JSON.stringify( this.form2 ));
          if(this.ruleForm.postageFreeList[i].effectiveArea.length>0){
            this.ruleForm.postageFreeList[i].effectiveArea=this.ruleForm.postageFreeList[i].effectiveArea.join(',')
          }
        }
      }
      // console.log(this.ruleForm.postageFreeList)
    },
    rset2(formName){
      this.dialogFormVisible2 = false;
      for(let i=0;i<this.ruleForm.postageFreeList.length;i++){
        if(this.ruleForm.postageFreeList[i].id==this.form2.id){
          this.ruleForm.postageFreeList[i]=this.form2;  //JSON.parse(JSON.stringify( this.form2 ));
          if(this.ruleForm.postageFreeList[i].effectiveArea.length>0){
            this.ruleForm.postageFreeList[i].effectiveArea=this.ruleForm.postageFreeList[i].effectiveArea.join(',')
          }
        }
      }
      // this.$refs[formName].resetFields();
    },
    handleClose2(){
      for(let i=0;i<this.ruleForm.postageFreeList.length;i++){
        if(this.ruleForm.postageFreeList[i].id==this.form2.id){
          this.ruleForm.postageFreeList[i]=this.form2;//JSON.parse(JSON.stringify( this.form2 ));
          if(this.ruleForm.postageFreeList[i].effectiveArea.length>0){
            this.ruleForm.postageFreeList[i].effectiveArea=this.ruleForm.postageFreeList[i].effectiveArea.join(',')
          }
        }
      }
      // console.log(this.ruleForm.postageFreeList)
    },
    del2(index,row){
      this.$confirm('确定要删除该条记录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.ruleForm.postageFreeList.splice(index,1)
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    // 表头样式设置
    headClass () {
      return 'background:#EBEEF5;'
    },
  }
}
</script>

<style>
.isShow{
  display: none;
}
</style>