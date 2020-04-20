<template>
  <div id="sidebar">
    <el-container style="border: 1px solid #eee,width:200px;">
      <el-aside id="elaside" width="200px">
        <el-menu :default-openeds="['1', '1']">
          <div v-for="(v,i) in menu" :key=i>
            <!-- <template v-if="v.items.length == 0">
              <router-link to="v.link">
                <el-submenu index="i">
                  <template slot="title">
                    <i :class="v.icon"></i>
                    {{v.title}}
                  </template>
                </el-submenu>
              </router-link>
            </template> -->
            <!-- <template v-else>
              <el-submenu index="11">
                <template slot="title">
                  <i class="el-icon-share"></i>组织架构管理
                </template>
                <el-menu-item-group v-if="this.$store.state.flodKey != 1">
                  <router-link to="/company">
                    <el-menu-item index="11-1">我的企业</el-menu-item>
                  </router-link>
                  <router-link to="/employee">
                    <el-menu-item index="11-2">我的员工</el-menu-item>
                  </router-link>
                  <router-link to="/customer">
                    <el-menu-item index="11-3">我的会员</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
            </template> -->
          </div>
          <el-submenu index="0">
            <div style="height:5px;"></div>
          </el-submenu>

          <router-link to="/home">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-home"></i>
                首页
              </template>
            </el-submenu>
          </router-link>

          <router-link to="/driver">
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-flag"></i>引导指南
              </template>
            </el-submenu>
          </router-link>

          <el-submenu index="11">
            <template slot="title">
              <i class="el-icon-share"></i>组织架构管理
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/company">
                <el-menu-item index="11-1">我的企业</el-menu-item>
              </router-link>
              <router-link to="/employee">
                <el-menu-item index="11-2">我的员工</el-menu-item>
              </router-link>
              <!-- <router-link to="/audit">
                <el-menu-item index="11-3">企业审核</el-menu-item>
              </router-link> -->
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="12">
            <template slot="title">
              <i class="el-icon-s-goods"></i>商品管理
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/good">
                <el-menu-item index="12-1">商品列表</el-menu-item>
              </router-link>
              <!-- <router-link to="/presell">
                <el-menu-item index="12-2">商品预售</el-menu-item>
              </router-link> -->
              <router-link to="/goodpresell">
                <el-menu-item index="12-2">预约管理</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="13">
            <template slot="title">
              <i class="el-icon-s-grid"></i>订单管理
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/order">
                <el-menu-item index="13-1">订单列表</el-menu-item>
              </router-link>
              <router-link to="/preorder">
                <el-menu-item index="13-2">预约订单</el-menu-item>
              </router-link>
              <router-link to="/count">
                <el-menu-item index="13-3">预约汇总</el-menu-item>
              </router-link>
              <router-link to="/refund">
                <el-menu-item index="13-4">退款管理</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="14">
            <template slot="title">
              <i class="el-icon-s-ticket"></i>营销活动
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/timelimited">
                <el-menu-item index="14-1">限时抢购</el-menu-item>
              </router-link>
              <router-link to="/fulldiscount">
                <el-menu-item index="14-2">优惠券</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="15">
            <template slot="title">
              <i class="el-icon-s-shop"></i>积分商城
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/integralset">
                <el-menu-item index="15-1">积分设置</el-menu-item>
              </router-link>
              <router-link to="/integralgood">
                <el-menu-item index="15-2">兑换商品</el-menu-item>
              </router-link>
              <router-link to="/customlist">
                <el-menu-item index="15-3">会员列表</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="16">
            <template slot="title">
              <i class="el-icon-s-tools"></i>基础设置
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/classify">
                <el-menu-item index="16-1">商品分类</el-menu-item>
              </router-link>
              <router-link to="/freight">
                <el-menu-item index="16-2">运费管理</el-menu-item>
              </router-link>
              <router-link to="/bannerlist">
                <el-menu-item index="16-3">广告管理</el-menu-item>
              </router-link>
              <router-link to="/newslist">
                <el-menu-item index="16-4">公告管理</el-menu-item>
              </router-link>
              <router-link to="/markset">
                <el-menu-item index="16-5">标签管理</el-menu-item>
              </router-link>
              <!-- <router-link to="/roleset">
                <el-menu-item index="16-3">角色管理</el-menu-item>
              </router-link> -->
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="17">
            <template slot="title">
              <i class="el-icon-user-solid"></i>合伙人
            </template>
            <el-menu-item-group v-if="this.$store.state.flodKey != 1">
              <router-link to="/rebateset">
                <el-menu-item index="17-1">返利设置</el-menu-item>
              </router-link>
               <router-link to="/partnerlist">
                <el-menu-item index="17-2">合伙人列表</el-menu-item>
              </router-link>
              <router-link to="/recordlist">
                <el-menu-item index="17-3">提现管理</el-menu-item>
              </router-link>
              <router-link to="/rebatelist">
                <el-menu-item index="17-4">返利明细</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <router-link to="/complain" v-if="this.$store.state.user_name=='admin'">
            <el-submenu index="18">
              <template slot="title">
                <i class="el-icon-s-comment"></i>意见反馈
              </template>
            </el-submenu>
          </router-link>

          <el-submenu index="15">
            <div style="height:150px;"></div>
          </el-submenu>
          

        </el-menu>
      </el-aside>
    </el-container>

    <div class="wrap" id="sidebarwrap">
      <router-view></router-view>
    </div>
  </div>
</template>



<script>
export default {
  name: "sidebar",
  data() {
    return {
      menu:[
        {
          title: '首页',
          icon: 'el-icon-s-home',
          link: '/home',
          items: []
        },
        {
          title: '引导指南',
          icon: 'el-icon-s-flag',
          link: '/driver',
          items: []
        },
        {
          title: '组织架构管理',
          icon: 'el-icon-share',
          link: '',
          items: [
            {title: '我的企业',link: '/company'},
            {title: '我的员工',link: '/employee'},
            {title: '我的会员',link: '/customer'}
          ]
        },
        {
          title: '商品管理',
          icon: 'el-icon-s-goods',
          link: '',
          items: [
            {title: '商品列表',link: '/good'},
            {title: '商品预售',link: '/presell'}
          ]
        },
        {
          title: '订单管理',
          icon: 'el-icon-s-goods',
          items: [
            {title: '订单列表',link: '/order'}
          ]
        },
      ]
    };
  },
  mounted() {
    
  }
};
</script>

<style scoped>
.wrap >>> *{box-sizing: border-box;}
.wrap >>> .clearfix:after{content:"";height:0;line-height:0;display:block;visibility:hidden;clear:both;}
.wrap >>> .clearfix{zoom:1;}
.el-container {
  box-sizing: border-box;
}
#sidebar {
  margin: 0;
  padding: 0;
  overflow: hidden;
  margin-top: -1px;
  margin-left: -1px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgb(240, 243, 244);
}
#elaside {
  transition: 1s;
}
/* 滚动条 */
.el-aside::-webkit-scrollbar {
  width: 5px;
  height: 20px;
  background-color: #fff;
}
.el-aside::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

.el-header {
  color: #fff;
  line-height: 60px;
}
.el-container {
  height: 100%;
  margin-bottom: 100px;
}
.el-aside {
  color: #fff;
  margin-left: 2px;
}
.el-menu {
  height: 100%;
  background: #fff;
}
.el-menu .el-submenu {
  background: #fff;
}
.el-menu-item-group{ 
  background: #fff;
}
.el-menu .el-submenu__title {
  color: #fff !important;
}

/* 图标颜色 */
.el-submenu__title i {
  color: #ccc;
}
/* 二级菜单 */
/* .el-menu-item { */
  /* color: #fff; */
/* } */

/* view */
.wrap {
  position: absolute;
  left: 200px;
  right: 0;
  top: 65px;
  bottom: 0;
  margin: auto;
  background: #ffffff;
  width: calc(100% - 250px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  transition: 1s;
  padding: .7rem;
}

.wrap::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}

.wrap::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.wrap::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

/* view search */
.wrap >>> .search{
  display: block;
  align-items: center;
  background:rgba(247,248,250,1);
  padding: .7rem .7rem 0 .7rem;
  margin-bottom: .7rem;
}

.wrap >>> .search .line{
  margin-right: .7rem;
}

.wrap >>> .searchbox{
  margin-right: .7rem;
  margin-bottom: .7rem;
  display: inline-block;
}

.wrap >>> .el-table thead{
  color: #555;
}

.wrap >>> .el-table{
  color: #000;
}

.wrap >>> .el-table td{
  font-size:.9rem;
  padding: 6px 0!important;
}

.wrap >>> .el-table .warning-row {
  background: oldlace;
}

.wrap >>> .el-table .success-row {
  background: #f0f9eb;
}
.wrap >>> .title{
  padding: 0px 10px 10px 10px;
  line-height: 40px;
}

.wrap >>> .title span{
  font-weight: bold;
}

.wrap >>> .title .el-button{
  float: right;
}

.wrap >>> .el-table td,.wrap >>> .el-table th{
  padding: 8px 0;
}

</style>