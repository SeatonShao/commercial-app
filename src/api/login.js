import request from '@/utils/request'

const userApi = {
  Login: '/business/login',
  LoginMobile: '/business/codeLogin ',
  Logout: '/logout',
  ForgePassword: '/forgotPassword',
  ResetEditPassword: '/business/resetEditPassword',
  EditPassword: '/business/editPassword',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/getBusinessLoginUser',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
 export function login (parameter) {
  // 密码采用sm2加密传输密码
  const sm2 = require('sm-crypto').sm2
  const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
  const encryptData = sm2.doEncrypt(parameter.password, publicKey, 1)
  parameter.password = encryptData
return request({
  url: userApi.Login,
  method: 'post',
  data: parameter
})
}

/**
 * editPassword func
 * parameter: {
 *     yhzh: '',
 *     yhmm: '',
 *     dxyzm: true
 * }
 * @param parameter
 * @returns {*}
 */
 export function editPassword (parameter) {
    // 密码采用sm2加密传输密码
    const sm2 = require('sm-crypto').sm2
    const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
    const encryptData = sm2.doEncrypt(parameter.yhmm, publicKey, 1)
    parameter.yhmm = encryptData
return request({
  url: userApi.EditPassword,
  method: 'post',
  data: parameter
})
}

/**
 * 重置密码 func
 * parameter: {
 *     yhzh: '',
 *     yhmm: '',
 *     dxyzm: true
 * }
 * @param parameter
 * @returns {*}
 */
 export function ePassword (parameter) {
  // 密码采用sm2加密传输密码
  const sm2 = require('sm-crypto').sm2
  const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
  const encryptData = sm2.doEncrypt(parameter.yhmm, publicKey, 1)
  parameter.yhmm = encryptData
return request({
url: userApi.EditPassword,
method: 'post',
data: parameter
})
}
/**
 * resetEditPassword func
 * parameter: {
 *     yhzh: '',
 *     yhmm: '',
 *     dxyzm: true
 * }
 * @param parameter
 * @returns {*}
 */
 export function resetEditPassword (parameter) {
    // 密码采用sm2加密传输密码
    const sm2 = require('sm-crypto').sm2
    const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
    const encryptData = sm2.doEncrypt(parameter.yhmm, publicKey, 1)
    parameter.yhmm = encryptData
return request({
  url: userApi.ResetEditPassword,
  method: 'post',
  data: parameter
})
}

/**
 * ForgePassword func
 * parameter: {
 *     yhzh: '',
 *     yhmm: '',
 *     dxyzm: true
 * }
 * @param parameter
 * @returns {*}
 */
 export function forgePassword (parameter) {
    // 密码采用sm2加密传输密码
    const sm2 = require('sm-crypto').sm2
    const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
    const encryptData = sm2.doEncrypt(parameter.yhmm, publicKey, 1)
    parameter.yhmm = encryptData
return request({
  url: userApi.ForgePassword,
  method: 'post',
  data: parameter
})
}
/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function loginMobile (parameter) {
  return request({
    url: userApi.LoginMobile,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
