import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// @ 代表 src这一层目录
import Login from '@/components/login/login.vue';
import Home from '@/components/home/home.vue';
import ErrorHtml from '@/components/error/error.vue';

export default new Router({
  mode:"history",
  routes: [
    {path:'/',redirect:'/home'},
    {
      name:'login',
      path:'/login',
      component:Login
    },
    {
      name:'home',
      path:'/home',
      component:Home
    },
    {path:'*',component:ErrorHtml}
  ],
});
