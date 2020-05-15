<template>
  <div id="display">
    <appheader />
    <topbar />
    <sidebar />
  </div>
</template>

<script>
import appheader from "../components/Header";
import sidebar from "../components/Sidebar";
import topbar from "../components/Topbar";
export default {
  name: "display",
  components: {
    sidebar,
    appheader,
    topbar
  }
};
</script>
<style scoped>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: Helvetica, ‘Hiragino Sans GB’, ‘Microsoft Yahei’, ‘微软雅黑’,
    Arial, sans-serif;
  background: #f0f3f4;
}
#display {
  width: 100%;
  height: 100%;
}
a {
  color: #303133;
  text-decoration: none;
}
.title {
  color: #303133;
  width: 100%;
  font-size: 1rem;
  border-bottom: 1px solid #c3c6cf;
  padding: 20px 20px;
}

.title i{
  color: #fff;
}
#display >>> .wrap{
  top: 100px!important;
  width: calc(100% - 200px);
}

#display >>> .el-col .wrap{
  width: auto;
}

#display >>> #header>.wrap{
   width: 100%;
}

#display >>> .title>i{
   color: #fff;
}
/* menu */

#display >>> .el-submenu .el-menu-item{
  display: inline-block;
  width: 50%;
  padding: 0;
  text-align: center;
  padding-left: 0 !important; 
  min-width: 0;
  height: 40px;
  line-height: 40px;
}

#display >>> .el-menu-item-group__title{
  padding: 0;
}

#display >>> .el-menu-item:hover,#display >>> .el-menu-item.is-active{
  background-color: #fff;
  color: #4B9BF7;
}

#display >>> .el-submenu__title:hover{
  background-color: #fff;
}

#display >>> .el-submenu__title{
  padding-left: 8px !important;
  padding: 0 8px;
  font-weight: bold;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  pointer-events: none;
}

#display >>> .el-menu-item-group>ul{
  padding-left: 22px;
}

#display >>> .el-submenu__title > i{
  color: #4B9BF7;
  position: relative;
  top: -2px;
  margin-right: 8px;
}

#display >>> .el-menu{
  display: block!important;
}

#display >>> i.el-submenu__icon-arrow,i.el-submenu__icon-arrow{
  display: none !important;
}
/* header */
#display >>> .el-breadcrumb__inner{
  color: #fff;
}

#display >>> .el-breadcrumb__inner a,#display>>> .el-breadcrumb__inner.is-link{
  color: #fff;
}

#display >>> #fold{
  color: #fff;
}

#display >>> .loginin i,#display >>> .loginin .el-dropdown{
  color: #fff;
}

#display >>> .el-badge{
  outline: none;
}

#display >>> .el-badge__content{
  top: 15px;
  right: 15px;
  height: 12px;
  line-height: 12px;
}

/* form */
#display >>> .el-form *{
  font-size: 14px;
}

#display >>> .el-form{
  /* width: 90%; */
  margin-top: .7rem;
}

#display >>> .el-tabs{
  margin-top: 1rem;
}

#display >>> .el-form .el-input{
  width: 300px;
}


#display >>> .half-form{
  width: 50%;
  float: left;
}

#display >>> .disabled .el-upload--picture-card {
  display: none !important;
}


#display >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9!important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
#display >>> .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
#display >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#display >>> .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>