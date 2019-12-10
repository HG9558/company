// import direction from './direction'
import store from 'src/store'

// function view(url) {
//   return function(resolve) {
//     require([url], resolve)
//   }
// }
// const Ow = r => require.ensure([], () => r(require('../views/ow/Ow')), 'ow')
// const OwHome = r => require.ensure([], () => r(require('../views/ow/Home')), 'ow')
// const OwNews = r => require.ensure([], () => r(require('../views/ow/News')), 'ow')
// const OwFAQ = r => require.ensure([], () => r(require('../views/ow/FAQ')), 'ow')

const Login = r => require.ensure([], () => r(require('src/views/Login')), 'login-part')
const C404 = r => require.ensure([], () => r(require('src/views/login/404')), 'login-part')
const C500 = r => require.ensure([], () => r(require('src/views/login/500')), 'login-part')
const C503 = r => require.ensure([], () => r(require('src/views/login/503')), 'login-part')
const Forbidden = r => require.ensure([], () => r(require('src/views/login/Forbidden')), 'login-part')
const Register = r => require.ensure([], () => r(require('src/views/login/Register')), 'login-part')
const LoginTest = r => require.ensure([], () => r(require('src/views/login/LoginTest')), 'login-part')
const LoginNow = r => require.ensure([], () => r(require('src/views/login/Login')), 'login-part')
const Try = r => require.ensure([], () => r(require('src/views/login/Try')), 'login-part')
const Forget = r => require.ensure([], () => r(require('src/views/login/Forget')), 'login-part')

const Pages = r => require.ensure([], () => r(require('src/views/Pages')), 'pages-part')

// const TrendChart = r => require.ensure([], () => r(require('src/views/Pages')), 'trend-chart')

export default function (VueRoter) {
  let router = new VueRoter({
    // mode: 'history',
    routes: [
      {
        path: '/',
        meta: {
          login: true
        },
        component: require('../views/Home')
      },
      // {
      //   path: '/ow',
      //   component: Ow
      //   // children: [
      //   //   {
      //   //     path: '',
      //   //     component: OwHome
      //   //   },
      //   //   {
      //   //     path: 'news',
      //   //     component: OwNews
      //   //   },
      //   //   {
      //   //     path: 'faq',
      //   //     component: OwFAQ
      //   //   }
      //   // ]
      // },
      {
        path: '/login',
        // component: require('../views/Login'),
        component: Login,
        meta: {
        },
        children: [
          // { path: '404', component: require('../views/login/404') },
          { path: '404', component: C404 },
          { path: '500', component: C500 },
          { path: '503', component: C503 },
          { path: 'forbidden', component: Forbidden },
          // { path: 'forbidden', component: require('../views/login/Forbidden') },
          { path: 'register', component: Register },
          // { path: 'register', component: require('../views/login/Register') },
          { path: '', component: LoginTest },
          // { path: '', component: require('../views/login/LoginTest') },
          { path: 'login',
            meta: {
              // login: false
            },
            // component: require('../views/login/Login')
            component: LoginNow
          },
          { path: 'try',
            meta: {
              // login: false
            },
            component: Try },
          { path: 'forget', component: Forget }
        ]
      },
      {
        path: '/game/:url',
        meta: {
          login: true
        },
        component: Pages
      },
      {
        path: '/group/:url',
        meta: {
          login: true
        },
        component: Pages
      },
      {
        path: '/me/:url',
        meta: {
          login: true
        },
        component: Pages
      },
      {
        path: '/form/:url',
        meta: {
          login: true
        },
        component: Pages
      },
      {
        path: '/help/:url',
        meta: {
          login: true
        },
        component: Pages
      },
      {
        path: '/activity/:url',
        meta: {
          login: true
        },
        component: Pages
      },
      {
        path: '/download/:url',
        meta: {
          login: true
        },
        component: Pages
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
        console.log(window.location.origin + '#' + to.fullPath)
        return next(false)
      }
      return next()
    }
    // console.log('game,me,group,form,activity,help,download'.indexOf(to.path.split('/')[1]) === -1, to.path, '????????')
    // router.app.$Progress.start()
    t = setTimeout(() => {
      window.NProgress.start()
    }, 300)
    // 如果需要登录，而当前没有登录， 先测试有没有登录
    if (to.meta.login && store.state.user.login === false) {
      next({path: '/login'})
    // 如果不要登录， 而当前登录了, 跳到大厅
    } else if (to.meta.login && store.state.user.login === null) {
      let t = setInterval(() => {
        if (store.state.user.login === false) {
          next({path: '/login'})
          clearInterval(t)
        }
        if (store.state.user.login === true) {
          next()
          clearInterval(t)
        }
      }, 200)
    } else if (to.meta.login === false && store.state.user.login) {
      // router.app.$Progress.fail()
      next(false)
    } else if ('game,me,group,form,activity,help,download'.indexOf(to.path.split('/')[1] || 'xxxxx') === -1 && 'game,me,group,form,activity,help,download'.indexOf(from.path.split('/')[1] || 'xxxxx') !== -1) {
      store.state.pages.forEach(t => store.actions.updatePage('', {size: 'minus'}, t))
      setTimeout(next, 300)
    } else next()
    // next()
    //
  })

  // 匹配后
  router.afterEach(r => {
    clearTimeout(t)
    setTimeout(() => {
      window.NProgress.done()
    }, 300)
    // window.NProgress.done()
    // router.app.$Progress.finish()
    // block8/3 console.log('after:', r)
  })
  return router
}
// this.$Progress.start()

// this.$Progress.set(num)

// this.$Progress.increase(num)

// this.$Progress.decrease(num)

// this.$Progress.finish()

// this.$Progress.fail()
