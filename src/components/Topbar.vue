<template>
    <ul id="topBar" ref='ul'>
        <li :class="{'active': items.meta.title == activeTitle }" v-for="(items,index) in hisRouteList" :key="index">
            <i v-if="items.meta.title == activeTitle" class="el-icon-star-on"></i>
            <router-link :to="{ path: items.path }">
            {{items.meta.title}}
            </router-link>
            <i @click="close(index)" class="el-icon-close" v-if="items.meta.title != '首页'"></i>
        </li>
    </ul>
</template>

<script>
export default {
  name: "topbar",
  data() {
    return {
      hisRouteList: [{ path: "/home", meta: { title: "首页" } }],
      activeTitle: '首页'
    };
  },
  methods: {
    // 面包屑
    isHome(route) {
      return route.name === "home";
    },
    isHave(route) {
        let flag = false;
        this.hisRouteList.forEach(function(v,i){
            if(v.meta.title == route.meta.title)
            flag = true;
        })
        return flag;
    },
    getBreadcrumb() {
      let matched = this.$route.matched;
      if(matched.length>1){
        this.activeTitle = matched[1].meta.title;
        //如果不是首页
        if (!this.isHave(matched[1])) {
          // this.hisRouteList = this.hisRouteList.concat(matched[1]);
          // this.hisRouteList.unshift(matched[1])
          this.hisRouteList.splice(1,0,matched[1])
        }
        // 导航栏滚动条的自动定位
        let i=this.hisRouteList.findIndex((val,index,arr)=>{
          return val.meta.title==matched[1].meta.title
        })
        let len=this.hisRouteList.length;
        if(i==0||i==1||i==2||i==3||i==4){
          this.$refs.ul.scrollLeft=0
        }else{
          this.$refs.ul.scrollLeft=i/len*this.$refs.ul.scrollWidth;
        }
        
        // console.log(i)
        // console.log(len)
        // console.log(this.$refs.ul.scrollWidth)
        // console.log(this.$refs.ul.scrollLeft)
      
      }
      
    },
    close(i){
      // console.log(this.hisRouteList)
      // console.log(i)
        this.hisRouteList.splice(i,1);
        // let path = this.hisRouteList[this.hisRouteList.length-1].path;
        let path = this.hisRouteList[i-1].path;
        this.$router.push({
          path: path//跳转路径的name值，不写跳转后页面取不到参数
        })
    }
  },
  watch: {
    // $route() {
    //   this.getBreadcrumb();
    // }
    '$route':'getBreadcrumb'
  },
  mounted() {
    this.getBreadcrumb();
  }
};
</script>

<style scoped>
li{list-style:none;}
#topBar{
    width: calc(100% - 220px);
    position: absolute;
    left: 220px;
    height: 50px;
    margin:0;
    padding: 10px .7rem;
    background-color: #fff;
    box-sizing: border-box;
    margin: auto;
    right: 0;
    transition: 1s;
    z-index: 111;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    overflow-x: auto;
    overflow-y:hidden;
}
/* 滚动条 */
#topBar::-webkit-scrollbar{
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 3px;
}
#topBar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.01);
  background: rgba(0, 0, 0, 0.01);
}

#topBar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.01);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.01);
}

li{
    height: 29px;
    line-height: 29px;
    display: inline-block;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-right: 10px;
    border-radius: 5px;
    box-sizing: border-box;
}
li.active{
    background-color: #4B9BF7;
    color: #fff;
}
li.active * {
    color: #fff;
}
li.active .el-icon-star-on{
    color: #fff;
}
i.el-icon-close{
    border-radius: 50%;
}
i.el-icon-close:hover{
    cursor: pointer;
    color: #fff;
    background-color: #ddd;
}
</style>
