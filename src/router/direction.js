let history = []
// let index = -1
let direction = ''
let oldIndex = -1

export default ({to, router}) => {
  if (to.ignore) {
    direction = ''
    return
  }
  if (to) {
    oldIndex = history.findIndex((url, i, his) => {
      return url === to.path || urlLikes(url, to.path)
    })
    if (oldIndex > -1) {
      if (oldIndex < history.length - 1) {
        direction = 'back'
      } else {
        direction = ''
      }
      history.splice(oldIndex, history.length - oldIndex - 1)
      history[oldIndex] = to.path
      // index = oldIndex
    } else {
      history.push(to.path)
      direction = ''
      // index = history.length - 1
    }
    router.app.$set('direction', direction)
    // console.log(oldIndex, history, direction, index)
  }
}
let urlLikes = (url, path) => {
  let likes = false
  let urlIndex = url.lastIndexOf('/') + 1
  let pathIndex = path.lastIndexOf('/') + 1
  if (urlIndex !== pathIndex || urlIndex === url.length || urlIndex === path.length) {
    likes = false
  } else {
    likes = url.startsWith(path.slice(0, pathIndex))
  }
  return likes
}
