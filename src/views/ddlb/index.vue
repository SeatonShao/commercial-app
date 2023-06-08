<template>
  <div>
    <a-card :bordered="false">
      <a-tabs v-model="key" @change="search">
        <a-tab-pane key="1" tab="所有订单"> </a-tab-pane>
        <a-tab-pane key="2" tab="待确认"> </a-tab-pane>
        <a-tab-pane key="3" tab="待审核"> </a-tab-pane>
        <a-tab-pane key="4" tab="待发货"> </a-tab-pane>
        <a-tab-pane key="5" tab="已发货"> </a-tab-pane>
        <a-tab-pane key="6" tab="部分发货"> </a-tab-pane>
        <a-tab-pane key="7" tab="已取消"> </a-tab-pane>
        <a-input placeholder="请输入订单号搜索" slot="tabBarExtraContent" :model="ddh" @pressEnter="search"/>
      </a-tabs>
      <div>
        <a-button @click="batchExport" :loading="batchExportLoading"><a-icon type="export"/>下载   </a-button>
      </div>
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="data"
        :rowKey="(record) => record.ddh"
        :scroll="{ x: 1000, y: tableHeight }"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="ddztaction" slot-scope="text, record">
          <a-button :class="{ blue: record.ddzt != '7'&&record.ddzt != '10'&&record.ddzt != '11', green: record.ddzt == '7', orange: record.ddzt == '10', red: record.ddzt == '11'}">{{ record.ddzt|getStatus }}</a-button>
        </template>
        <template slot="gzxxaction" slot-scope="text, record, index">
          <a-button type="link" @click="show(record, index)">订单详情</a-button>
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a-button type="primary" @click="newOrder(record, index)">再来一单</a-button>
          <a-button type="danger" @click="cancelOrder(record, index)" v-if="record.ddzt=='1'">取消订单</a-button>
          <a-button type="primary" @click="upload(record, index)" v-if="record.ddzt=='1'">上传底单</a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import order from '@/api/order'
import moment from 'moment'
// import { yxzylxcMonthPage, yxzylxMonthExport } from '@/api/modular/main/yxzylxcmonth/yxzylxMonthManage'
import { mapActions } from 'vuex'
// import { numberToCurrencyNo, numberToRoundCurrencyNo, dateFormat } from '@/api/modular/main/tool/numberToCurrencyNo'
export default {
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10
      },
      key: '1',
      tableHeight: window.innerHeight - 265,
      ddh: '',
      data: [],
      // 表头
      columns: [
        {
          title: '序号',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'ddh',
          width: 100
        },
        {
          title: '订单日期',
          align: 'center',
          dataIndex: 'ddrq',
          width: 100
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'cpmc',
          width: 150
        },
        {
          title: '包装规格',
          align: 'center',
          dataIndex: 'bzgg',
          width: 150
        },
        {
          title: '产品编码',
          align: 'center',
          dataIndex: 'cpbm',
          width: 100
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'sl',
          width: 80
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'dj',
          width: 80
          // customRender: (text, record, index) => numberToCurrencyNo(record.yxzylxCrmkhdj)
        },
        {
          title: '金额',
          align: 'center',
          dataIndex: 'je',
          width: 100
          // customRender: (text, record, index) => numberToRoundCurrencyNo(record.yxzylxCrmkhje)
        },
        {
          title: '已发数量',
          align: 'center',
          dataIndex: 'yfsl',
          width: 80
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'ddzt',
          scopedSlots: { customRender: 'ddztaction' },
          width: 100
        },
        {
          title: '跟踪信息',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'gzxxaction' }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 330
        }
      ],
      tstyle: { 'padding-bottom': '0px', 'margin-bottom': '0px' },
      batchExportLoading: false
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.search()
  },
  methods: {
            /**
             * 批量导出
             */
             batchExport () {
                const obj = JSON.parse(JSON.stringify({ ddzt: this.key, ddh: this.ddh }))
                order.ddlbExport(obj).then((res) => {
                    this.$refs.batchExport.downloadfile(res)
                })
            },
            /**
     * 通过返回的元素通过浏览器下载
     * 也就是接受使用这个组件的地方吧下载的内容传过来，
     * 但是这个组件本公子编写的时候只想的适用于导出excel来使用，下载文件呀图片方面的重新整个组件即可
     */
    downloadfile (res) {
      this.batchExportLoading = false
      var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
    },
    search() {
        console.info(order)
        const page = Object.assign({
          pageNo: (this.pagination && this.pagination.current) ||
            this.showPagination && this.localPagination.current || this.pageNum,
          pageSize: (this.pagination && this.pagination.pageSize) ||
            this.showPagination && this.localPagination.pageSize || this.pageSize
        }
      )
            order.ddlb(Object.assign(page, { ddzt: this.key, ddh: this.ddh })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              } else {
                this.$message.error('请求数据失败！')
              }
            }).catch(e => {
              console.info(e)
            })
        },
    handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.search()
      },
    show(record, index) {
      this.$router.push({ path: '/dashboard/ddxq', query: { ddls: record.ddls } })
    },
    newOrder(record, index) {
      this.$router.push({ path: '/dashboard/cjdd2', query: { ddls: record.ddls } })
    },
    cancelOrder(index) {
      // this.$router.push({ path: '/dashboard/ddxq', params: { id: this.data[index].ddh } })
      this.$message.info('取消订单完成！')
      order.cancelOrder({ lsbh: this.data.ddmxls }).then((res) => {
        console.info(res)
        this.search()
      })
    },
    upload(index) {
      // this.$router.push({ path: '/dashboard/ddxq', params: { id: this.data[index].ddh } })
      this.$message.info('上传底单完成！')
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 265
    },
    moment,
    ...mapActions(['Login', 'Logout', 'dictTypeData']),
    /**
     * 单个删除
     */
    singleDelete(record) {
      // const param = [{ 'yxzylxLsbh': record.yxzylxLsbh }]
      // this.yxzylxMonthDelete(param)
    },
    handleOk() {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th {
  padding: 5px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 5px;
}
.table-operator {
  margin-bottom: 18px;
}
</style>
