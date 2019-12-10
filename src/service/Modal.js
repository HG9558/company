import Vue from 'vue'
import Modal from 'components/Modal'

const ModalConstructor = Vue.extend(Modal)

const defaults = {
  title: '',
  content: '',
  showok: true,
  showcancel: true,
  showclose: true,
  body: true
}

const modal = (options = {}) => {
  options = Object.assign({}, defaults, options)
  if (typeof options.target === 'string') options.target = document.querySelector(options.target)
  options.target = options.target || document.body
  let instance = new ModalConstructor({
    el: document.createElement('div'),
    data: options
  })
  options.target.appendChild(instance.$el)
  return instance
}
['confirm', 'question', 'warn', 'success', 'redpocket', 'info'].forEach(m => {
  modal[m] = (options = {}) => {
    return modal(Object.assign(options, {type: m}))
  }
})

export default {
  install (Vue) {
    Vue.prototype.$modal = modal
  }
}

