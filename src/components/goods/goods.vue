<template>
    <el-card  class="box-card">
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <router-view></router-view>
    </el-card>
</template>

<script>
    export default {
        name: "goods"
    }
</script>

<style scoped>

</style>
