import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import store from '../store'
let user = store.state.user
const Login = r => require.ensure([], () => r(require('../views/Login')), 'login-part')
const C404 = r => require.ensure([], () => r(require('../views/login/404')), 'login-part')
const C500 = r => require.ensure([], () => r(require('../views/login/500')), 'login-part')
const C503 = r => require.ensure([], () => r(require('../views/login/503')), 'login-part')
const Forbidden = r => require.ensure([], () => r(require('../views/login/Forbidden')), 'login-part')
// const Register = r => require.ensure([], () => r(require('../views/login/Register')), 'login-part')
const LoginTest = r => require.ensure([], () => r(require('../views/login/LoginTest')), 'login-part')
// const LoginNow = r => require.ensure([], () => r(require('../views/login/Login')), 'login-part')
const Try = r => require.ensure([], () => r(require('../views/login/Try')), 'login-part')
const Forget = r => require.ensure([], () => r(require('../views/login/Forget')), 'login-part')

const Pages = r => require.ensure([], () => r(require('../views/Pages')), 'pages-part')
const Egame = r => require.ensure([], () => r(require('../views/outer/Egame')), 'pages-part')
const Egamimg = r => require.ensure([], () => r(require('../views/outer/Egamimg')), 'pages-part')
const Sports = r => require.ensure([], () => r(require('../views/outer/Sports')), 'pages-part')

let router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      path: '/',
      meta: {
      },
      component: require('../views/Home.v2'),
      children: [
        {
          path: '/sports',
          meta: {
            rl: true
          },
          component: Sports
        },
        {
          path: '/egame/:tabIndex',
          meta: {
            rl: true
          },
          component: Egame
        },
        {
          path: '/egaming',
          meta: {
            rl: true
          },
          component: Egamimg
        },
        {
          path: '/game/:url',
          meta: {
            // rl: true
          },
          component: Pages
        },
        {
          path: '/group/:url',
          meta: {
            rl: true
          },
          component: Pages
        },
        {
          path: '/me/:url',
          meta: {
            rl: true
          },
          component: Pages
        },
        {
          path: '/form/:url',
          meta: {
            rl: true
          },
          component: Pages
        },
        {
          path: '/help/:url',
          meta: {
            // rl: true
          },
          component: Pages
        },
        {
          path: '/activity/:url',
          meta: {
            rl: true
          },
          component: Pages
        },
        {
          path: '/download/:url',
          meta: {
            // rl: true
          },
          component: Pages
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      meta: {
      },
      children: [
        { path: '404', component: C404 },
        { path: '500', component: C500 },
        { path: '503', component: C503 },
        { path: 'forbidden', component: Forbidden },
        // { path: 'register', component: Register },
        { path: '', component: LoginTest },
        // { path: 'login',
        //   meta: {
        //   },
        //   component: LoginNow
        // },
        { path: 'try',
          meta: {
          },
          component: Try },
        { path: 'forget', component: Forget }
      ]
    },
    {
      path: '/trend',
      component: require('../views/form/TrendChart')
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
let t = 0
// 匹配前
router.beforeEach((to, from, next) => {
  // login or not go to the page
  if (to.path.startsWith('/form/4-5-3')) {
    if (from && from.path.startsWith('/game')) {
      window.open(window.location.origin + '#' + to.fullPath)
      // console.log(window.location.origin + '#' + to.fullPath)
      return next(false)
    }
    next({path: '/trend?gameid=' + to.query.gameid})
    return next()
  }
  // NProgress
  t = setTimeout(() => {
    window.NProgress.start()
  }, 300)
  if (to.meta.rl && !user.login) {
    setTimeout(() => {
      if (!user.login) {
        router.push(from.path)
        router.apps[0].$children[0] && router.apps[0].$children[0].__popLogin('Login:' + to.path)
      } else next()
    }, user.login === '' ? 500 : 0)
  } else next()
})

// 匹配后
router.afterEach(r => {
  clearTimeout(t)
  setTimeout(() => {
    window.NProgress.done()
  }, 300)
})
export default router
