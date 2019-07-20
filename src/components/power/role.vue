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

              <span v-if="roleList.row.children.length === 0">没有分配权限</span>
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

              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(roleList.row)">分配权限</el-button>
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

      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRoleDialogVisible"
        width="50%">

        <!--tree 树形-->
        <!--:default-expanded-keys="[2, 3]"  如果不用数组的，
        可以使用快捷方式：:default-expanded-all 默认展开全部层级，不需要遍历数据取得每一项的id-->

        <!--:default-checked-keys="[5]" 需要选中显示的权限id，是一个数组，把有的权限的id存储起来 -->
        <!-- node-key="id" 是层级目录对应的id属性 --- 也就是 key -->
        <el-tree
          :data="roleListTree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="roleListId"
          :default-checked-keys="checkedRoleId"
          ref="tree"
          :props="defaultProps">
        </el-tree>

        <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRole()">确 定</el-button>
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
          },


          // 分配权限：
          setRoleDialogVisible:false,
          roleListTree:[], // tree 结构上的数据
          roleListId:[], // 根据权限id 自动展开所有权限
          checkedRoleId:[], // 选中的权限的id
          defaultProps: {
            children: 'children', // 层级数据，都是基于 children往下一层查找的
            label: 'authName' // tree结构显示的名称
          },
          RoleId: -1 //角色id,在保存角色权限的时候需要用到。
        }
      },
      created(){
        this.getRoleList();
      },
      methods:{

        // tree 权限树：
        async setRole(row){
          this.RoleId = row.id;

          // 获取 tree 树形结构的 权限数据：
          const res = await this.axios.get(`rights/tree`);

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.roleListTree = data; // 把得到的数据 保存到 控件需要的数组中

            // 把数据遍历，取所有权限的id存储到一个数组中，
            // :default-expanded-keys="[2, 3]"  然后会自动展开每一项
            var arrTemp1 = [];
            data.forEach((item1,i) => {
              arrTemp1.push(item1.id);
              item1.children.forEach(item2 => {
                arrTemp1.push(item2.id);
                item2.children.forEach(item3 => {
                  arrTemp1.push(item3.id);
                })
              })
            })
            this.roleListId = arrTemp1;


            // 获取角色对应的 权限，然后遍历取选中的权限的id到一个数组中。
            // 角色对应的权限 --- 需要在 点击这个按钮的时候，传递进来。
            // 注意：因为tree 树形控件 只要内部有选中的，则外部的都会自动选中，不管是全选还是半选，反之，如果外部选中，则里面的都会全选，这就产生 BUG了
            // 因为内部 有些不可能全选的，但是你把 外部的 id也放到数组中渲染，则默认会以为外部选中，则内部全选。
            // 所以不需要把 外部的 id 放到数组中，只需要把 最内部的id放到数组就行，外部会自动全选/半选。
            // console.log(row);
            var arrTemp2 = [];
            row.children.forEach(item1 => {
              // arrTemp2.push(item1.id);
              item1.children.forEach(item2 => {
                // arrTemp2.push(item2.id);
                item2.children.forEach(item3 => {
                  arrTemp2.push(item3.id);
                })
              })
            })
            this.checkedRoleId = arrTemp2;
          }

          // 点击，显示对话框：
          this.setRoleDialogVisible = true;
        },
        async saveRole(){
          // 保存 tree 中更改的 权限
          // api 接口文档：角色管理 --- 角色授权 ---> 需要 角色id 和 权限 ID 列表
          // 权限id 分为： 全选的id 和半选 的id
          // 全选：getCheckedKeys()   --- 返回一个 全选的 id数组
          // 半选：getHalfCheckedKeys() ---- 返回一个 半选的 id数组
          // 怎么使用这两个方法？？ 因为是 tree组件上的方法，所以直接 ref获取tree组件然后调用就行

          // 全选：arr1
          let arr1 = this.$refs.tree.getCheckedKeys();
          // 半选： arr2
          let arr2 = this.$refs.tree.getHalfCheckedKeys();

          // 拼接成一个数组：arr
          let arr = [...arr1, ...arr2]; // 展开运算符

          // 请求：参数 rids 权限id列表，以 , 分割的权限 ID 列表
          const res = await this.axios.post(`roles/${this.RoleId}/rights`,{rids:arr.join(',')});
          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.$message.success("更改权限成功")
            // 更新视图数据
            this.getRoleList();
            // 关闭对话框：
            this.setRoleDialogVisible = false;
          }
        },



        // 删除list 的权限：
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

            console.log(res);

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
