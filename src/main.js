// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

import '../static/css/reset.css'

// Element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// axios
import Axios from 'axios';
Vue.prototype.axios = Axios;
Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log(config.url); // 得到的是 baseURL 后面的字符
  if(config.url !== 'login'){ // 如果不是login页面，则拦截请求，设置请求头
    // 设置请求头，把token携带到服务端进行请求：
    const AUTH_TOKEN = sessionStorage.getItem('token');
    config.headers['Authorization'] = AUTH_TOKEN; // config中自带headers，给headers绑定新的属性
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});


// moment
import moment from 'moment';
// 创建全局过滤器，在new vue 前面创建
Vue.filter('formatDate',(data) => {
  return moment(data).format('YYYY-MM-DD')
})


// vue-table-with-tree-grid
import treeGrid from 'vue-table-with-tree-grid';
Vue.component('tree-table',treeGrid); //注册为全局，并自定义组件标签为 tree-table


// 富文本
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
