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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
