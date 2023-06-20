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
    <a-modal title="重置密码" :visible="modalVisible" :footer="null" @cancel="modalVisible = false" v-if="$store.state.user.info.sfcz != '1'">
      <a-form ref="edit" autocomplete="off" :form="form" id="formRegister">
        <a-alert v-if="isLoginError" type="error" showIcon :message="this.accountLoginErrMsg" />
        <div class="tabtitle">手机号登录</div>
        <a-form-item>
          <a-input size="large" type="text" placeholder="手机号" read-only v-decorator="['mobile', {initialValue: $store.state.user.info.yhzh, rules: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
          </a-input>
        </a-form-item>
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="14">
            <a-form-item>
              <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="10">
            <a-button
              class="getCaptcha"
              tabindex="-1"
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
            ></a-button>
          </a-col>
        </a-row>
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
    <a-modal title="重置密码" :visible="modalVisible" :footer="null" @cancel="modalVisible = false" v-else>
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
            @click.stop.prevent="handleSubmit2"
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
import { resetEditPassword, ePassword } from '@/api/login'
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
      isLoginError: false,
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
    console.info(this.$store.state.user.info.sfcz)
    if (this.$store.state.user.info.sfcz == '1') {
      this.modalVisible = true
    }
    // this.$store.commit('SET_SFCZ', '1')
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
    ...mapActions(['Login', 'Logout']),
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
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ phoneNumber: values.mobile, type: 1 }).then(res => {
            setTimeout(hide, 2500)
            // this.$notification['success']({
            //   message: '提示',
            //   description: '验证码获取成功，您的验证码为：' + res.result.captcha,
            //   duration: 8
            // })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    handleSubmit() {
      const {
        form: { validateFields },
        state,
        $router
      } = this
      validateFields({ force: true }, (err, values) => {
        console.info(err)
        if (!err) {
          state.passwordLevelChecked = false

          ePassword({ yhzh: this.$store.state.user.info.yhzh, yhmm: values.password, dxyzm: values.captcha })
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('重置密码成功！')
                this.$store.commit('SET_SFCZ', 0)
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

    handleSubmit2() {
      const {
        form: { validateFields },
        state
      } = this
      validateFields({ force: true }, (err, values) => {
        console.info(err)
        if (!err) {
          state.passwordLevelChecked = false
          console.info({ syzhid: this.$store.state.user.info.syzhid, yhmm: values.password })
          resetEditPassword({ syzhid: this.$store.state.user.info.syzhid, yhmm: values.password })
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('重置密码成功！')
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

.getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }
</style>
