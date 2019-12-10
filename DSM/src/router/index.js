// import direction from './direction'
import store from 'src/store'
// function view(url) {
//   return function(resolve) {
//     require([url], resolve)
//   }
// }
// const OwHome = r => require.ensure([], () => r(require('../../DSDS/src/views/ow/Home')), 'ow')
// const OwNews = r => require.ensure([], () => r(require('../../DSDS/src/views/ow/News')), 'ow')
// const OwFAQ = r => require.ensure([], () => r(require('../../DSDS/src/views/ow/FAQ')), 'ow')

// const Home = r => require.ensure([], () => r(require('../views/Home')), 'login-part')
const Login = r => require.ensure([], () => r(require('../views/Login')), 'login-part')
const C404 = r => require.ensure([], () => r(require('src/views/login/404')), 'login-part')
const Forbidden = r => require.ensure([], () => r(require('src/views/login/Forbidden')), 'login-part')
const Register = r => require.ensure([], () => r(require('src/views/login/Register')), 'login-part')
const LoginTest = r => require.ensure([], () => r(require('src/views/login/LoginTest')), 'login-part')
const LoginNow = r => require.ensure([], () => r(require('src/views/login/Login')), 'login-part')
const Try = r => require.ensure([], () => r(require('src/views/login/Try')), 'login-part')
const Forget = r => require.ensure([], () => r(require('src/views/login/Forget')), 'login-part')

const Pages = r => require.ensure([], () => r(require('src/views/Pages')), 'pages-part')

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
      {
        path: '/login',
        meta: {
          // login: false
        },
        // component: require('../../DSDS/src/views/Login'),
        component: Login,
        children: [
          // { path: '404', component: require('../../DSDS/src/views/login/404') },
          { path: '404', component: C404 },
          { path: 'forbidden', component: Forbidden },
          // { path: 'forbidden', component: require('../../DSDS/src/views/login/Forbidden') },
          { path: 'register', component: Register },
          // { path: 'register', component: require('../../DSDS/src/views/login/Register') },
          { path: '', component: LoginTest },
          // { path: '', component: require('../../DSDS/src/views/login/LoginTest') },
          { path: 'login',
            meta: {
              // login: false
            },
            // component: require('../../DSDS/src/views/login/Login')
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
        path: '*',
        redirect: '/'
      }
      // {
      //   meta: {
      //     login: true
      //   },
      //   path: '/',
      //   redirect: '/me/2-1-1'
      // }
    ],
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })

  // 匹配前
  router.beforeEach((to, from, next) => {
    // 如果需要登录，而当前没有登录， 先测试有没有登录
    // remove at 17/08/11
    // if (to.meta.login && !store.state.user.login) next({path: '/login'})
    // // 如果不要登录， 而当前登录了, 跳到大厅
    // else if (to.meta.login === false && store.state.user.login) {
    //   next(false)
    // } else next()

    // add at 17/08/11
    window.NProgress.start()
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
  })

  // 匹配后
  router.afterEach(router => {
    window.NProgress.done()
  })
  return router
}
