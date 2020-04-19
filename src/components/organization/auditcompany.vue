<template>
  <div class="audit">
    <div class="title clearfix">
      <span>待审核企业</span>
    </div>
    <div class="search">
      <!-- 订单号 -->
      <div class="searchbox">
        <label>企业名称：</label>
        <el-input v-model="searchParams.keyword" placeholder="请输入企业名称" :style="{width:'180px',height:'40px'}"></el-input>
      </div>
      <!-- 按钮 -->
      <div class="searchbox">
        <el-button type="primary" @click="search()">
          <i class="el-icon-zoom-in"></i>
          查询
        </el-button>
      </div>
      <div class="searchbox">
        <el-button>
          <i class="el-icon-refresh-right" @click="reset()"></i>
          重置
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name:'audit',
  data(){
    return {
      searchParams:{
        keyword:""
      },
    }
  }
}
</script>

<style lang="scss">

</style>