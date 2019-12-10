export default (Vue) => {
  Vue.http.options.root = ''
  Vue.http.options.emulateJSON = true
  Vue.http.options.credentials = true
  // Vue.http.headers.common['Authorization'] = 'ren huang'
  // Vue.http.interceptors.push((request, next) => {
  //   next(({data}) => {
  //     console.log('responsedata: ', data)
  //     if (data && data.success === -2) console.log('no Authorization')
  //   })
  // })
  Vue.http.interceptors.push(() => {
    return {
      request (req) {
        // console.log(this, req)
        return req
      },
      response (rep) {
        // 用户过期
        if (rep.data && rep.data.success === -1) {
          this.$modal.warn({
            content: '您长时间没有操作，请重新登录！',
            ok () {
              this.__setCall({fn: '__logout'})
            },
            O: this
          })
        }
        // block8/3 console.log(rep.data)
        // if (data && data.success === -2) console.log('no Authorization')
        return rep
      }
    }
  })
}
