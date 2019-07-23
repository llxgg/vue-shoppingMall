import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
Vue.use(Router);

// @ 代表 src这一层目录
import Login from '@/components/login/login.vue';
import Home from '@/components/home/home.vue';
import ErrorHtml from '@/components/error/error.vue';

import Users from '@/components/user/user.vue';

import Role from '@/components/power/role.vue';
import Power from '@/components/power/power.vue';

import goods from '@/components/goods/goods.vue';
import goodList from '@/components/goods/goodList.vue';
import goodAdd from '@/components/goods/goodAdd.vue';
import Categories from '@/components/goods/categories.vue';
import Params from '@/components/goods/params.vue';


 const router = new Router({
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
      component:Home,
      children:[
        {
          name:'users',
          path:'users',
          component:Users
        },
        {
          name:"roles",
          path:'roles',
          component:Role
        },
        {
          name:"rights",
          path:'rights',
          component:Power
        },
        {
          name:"goods",
          path:'goods',
          redirect:'goods/list',
          component:goods,
          children:[
            {
              name:'list',
              path:'list',
              component:goodList
            },
            {
              name:'add',
              path:'add',
              component:goodAdd
            },
          ]
        },
        {
          name:"categories",
          path:'categories',
          component:Categories
        },
        {
          name:"params",
          path:'params',
          component:Params
        }
      ]
    },
    {path:'*',component:ErrorHtml}
  ],
});

  // 路由守卫：注意：如果路由守卫成功，结果没有跳转，这是因为 token变量名有问题，改为 tokenStr就行
router.beforeEach((to, from, next) => {

  // 如果用户访问的是 登录页面，则直接放行
  if (to.path === '/login') return next();

// 获取 token
const tokenStr = sessionStorage.getItem('token');

// 如果 token 存在， 直接放行
if (tokenStr) return next();

// 否则，强制跳转到登录页
next('/login');
Message.warning("请先登录");
})

export default router;
