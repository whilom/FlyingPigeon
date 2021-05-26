import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import * as types from '../store/types'

import home from '../views/home.vue'
import resume from '../components/resume.vue'
import mailManage from '../views/mailManage.vue'
import personalCenter from '../views/personalCenter.vue'
import login from '../views/login.vue'
import register from '../views/register.vue'
import writeLetter from '../views/writeLetter.vue'
import receiveLetter from '../views/receiveLetter.vue'

Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/home',
    redirect: '/home',
    component: home,
    meta: {
      title: '首页',
      requireAuth: true
    },
    children: [
      {
        path: '/home',
        component: resume,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/home/writeLetter',
        component: writeLetter,
        meta: {
          title: '写信'
        }
      },
      {
        path: '/home/receiveLetter',
        component: receiveLetter,
        meta: {
          title: '收件箱'
        }
      },
      {
        path: '/home/mailManage',
        component: mailManage,
        meta: {
          title: '邮箱管理'
        }
      },
      {
        path: '/home/personalCenter',
        component: personalCenter,
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/',
    component: login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    component: register,
    meta: {
      title: '注册'
    }
  }
]

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next();
    }
    else {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    }
  }
  else {
    next();
  }
})

export default router;