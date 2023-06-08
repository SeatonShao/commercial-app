<template>
  <a-modal :visible="showOrderModal" title="选择订单模板" width="800px" :footer="null" @cancel="closeModal">
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
          :scroll="{ x: 800, y: 300 }"
          :rowKey="(record) => Math.random() * 1000000"
          :pagination="pagination"
          :customRow="clickThenSelect"
          @change="handleTableChange"
          bordered
        >
          <template slot="action" slot-scope="text, record, index">
            <a-button type="link" @click="del(index)">删除</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
import moment from 'moment'
import order from '@/api/order'
import { mapActions } from 'vuex'
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
      // queryParam: {},
      queryParam: { userid: this.$route.query.userid },
      // 表头
      columns: [
        {
          title: '模板名称',
          align: 'center',
          dataIndex: 'mbmc',
          width: 60
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'khmc',
          width: 100
        },
        {
          title: '收货人',
          align: 'center',
          width: 80,
          dataIndex: 'shr'
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'lxdh',
          width: 100
        },
        {
          title: '收货地址',
          align: 'center',
          dataIndex: 'shdz',
          width: 120,
          ellipsis: true
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 60
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
  methods: {
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
        .templatePage(Object.assign(page, { khmc: this.queryParam.queryParam }))
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
    clickThenSelect(record, index) {
      const vm = this
      console.info(this)
      return {
        on: {
          click: () => {
            vm.closeModal(record)
          }
        }
      }
    },
    closeModal(record) {
      this.$emit('closeModal', 'modal', record)
    },
    moment,
    ...mapActions(['Login', 'Logout'])
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
