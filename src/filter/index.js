import { padStart } from '../util/base'
export default (Vue) => {
  Vue.filter('padStart', padStart)
}
// module.exports = {
//   padStart
// }
