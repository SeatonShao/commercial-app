import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

/**
 * 获取某个code下字典的列表，多用于字典下拉框，使用方法：{{ code | dictData }}
 *
 * @author Jonny
 * @date 2020-9-19 22:40:22
 */
 Vue.filter('dictData', function (code) {
  const dictTypeTree = Vue.ls.get('DICT_TYPE_TREE_DATA')
  if (dictTypeTree === undefined) {
    return []
  }
  // eslint-disable-next-line eqeqeq
  const tree = dictTypeTree.filter(item => item.code == code)[0].children
  if (tree === undefined) {
    return []
  }
  return tree
})
