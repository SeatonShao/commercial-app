<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="false"
    @cancel="handleCancel"
    :footer="null"
    style="top: 5px; float:left; left: 10px;"
  >
    <a-card :bordered="false">
      <div>
        <a-input :style="{ padding: '10px', width: '300px' }" v-model="queryParam.queryParam" allow-clear placeholder=""/>
        <a-button type="primary" @click="loadData" >查找</a-button>
        <a-button style="margin-left: 8px" @click="reset">重置</a-button>
      </div>
      <div class="table">
        <a-table
          ref="searchTable"
          :columns="columns"
          :dataSource="data"
          :rowKey="() => Math.random()*1000000"
          :customRow="clickThenSelect"
          :pagination="pagination"
          bordered
          @change="handleTableChange"
        >
        </a-table>
      </div>
    </a-card>
  </a-modal>
</template>
<script>
  import order from '@/api/order'
  export default {
    data () {
      return {
        pagination: {
          current: 1,
        pageSize: 10
      },
        title: '',
        formName: '',
        visible: false,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        // queryParam: {},
        queryParam: { userid: this.$route.query.userid, queryParam: '' },
        // 表头
        tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
        // 加载数据方法 必须为 Promise 对象
        columns: [],
        data: []
      }
    },
    created () {
      console.log('created')
    },
    mounted() {
      console.log('mounted')
    },
    methods: {
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.loadData()
      },
      reset() {
        this.queryParam.queryParam = ''
        this.loadData()
      },
      setColumns () {
      console.info('setColumns', this.formName)
      if (this.formName === 'khjlmc' || this.formName === 'fhjlmc') {
            this.columns = [{
            title: '人员编码',
            align: 'center',
            dataIndex: 'rybh'
          }, {
            title: '人员名称',
            align: 'center',
            dataIndex: 'rymc'
          }, {
            title: '所属部门',
            align: 'center',
            dataIndex: 'ssbm'
          }, {
            title: 'erp人员编码',
            align: 'center',
            dataIndex: 'erprybh'
          }]
          } else if (this.formName === 'xslxmc' || this.formName === 'khlxmc') {
            this.columns = [{
            title: '类型编号',
            align: 'center',
            dataIndex: 'lxbh'
          }, {
            title: '类型名称',
            align: 'center',
            dataIndex: 'lxmc'
          }]
          } else if (this.formName === 'sfmc') {
            this.columns = [{
            title: '省份编码',
            align: 'center',
            dataIndex: 'sfbh'
          }, {
            title: '省份名称',
            align: 'center',
            dataIndex: 'sfmc'
          }]
          } else if (this.formName === 'khmc') {
            this.columns = [{
            title: '客户编码',
            align: 'center',
            dataIndex: 'khbh'
          }, {
            title: '客户名称',
            align: 'center',
            dataIndex: 'khmc'
          }, {
            title: '允许发货',
            align: 'center',
            dataIndex: 'yxfh'
          }, {
            title: '资质是否过期',
            align: 'center',
            dataIndex: 'zzsfgq'
          }, {
            title: '是否超授信',
            align: 'center',
            dataIndex: 'sfcsx'
          }, {
            title: '授信情况',
            align: 'center',
            dataIndex: 'sxqk'
          }]
          } else if (this.formName === 'csokhmc') {
            this.columns = [{
            title: '客户编码',
            align: 'center',
            dataIndex: 'khbh'
          }, {
            title: '客户名称',
            align: 'center',
            dataIndex: 'khmc'
          }, {
            title: '联系电话',
            align: 'center',
            dataIndex: 'lxdh'
          }]
          } else if (this.formName === 'qrrmc') {
            this.columns = [{
            title: '人员编码',
            align: 'center',
            dataIndex: 'rybh'
          }, {
            title: '人员名称',
            align: 'center',
            dataIndex: 'rymc'
          }, {
            title: '所属部门',
            align: 'center',
            dataIndex: 'ssbm'
          }]
          } else if (this.formName === 'skdmc') {
            this.columns = [{
            title: '收款日期',
            align: 'center',
            dataIndex: 'skrq'
          }, {
            title: '挂账单位',
            align: 'center',
            dataIndex: 'gzdwmc'
          }, {
            title: '收款账号',
            align: 'center',
            dataIndex: 'skzh'
          }, {
            title: '业务员',
            align: 'center',
            dataIndex: 'ywymc'
          }, {
            title: '汇款金额',
            align: 'center',
            dataIndex: 'hkje'
          }, {
            title: '核销余额',
            align: 'center',
            dataIndex: 'hxye'
          }]
          } else {
            this.columns = [{
            title: '编码',
            align: 'center',
            dataIndex: 'khbh'
          }, {
            title: '名称',
            align: 'center',
            dataIndex: 'khmc'
          }]
          }
    },
      loadData() {
        console.info(order)
        const page = Object.assign({
          pageNo: (this.pagination && this.pagination.current) ||
            this.showPagination && this.localPagination.current || this.pageNum,
          pageSize: (this.pagination && this.pagination.pageSize) ||
            this.showPagination && this.localPagination.pageSize || this.pageSize
        }
      )
          if (this.formName === 'khjlmc' || this.formName === 'fhjlmc') {
            console.info(Object.assign(page, { rymc: this.queryParam.queryParam, wwxt: this.queryParam.wwxt }))
            order.examineManageDict(Object.assign(page, { rymc: this.queryParam.queryParam, wwxt: this.queryParam.wwxt })).then(res => {
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
          } else if (this.formName === 'xslxmc' || this.formName === 'khlxmc') {
            order.salesTypeDict(Object.assign(page, { khmc: this.queryParam.queryParam })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              }
            }).catch(e => {
              console.info(e)
            })
          } else if (this.formName === 'skdmc') {
            order.skdDict(Object.assign(page, { gzdwnm: this.queryParam.queryParam })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              }
            }).catch(e => {
              console.info(e)
            })
          } else if (this.formName === 'sfmc') {
            order.provinceDict(Object.assign(page, { khmc: this.queryParam.queryParam })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              }
            }).catch(e => {
              console.info(e)
            })
          } else if (this.formName === 'csokhmc') {
            order.csoCustomDict(Object.assign(page, { khmc: this.queryParam.queryParam })).then(res => {
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
          } else if (this.formName === 'khmc') {
            console.info()
            order.businessCustomDict(Object.assign(page, { khmc: this.queryParam.queryParam, wwxt: this.queryParam.wwxt, xslx: this.queryParam.xslx })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              }
            }).catch(e => {
              console.info(e)
            })
          } else if (this.formName === 'ejskhmc') {
            order.businessCustomDict(Object.assign(page, { khmc: this.queryParam.queryParam })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              }
            }).catch(e => {
              console.info(e)
            })
          } else if (this.formName === 'qrrmc') {
            order.personnelDict(Object.assign(page, { rymc: this.queryParam.queryParam })).then(res => {
              if (res.code === 200) {
                this.data = res.data.rows
                const pagination = { ...this.pagination }
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = res.data.totalRows
                this.loading = false
                this.pagination = pagination
              }
            }).catch(e => {
              console.info(e)
            })
          }
          console.info('loaddata', this.data)
        },
      open (title, formName, value, wwxt, xslx) {
        console.info(title, formName, value)
        this.title = title
        this.formName = formName
        this.data = []
        this.queryParam.queryParam = value
        this.pagination.current = 1
        this.pagination.total = 0
        this.queryParam.wwxt = wwxt
        this.queryParam.xslx = xslx
        this.visible = true
        this.setColumns()
        this.loadData()
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      handleCancel() {
        // 清空已选择的
        this.visible = false
      },
      clickThenSelect(record) {
        const vm = this
        return {
          on: {
            click: () => {
              // this.emitP(record)
              if (this.formName === 'khmc') {
                if (record.yxfh !== '是') {
                  this.$message.warn('选择的考核经理没有该商业客户的发货权限！')
                  return
                }
                if (record.zzsfgq === '是') {
                  this.$message.warn('选择的考核经理资质过期！')
                  return
                }
                vm.$emit('ok', { 'obj': { khmc: record.khmc, khbh: record.khbh, khnm: record.khnm }, 'formName': this.formName })
              } else if (this.formName === 'khjlmc') {
                vm.$emit('ok', { 'obj': { khjlmc: record.rymc, khjlid: record.rynm }, 'formName': this.formName })
              } else if (this.formName === 'ejskhmc') {
                vm.$emit('ok', { 'obj': { ejskhmc: record.khmc, ejskhbh: record.khbh, ejskhnm: record.khnm }, 'formName': this.formName })
              } else if (this.formName === 'sfmc') {
                vm.$emit('ok', { 'obj': { sfmc: record.sfmc, sfbh: record.sfbh }, 'formName': this.formName })
              } else if (this.formName === 'csokhmc') {
                vm.$emit('ok', { 'obj': { csokhmc: record.khmc, csobhbh: record.khbh, csokhnm: record.khnm }, 'formName': this.formName })
              } else if (this.formName === 'qrrmc') {
                vm.$emit('ok', { 'obj': { qrrmc: record.rymc, qrrid: record.rynm }, 'formName': this.formName })
              } else if (this.formName === 'xslxmc') {
                vm.$emit('ok', { 'obj': { xslxmc: record.lxmc, xslxbh: record.lxbh }, 'formName': this.formName })
              } else if (this.formName === 'khlxmc') {
                vm.$emit('ok', { 'obj': { khlxmc: record.lxmc, khlxbh: record.lxbh }, 'formName': this.formName })
              } else if (this.formName === 'skdmc') {
                vm.$emit('ok', { 'obj': { skdmc: record.skrq + '_' + record.hkje + '_' + record.hxye, skdid: record.sdkbh }, 'formName': this.formName })
              } else if (this.formName === 'fhjlmc') {
                if (record.erprybh) {
                  vm.$emit('ok', { 'obj': { fhjlmc: record.rymc, fhjlid: record.rynm, ssbm: record.ssbm }, 'formName': this.formName })
                } else {
                  vm.$message.error('选择的人员没有用友ERP账套的业务员编码对应，请联系系统运营人员处理。')
                }
              }
              // vm.$emit('ok', { 'obj': record, 'formName': this.formName })

              console.info({ 'obj': record, 'formName': this.formName })
              this.visible = false
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
       .table /deep/ .ant-table-thead > tr > th {
            padding: 3px ;
          }
        .table  /deep/ .ant-table-tbody > tr > td {
            padding: 3px ;
          }
.table-operator {
    margin-bottom: 18px;
  }
  button {
    margin-right: 8px;
  }
</style>
