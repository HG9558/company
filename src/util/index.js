// 数组
import groupArray from './Array'
// 日期
import { timeFormat } from './Date'
// dom
import { getOffset, addEvent, removeEvent } from './Dom'
// 基础
import { repeat } from './base'
import { numberWithCommas } from './Number'
// 注数算法
import N from './N'
import M from './M'

/**
 * 对列表按指定字段排序
 * @param {*} list 
 * @param {*} filedName 
 * @param {*} order 
 */
function listOrderByField(list, fieldName, order) {
  let temp
  let current
  let next
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - i; j++) {
      current = list[j][fieldName]
      next = list[j + 1] && list[j + 1][fieldName]
      current = parseFloat(String(current).replace(/[-\s:.,]/g, ''))
      next = parseFloat(String(next).replace(/[-\s:.,]/g, ''))
      if (current > next) {
        temp = list[j + 1]
        list[j + 1] = list[j]
        list[j] = temp
      }
    }
  }
  if (order === 'desc') {
    list = list.reverse()
  }
  return list
}

module.exports = {
  groupArray,
  getOffset,
  addEvent,
  removeEvent,
  timeFormat,
  repeat,
  N,
  M,
  listOrderByField
}

window.Number.prototype._o0 = window.String.prototype._o0 = function () {
  return parseFloat((this + '').replace(/,/g, '')) > 0
}
window.Number.prototype._l0 = window.String.prototype._l0 = function () {
  return parseFloat((this + '').replace(/,/g, '')) < 0
}
window.Number.prototype._nwc = window.String.prototype._nwc = function () {
  return numberWithCommas(this)
}
