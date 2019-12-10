let getOffset = (e, depth) => {
  if (depth === undefined) depth = Infinity
  let top = e.offsetTop
  let left = e.offsetLeft
  let width = e.offsetWidth
  let height = e.offsetHeight
  while ((e = e.offsetParent) && depth > 0) {
    top += e.offsetTop
    left += e.offsetLeft
    depth--
  }
  return {top, left, width, height}
}

let addEvent = (evnt, elem, func) => {
  if (elem.addEventListener) elem.addEventListener(evnt, func, false)
  else if (elem.attachEvent) { // IE DOM
    elem.attachEvent('on' + evnt, func)
  } else {
    elem['on' + evnt] = func
  }
}

let removeEvent = (evnt, elem, func) => {
  if (elem.removeEventListener) elem.removeEventListener(evnt, func, false)
  else if (elem.detachEvent) { // IE DOM
    elem.detachEvent('on' + evnt, func)
  } else {
    elem['on' + evnt] = null
  }
}

// 全屏
let launchFullScreen = element => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT)
  }
}

// 退出全屏
let cancelFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

let toggleFullScreen = () => {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen()
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT)
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
}

module.exports = {
  getOffset,
  addEvent,
  removeEvent,
  launchFullScreen,
  cancelFullScreen,
  toggleFullScreen
}
