<template>
  <a-modal
    :visible="showOrderModal"
    title="选择订单模板"
    width="800px"
    :confirmLoading="false"
    @ok="handleOk"
    @cancel="closeModal">
    <div>
      <div class="search-wrapper">
        <a-row>
          <a-col>
            <a-input
              placeholder="模板名称"
              v-model="queryParam.mbmc"
              style="width: 250px; box-sizing: border-box"
            />
            <a-button type="primary" @click="loadData">查询</a-button>
            <!--<a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>-->
          </a-col>
        </a-row>
      </div>
      <div class="table">
        <a-table
          ref="table"
          :columns="columns"
          :dataSource="data"
          :rowKey="(record) => record.lsbh"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'radio' }"
          @change="handleTableChange"
          bordered
        >
          <template slot="action" slot-scope="text, record">
            <a-button type="link" @click="del(record.lsbh)">删除</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
import order from '@/api/order'
export default {
  props: {
    showOrderModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 查询参数
      selectedRows: [],
      selectedRowKeys: [],
      // queryParam: {},
      queryParam: { userid: this.$route.query.userid },
      // 表头
      columns: [
        {
          title: '模板名称',
          align: 'center',
          dataIndex: 'mbmc'
        },
        {
          title: '商业单位',
          align: 'center',
          dataIndex: 'khmc'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 160
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10
    },
      // 加载数据方法 必须为 Promise 对象
      data: []
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
  },
  watch: {
    showOrderModal(v) {
      this.loadData()
    }
  },
  methods: {
    del(id) {
      order
        .templateDel({ lsbh: id })
        .then((res) => {
          if (res.message) {
            this.$message.success(res.message)
            this.loadData()
          }
        }
        )
    },
    handleOk() {
        if (this.selectedRows.length < 1) {
          this.$message.warn('请选择一条记录！')
          return
        }
        this.closeModal(this.selectedRows[0])
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
        .templatePage(Object.assign(page, { mbmc: this.queryParam.mbmc, zdrid: this.$store.state.user.info.syzhid }))
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
    onSelectChange(selectedRowKeys, selectedRows) {
      console.info(selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    closeModal(record) {
      this.$emit('closeModal', 'modal', record)
    }
  }
}
</script>
<style lang="less" scoped>
button {
  margin-right: 8px;
}
.table {
  margin-top: 10px;
}
.table /deep/ .ant-table-thead > tr > th {
  padding: 3px;
}
.table /deep/ .ant-table-tbody > tr > td {
  padding: 3px;
}
</style>
