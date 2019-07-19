<template>
    <el-card class="box-card">
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--搜索输入框-->
      <el-row class="searchgroup">
        <el-col>

          <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>

          <el-button type="success">添加用户</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table
        :data="userslist"
        style="width: 100%">
        <el-table-column
          label="#"
          type="index"
          width="60">
        </el-table-column>

        <el-table-column
          prop="username"
          label="姓名"
          width="150">
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>

        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>



        <el-table-column
          prop="create_time"
          label="创建日期">

          <!-- 单元格内部只能写文本数据，如果想要使用插值表达式，则需要使用template组件 -->
          <template slot-scope="userslist">
            {{ userslist.row.create_time | formatDate }}
          </template>

        </el-table-column>



        <el-table-column label="用户状态">
          <!-- 单元格内，不能随便使用其他组件。 -->
          <!-- 如果想要使用其他组件，则外层用template 组件包裹，把外层的数据通过 template的自带属性：slot-scope传递到template内部，传递的是数据源，所以要通过该数据源.row 得到每一条数据 -->
          <template slot-scope="userslist">
            <el-switch
              v-model="userslist.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>

        </el-table-column>



        <el-table-column label="操作">

          <template slot-scope="userslist">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
          </template>

        </el-table-column>
      </el-table>

      <!--分页-->
    </el-card>
</template>

<script>
    export default {
      data(){
        return {
          query:'', // 搜索内容
          pagenum:1, // 当前页码
          pagesize:2, // 每页多少条数据
          total: -1, // 数据总数，做分页使用
          userslist:[] // 表格数据

        }
      },
      created(){
        this.getUserList();
      },
      methods:{
        async getUserList(){
          const res = await this.axios.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);

          // console.log(res);
          // 解构：
          const {meta:{msg,status},data:{total,users}} = res.data;

          if(status === 200){
            // 1. 提示获取数据成功
            // 2. 给 data对应的数据赋值，渲染到列表上
            this.$message.success(msg);
            this.userslist = users;
            this.total = total;
          }else {
            this.$message.success(msg);
          }
        }
      }
    }
</script>

<style scoped>
  .box-card {
    height:100%;
  }
  .searchgroup {
    margin-top: 20px;
  }
  .inputSearch {
    width: 300px;
  }
</style>
