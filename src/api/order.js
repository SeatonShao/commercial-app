import { axios } from '@/utils/request'

export default {
  /**
   * cso客户
   *
   * @author Xiao
   * @date 2023-05-16 14:48:35
   */
  csoCustomDict(parameter) {
    return axios({
      url: '/csoCustomDict/page',
      method: 'get',
      params: parameter
    })
  },

  /**
   * 商业客户
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  businessCustomDict(parameter) {
    return axios({
      url: '/businessCustomDict/page',
      method: 'get',
      params: parameter
    })
  },

  /**
   * 人员查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  personnelDict(parameter) {
    return axios({
      url: '/personnelDict/page',
      method: 'get',
      params: parameter
    })
  },

  /**
   * 省份查询
   *
   * @author xiao
   * @date 2022/10/12 11:10
   */
  provinceDict(parameter) {
    return axios({
      url: '/provinceDict/page',
      method: 'get',
      params: parameter
    })
  },

  /**
   * 销售类型查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  salesTypeDict(parameter) {
    return axios({
      url: '/salesTypeDict/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 客户档案查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  yxsjysDict(parameter) {
    return axios({
      url: '/yxsjysDict/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 收款单查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  skdDict(parameter) {
    return axios({
      url: '/skdDict/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 发票开具查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  fpkjDict(parameter) {
    return axios({
      url: '/fpkjDict/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 考核经理查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  examineManageDict(parameter) {
    return axios({
      url: '/examineManageDict/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 确认订单
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  confirmOrder(parameter) {
    return axios({
      url: '/order/confirmOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 商业采购查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  syzhDict(parameter) {
    return axios({
      url: '/syzhDict/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 产品信息查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
  productDict(parameter) {
    return axios({
      url: '/productDict/page',
      method: 'get',
      params: parameter
    })
  },
    /**
   * 产品信息查询
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
     productDetail(parameter) {
      return axios({
        url: '/productDetail/page',
        method: 'get',
        params: parameter
      })
    },
  /**
   * 订单详情查询
   *
   * @author xiao
   * @Date 2023-05-19 14:48:35
   */
  orderDetail(parameter) {
    return axios({
      url: '/order/orderDetail',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 订单分单
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  allocateOrder(parameter) {
    return axios({
      url: '/order/allocateOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 查询审核记录
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  auditLog(parameter) {
    return axios({
      url: '/order/auditLog',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 查询电子合同
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
 econtractView(parameter) {
  return axios({
    url: '/econtract/viewUrl',
    method: 'get',
    params: parameter
  })
},
  /**
   * 转手订单
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  handoverOrder(parameter) {
    return axios({
      url: '/order/handoverOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 取消订单
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  cancelOrder(parameter) {
    return axios({
      url: '/order/cancelOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 退回订单
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  backOrder(parameter) {
    return axios({
      url: '/order/backOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 订单发货
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  orderDelivery(parameter) {
    return axios({
      url: '/order/orderDelivery',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 订单审核
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  auditOrder(parameter) {
    return axios({
      url: '/order/auditOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 订单关闭
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  closeOrder(parameter) {
    return axios({
      url: '/order/closeOrder',
      method: 'get',
      params: parameter
    })
  },
  /**
   * 订单状态映射
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
  getStatus(zt) {
    if (zt === '1') {
      return '待确认'
    } else if (zt === '2') {
      return '审核不通过'
    } else if (zt === '3') {
      return '待审核'
    } else if (zt === '4') {
      return '备货中'
    } else if (zt === '5') {
      return '部分备货中'
    } else if (zt === '6') {
      return '库存不足'
    } else if (zt === '7') {
      return '已发货'
    } else if (zt === '8') {
      return '完成'
    } else if (zt === '9') {
      return '部分发货'
    } else if (zt === '10') {
      return '已关闭'
    } else if (zt === '11') {
      return '已取消'
    }
  },
  /**
   * 订单创建
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
 createOrder(parameter) {
  return axios({
    url: '/order/cgCreateOrder',
    method: 'post',
    data: parameter
  })
},
  /**
   * 订单2创建
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
   createOrderPC(parameter) {
    return axios({
      url: '/order/pcCreateOrder',
      method: 'post',
      data: parameter
    })
  },
  /**
   * 采购端上传汇款底单
   *
   * @author xiao
   * @Date 2023-05-23 14:48:35
   */
   uploadReceipt(parameter) {
    return axios({
      url: '/order/uploadReceipt',
      method: 'post',
      data: parameter
    })
  },
   /**
   * 图片上传
   *
   * @author xiao
   * @Date 2023-05-16 14:48:35
   */
    uploadImg(parameter) {
      return axios({
        url: '/ftp/uploadFile',
        method: 'post',
        data: parameter
      })
   },
  /**
   *  订单列表
   */
  ddlb(parameter) {
    return axios({
      url: '/order/cgOrderListPage',
      method: 'get',
      params: parameter
    })
  },
  /**
   *  订单模板列表
   */
   templatePage(parameter) {
    return axios({
      url: '/template/page',
      method: 'get',
      params: parameter
    })
  },
  /**
   *  订单模板添加
   */
   templateAdd(parameter) {
    return axios({
      url: '/template/add',
      method: 'post',
      data: parameter
    })
  },
   /**
  * 订单发票查询
  *
  * @author xiao
  * @Date 2023-05-16 14:48:35
  */
    invoiceView(parameter) {
      return axios({
        url: '/order/invoiceView',
        method: 'get',
        params: parameter,
        responseType: 'arraybuffer'
      })
    },
  /**
   *  订单模板删除
   */
   templateDel(parameter) {
    return axios({
      url: '/template/delete',
      method: 'post',
      data: parameter
    })
  },

  /**
   *  导出订单列表
   */
  ddlbExport(parameter) {
    return axios({
      url: '/order/cgOrderListExport',
      method: 'get',
      params: parameter,
      responseType: 'blob'
    })
  },

  /**
   *  分单列表
   */
  fdlb(parameter) {
    return axios({
      url: '/order/orderAllocatePage',
      method: 'get',
      params: parameter
    })
  },

  /**
   *  导出分单列表
   */
  fdlbExport(parameter) {
    return axios({
      url: '/order/orderAllocateExport',
      method: 'get',
      params: parameter,
      responseType: 'blob'
    })
  },
  /**
   *  确认列表
   */
  qrlb(parameter) {
    return axios({
      url: '/order/orderConfirmPage',
      method: 'get',
      params: parameter
    })
  },

  /**
   *  导出确认列表
   */
  qrlbExport(parameter) {
    return axios({
      url: '/order/orderConfirmExport',
      method: 'get',
      params: parameter,
      responseType: 'blob'
    })
  },

  /**
   *  审核列表
   */
  shlb(parameter) {
    return axios({
      url: '/order/orderAuditPage',
      method: 'get',
      params: parameter
    })
  },

  /**
   *  导出审核列表
   */
  shlbExport(parameter) {
    return axios({
      url: '/order/orderAuditExport',
      method: 'get',
      params: parameter,
      responseType: 'blob'
    })
  },
  /**
   *  批量审核
   */
  batchCheck(parameter) {
    return axios({
      url: '/order/orderFollowPage',
      method: 'get',
      params: parameter
    })
  },
  /**
   *  跟进列表
   */
  gjlb(parameter) {
    return axios({
      url: '/order/orderFollowPage',
      method: 'get',
      params: parameter
    })
  },

  /**
   *  导出跟进列表
   */
  gjlbExport(parameter) {
    return axios({
      url: '/order/orderFollowExport',
      method: 'get',
      params: parameter,
      responseType: 'blob'
    })
  },

  /**
   *  转交订单
   */
  zjDd(parameter) {
    return axios({
      url: '/order/orderFollowPage',
      method: 'get',
      params: parameter
    })
  }
}
