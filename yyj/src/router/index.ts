import { createRouter, createWebHistory } from "vue-router";
// import View from '../components/BaseView.vue'

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: () =>
    import(
      "../views/Home.vue"
    ),
  },
  {
    path:'/record/add',
    name:'RecordAdd',
    meta: {
      requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    component:()=>import('../views/RecordPost/Index.vue')
  },
  {
    path:'/login',
    name:'Login',
    component:()=>import('../views/Login/Index.vue')
  },
  {
    path:'/register',
    name:'Register',
    component:()=>import('../views/Login/Register.vue')
  },
  {
    path:'/relativer',
    name:'Relativer',
    component:()=>import('../views/Relativer/Index.vue')
  },
  {
    path:'/mine',
    name:'Mine',
    meta: {
      requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    component:()=>import('../views/Mine/Index.vue')
  },
  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 };
  }
});

// localStorage.setItem('userInfo', 1)
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  } else {
    document.title = "扬扬记";
  }
  // if (to.meta.description) {
  //   document.querySelector('meta[name=description]').content = to.meta.description
  // } else {
  //   document.querySelector('meta[name=description]').content = '用户中心'
  // }
  // debugger
  const path = to.matched.filter(v => v.meta.requiresAuth);
  if (path.length) {
    const metaName = path[0].meta.requiresAuth;
    
    if (metaName && !localStorage.getItem("userId")) {
      localStorage.setItem("ucm_curUrl", path[0].path);
      next({
        path: "/login",
        replace: true
      });
      // 增加 replace true 解决登录页面返回的问题
    } else {
      
      next();
    }
  } else {
    next();
  }
});

export default router;
