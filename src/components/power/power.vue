<template>
    <el-card>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 列表 -->
      <el-table
        :data="PowerList"
        stripe
        border
        style="width: 100%;margin-top:20px;">
        <el-table-column
          type="index"
          label="#"
          width="60">
        </el-table-column>

        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>

        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>

        <el-table-column
          prop="level"
          label="权限等级">

          <template slot-scope="PowerList">
            <el-tag v-if="PowerList.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="PowerList.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else  type="warning">三级</el-tag>
          </template>

        </el-table-column>
      </el-table>
    </el-card>
</template>

<script>
    export default {
      data(){
        return{
          PowerList:[]
        }
      },
      created(){
        this.getPowerList();
      },
      methods:{
        async getPowerList(){
          const res = await this.axios.get('rights/list');
          console.log(res);

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.$message.success(msg);
            this.PowerList = data;
          }
        }
      }
    }
</script>

<style scoped>

</style>
