<template>
  <div>
    <a-card :bordered="true" :bodyStyle="tstyle" :style="{ padding: '10px 10px' }">
      <div class="search-wrapper">
        <div style="width: 100%">
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between">
            <h1>安全设置</h1>
            <div></div>
          </div>
          <div style="width: 100%"><a-button type="link" @click="modalVisible = true">修改密码</a-button></div>
          <a-divider></a-divider>
        </div>
      </div>
    </a-card>
    <a-modal title="重置密码" :visible="modalVisible" :footer="null" @cancel="modalVisible = false">
      <a-form ref="formRegister" autocomplete="off" :form="form" id="formRegister">
        <a-form-item>
          <a-input-password
            size="large"
            autocomplete="off"
            @click="handlePasswordInputClick"
            :placeholder="$t('user.register.password.placeholder')"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: $t('user.password.required') },
                  { validator: this.handlePasswordLevel }
                ],
                validateTrigger: ['change', 'blur']
              }
            ]"
          ></a-input-password>
        </a-form-item>
        <div :style="{ width: '100%', marginBottom: '15px' }" v-show="state.passwordLevelChecked">
          <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
          <a-progress :percent="state.percent" :showInfo="false" :strokeColor="passwordLevelColor" />
          <div style="margin-top: 10px">
            <span>{{ $t('user.register.password.popover-message') }} </span>
          </div>
        </div>
        <a-form-item>
          <a-input-password
            size="large"
            autocomplete="false"
            :placeholder="$t('user.register.confirm-password.placeholder')"
            v-decorator="[
              'password2',
              {
                rules: [
                  { required: true, message: $t('user.password.required') },
                  { validator: this.handlePasswordCheck }
                ],
                validateTrigger: ['change', 'blur']
              }
            ]"
          ></a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="register-button"
            :loading="registerBtn"
            @click.stop.prevent="handleSubmit"
            :disabled="registerBtn"
            >确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { scorePassword } from '@/utils/util'
import { getSmsCaptcha } from '@/api/loginManage'
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
  data() {
    return {
      form: this.$form.createForm(this),
      registerBtn: false,
      modalVisible: false,
      tableHeight: window.innerHeight - 205,
      // 高级搜索 展开/关闭
      // 表头
      data: [],
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
    passwordLevelClass() {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName() {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor() {
      return levelColor[this.state.passwordLevel]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
  },
  watch: {
    'state.passwordLevel'(val) {
      console.log(val)
    }
  },
  methods: {
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error(this.$t('user.password.required')))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(this.$t('user.password.twice.msg')))
      }
      callback()
    },
    handlePasswordInputClick() {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 205
    },
    ...mapActions(['Login', 'Logout', 'resetEditPassword']),
    /**
     * 编辑
     */
    handlePasswordLevel(rule, value, callback) {
      if (!value) {
        return callback()
      }
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
        callback(new Error(this.$t('user.password.strength.msg')))
      }
      this.state.passwordLevel = this.state.level
      this.state.percent = this.state.level * 33

      callback()
    },
    handleSubmit() {
      const {
        form: { validateFields },
        state,
        $router,
        resetEditPassword
      } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          state.passwordLevelChecked = false

          resetEditPassword({ syzhid: this.$store.state.user.info.yhzhid, yhmm: values.password })
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('重置密码成功！')
                $router.push({ name: 'index' })
              } else {
                this.$message.success('重置密码失败！')
              }
            })
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              this.modalVisible = false
            })
        }
      })
    },

    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        $message,
        $notification
      } = this

      validateFields(['account'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = $message.loading('验证码发送中..', 0)

          getSmsCaptcha({ phoneNumber: values.account, type: '2' })
            .then((res) => {
              setTimeout(hide, 2500)
              $notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            })
            .catch((err) => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.registerBtn = false
    }
  }
}
</script>
<style lang="less" scoped>
#formRegister > div.ant-row.ant-form-item.ant-form-item-with-help {
  margin-bottom: 0;
}

.table-operator {
  margin-bottom: 18px;
}
</style>
