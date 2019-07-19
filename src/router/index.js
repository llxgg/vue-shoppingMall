import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// @ 代表 src这一层目录
import Login from '@/components/login/login.vue';

export default new Router({
  mode:"history",
  routes: [
    {
      name:'login',
      path:'/login',
      component:Login
    }
  ],
});
