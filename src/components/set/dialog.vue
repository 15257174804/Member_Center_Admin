<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="模板名称" prop="name" placeholder="请输入模板名称">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="发货时间" prop="sendInDays">
        <el-select v-model="ruleForm.sendInDays" placeholder="请选择发货时间">
          <el-option label="1天内发货" value="1"></el-option>
          <el-option label="2天内发货" value="2"></el-option>
          <el-option label="3天内发货" value="3"></el-option>
          <el-option label="4天内发货" value="4"></el-option>
          <el-option label="5天内发货" value="5"></el-option>
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
          <el-radio-group v-model="ruleForm.weatherItIsFree">
            <el-radio :label="1">按件数</el-radio>
            <el-radio :label="2" disabled>按数量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="add1" style="margin:10px 0 10px 0;">请设置区域运费计价方式 <i class="el-icon-plus"></i></el-button>
        
        <el-table
          :data="ruleForm.postageCalculateList"
          height="200"
          border
          :header-cell-style="headClass"
          style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="effectiveAreaName" label="运送区域"></el-table-column>
          <el-table-column prop="defaultQuantity" label="首件数"></el-table-column>
          <el-table-column prop="defaultPrice" label="首费"></el-table-column>
          <el-table-column prop="increaseQuantity" label="续件数"></el-table-column>
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
        <el-dialog :visible.sync="dialogFormVisible1" append-to-body width="35%">
          <el-form :model="form1" label-width="80px" ref="form1">
            <el-form-item label="配送区域" prop="effectiveArea">
              <el-select v-model="form1.effectiveArea" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首件数" prop="defaultQuantity">
              <el-input v-model="form1.defaultQuantity" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="首费" prop="defaultPrice">
              <el-input v-model="form1.defaultPrice" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="续件数" prop="increaseQuantity">
              <el-input v-model="form1.increaseQuantity" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="续费" prop="increasePrice">
              <el-input v-model="form1.increasePrice" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="rset1('form1')">取 消</el-button>
            <el-button type="primary" @click="save1('form1')">确 定</el-button>
          </div>
        </el-dialog>

        <el-button type="primary" @click="add2" style="margin:10px 0 10px 0;">请设置免邮条件 <i class="el-icon-plus"></i></el-button>
        
        <el-table
          :data="ruleForm.postageFreeList"
          height="200"
          border
          :header-cell-style="headClass"
          style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="effectiveAreaName" label="运送区域"></el-table-column>
          <el-table-column prop="quantity" label="满多少件包邮"></el-table-column>
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
        <el-dialog :visible.sync="dialogFormVisible2" append-to-body width="35%">
          <el-form :model="form2" label-width="120px" ref="form2">
            <el-form-item label="配送区域" prop="effectiveArea">
              <el-select v-model="form2.effectiveArea" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="满多少件包邮" prop="quantity">
              <el-input v-model="form2.quantity" autocomplete="off"></el-input>
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
        effectiveArea:'',
        effectiveAreaName:''
      },
      ruleForm:{
        name:'',
        sendInDays:'',
        weatherItIsFree:1,   //是否包邮
        valuationMethods:1,  //按件数1
        postageCalculateList:[],  //运费计算方式
        postageFreeList:[]   //免邮条件
      },
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        // sendInDays: [
        //   { required: true, trigger: 'change' ,message: '请输入发货时间'}
        // ],
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
    rset2(formName){
      this.dialogFormVisible2 = false;
      // this.$refs[formName].resetFields();
    },
    rset1(formName){
      this.dialogFormVisible1 = false;
      // this.$refs[formName].resetFields();
    },
    getparentform(){
      this.$nextTick(function(){
        console.log('监听父组件是否有参数传过来')
        if(this.parentform.id){
          console.log(this.parentform)
          this.ruleForm=this.parentform;
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
          // // console.log(Array.isArray(this.ruleForm.postageCalculateList[0].effectiveArea))
          // console.log(this.ruleForm.postageCalculateList)
          // console.log(this.ruleForm.postageFreeList)
          // for(var i=0;i<this.ruleForm.postageCalculateList.length;i++){
          //   this.ruleForm.postageCalculateList[i].effectiveArea=this.ruleForm.postageCalculateList[i].effectiveArea.split('"')
          //   this.ruleForm.postageCalculateList[i].effectiveArea=this.ruleForm.postageCalculateList[i].effectiveArea.slice(1)
          //   this.ruleForm.postageCalculateList[i].effectiveArea.pop()
          //   this.ruleForm.postageCalculateList[i].effectiveArea=this.ruleForm.postageCalculateList[i].effectiveArea.filter((elem,index,arr)=>{
          //     return elem!=','
          //   })
          //   console.log(this.ruleForm.postageCalculateList[i].effectiveArea)
          // }
          // for(var j=0;j<this.ruleForm.postageFreeList.length;j++){
          //   this.ruleForm.postageFreeList[j].effectiveArea=this.ruleForm.postageFreeList[j].effectiveArea.split('"')
          //   this.ruleForm.postageFreeList[j].effectiveArea=this.ruleForm.postageFreeList[j].effectiveArea.slice(1)
          //   this.ruleForm.postageFreeList[j].effectiveArea.pop()
          //   this.ruleForm.postageFreeList[j].effectiveArea=this.ruleForm.postageFreeList[j].effectiveArea.filter((elem,index,arr)=>{
          //     return elem!=','
          //   })
          //   console.log(this.ruleForm.postageFreeList[j].effectiveArea)
          // }

      })
    },
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
            this.options = res.data.msg.datas;//将获取的数据赋值
          } 
          console.log(this.options)
      })
      .catch(err => {
          console.log(err);
      });
    },
    add1(){
      let obj={
        effectiveArea:'',
        defaultQuantity:0,
        defaultPrice:0,
        increaseQuantity:0,
        increasePrice:0
      }
      this.ruleForm.postageCalculateList.push(obj)
    },
    edit1(index,row){
      this.dialogFormVisible1=true;
      this.form1.id=index;
      this.getsheng();
    },
    save1(formName){
      this.dialogFormVisible1=false;
      let index=this.form1.id;
      console.log(11111)
      this.form1.effectiveAreaName=''
      for(var i=0;i<this.form1.effectiveArea.length;i++){
        for(var j=0;j<this.options.length;j++){
          if(this.form1.effectiveArea[i]==this.options[j].id){
            
            this.form1.effectiveAreaName=this.form1.effectiveAreaName+' '+this.options[j].name
          }
        }
      }
      console.log(this.form1.effectiveArea)
      console.log(this.form1.effectiveAreaName)
      console.log(2222222222)

      this.ruleForm.postageCalculateList[index].effectiveArea=this.form1.effectiveArea.join();
      this.ruleForm.postageCalculateList[index].effectiveAreaName=this.form1.effectiveAreaName;
      this.ruleForm.postageCalculateList[index].transportMethod=1;
      this.ruleForm.postageCalculateList[index].defaultQuantity=this.form1.defaultQuantity;
      this.ruleForm.postageCalculateList[index].defaultPrice=this.form1.defaultPrice;
      this.ruleForm.postageCalculateList[index].increaseQuantity=this.form1.increaseQuantity;
      this.ruleForm.postageCalculateList[index].increasePrice=this.form1.increasePrice;
      console.log(this.ruleForm.postageCalculateList[index])

      // this.$refs[formName].resetFields();
    },
    del1(index,row){
      console.log(row)
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
        effectiveArea:'',
        quantity:0
      }
      this.ruleForm.postageFreeList.push(obj)
    },
    edit2(index,row){
      this.dialogFormVisible2=true;
      this.form2.id=index;
      this.getsheng();
    },
    save2(formName){
      this.dialogFormVisible2=false;
      let index=this.form2.id;
      console.log('save2')
      console.log(11111)
      this.form2.effectiveAreaName=''
      for(var i=0;i<this.form2.effectiveArea.length;i++){
        for(var j=0;j<this.options.length;j++){
          if(this.form2.effectiveArea[i]==this.options[j].id){
            
            this.form2.effectiveAreaName=this.form2.effectiveAreaName+' '+this.options[j].name
          }
        }
      }
      this.ruleForm.postageFreeList[index].effectiveArea=this.form2.effectiveArea.join();
      this.ruleForm.postageFreeList[index].effectiveAreaName=this.form2.effectiveAreaName;
      this.ruleForm.postageFreeList[index].transportMethod=1;
      this.ruleForm.postageFreeList[index].packageMailConditions=1;
      this.ruleForm.postageFreeList[index].quantity=this.form2.quantity;
      console.log(this.ruleForm.postageFreeList[index])

      // this.$refs[formName].resetFields();
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