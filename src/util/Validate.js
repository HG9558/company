import {checkPwdScore, getPwdSafeLevel} from './pwd'

let pwd = pwd => {
  // return pwd.length >= 6 && pwd.length <= 16 && !pwd.match(/([a-zA-Z\d]){1}?\1{2,}/) && pwd.match(/(\d+[a-zA-Z]+)|([a-zA-Z]+\d+)/g)
  return /^.{6,20}$/g.test(pwd) && /\d/g.test(pwd) && /[a-zA-Z~!@#$%^&*()\-_=+]/g.test(pwd) && !/([a-zA-Z\d~!@#$%^&*()\-_=+]){1}\1{2,}/g.test(pwd)
}
let phone = phone => {
  // return phone.length === 11 && phone.match(/^(134|135|136|137|138|139|150|151|152|157|158|159|187|188|130|131|132|155|156|176|185|186|133|153|180|189)/)
  return phone.length === 11 && phone.match(/^1[3456789]/)
}
let email = email => {
  return email.match(/\S+@\S+\.\S+/)
}
let bankcard = bankcard => {
  return (bankcard.length === 16 || bankcard.length === 18 || bankcard.length === 19) && bankcard.match(/^\d{16,}$/)
}
let chinese = chinese => {
  return chinese.match(/^[\u4e00-\u9fa5]+$/)
}
let chineseName = chineseName => {
  return chineseName.match(/^[\u4e00-\u9fa5]{1,8}(·*[\u4e00-\u9fa5]{1,8}){1,4}$/)
}
let account = account => {
  // 必须包含数字和字母
  // return account.length >= 6 && account.length <= 16 && account.match(/(\d+[a-zA-Z]+)|([a-zA-Z]+\d+)/g)
  return account.match(/^[0-9a-zA-Z]{6,16}$/)
}
let nickName = nickName => {
  return nickName.length >= 2 && nickName.length <= 8 && !(nickName.match(/\d/g) || [])[4] && !nickName.match(/q{2,}/gi) && nickName.match(/^[\u4e00-\u9fa5\da-zA-Z]+$/)
}
module.exports = {
  pwd,
  phone,
  email,
  bankcard,
  chinese,
  chineseName,
  account,
  nickName,
  checkPwdScore,
  getPwdSafeLevel
}
