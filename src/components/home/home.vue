<template>
  <el-container class="container">
    <!--头部区域-->
    <el-header class="header">
      <el-col :span="5"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light"><h2>电商后台管理系统</h2></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"><a class="link" @click.prevent="handleBack" href="#">退出</a></div>
      </el-col>
    </el-header>

    <!-- content内容区域 -->
    <el-container>
      <!--左侧-->
      <el-aside class="aside" width="200px">
        <el-menu
          :unique-opened="true"
        >
          <!--用户管理-->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-s-tools"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>

          <!--权限管理-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="2-1">
              <i class="el-icon-user-solid"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-user-solid"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>

          <!--商品管理-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="3-1">
              <i class="el-icon-s-tools"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-s-tools"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-s-tools"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>

          <!--订单管理-->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>订单管理</span>
            </template>

            <el-menu-item index="4-1">
              <i class="el-icon-s-tools"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>

          <!--数据统计-->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>数据统计</span>
            </template>

            <el-menu-item index="5-1">
              <i class="el-icon-s-tools"></i>
              <span>数据列表</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!--右侧-->
      <el-main class="main">Main</el-main>
    </el-container>

  </el-container>
</template>

<script>
    export default {
      name: "home",
      data(){
        return {

        }
      },
      methods:{
        // 退出
        handleBack:function(){
          // 1. 清除token
          // 2. 提示用户信息
          // 3. 跳转到login页面
          sessionStorage.removeItem("token");
          this.$message.success('退出成功');
          this.$router.replace({name:'login'});
        }
      }
    }
</script>

<style scoped>
.container {
  height:100%;
}
.header {
  background-color: #161b41;
}
.header div {
  height:60px;
}
.header div h2 {
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.header div .link {
  text-decoration: none;
  line-height: 60px;
  font-size: 20px;
  color:#fff;
}

.aside {
    background-color: #fff;
}
.main {
    background-color: #ddd;
}
</style>
