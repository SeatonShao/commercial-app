<template>
  <div class="main user-layout-register">
    <div class="title">罗欣商业订单平台</div>
    <div class="tabtitle">重置密码</div>
    <a-form ref="formRegister" :form="form" id="formRegister">

      <a-popover
        placement="rightTop"
        :trigger="['focus']"
        :getPopupContainer="(trigger) => trigger.parentElement"
        v-model="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }" >
            <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            <div style="margin-top: 10px;">
              <span>{{ $t('user.register.password.popover-message') }}
              </span>
            </div>
          </div>
        </template>
      <a-form-item>
        <a-input size="large" :placeholder="$t('user.login.mobile.placeholder')" v-decorator="['account', {rules: [{ required: true, message: $t('user.phone-number.required'), pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }]">
        </a-input>
      </a-form-item>
      <!--<a-input-group size="large" compact>
            <a-select style="width: 20%" size="large" defaultValue="+86">
              <a-select-option value="+86">+86</a-select-option>
              <a-select-option value="+87">+87</a-select-option>
            </a-select>
            <a-input style="width: 80%" size="large" placeholder="11 位手机号"></a-input>
          </a-input-group>-->

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="14">
          <a-form-item>
            <a-input size="large" type="text" :placeholder="$t('user.login.mobile.verification-code.placeholder')" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="10">
          <a-button
            class="getCaptcha"
            size="large"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && $t('user.register.get-verification-code')||(state.time+' s')"></a-button>
        </a-col>
      </a-row>
      <a-form-item>
          <a-input-password
            size="large"
            @click="handlePasswordInputClick"
            :placeholder="$t('user.register.password.placeholder')"
            v-decorator="['password', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></a-input-password>
        </a-form-item>
      </a-popover>

      <a-form-item>
        <a-input-password
          size="large"
          :placeholder="$t('user.register.confirm-password.placeholder')"
          v-decorator="['password2', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
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
          :disabled="registerBtn">确定
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">{{ $t('user.register.sign-in') }}</router-link>
      </a-form-item>

    </a-form>
    <div class="footer">
      <div class="copyright">
        Copyright © 2021 <a target="_blank" href="http://www.luoxin.cn">罗欣药业</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getSmsCaptcha } from '@/api/loginManage'
import { deviceMixin } from '@/store/device-mixin'
import { scorePassword } from '@/utils/util'

import { mapActions } from 'vuex'
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
  name: 'Register',
  components: {
  },
  mixins: [deviceMixin],
  data () {
    return {
      form: this.$form.createForm(this),

      state: {
        time: 60,
        level: 0,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false
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
  methods: {
    ...mapActions(['Login', 'Logout', 'forgotPwd']),
    handlePasswordLevel (rule, value, callback) {
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

    handlePasswordCheck (rule, value, callback) {
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

    handlePhoneCheck (rule, value, callback) {
      console.log('handlePhoneCheck, rule:', rule)
      console.log('handlePhoneCheck, value', value)
      console.log('handlePhoneCheck, callback', callback)

      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handleSubmit () {
      const { form: { validateFields }, state, $router, forgotPwd } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          state.passwordLevelChecked = false

          forgotPwd({ yhzh: values.account, yhmm: values.password, dxyzm: values.captcha })
            .then((res) => {
              this.$message.success()
              $router.push({ name: 'login' })
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        }
      })
    },

    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state, $message } = this

      validateFields(['account'], { force: true },
        (err, values) => {
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

            getSmsCaptcha({ phoneNumber: values.account, type: '2' }).then(res => {
              setTimeout(hide, 2500)
            }).catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
          }
        }
      )
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.registerBtn = false
    }
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less" scoped>
.main{
  min-width: 260px;
  width: 368px;
  margin-left: 61.8%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 12px;
  padding: 40px 40px 20px 40px ;
  input:focus {
      border-top: none;
      box-shadow: none;
    }
  .title{
    width: 100%;
    text-align: center;
    font-family: '幼圆';
    font-size: 24px;
    font-weight: 700;
    padding: 24px 0 36px 0 ;
    color: #024bb1;
    letter-spacing: 1px;
  }
  .tabtitle{
    font-weight: 600;
    font-size: 16px;
    color: #444;
    text-align: left;
    width: 100%;
    padding: 0 0 0 0 ;
 }
  /deep/ .ant-input-affix-wrapper{

    background-color: rgba(255, 255, 255, 1);
  }
  /deep/ .ant-input{
    border-top:none;
    border-left: none;
    border-right: none;
    background-color: rgba(255, 255, 255, 1);
  }
  .footer {
        width: 100%;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 16px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          font-weight: 550;
        }
      }
}
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }

  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>
