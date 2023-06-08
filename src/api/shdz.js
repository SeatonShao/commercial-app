import { axios } from '@/utils/request'

/**
 * 地址列表
 *
 * @author xiao
 * @Date 2023-05-16 14:48:35
 */
export default {
  list (parameter) {
    return axios({
      url: '/address/list',
      method: 'get',
      params: parameter
    })
  },

  /**
   * 设置默认
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  setDefault (parameter) {
    return axios({
      url: '/address/setDefault',
      method: 'post',
      data: parameter
    })
  },

  /**
   * 新增地址
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  add (parameter) {
    return axios({
      url: '/address/add',
      method: 'post',
      data: parameter
    })
  },

  /**
   * 编辑地址
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  edit (parameter) {
    return axios({
      url: '/address/edit',
      method: 'post',
      data: parameter
    })
  },

  /**
   * 删除地址
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  del (parameter) {
    return axios({
      url: '/address/delete',
      method: 'post',
      data: parameter
    })
  }
}
