<template>
  <div>
    <a-card :bordered="true" :bodyStyle="tstyle" :style="{ padding: '10px 10px' }">
      <template slot="title">
        <div>收货地址：
          <a-select mode="default" :model="khbh" :style="{width: '250px' }" @change="handleChange">
            <a-select-option value="item.khbh" v-for="(item, index) in khList" :key="index">
              {{ item.khmc }}
            </a-select-option>
          </a-select>
        </div>
        <div><a-button type="link" @click="newAddress">添加新地址</a-button></div>
      </template>
      <div class="search-wrapper">
        <a-list>
          <a-list-item v-for="(item,index) in data" :key="index">
            <div style="width: 100%;">
              <div style="width: 100%;display: flex; flex-direction: row; justify-content: space-between;">
                <div>收货人：{{ item.shr }}</div>
                <div ><a-button type="link">修改</a-button><a-button type="link">删除</a-button></div>
              </div>
              <div style="width: 100%;">收货地址：{{ item.shdz }}</div>
              <div style="width: 100%;">联系电话：{{ item.lxdh }}</div>
              <div style="width: 100%;">设为默认：<a-switch v-model="item.isDefault" ></a-switch></div>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </a-card>
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import addForm from './addForm.vue'
  import editForm from './editForm.vue'
  import { list } from '@/api/shdz'
import order from '@/api/order'
  export default {
    components: {
      addForm,
      editForm
    },
    data () {
      return {
        tableHeight: window.innerHeight - 205,
        // 高级搜索 展开/关闭
        // 表头
        data: [
        ],
        khList: []
      }
    },
    created () {
      window.addEventListener('resize', this.getHeight)
      this.queryKH()
    },
    mounted () {
      console.info('mounted')
      this.getData()
    },
    methods: {
      queryKH() {
        order.businessCustomDict().then(res => {
          this.khList = res.data.rows
        })
      },
      getData () {
        list({}).then(res => {
          if (res.code === 200) {
            console.info(res)
            this.data = res.data
          }
        }).catch(() => {

        })
      },
      getHeight () {
        this.tableHeight = window.innerHeight - 205
      },
      newAddress () {

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
