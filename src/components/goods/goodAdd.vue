<template>
    <div>
      <!--警告-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>

      <!-- 步骤条,关联标签页，标签页有一个属性 v-model="activeName" 是绑定那个标签页的-->
      <!-- el-steps 只要关联该 activeName属性就可以，但是 当前标签的active类型是number，所以要转换成数字类型； - 运算符号，会自动转换为number类型。 同类 + 有歧义，可以把number 转换为string -->
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页,注意：是整个标签页的内容都填写完毕才提交的，所以应该放在一个form标签中 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
        <el-tabs tab-position="left" v-model="activeName" :before-leave="disabledSlide">

          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" min="0"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number" min="0"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number" min="0"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="goodsCatList"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 需要提交的，所以用form 标签包裹每一项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
              <!-- 多选框 v-model同步最新的数据 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="param" v-for="(param,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 静态属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 修改的数据需要提交的，用form标签包裹 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
              <el-input v-model="item.attr_vals" autocomplete="off"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 上传图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action：上传的服务端地址，必须是完整的 -->
            <!-- :on-preview：预览图片的函数 -->
            <!-- :on-remove：移除图片的函数 -->
            <!-- list-type：上传组件，自带一个图片列表展示图片 -->
            <!-- 注意问题：element-ui提供的图片上传不走网络，所以就不能实现拦截请求，添加token到请求头，也就不能上传到服务器，会提示无效token，所以需要给 upload指定请求头，携带token -->
            <!-- headers指定请求头，是一个对象，可以在data中处理，页面一旦加载created就获取token -->
            <!-- :on-success:图片上传触发的函数 -->
            <el-upload
              :headers="uploadToken"
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor">
            </quill-editor>

            <!-- 提交 -->
            <el-button style="margin-top:12px;float:right;" type="primary" @click="saveAddGood">提交</el-button>
          </el-tab-pane>

        </el-tabs>
      </el-form>

      <!-- 预览图片 -->
      <el-dialog
        title="预判大图"
        :visible.sync="showImgDialogVisible"
        width="50%">
        <img :src="showImgUrl" alt="" style="width: 100%;">
      </el-dialog>
    </div>
</template>

<script>
    import lodash from 'lodash';
    export default {
      data(){
        return {
          activeName:'0', // 标签页同步
          // 绑定的数据
          addForm:{
            goods_name:'',
            goods_price:'',
            goods_weight:'',
            goods_number:'',
            goods_cat:[], // 选中后的select数据
            goods_introduce:'', // 商品的描述，也就是富文本
            pics:[], // 添加商品的时候，需要这两个数组
            attrs:[], // 商品的属性数组
            add_time:new Date().getTime()
          },
          //校验
          addFormRules:{
            goods_name:[
              { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            goods_price:[
              { required: true, message: '请输入商品价格', trigger: 'blur' }
            ],
            goods_weight:[
              { required: true, message: '请输入商品重量', trigger: 'blur' }
            ],
            goods_number:[
              { required: true, message: '请输入商品数量', trigger: 'blur' }
            ],
            goods_cat:[
              { required: true, message: '请输入商品分类', trigger: 'blur' }
            ]
          },


          // select
          goodsCatList:[], // 渲染在页面的 select数据
          cascaderProps:{ // props 属性
            value:'cat_id', // 选中后的分类id
            label:'cat_name', // 分类名称
            children:'children' // 分类的数据
          },


          // 商品参数：
          manyParams:[], // 动态参数列表

          // 商品属性：
          onlyParams:[], // 静态属性数据

          // 上传图片：
          uploadToken:{
            Authorization:''
          },
          // 预判图片：
          showImgDialogVisible:false,
          showImgUrl:'' // 图片地址
        }
      },
      created(){
        this.getSelectData();

        // 获取token
        const tokenStr = sessionStorage.getItem('token');
        this.uploadToken.Authorization = tokenStr;
      },

       methods:{
        // 不满足第一页标签的，则不能下滑到第一页标签页：标签页提供一个属性：before-leave，是一个函数，返回false / promise会阻止下滑
        disabledSlide(){
          if(this.addForm.goods_cat.length !== 3){
            this.$message.error("请选择基本信息中的商品分类为三级商品分类");
            return false;
          }
        },



        // 更改select 会自动触发，返回选中后的分类id数组
        handleChange(value){
          this.addForm.goods_cat = value;
          if(this.addForm.goods_cat.length !== 3){
            this.$message.warning("请选择三级分类");
            this.addForm.goods_cat = [];
          }
        },


        // 获取select的数据：
        async getSelectData(){
          const res = await this.axios.get(`categories`,{params:{type:3}});

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.goodsCatList = data;
          }
        },


        // 预览图片：
        handlePreview(result){
          this.showImgDialogVisible = true;
          this.showImgUrl = result.response.data.url;
          console.log(result.response.data.url);
        },
        // 图片上传成功，记录图片的信息到 addForm.pics数组中：
        // 怼出一个对象：  {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
        // 然后追加到 pics数组中
        uploadSuccess(result){
          const obj = {pic:result.data.tmp_path};
          this.addForm.pics.push(obj);
        },
        // 移除图片：从 pics 数组中删除对应的图片
        handleRemove(result){
          // findIndex : 根据条件，找出对应的索引
          const index = this.addForm.pics.findIndex(item => item.pic === result.response.data.tmp_path);
          this.addForm.pics.splice(index,1);
        },


        // 保存添加商品的参数：
        saveAddGood(){
          console.log(this.addForm);

          // 在保存参数的时候，发现有两处需要处理的，选择的分类id，也就是select的值是一个数组，但是上传的是一串字符串，所以需要转换，第二处问题：动态参数和静态属性没有获取到。
          // 1. 把addForm中的goods_cat 遍历，然后转换为字符串，逗号分割。
          // this.addForm.goods_cat = this.addForm.goods_cat.join(',');
          // 上面的写法，会出错，因为 还没有提交，select就必须用的是数组，为提交就转换为字符串，肯定会报错的。
          // 解决方案：把addForm 深拷贝到另一个对象，用新的对象处理成字符串。 --- lodash插件
          var form = _.cloneDeep(this.addForm); // cloneDeep 深拷贝，_ 就相当于jquery中的$
          form.goods_cat =  form.goods_cat.join(','); // 深拷贝拷贝的是对象，浅拷贝拷贝的是引用
          // console.log(form);

          // 怼出attrs的数组，里面包含动态参数和静态属性
          /* {
            "attr_id":15,
            "attr_value":"ddd"
          },*/

          this.manyParams.forEach(item => {
            const o = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
            form.attrs.push(o);
          })

          this.onlyParams.forEach(item => {
            const o = {attr_id:item.attr_id,attr_value:item.attr_vals} // 静态属性本来就是字符串，不需要处理
            form.attrs.push(o);
          })

          console.log(form);

          // 提交到服务端：
          this.$refs.addFormRef.validate(async valid => {
            if(!valid){
              this.$message.warning("还有参数没有填写完毕");
            }else {
              const res = await this.axios.post(`goods`,form);
              const {meta:{status,msg},data} = res.data;

              if(status ===201){
                this.$message.success("添加商品成功");
                // 跳转到商品列表
                this.$router.push({name:'list'});
              }else {
                this.$message.error(msg);
              }
            }
          })
        },
      },

      // 监听
      watch:{
        async activeName(newVal,oldVal){
          if(newVal == '1'){
            // 进入 商品参数面板，发送分类请求，获取动态参数渲染到页面：
            const id = this.addForm.goods_cat[2];
            const res = await this.axios.get(`categories/${id}/attributes`,{
              params:{sel:"many"}
            });

            const {meta:{status,msg},data} = res.data;

            // 把 attr_vals 由字符串处理为数组：split
            data.forEach(item => {
              item.attr_vals =item.attr_vals ? item.attr_vals.split(',') : [];
            })

            if(status === 200){
              this.manyParams = data;
            }
          }else if(newVal == '2'){
            // 请求 only的静态属性数据：
            const id = this.addForm.goods_cat[2];
            const res = await this.axios.get(`categories/${id}/attributes`,{
              params:{sel:"only"}
            });
            const {meta:{status,msg},data} = res.data;
            if(status === 200){
              this.onlyParams = data;
            }
          }
        }
      }
    }
</script>

<style>
.el-alert {
  margin: 12px 0;
}

.el-steps {
  margin-bottom: 15px;
}
.el-step__title {
  font-size: 12px;
  line-height: 38px;
}

  .el-form-item__label {
    float: none;
  }

  .el-form-item {
    margin-bottom: 8px;
  }
  .el-form-item__content {
    margin-left: 0!important;
  }
  .el-checkbox {
    margin-right: 8px;
  }
  .ql-editor {
    height:300px!important;
  }

.el-form-item__label {
  text-align: left!important;
  float: none!important;
}
</style>
