<template>
  <div>
    <a-card :bordered="true" :style="{ padding: '10px 10px' }">
      <template slot="title">
        <div style="display: inline-block;">收货地址：
          <a-select v-model="kh" @change="changeKH">
            <a-select-option :value="item.synm + ';' + item.symc" v-for="(item, index) in $store.state.user.gxList" :key="index">
              {{ item.symc }}
            </a-select-option>
          </a-select>
        </div>
        <div style="float: right;"><a-button type="link" @click="newAddress(null)">添加新地址</a-button></div>
      </template>
      <div class="search-wrapper">
        <a-list>
          <a-list-item v-for="(item,index) in data" :key="index">
            <div style="width: 100%;">
              <div style="width: 100%;display: flex; flex-direction: row; justify-content: space-between;">
                <div>收货人：{{ item.shrs }}</div>
                <div ><a-button type="link" @click="newAddress(index)">修改</a-button><a-button type="link" style="color: red;" @click="del(index)">删除</a-button></div>
              </div>
              <div style="width: 100%;">收货地址：{{ item.shdz }}</div>
              <div style="width: 100%;">联系电话：{{ item.lxdh }}</div>
              <div style="width: 100%;">设为默认：<a-switch :checked="item.mrdz=='1'" @click="setDefault(index)"></a-switch></div>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </a-card>
    <add-form ref="addForm" @ok="handleOk" />
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import addForm from '../cjdd/addForm.vue'
  import shdz from '@/api/shdz'
  export default {
    components: {
      addForm
    },
    data () {
      return {
        tableHeight: window.innerHeight - 205,
        // 高级搜索 展开/关闭
        // 表头
        data: [
        ],
        kh: '',
        khmc: '',
        khnm: ''
      }
    },
    created () {
      window.addEventListener('resize', this.getHeight)
      this.khnm = this.$store.state.user.gxList[0].synm
      this.khmc = this.$store.state.user.gxList[0].symc
      this.kh = this.khnm + ';' + this.khmc
      this.querySHDZ(this.khnm)
    },
    methods: {
      newAddress(index) {
      if (index !== this.data.size - 1) {
        this.$refs.addForm.open('收货人地址', this.data[index], this.khnm, this.khmc)
      } else {
        this.$refs.addForm.open('收货人地址', {}, this.khnm, this.khmc)
      }
    },
    setDefault(index) {
      if (this.data[index].mrdz == '1') {
       this.$message.warn('必须有一个默认地址！')
       return
     }
     this.data[index].mrdz = '1'
      shdz
        .setDefault(this.data[index])
        .then(res => {
          if (res.code === 200) {
            this.$message.info('设置成功')
            this.querySHDZ(this.khnm)
          }
        })
    },
      changeKH(e) {
        let v = this.kh
      v = v.split(';')
      this.form.khmc = v[1]
      this.form.khnm = v[0]
      this.querySHDZ(this.khnm)
    },
    querySHDZ (khnm) {
        shdz.list({ khbh: khnm }).then(res => {
          if (res.code === 200) {
            console.info(res)
            this.data = Object.assign({}, res.data)
            for (const i in res.data) {
              console.info(i)
              // this.data[i].mrdz = this.data[i].mrdz === '1'
            }
          }
        })
      },
      handleOk () {
        this.querySHDZ(this.khnm)
      },
      getHeight () {
        this.tableHeight = window.innerHeight - 205
      },
      ...mapActions(['Login', 'Logout', 'dictTypeData']),
      del (index) {
        shdz.del({ id: this.data[index].id }).then(res => {
          if (res.code === 200) {
            console.info(res)
            this.data = res.data
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ant-card-head-title{
  padding: 6px 0 0 0 ;
}
  .table-operator {
    margin-bottom: 18px;
  }
</style>
