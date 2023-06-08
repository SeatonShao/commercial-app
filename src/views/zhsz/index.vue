<template>
  <div>
    <a-card :bordered="true" :bodyStyle="tstyle" :style="{ padding: '10px 10px' }">
      <div class="search-wrapper">
        <div style="width: 100%;">
          <div style="width: 100%;display: flex; flex-direction: row; justify-content: space-between;">
            <h1>安全设置</h1>
            <div ></div>
          </div>
          <div style="width: 100%;">账户密码：<span style="display: inline-block;margin: 0 20px; width: 200px;">{{ showPwd?'item.shdz':'*******' }}</span><a-icon type="eye" v-if="showPwd" @click="showPwd = false"/><a-icon type="eye-invisible" v-else @click="showPwd = true"/><a-button type="link">修改</a-button></div>
          <div style="width: 100%;">当前密码强度：{{ '强' }}</div>
          <a-divider></a-divider>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    components: {
    },
    data () {
      return {
        showPwd: false,
        tableHeight: window.innerHeight - 205,
        // 高级搜索 展开/关闭
        // 表头
        data: [
          {
            shr: '展昭',
            shdz: '河南省开封市',
            lxdh: '674564588',
            isDefault: true
          },
          {
            shr: '荆轲',
            shdz: '辽宁省',
            lxdh: '1232323213',
            isDefault: true
          },
          {
            shr: '后羿',
            shdz: '河南洛阳',
            lxdh: '133456677878',
            isDefault: false
          },
          {
            shr: '虢石父',
            shdz: '陕西宝鸡',
            lxdh: '334445566',
            isDefault: false
          }
        ],
        tstyle: { 'padding-bottom': '0px', 'margin-bottom': '0px' },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          // return yxlxcdxxPage(Object.assign(parameter, this.queryParam)).then((res) => {
          //   return res.data
          // })
        },
        yxlxcdxxZtData: [],
        selectedRowKeys: [],
        selectedRows: [],
        options: {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
      }
    },
    created () {
      window.addEventListener('resize', this.getHeight)
      this.columns.push({
        title: '数据库表',
        width: '200px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' }
      })
      // 加载字典所有字典到缓存中
      this.dictTypeData().then((res) => {
        const yxlxcdxxZtOption = this.$options
        this.yxlxcdxxZtData = yxlxcdxxZtOption.filters['dictData']('SYZT')
      })
    },
    methods: {
      getHeight () {
        this.tableHeight = window.innerHeight - 205
      },
      ...mapActions(['Login', 'Logout', 'dictTypeData']),
            /**
       * 编辑
       */
      edit () {
        if (this.selectedRowKeys && this.selectedRowKeys.length === 1) {
          this.$refs.editForm.edit(this.selectedRowKeys[0])
        } else {
            this.$message.info('请选择一条记录!')
        }
      },
      /**
       * 单个删除
       */
      singleDelete (record) {
        const param = [{ 'yxlxcdxxLsbh': record.yxlxcdxxLsbh }]
        this.yxlxcdxxDelete(param)
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  }
</script>
<style lang="less" scoped>
  .table-operator {
    margin-bottom: 18px;
  }
</style>
