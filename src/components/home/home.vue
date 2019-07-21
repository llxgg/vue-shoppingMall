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
          :router="true"
          :unique-opened="true"
        >
          <!--用户管理-->
          <el-submenu v-for="item1 in menus" :key="item1.id" :index="'' + item1.order">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item :index="'/home/'+ item2.path" v-for="item2 in item1.children" :key="item2.id">
              <i class="el-icon-s-tools"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>



        </el-menu>
      </el-aside>

      <!--右侧-->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
    export default {
      name: "home",
      data(){
        return {
          menus:[]
        }
      },
      created(){
        this.getMenusList();
      },
      methods:{
        // 左侧菜单栏渲染：
        async getMenusList(){
          const res = await this.axios.get(`menus`);
          console.log(res);

          this.menus = res.data.data;
        },

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
