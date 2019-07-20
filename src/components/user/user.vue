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

          <el-input clearable @clear="handleLoad" placeholder="请输入内容" v-model="query" class="inputSearch">
            <el-button @click="querySearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>

          <el-button type="success" @click="addDialogVisible = true">添加用户</el-button>
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
              @change="changeSwitch(userslist.row.mg_state,userslist.row.id)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>

        </el-table-column>



        <el-table-column label="操作">

          <template slot-scope="userslist">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="editItem(userslist.row.id)"></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="removeUser(userslist.row.id)"></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
          </template>

        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加用户表单 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="50%">

        <el-form :model="addForm" :rules="addFormRules" ref="addRuleForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户信息 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >

        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSave">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
</template>

<script>
    export default {
      data(){
        // 自定义校验规则，必须在 return 之前，因为return 后面的代码不会执行。
        // 定义一个函数，有三个参数，rule，value -- 内容，callback -- 成功或者失败的回调
        var checkEmail = (rule,value,callback) => {
          if(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false){
            // 失败 --- 返回错误对象
            return callback(new Error('邮箱地址错误'))
          }
          // 成功 -- 直接调用 callback就行
          callback();
        }

        var checkMobile = (rule,value,callback) => {
          if(/^[1]\d{10}$/.test(value) === false){
            return callback(new Error('电话号码错误'))
          }
          callback();
        }



        return {
          query:'', // 搜索内容
          pagenum:1, // 当前页码
          pagesize:2, // 每页多少条数据
          total: -1, // 数据总数，做分页使用
          userslist:[], // 表格数据

          // 是否弹出添加用户的对话框：
          addDialogVisible:false,
          addForm:{
            username:'',
            password:'',
            email:'',
            mobile:''
          },
          // 校验规则：
          addFormRules:{
            username:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
            ],
            // email 和 mobile 需要自定义校验规则进行正则校验，下面的规则只是对空value校验。
            email:[
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator: checkEmail, trigger: 'blur' }
            ],
            mobile:[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: checkMobile, trigger: 'blur' }
            ]
          },


          // 是否弹出编辑框
          editDialogVisible:false,
          editForm:{
            id:'',
            username:"",
            email:"",
            mobile:""
          },
          editFormRules:{
            email:[
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator: checkEmail, trigger: 'blur' }
            ],
            mobile:[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: checkMobile, trigger: 'blur' }
            ]
          }

        }
      },

      created(){
        this.getUserList();
      },
      methods:{

        // 删除用户：
        async removeUser(id){
          const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);

          console.log(confirmResult);
          if(confirmResult !== 'confirm'){
            return  this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }else {
            // 确认删除：
            const res = await this.axios.delete(`users/${id}`);
            const {meta:{status,msg}} = res.data;
            if(status === 200){
              this.$message.success("删除用户成功");
              this.getUserList();
            }else {
              this.$message.success("删除用户失败");
            }
          }
        },

        // 编辑表单关闭：重置表单
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },
        // 查询对应id的用户数据
        async editItem(id) {
          const res = await this.axios.get(`users/${id}`);
          const {meta:{status,msg},data} = res.data;
          if(status === 200 ){
            this.$message.success(msg);
            this.editForm.id = data.id;
            this.editForm.username = data.username;
            this.editForm.email = data.email;
            this.editForm.mobile = data.mobile;
            this.editDialogVisible = true;
          }else {
            this.$message.success(msg)
          }
        },
        // 点击“确认的时候”，保存用户数据
        editUserSave(){
           this.$refs.editFormRef.validate(async valid => {
             if(!valid) return;

              const res = await this.axios.put(`users/${this.editForm.id}`,this.editForm);
              const {meta:{status,msg},data} = res.data;
              if(status === 200){
                this.$message.success(msg);
                // 关闭edit框
                this.editDialogVisible = false;
                // 刷新页面
                this.getUserList();
              }else {
                this.$message.error(msg);
              }
           })
        },


        // 添加表单关闭，重置输入框的数据：
        addDialogClosed(){
          // 重置表单：
          this.$refs.addRuleForm.resetFields();
        },
        // 添加用户：
        addUser(){
          // 调用js方法，校验表单是否符合规范，符合才添加用户
          this.$refs.addRuleForm.validate(async valid => {
            if(!valid) return;
            const res = await this.axios.post('users',this.addForm);
            const {meta:{status,msg},data} = res.data;
            if(status === 201){
              this.$message.success(msg);
              // 刷新列表
              this.getUserList();
              // 关闭表单：
              this.addDialogVisible = false;
            }else {
              this.$message.error(msg);
            }
          })
        },



        // 更改用户状态：需要传递 状态和id
        // 另外一种修改状态的方式：@change="(state) => {changeSwitch(state,userslist.row.id)}"
        // 上面这种方式可以解决 第一个参数必须是state的问题。直接传递一个函数进去。
        async changeSwitch(state,id){
          const res = await this.axios.put(`users/${id}/state/${state}`);

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            // 提示：
            this.$message.success(msg)
          }else {
            this.$message.success(msg)
          }
        },

        // 清除输入的内容时，重新获取第一页数据 --- 从新发送请求就行
        handleLoad(){
          this.getUserList();
        },

        // 查询参数：
        querySearch(){
          // 因为在这个请求事件中，已经绑定 query参数了，现在直接在此发送请求就行，不需要传递参数
          this.getUserList();
        },

        // 分页的方法：
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pagesize = val;
          this.pagenum = 1; // 切换条数后，从第一页开始重新渲染。
          this.getUserList();
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.pagenum = val;
          this.getUserList();
        },

        // 请求用户列表数据
        async getUserList(){
          // 设置请求头：token
          const AUTH_TOKEN = sessionStorage.getItem('token');
          this.axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

          const res = await this.axios.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);

          console.log(res);
          // 解构：
          const {meta:{msg,status},data:{total,users}} = res.data;

          if(status === 200){
            // 1. 提示获取数据成功
            // 2. 给 data对应的数据赋值，渲染到列表上
            // this.$message.success(msg);
            this.userslist = users;
            this.total = total;
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
