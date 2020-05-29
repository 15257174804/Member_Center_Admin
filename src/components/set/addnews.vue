<template>
  <div class="addnews">
    <!-- 标题 -->
    <div class="title clearfix">
      <span>公告编辑 | </span>
      <span>{{title}}</span>
    </div>
    <!-- 表单内容 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" >
      
        <!-- 输入预约活动名称 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题图片" prop="titlePic">
          <!-- <el-upload
            class="avatar-uploader"
            :action="axios.defaults.baseURL + '/crm/file/imgupload?token=' + token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
          <!-- 修改 -->
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

        <!-- 后期有要求可使用富文本编辑器  https://www.jianshu.com/p/d0c1884505f1 -->
        <el-form-item label="内容" prop="context">
          <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="ruleForm.context" placeholder="请输入公告内容"></el-input> -->
          <quill-editor v-model="ruleForm.context" ref="myQuillEditor" style="height: 300px;width:80%;margin-bottom:50px;" :options="editorOption">
            <!-- 自定义toolar -->
            <div id="toolbar" slot="toolbar">
              <!-- Add a bold button -->
              <button class="ql-bold" title="加粗">Bold</button>
              <button class="ql-italic" title="斜体">Italic</button>
              <button class="ql-underline" title="下划线">underline</button>
              <button class="ql-strike" title="删除线">strike</button>
              <button class="ql-blockquote" title="引用"></button>
              <button class="ql-code-block" title="代码"></button>
              <button class="ql-header" value="1" title="标题1"></button>
              <button class="ql-header" value="2" title="标题2"></button>
              <!--Add list -->
              <button class="ql-list" value="ordered" title="有序列表"></button>
              <button class="ql-list" value="bullet" title="无序列表"></button>
              <!-- Add font size dropdown -->
              <select class="ql-header" title="段落格式">
                <option selected>段落</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
              </select>
              <select class="ql-size" title="字体大小">
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px" selected>16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
              <select class="ql-font" title="字体">
                <option value="SimSun">宋体</option>
                <option value="SimHei">黑体</option>
                <option value="Microsoft-YaHei">微软雅黑</option>
                <option value="KaiTi">楷体</option>
                <option value="FangSong">仿宋</option>
                <option value="Arial">Arial</option>
              </select>
              <!-- Add subscript and superscript buttons -->
              <select class="ql-color" value="color" title="字体颜色"></select>
              <select class="ql-background" value="background" title="背景颜色"></select>
              <select class="ql-align" value="align" title="对齐"></select>
              <button class="ql-clean" title="还原"></button>
              <!-- You can also add your own -->
              <button class="ql-image" title="图片"></button>
              <button class="ql-link" title="链接"></button>
            </div>
          </quill-editor>
        </el-form-item>
      
      <el-form-item  style="margin:20px 0 20px 0;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import {Quill,quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入font.css 
import '../../assets/css/font.css'

// 自定义字体大小
let Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
Quill.register(Size, true)

// 自定义字体类型
var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
  '宋体', '黑体'
]
var Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)
export default {
  name:'addnews',
  components: {
    quillEditor
  },
  data(){
    return {
      editorOption: {
        placeholder: "请输入",
          theme: "snow", // or 'bubble' 
          modules: {
            toolbar: {
              container: '#toolbar'
            }
          }
      },
      title:'新增公告',
      token: localStorage.getItem('loginToken'),
      imgUrl:'',
      options: [{
          value: 1,
          label: '行业资讯'
        }, {
          value: 2,
          label: '招商信息'
        }
      ],
      ruleForm:{
        id:'',
        title:'',
        type:'',
        titlePic:'',
        context:null
      },
      rules:{
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择公告类型', trigger: 'change' }
        ],
        context: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisibleImg: false,
      fileList:[],
      hideUpload:false
    }
  },
  methods:{
    // 上传背景图成功之后的回调
    handleAvatarSuccess(res, file,fileList) {
      // console.log('图片上传成功')
      this.ruleForm.titlePic=res.msg.fileName;
      this.imgUrl = URL.createObjectURL(file.raw);
      // console.log(file);
      // console.log(res)
      this.hideUpload = fileList.length >= 1;
    },
    // 背景图上传之前的回调
    beforeAvatarUpload(file) {
      // console.log(file)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false
      }else{
        const isSize = new Promise((resolve, reject) => {
          const _URL = window.URL || window.webkitURL;
          const img = new Image();
          img.onload = () => {
            const valid = img.width/img.height==1.875;
            valid ? resolve() : reject();
          };
          img.src = _URL.createObjectURL(file);
        }).then(() => {
            return file;
          },() => {
            this.$message.error('建议图片比例应为750:400');
            return Promise.reject();
          }
        )
        return isSize
      }
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
      this.ruleForm.titlePic=''
      // console.log(this.ruleForm.titlePic)
      this.hideUpload = fileList.length >= 1;
    },
    // 返回按钮
    goback(){
      this.$router.back(-1);
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params=this.ruleForm;
          this.axios.post('/b2c/news/save',params)
          .then(res => {
            // console.log('这是保存提交是返回的数据')
            // console.log(res.data)
            if(res.data.code > 0){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.$router.push('/newslist')
            }else{
              this.$message.error(res.data.msg);
            }
          })
        } else {
          this.$message.error('请完善内容后提交保存!');
          return false;
        }
      });
    },
    getData(){
      // console.log('获取页面元素')
      let params={
        id:this.ruleForm.id
      }
      this.axios.get('/b2c/news/newsDetail',{params})
      .then(res=>{
        this.ruleForm=res.data.msg;
        this.imgUrl=this.axios.defaults.baseURL + '/b2c/image/' + this.ruleForm.titlePic;
        this.fileList=[
          {
            name:this.ruleForm.titlePic,
            url:this.axios.defaults.baseURL + '/b2c/image/' + this.ruleForm.titlePic
          }
        ]
        this.hideUpload = this.fileList.length >= 1;
      })
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.ruleForm.id = this.$route.query.id;
      this.title=this.$route.query.title;
      this.getData();
    }
    // console.log(this.$store.state.groupId)
  }
}
</script>

<style lang='scss'>
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
.el-textarea__inner{
  width:50%;
}
</style>