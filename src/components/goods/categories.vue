<template>
    <el-card>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 列表 -->
      <div style="margin-top:12px;margin-bottom:12px;">
        <el-button type="primary" @click="addSort">添加分类</el-button>
      </div>

      <!-- tree-grid  -->
      <tree-table :data="categoryList" :columns="columns" :show-index="true" :border="true" :expand-type="false" :selection-type="false">

        <!-- 是否有效的插槽 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-error red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success green" v-else></i>
        </template>

        <!--排序的插槽-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作的插槽 -->
        <template slot="setting" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editSort(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeSort(scope.row)">删除</el-button>
        </template>

      </tree-table>


      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogVisibleClosed">

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>

          <el-form-item label="父级分类">
            <!-- options：级联的数据源，同时要设置props 指定对应的关系 -->
            <!-- v-model 绑定的是 选中时的id，是一个数组 -->
            <!-- change事件：只要select发生改变，就会把数据存在v-model上 -->
            <!-- :change-on-select="true" 可以选中 一级分类，给一级分类添加二级分类  -->
            <el-cascader
              clearable
              :change-on-select="true"
              expand-trigger="hover"
              v-model="selected"
              :options="selectOption"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveSort">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑分类对话框 -->
      <el-dialog
        @close="editFormClosed"
        title="编辑分类"
        :visible.sync="editDialogVisible"
        width="50%">

        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEditSort">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
</template>

<script>
    export default {
      data(){
        return {
          type:3, // 层级分类列表，直接获取三层
          categoryList:[], // 获取分类列表的数据
          columns:[
            {
              label:"分类名称",
              prop:'cat_name'
            },
            {
              label:"是否有效",
              type:'template', // 如果要使用其他组件，则指定template插槽
              template:'isok' // 要使用哪个插槽
            },
            {
              label:"排序",
              type:"template",
              template:'order'
            },
            {
              label:"操作",
              type:'template',
              template:'setting',
              width:'200'
            }
          ],


          // 添加分类的data
          addDialogVisible:false,
          addForm:{
            cat_name: '', // 分类名称
            cat_pid: 0, // 要添加分类，他的父级id，如果没有选 父级分类，则默认为一级分类，为0
            cat_level: 0 // 添加这个分类的等级，默认为一级
          },
          addFormRules:{
            cat_name:[
              { required: true, message: '请输入分类名称', trigger: 'blur' }
            ]
          },

          cascaderProps:{ // 要关联上 父级 的分类清除
            value: 'cat_id', // 选中之后的 id
            label: 'cat_name',// 展示的分类名称
            children: 'children'// 分类的数据，都是children内的
          },
          selected:[], // 选中后的父级分类 id
          selectOption:[], // select 下拉框中的数据，请求


          // 编辑分类的data：
          editDialogVisible:false,
          editForm:{
            cat_name:'',
            id:''
          },
          editFormRules:{
            cat_name:[
              { required: true, message: '请输入分类名称', trigger: 'blur' }
            ]
          }
        }
      },
      created(){
        this.getListCategory();
      },
      methods:{


        // 删除分类：
        async removeSort(row){
          const id = row.cat_id;

          const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);

          if(confirmResult == 'confirm'){
            // 确定删除
            const res = await this.axios.delete(`categories/${id}`);

            const {meta:{status,msg},data} = res.data;

            if(status === 200 ){
              // 删除成功：
              this.$message.success("删除分类成功");
              // 更新视图：
              this.getListCategory();
            }
          }else {
            // 不删除：
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }
        },



        // 编辑分类：
        async editSort(row){
          // 把得到的id 请求数据
          const id = row.cat_id;

          const res = await this.axios.get(`categories/${id}`);

          console.log(res);

          const {meta:{status,msg},data} = res.data;

          if(status === 200){
            // 获取id对应的数据成功：
            this.$message.success("获取数据成功");
            // 赋值
            this.editForm.id = data.cat_id;
            this.editForm.cat_name = data.cat_name;
          }else {
            this.$message.success("获取数据失败");
          }

          // 打开对话框
          this.editDialogVisible = true;
        },

        // 关闭编辑框，重置表单数据：
        editFormClosed(){
          this.$refs.editFormRef.resetFields();
          this.editForm.id = ''; // resetFields 只是重置 输入的数据，并不能把隐藏的数据也重置
        },

        // 确定保存编辑后的分类：
        saveEditSort(){
          this.$refs.editFormRef.validate(async valid => {
            if(!valid) return; // 如果校验不通过


            // 校验通过
            const res = await this.axios.put('categories/' + this.editForm.id,{
              cat_name:this.editForm.cat_name
            });

            const {meta:{status,msg},data} = res.data;

            if(status === 200){
              // 编辑成功
              this.$message.success("编辑分类成功");
              // 更新视图
              this.getListCategory();
              // 关闭对话框
              this.editDialogVisible = false;
            }else {
              this.$message.error(msg);
            }
          })
        },



        // select 发生改变时触发的事件：
        handleChange(value){
          console.log(value);
          // 根据 选中的 父类id，进行截取：
          // 设置分类层级：[52, 64, __ob__: Observer]，有两个父级分类，则代表现在添加的是3级分类
          this.addForm.cat_level = this.selected.length;


          // 设置父级分类的 id  ---->  [52, 64, __ob__: Observer] 64 为当前分类的父级分类，取64
          // 取数组最后一项，就是上一级的父类id，如果数组为空，则父级id为0，也就是自己为一级
          if(this.selected.length === 0){
            this.addForm.cat_pid = 0;
          }else {
            this.addForm.cat_pid = this.selected[this.selected.length -1]; // 取最后一项
          }
        },

        // 确定添加的事件：
        async saveSort(){
          const res = await this.axios({
            method:'POST',
            url:'categories',
            data:this.addForm
          })
          const {meta:{status,msg},data} = res.data;
          if(status === 201){
            this.$message.success("添加分类成功");
            // 关闭对话框
            this.addDialogVisible = false;
          }else {
            this.$message.error("添加分类失败");
          }
        },


        // 添加分类按钮的事件：
        // 获取添加分类中 select中的数据：type应该从2开始，获取后面的 2 ， 3 级数据
        async addSort(){
          const res = await this.axios.get(`categories`,{
            params : {type:2}
          })

          this.selectOption = res.data.data;
          this.addDialogVisible = true;
        },

        // 关闭添加分类的输入框：要清空所有数据
        addDialogVisibleClosed(){
          this.$refs.addFormRef.resetFields(); // 只是清空 addForm中的 name值
          // 清空select的数据：addForm要清空
          this.addForm.cat_pid = this.addForm.cat_level = "";

          // selected 选中时存储起来的数据也要清空，否则会残留。
          this.selected = [];
        },


        // 获取分类列表的数据
        async getListCategory(){
          const res = await this.axios.get(`categories`,{
            params:{
              type:this.type
            }
          });

          this.categoryList = res.data.data;

          console.log(res);
        }
      }
    }
</script>

<style scoped>
.green {
  color:green;
}
  .red {
    color:red;
  }

  .el-cascader {
    width:100%;
  }
</style>
