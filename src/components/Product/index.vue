<template>
  <a-modal
    :visible="visible"
    title="选择产品"
    width="800px"
    :footer="null"
    @cancel="closeModal"
    style="top: 5px; float: left; left: 10px"
  >
    <div>
      <div class="search-wrapper">
        <a-row>
          <a-col>
            <a-input format="YYYYMM" placeholder="" v-model="queryParam.cpmc" style="display: inline-block; width: 300px;"/>
            <a-button type="primary" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (queryParam = {cpmc:''})">重置</a-button>
          </a-col>
        </a-row>
      </div>
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="data"
        :rowKey="(record) => record.cpbm"
        :scroll="{ x: 1000, y: tableHeight }"
        :pagination="pagination"
        :customRow="clickThenSelect"
        @change="handleTableChange"
        bordered
      >
      </a-table>
    </div>
  </a-modal>
</template>
<script>
import order from '@/api/order'
import moment from 'moment'
import { mapActions } from 'vuex'
import { throttle } from 'lodash'
export default {
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10
      },
      visible: false,
      tableHeight: window.innerHeight - 265,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      // queryParam: {},
      queryParam: { cpmc: '' },
      // 表头
      columns: [
        {
          title: '产品编码',
          align: 'center',
          dataIndex: 'cpbm',
          width: 80
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'cpmc',
          width: 120
        },
        {
          title: '包装规格',
          align: 'center',
          width: 130,
          dataIndex: 'bzgg'
        },
        {
          title: '计量单位',
          align: 'center',
          dataIndex: 'jldw',
          width: 60,
          ellipsis: true
        },
        {
          title: '件装量',
          align: 'center',
          dataIndex: 'jzl',
          width: 60
        },
        {
          title: '生产企业',
          align: 'center',
          dataIndex: 'scqymc',
          width: 150,
          ellipsis: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      data: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
  },
  methods: {
    open() {
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0
      }
      this.queryParam = { cpmc: '' }
      this.data = []
      this.visible = true
      this.loadData()
    },
    loadData() {
      console.info(order)
      const page = Object.assign({
        pageNo:
          (this.pagination && this.pagination.current) ||
          (this.showPagination && this.localPagination.current) ||
          this.pageNum,
        pageSize:
          (this.pagination && this.pagination.pageSize) ||
          (this.showPagination && this.localPagination.pageSize) ||
          this.pageSize
      })
      order
        .productDict(Object.assign(page, { cpmc: this.queryParam.cpmc }))
        .then((res) => {
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
        })
        .catch((e) => {
          console.info(e)
        })
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    closeModal() {
      this.visible = false
      this.$emit('closeModal')
    },
    clickThenSelect(record) {
      const vm = this
      return {
        on: {
          click: throttle(function() {
            vm.$emit('closeModal', 'product', record)
            console.info('closeModal', record)
            vm.visible = false
          }, 500, { leading: false, trailing: true })
        }
      }
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 265
    },
    moment,
    ...mapActions(['Login', 'Logout']),
    handleOk() {
      this.loadData()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
<style lang="less" scoped>
.search-wrapper {
  margin: 0 0 15px 0;
}
/deep/ .ant-table-thead > tr > th {
  padding: 3px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 3px;
}
button {
  margin-right: 8px;
}
</style>
