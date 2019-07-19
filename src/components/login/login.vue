<template>
    <div class="login-wrap">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="用户名" prop="name">
          <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
      name: "login",
      data(){
        var validateName = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入用户名'));
          } else {
            callback();
          }
        };
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            callback();
          }
        };
          return {
            ruleForm:{
              name:"",
              pass:""
            },
            rules:{
              name:[
                { validator: validateName, trigger: 'blur' }
              ],
              pass: [
                { validator: validatePass, trigger: 'blur' }
              ],
            }
          }
      },
      methods:{
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // 有值的时候：true
              this.axios({
                method:'post',
                url:'login',
                data:{
                  username : this.ruleForm.name,
                  password :  this.ruleForm.pass
                }
              }).then(res => {
                console.log(res);
                // 把需要的信息从res结构出来：
                // const {data,meta} = res.data;
                // 二次结构：meta中的 msg 和 status
                // meta: {msg: "用户名不存在", status: 400},所以解构的时候，左边是属性，右边是值
                const {
                  data,
                  meta:{msg,status}
                } = res.data;

                if(status === 200){
                  // 保存token，做路由守卫
                  sessionStorage.setItem("token",data.token);

                  // 登录成功：跳转路由到 home
                  // 提示登录成功
                  this.$router.push({name:'home'});
                  // alert("登录成功");
                  this.$message.success(msg);
                }else {
                  // 错误提示
                  this.$message.error(msg);
                }
              })
            } else {
              // 没有输入任何东西的时候：false
              alert("请输入内容");
              return false;
            }
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #241521;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-wrap .demo-ruleForm {
    background-color: #fff;
    padding:30px;
    width: 400px;
    border-radius: 10px;
  }
</style>
