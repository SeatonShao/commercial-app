<template>
  <div>
    <a-card :bordered="true" :bodyStyle="tstyle" :style="{ padding: '10px 10px' }">
      <div class="search-wrapper">
        <div style="width: 100%;">
          <div style="width: 100%;display: flex; flex-direction: row; justify-content: space-between;">
            <h1>安全设置</h1>
            <div ></div>
          </div>
          <div style="width: 100%;">账户密码：<a-button type="link" style="float:right;">修改</a-button></div>
          <div style="width: 100%;display: inline-block;">
            <div :style="{ width: '240px' }" >
              <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
              <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            </div>
          </div>
          <a-divider></a-divider>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
import { scorePassword } from '@/utils/util'
const levelNames = {
  0: 'user.password.strength.short',
  1: 'user.password.strength.low',
  2: 'user.password.strength.medium',
  3: 'user.password.strength.strong'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
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
        ],
        tstyle: { 'padding-bottom': '0px', 'margin-bottom': '0px' },
        state: {
        time: 60,
        level: 0,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      }
      }
    },
    computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
    created () {
      window.addEventListener('resize', this.getHeight)
     this.handlePasswordLevel()
    },
    methods: {
      getHeight () {
        this.tableHeight = window.innerHeight - 205
      },
      ...mapActions(['Login', 'Logout', 'dictTypeData']),
            /**
       * 编辑
       */
       handlePasswordLevel (value) {
      console.log('scorePassword ; ', scorePassword(value))
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          this.state.level = 1
        }
        if (scorePassword(value) >= 60) {
        this.state.level = 2
        }
        if (scorePassword(value) >= 80) {
        this.state.level = 3
        }
      } else {
        this.state.level = 0
      }
      this.state.passwordLevel = this.state.level
      this.state.percent = this.state.level * 33
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
