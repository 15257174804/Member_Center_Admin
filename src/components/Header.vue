<template>
  <div id="header">
    <div class="wrap">
      <div id="title-sidebar">
        <a id="logo-big" class="image">
          <img src="../assets/logo1.png" alt />
        </a>
        <a id="logo-small" class="image">
          <img src="../assets/smalllofo.png" alt />
        </a>
      </div>
      <div class="right" id="right-bread">
        <i class="el-icon-s-fold" id="fold" @click="flodpx()"></i>
        <div class="shouye">
          <li id="domshouye">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>当前位置:</el-breadcrumb-item>
              <el-breadcrumb-item
                :to="{ path: items.path }"
                v-for="(items,index) in breadList"
                :key="index"
              >{{items.meta.title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </li>
        </div>
        <div class="loginin">
          <li id="domMessage" @click="open">
            <el-badge value="new" class="item">
              <i class="el-icon-message-solid"></i>
            </el-badge>
            
          </li>

          <li id="domFullScreen">
            <i class="el-icon-full-screen" @click="screen"></i>
          </li>

          <div class="geren">
            <el-col>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <div class="user-img">
                    <span></span>
                    <img src="../assets/personal/user.jpg" alt />
                  </div>
                  <div class="admin">
                    {{this.$store.state.group_name}} - {{this.$store.state.user_name}}<i class="el-icon-arrow-down"></i>
                  </div>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <router-link to="/home">
                    <el-dropdown-item icon="el-icon-s-home">首页</el-dropdown-item>
                  </router-link>
                  <router-link to="/personal">
                    <el-dropdown-item icon="el-icon-user-solid">个人中心</el-dropdown-item>
                  </router-link>

                  <el-dropdown-item>
                    <el-button type="text"  icon="el-icon-switch-button" @click="removetoken()">退出</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      userInfo: this.global.userInfo,
      fullscreen: false,
      key: 0,
      breadList:[],
      hisRouteList: [{ path: "/home", meta: { title: "首页" } }]
    };
  },
  methods: {
    // 缩放面包屑
    flodpx() {
      let titlesidebar = document.getElementById("title-sidebar");
      let elaside = document.getElementById("elaside");
      let fold = document.getElementById("fold");
      let rightbread = document.getElementById("right-bread");
      let topBar = document.getElementById("topBar");
      let sidebarwrap = document.getElementById("sidebarwrap");
      let logobig = document.getElementById("logo-big");
      let logosmall = document.getElementById("logo-small");
      let elMenuItem = document.getElementById("sidebarwrap").getElementsByTagName("el-menu-item");
      
      this.key++;
      if (this.key == 1) {
        titlesidebar.style.width = "40px";
        elaside.style.width = "40px";
        rightbread.style.width = "calc(100% - 40px)";
        sidebarwrap.style.width = "calc(100% - 40px)";
        topBar.style.width = "calc(100% - 40px)";
        topBar.style.left = "40px";
        rightbread.style.left = "40px";
        sidebarwrap.style.left = "40px";
        fold.className = "el-icon-s-unfold";
        logobig.style.display = "none";
        logosmall.style.display = "inline-block";
      }
      if (this.key == 2) {
        titlesidebar.style.width = "200px";
        elaside.style.width = "200px";
        rightbread.style.width = "calc(100% - 200px)";
        sidebarwrap.style.width = "calc(100% - 200px)";
        topBar.style.width = "calc(100% - 200px)";
        fold.className = "el-icon-s-fold";
        sidebarwrap.style.left = "200px";
        topBar.style.left = "200px";
        logobig.style.display = "inline-block";
        logosmall.style.display = "none";
        this.key = 0;
      }
      this.$store.dispatch("setFlodKeyFun",this.key);
    },
    // 信息
    open() {
      this.$notify({
        title: "消息中心",
        dangerouslyUseHTMLString: true,
        message: `<div>欢迎入驻药问我健康平台</div>                 
         `,
        offset: 100
      });
    },
    // 点击全屏
    screen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 退出
    removetoken() {
      // 清除token
      localStorage.removeItem("loginToken");
      this.$router.push("/login");
    },
    // 面包屑
    isHome(route) {
      return route.name === "home";
    },
    getBreadcrumb() {
      let matched = this.$route.matched;
      // console.log(matched)
      this.hisRouteList = this.hisRouteList.concat(matched[1]);
      //如果不是首页
      if (!this.isHome(matched[0])) {
        matched =  [{ path: "/home", meta: { title: "首页" } }].concat(matched);
      }
      this.breadList = matched;
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  mounted() {
    this.getBreadcrumb();
  }
};
</script>

<style scoped>
#header {
  width: 100%;
  height: 50px;
  background: #282A55;
  border-bottom: 1px solid rgb(101, 105, 122);
}
.wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100%;
}
#title-sidebar {
  width: 200px;
  background: #282A55;
  transition: 1s;
}
.right {
  width: calc(100% - 200px);
  background: #282A55;
  transition: 1s;
}
.el-breadcrumb {
  line-height: 50px;
}
li {
  list-style: none;
}
/* left */
.image {
  color: #fff;
  text-align: center;
  position: absolute;
  line-height: 50px;
  margin-left: 44px;
  cursor: pointer;
}
.image img {
  width: 112px;
  margin-left: -2px;
  color: #fff;
  vertical-align: middle;
}

/* right */
#fold,
.shouye {
  float: left;
  line-height: 50px;
  text-align: center;
  margin-left: 3rem;
}
.loginin {
  float: right;
  width: 500px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  line-height: 50px;
  height: 50px;
}
.loginin i {
  font-size: 1.2rem;
  color: #9b9292;
  cursor: pointer;
  margin: 0 .5rem;
}

.el-dropdown-link {
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  margin-left: 20px;
}

.el-dropdown-link .user-img {
  height: 100%;
  margin: 0 .5rem;
}

.el-dropdown-link .user-img span{
  height: 100%;
  display: inline-block;
}

.el-dropdown-link img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
  position: relative;
  top: -1px;
}
.remove {
  width: 100%;
  height: 100%;
}

#logo-small{
  width: 40px;
  height: 50px;
  display: none;
  margin-left: 0!important;
}
#logo-small img{
  width: 35px;
  height: 35px;
}
</style>
