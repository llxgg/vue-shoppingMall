<template>
    <el-card>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 提示信息 -->
      <el-alert
        title="只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>


      <!-- select -->
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            clearable
            :change-on-select="true"
            expand-trigger="hover"
            v-model="selected"
            :options="goodsList"
            :props="cascaderProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>


      <!-- 标签页 -->
      <!--v-model 绑定的是 自动渲染那个标签页，可以默认展示 name为 first的标签页  -->
      <el-tabs v-model="activeName" @tab-click="handleTapClick">

        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="selected.length === 3 ? false : true"
            @click="addDialogVisible = true">添加参数</el-button>
          <!--表格-->
          <el-table
            :data="tableManyData"
            style="width: 100%"
            :border="true"
            :stripe="true">

            <!-- 展开 -->
            <el-table-column
              type="expand">

              <template slot-scope="scope">
                <el-tag
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="index"
                  closable  @close="closeTag(scope.row,index)">
                  {{tag}}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column
              type="index">
            </el-table-column>

            <el-table-column
              prop="attr_name"
            label="参数名称">
            </el-table-column>

            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPar(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removePar(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="selected.length === 3 ? false : true"
            @click="addDialogVisible = true">添加属性</el-button>
          <!-- 表格 -->
          <el-table
            :data="tableOnlyData"
            style="width: 100%"
            :border="true"
            :stripe="true">

            <!-- 展开 -->
            <el-table-column
              type="expand">

              <template slot-scope="scope">
                <el-tag
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="index"
                  closable @close="closeTag(scope.row,index)">
                  {{tag}}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column
              type="index">
            </el-table-column>

            <el-table-column
              prop="attr_name"
              label="参数名称">
            </el-table-column>

            <el-table-column
              label="操作">

              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPar(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removePar(scope.row)">删除</el-button>
              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>


      <!-- 添加参数面板 -->
      <el-dialog
        :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑面板 -->
      <el-dialog
        :title="activeName === 'many' ? '修改动态参数' : '修改静态属性'"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">

        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
</template>

<script>
    export default {
      data(){
        return {
          selected:[], // 选中的数组
          goodsList:[],  //渲染出来的数据
          cascaderProps:{ // 要关联上 父级 的分类清除
            value: 'cat_id', // 选中之后的 id
            label: 'cat_name',// 展示的分类名称
            children: 'children'// 分类的数据，都是children内的
          },


          // 标签页：
          activeName:'many',
          tableManyData:[],  // 动态参数的数据
          tableOnlyData:[], // 静态属性的数据


          // 添加参数：
          addDialogVisible:false,
          addForm:{
            attr_name:''
          },
          addFormRules:{
            attr_name:[
              {required:true,message:'请输入参数名称',trigger:'blur'}
            ]
          },


          // 编辑参数：
          editDialogVisible:false,
          editForm:{
            attrId:'',
            attr_name:''
          },
          editFormRules:{
            attr_name:[
              {required:true,message:"请输入内容",trigger:'blur'}
            ]
          },


          // tag 标签数据：
          // inputVisible:false, // 默认·不显示输入框，不能在这里处理，会全部都同步，应该在每一项中配置，也就是在获取 表单数据，遍历处理tag的时候。
          // inputValue:'', // 添加的数据
        }
      },
      created(){
        this.getSelectList();
      },
      methods:{
        // 删除 tag标签：删除数据库中的，同时也要删除页面上的 ---  也就是删除数组中对应的项
        async closeTag(row,i){
          console.log(i);
          // console.log(row);
          row.attr_vals.splice(i,1); // 删除数组中
          // 更新数据：保存到数组中
          const res = await this.axios.put(`categories/${this.selected[2]}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(',')
          })
          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.$message.success("删除tag标签成功");
          }else{
            this.$message.error("删除tag标签失败");
          }

        },

        // 添加tag标签：
        async handleInputConfirm(row){
          // console.log(row.inputValue);
          const val = row.inputValue.trim();
          if(val.length <= 0){
            row.inputValue = '';
            row.inputVisible = false; // 失去焦点后，显示 new Tag
            return;
          }

          row.attr_vals.push(val);
          row.inputValue = "";
          // 把数据还原，然后保存到数据库中：
          const res = await this.axios.put(`categories/${this.selected[2]}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(',')
          })

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.$message.success("添加tag标签成功");
          }else{
            this.$message.error("添加tag标签失败");
          }

          row.inputVisible = false;
        },
        showInput(row){
          row.inputVisible = true; // 显示输入框
          this.$nextTick(_ => { //自动获取焦点
            this.$refs.saveTagInput.$refs.input.focus();
        });
        },




        // 添加参数面板关闭，重置表单：
        addDialogClosed(){
          this.$refs.addFormRef.resetFields();
        },
        // 添加参数：
        addParams(){
          this.$refs.addFormRef.validate(async valid => {
            if(!valid) return;

            // 校验成功
            const res = await this.axios({
              method:'POST',
              url:`categories/${this.selected[2]}/attributes`,
              data:{
                attr_name:this.addForm.attr_name,
                attr_sel:this.activeName
              }
            });

            const {meta:{status,msg},data} = res.data;
            if(status === 201) {
              this.$message.success("添加参数成功");
              // 更新视图：
              this.getTableData();
            }else {
              this.$message.error("添加参数失败");
            }

            this.addDialogVisible = false;
          })
        },


        // 编辑参数面板关闭，重置参数：
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },
        // 动态渲染编辑输入框内容
        async editPar(row){
          this.editForm.attrId = row.attr_id;

        const res = await this.axios.get(`categories/${this.selected[2]}/attributes/${this.editForm.attrId }`,{
            params:{attr_sel:this.activeName}
          });

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.$message.error(msg);
          }else {
            this.$message.error(msg);
          }

          // this.editDialogVisible = true;
        },

          async removePar(row){
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err);

            if(confirmResult == 'confirm'){
              const attrid = row.attr_id;
              const res = await this.axios.delete(`categories/${this.selected[2]}/attributes/${attrid}`);

              const {meta:{status,msg},data} = res.data;
              if(status === 200){
                this.$message.success("删除参数成功");
                // 更新视图：
                this.getTableData();
              }

            }else {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            }
          },


        // 标签页切换的方法：
        handleTapClick(){
          // 在切换标签页的时候，在发送另一个请求就行
          // console.log(this.activeName);
          // 如果选静态属性，要先判断select是否为3级，否则不请求静态属性
          if(this.selected.length !== 3) return;
          // 请求数据：
          this.getTableData();
        },


        // 获取触发 select的分类id
        handleChange(value){
          if(this.selected.length !== 3){
            this.selected = []; // 如果长度不为3，即没有三级分类，不选择
            // 表格中已有的数据也要清空：
            this.tableManyData = [];
            this.tableOnlyData = [];
          }else {
            // 长度达到 3 ，则直接发送 mary 请求，因为默认显示 mary动态参数页面
            this.getTableData();
          }
        },

        // 请求参数数据：
        async getTableData(){
          const id = this.selected[2]; // 要添加的分类id，去选中的最后一项id。三级分类
          const sel = this.activeName;
          const res = await this.axios.get(`categories/${id}/attributes`,{
            params:{sel:sel}
          });

          const {meta:{status,msg},data} = res.data;


          data.forEach(item => {
            // 有item.attr_vals，有则处理，没有则赋值为空数组，防止出现空的 tag标签
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []; // 重新赋值

            // 控制 每一项的 new tag 是否可以输入
            item.inputVisible = false;
            item.inputValue = '';
    })


          if(status === 200){
            if(sel === 'many'){
              this.tableManyData = data;
            }else {
              this.tableOnlyData = data;
            }
          }
        },


        // 获取 select 的数据
        async getSelectList(){
          const res = await this.axios.get(`categories?type=3`);

         const {meta:{status,msg},data} = res.data;

         if(status === 200){
           // 获取数据成功：
           this.goodsList = data;
         }
        }
      }
    }
</script>

<style scoped>
.el-alert {
  margin: 12px 0;
}
  .el-table {
    margin-top: 12px;
  }
  .el-tag {
    margin: 5px;
  }
  .el-input {
    width: 100px;
  }
</style>
