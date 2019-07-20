<template>
    <el-card>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 表格 -->
      <div style="margin-top:20px;">
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>

        <el-table
          :data="roleList"
          border
          stripe
          style="width: 100%;margin-top:15px;">

          <!-- 展开：给对应的列设置 type="expand"; 里面的内容用 template包裹 -->
          <el-table-column
            type="expand"
            width="60">

            <template slot-scope="roleList">
              <el-row
                v-for="(itemOne,indexOne) in roleList.row.children"
                :key="itemOne.id"
                :class="['borderBottom',indexOne === 0 ? 'borderTop' : '']">
                <el-col :span="4">
                  <el-tag closable @close="deleteRole(roleList.row,itemOne.id)">{{itemOne.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>

                <el-col :span="20">
                  <el-row
                    v-for="(itemTwo,indexTwo) in itemOne.children"
                    :key="itemTwo.id"
                    :class="['borderTop',indexTwo === 0 ? 'borderNone' : '']">
                    <!-- 二级 -->
                    <el-col :span="5">
                      <el-tag closable type="success" @close="deleteRole(roleList.row,itemTwo.id)">{{itemTwo.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>

                    <el-col :span="19">
                      <!-- 三级 -->
                      <el-tag
                        closable
                        type="warning"
                        v-for="itemThree in itemTwo.children"
                        :key="itemThree.id"
                        @close="deleteRole(roleList.row,itemThree.id)">{{itemThree.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>


          <!-- 索引 -->
          <el-table-column
            type="index"
            width="60">
          </el-table-column>

          <el-table-column
            prop="roleName"
            label="角色名称"
            width="180">
          </el-table-column>

          <el-table-column
            prop="roleDesc"
            label="描述">
          </el-table-column>

          <el-table-column
            label="操作"
            width="300">

            <template slot-scope="roleList">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editItem(roleList.row.id)">编辑</el-button>

              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(roleList.row.id)">删除</el-button>

              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            </template>

          </el-table-column>
        </el-table>
      </div>

      <!-- 添加角色 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%">

        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editItemSave">确 定</el-button>
        </span>
      </el-dialog>


    </el-card>
</template>

<script>
    export default {
      data(){
        return {
          roleList:[], // 表单数据

          // 添加角色
          addDialogVisible:false,
          addForm:{
            roleName:'',
            roleDesc:''
          },
          addFormRules:{
            roleName: [
              { required: true, message: '请输入角色名称', trigger: 'blur' }
            ],
            roleDesc: [
              { required: true, message: '请输入角色描述', trigger: 'blur' }
            ],
          },

          // 编辑角色
          editDialogVisible:false,
          editForm:{
            id:"",
            roleName:"",
            roleDesc:""
          },
          editFormRules:{
            roleName: [
              { required: true, message: '请输入角色名称', trigger: 'blur' }
            ],
            roleDesc: [
              { required: true, message: '请输入角色描述', trigger: 'blur' }
            ]
          }
        }
      },
      created(){
        this.getRoleList();
      },
      methods:{

        // 删除权限：
        async deleteRole(row,rightId){
          // console.log(row);
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if(confirmResult !== 'confirm'){
        return this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }

      const res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`);
      const {meta:{status,msg},data} = res.data;
      if(status === 200){
        this.$message.success("删除权限成功");
        // 更新数据 ---注意：返回的是删除后的 权限数据，所以可以直接赋值给 roleList.row.children
        // this.getRoleList(); // 会整个页面刷新，权限列表收起
        // 可以 把返回的数据 赋值给 roleList.row.children --- 所以在传递参数的时候，直接传roleList.row
        row.children = data;
      }else {
        this.$message.error("删除权限失败");
      }
    },

        // 删除角色：
        async removeRole(id){
          const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);

          console.log(confirmResult);

          if(confirmResult === 'confirm'){ // 确认删除
            const res = await this.axios.delete('roles/' + id);

            const {meta:{status,msg},data} = res.data;
            if(status === 200){
              this.$message.success("删除角色成功");
              // 更新列表
              this.getRoleList();
            }

          }else{
            this.$message({
              message: '没有删除角色',
              type: 'warning'
            });
          }
        },



        // 编辑角色，传递id
        async editItem(id){
          const res = await this.axios.get('roles/' + id);
          console.log(res);
          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.$message.success("获取角色成功");
            // 把对应的数据 赋值给 editForm上，然后v-model渲染到页面
            this.editForm.id = data.roleId; // 把id也赋值上，到时候修改需要id值
            this.editForm.roleName = data.roleName;
            this.editForm.roleDesc = data.roleDesc;

            // 显示对话框：
            this.editDialogVisible = true;
          }else {
            this.$message.error("获取角色失败");
          }
        },
        // 确定编辑：
        editItemSave(){
          this.$refs.editFormRef.validate(async valid => {
            if(!valid) return;

            const res = await this.axios.put('roles/' + this.editForm.id,this.editForm);
            const {meta:{status,msg},data} = res.data;
            if(status === 200){
              this.$message.success("编辑角色成功");
              // 刷新页面：
              this.getRoleList();
              // 关闭对话框：
              this.editDialogVisible = false;
            }else {
              this.$message.success("编辑角色失败");
            }
          })
        },


        // 关闭添加角色，重置表单
        addDialogClosed() {
          this.$refs.addFormRef.resetFields();
        },
        // 添加角色：
        async addRole(){
          const res = await this.axios.post('roles',this.addForm);
          const {meta:{status,msg},data} = res.data;
          if(status === 201) {
            this.$message.success("添加角色成功");
            // 刷新列表
            this.getRoleList();
            // 关闭输入框
            this.addDialogVisible = false;
          } else {
            this.$message.error("添加角色失败");
          }
        },


        // 请求角色列表数据
        async getRoleList(){
          const res = await this.axios.get('roles');
          console.log(res);

          const {meta:{status,msg},data} = res.data;

          if(status === 200){
            this.$message.success(msg);
            this.roleList = data;
          }else {
            this.$message.success('获取角色列表失败');
          }
        }
      }
    }
</script>

<style scoped>
.borderBottom {
  border-bottom: 1px solid #ddd;
}
.borderTop {
  border-top: 1px solid #ddd;
}
.el-tag {
    margin: 10px;
  }
  .borderNone {
    border:none;
  }

  .el-col {
    white-space: nowrap;
  }
  .el-col-19 {
    white-space: normal;
  }
</style>
