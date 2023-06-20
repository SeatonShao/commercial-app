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
        <div slot="tabBarExtraContent" style="display:flex;justify-content: space-between;flex-wrap: nowrap;align-items: center;">
          <a-input placeholder="请输入订单号搜索" v-model="ddh" @pressEnter="search" style="margin-right:10px;"/>
          <a-button type="primary" @click="search" style="margin-right:10px;">搜索</a-button>
          <a-popconfirm
          placement="bottomRight"
          okType="primary"
          ok-text="搜索"
          cancel-text="重置"
          @cancel="reset"
          :visible="visible"
          @confirm="search">
            <a-icon slot="icon" />
            <template slot="title">
              <a-form layout="inline" style="width: 600px">
                    <a-row>
                    <a-col :span="12">
                    <a-form-item label="订单号" :labelCol="{ style: 'width: 80px' }">
                      <a-input :style="{ width: '140px',padding: '0 8px 0 0' }" v-model="queryParam.ddh" allow-clear placeholder=""/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="订单状态" :labelCol="{ style: 'width: 80px' }">
                      <a-select v-model="queryParam.ddzt" placeholder="" :style="{ width: '140px',padding: '0 8px 0 0' }">
                        <a-select-option v-for="(item,index) in ztData" :key="index" :value="item.code">{{ item.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  </a-row>
                  <a-row>
                  <a-col :span="12">
                    <a-form-item label="订单日期" :labelCol="{ style: 'width: 80px' }">
                      <a-date-picker format="YYYY-MM-DD" placeholder="" v-model="queryParam.ksrq" :style="{ width: '140px',padding: '0 8px 0 0' }"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="至" :labelCol="{ style: 'width: 80px' }">
                      <a-date-picker format="YYYY-MM-DD" placeholder="" v-model="queryParam.jsrq" :style="{ width: '140px',padding: '0 8px 0 0' }"/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-item label="产品名称" :labelCol="{ style: 'width: 80px' }">
                      <a-input :style="{ width: '140px',padding: '0 8px 0 0' }" v-model="queryParam.cpmc" allow-clear placeholder=""/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="产品编码" :labelCol="{ style: 'width: 80px' }">
                      <a-input :style="{ width: '140px',padding: '0 8px 0 0' }" v-model="queryParam.cpbm" allow-clear placeholder=""/>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </template>
            <a-icon type="down" @click="visible = !visible"></a-icon>
          </a-popconfirm>
        </div>
      </a-tabs>
      <div>
        <a-button @click="batchExport" :loading="batchExportLoading"><a-icon type="export"/>下载   </a-button>
      </div>
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="data"
        :rowKey="() => {return parseFloat(10000000000 * Math.random()).toFixed(0) + '' }"
        :scroll="{ x: 1000, y: tableHeight }"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="ddztaction" slot-scope="text, record">
          <a-button :class="{ blue: record.ddzt != '7'&&record.ddzt != '10'&&record.ddzt != '11', green: record.ddzt == '7', orange: record.ddzt == '10', red: record.ddzt == '11'}" style="width: 100%;">{{ record.ddzt|getStatus }}</a-button>
        </template>
        <template slot="gzxxaction" slot-scope="text, record, index">
          <a-button type="link" @click="show(record, index)">订单详情</a-button>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="primary" @click="newOrder(record.ddls)">再来一单</a-button>
          <a-button type="danger" @click="cancelOrder(record)" v-if="record.ddzt=='1'">取消订单</a-button>
          <a-button type="primary" @click="$refs.uploadHkdd.queryDetail(record.ddls)" v-if="record.ddzt=='1'">上传底单</a-button>
        </template>
      </a-table>
    </a-card>
    <uploadHkdd ref="uploadHkdd" @closeUploadHkdd="closeUploadHkdd"></uploadHkdd>
  </div>
</template>
<script>
import order from '@/api/order'
import moment from 'moment'
import uploadHkdd from './upload-hkdd.vue'
import { mapActions } from 'vuex'
// import { numberToCurrencyNo, numberToRoundCurrencyNo, dateFormat } from '@/api/modular/main/tool/numberToCurrencyNo'
export default {
  components: {
    uploadHkdd
  },

  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10
      },
      key: '1',
      visible: false,
      ztData: [],
      tableHeight: window.innerHeight - 265,
      ddh: '',
      queryParam: {
        ddh: '',
        ddzt: '',
        ksrq: '',
        jsrq: '',
        cpmc: '',
        cpbm: ''
      },
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
          width: 300
        }
      ],
      tstyle: { 'padding-bottom': '0px', 'margin-bottom': '0px' },
      batchExportLoading: false
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.search()
    this.dictTypeData().then((res) => {
                this.ztData = this.$options.filters['dictData']('ddzt')
              })
  },
  filters: {
    getStatus: order.getStatus
  },
  methods: {
    reset() {
      this.queryParam = {
        ddh: '',
        ddzt: '',
        ksrq: '',
        jsrq: '',
        cpmc: '',
        cpbm: ''
      }
    },
    closeUploadHkdd() {
      console.info()
      this.search()
    },
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
      const param = Object.assign({ ksfl: this.key }, this.queryParam)
      param.ksrq = param.ksrq ? moment(param.ksrq).format('YYYY-MM-DD') : ''
      param.jsrq = param.jsrq ? moment(param.jsrq).format('YYYY-MM-DD') : ''
            order.ddlb(Object.assign(page, param)).then(res => {
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
      this.$router.push({ path: '/order/ddxq', query: { ddls: record.ddls } })
    },
    newOrder(ddls) {
      if (this.$store.state.user.info.zhlx == '1') {
        this.$router.push({ path: '/order/cjdd', query: { ddls: ddls } })
      } else {
        this.$router.push({ path: '/order/cjdd2', query: { ddls: ddls } })
      }
    },
    cancelOrder(record) {
      // this.$router.push({ path: '/order/ddxq', params: { id: this.data[index].ddh } })
      order.cancelOrder({ ddls: record.ddls }).then((res) => {
        console.info(res)
        if (res.code === 200) {
          this.$message.info('取消订单完成！')
          this.search()
        } else {
          this.$message.info('取消订单失败！')
        }
      })
    },
    upload(index) {
      this.$message.info('上传底单完成！')
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 265
    },
    moment,
    ...mapActions(['Login', 'Logout', 'dictTypeData']),
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
/deep/ .ant-popover-buttons{
  text-align: center;
}
.orange {
    border-color: rgba(255, 165, 0, 0.3);
    background-color: rgba(255, 165, 0, 0.1);
    border-radius: 3px;
    color: rgba(255, 165, 0, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(255, 165, 0, 0.12);
    box-shadow: 0 2px 0 rgba(255, 165, 0, 0.045);
  }
  .blue {
    border-color: rgba(24, 144, 255, 0.3);
    background-color: rgba(24, 144, 255, 0.1);
    border-radius: 3px;
    color: rgba(24, 144, 255, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(24, 144, 255, 0.12);
    box-shadow: 0 2px 0 rgba(24, 144, 255, 0.045);
  }
  .green {
    border-color: rgba(0, 128, 0, 0.3);
    background-color: rgba(0, 128, 0, 0.1);
    border-radius: 3px;
    color: rgba(0, 128, 0, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(0, 128, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 128, 0, 0.045);
  }
  .red {
    border-color: rgba(255, 0, 0, 0.3);
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 3px;
    color: rgba(255, 0, 0, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(255, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(255, 0, 0, 0.045);
  }
.table-operator {
  margin-bottom: 18px;
}
</style>
