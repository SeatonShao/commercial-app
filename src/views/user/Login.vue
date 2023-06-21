<template>
  <div class="main">
    <div class="title">罗欣商业订单平台</div>
    <a-form
      id="formLogin"
      autocomplete="new-password"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-alert v-if="isLoginError" type="error" showIcon :message="this.accountLoginErrMsg" />
          <div class="tabtitle">账号密码登录</div>

          <a-form-item>
            <a-input
              size="large"
              type="text"
              autocomplete="false"
              placeholder="账号"
              v-decorator="[
                'account',
                { initialValue:'', rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="[
                'password',
                { initialValue:'', rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登录">
          <a-alert v-if="isLoginError" type="error" showIcon :message="this.accountLoginErrMsg" />
          <div class="tabtitle">手机号登录</div>
          <a-form-item>
            <a-input size="large" type="text" placeholder="手机号" v-decorator="['mobile', {initialValue: '', rules: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
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
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox style="display: none;" v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-item>

      <a-form-item style="margin-bottom: 0;">
        <Verify
          @success="verifySuccess"
          :mode="'pop'"
          :captchaType="captchaType"
          :imgSize="{ width: '330px', height: '155px' }"
          ref="verify"
        ></Verify>
      </a-form-item>

      <a-form-item >
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
      <!--
      <div class="user-login-other">
        <span>其他登录方式</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle"></a-icon>
        </a>
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>
      -->
    </a-form>
    <div class="footer">
      <div class="copyright">
        Copyright © 2021 <a target="_blank" href="http://www.luoxin.cn">罗欣药业</a>
      </div>
    </div>
    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { scorePassword } from '@/utils/util'
import { getSmsCaptcha, getCaptchaOpen } from '@/api/loginManage'
import Verify from '@/components/verifition/Verify'

export default {
  components: {
    TwoStepCaptcha,
    Verify
  },
  data () {
    var captchaTypeValue = 'clickWord'
    var min = 0
    var max = 100
    var random = Math.floor(Math.random() * (max - min)) + min

    if (random % 2 === 0) {
      captchaTypeValue = 'blockPuzzle'
    }
    if (random % 2 === 1) {
      captchaTypeValue = 'clickWord'
    }
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      accountLoginErrMsg: '',
      tenantOpen: false,
      captchaOpen: false, // 是否开启验证码
      tenantsList: [],
      loginParams: [], // 登录参数
      captchaType: captchaTypeValue
    }
  },
  created () {
    this.getCaptchaOpen()
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'dictTypeData']),
    /**
     * 获取验证码开关
     */
    getCaptchaOpen () {
      getCaptchaOpen().then((res) => {
        if (res.success) {
          this.captchaOpen = res.data
        }
      })
    },
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.isLoginError = false
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handlePasswordLevel (value) {
      console.log('scorePassword ; ', scorePassword(value))
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          this.ls.set('passwordLevel', 0)
        }
        if (scorePassword(value) >= 60) {
        this.ls.set('passwordLevel', 0)
        }
        if (scorePassword(value) >= 80) {
        this.ls.set('passwordLevel', 0)
        }
      } else {
        this.ls.set('passwordLevel', 0)
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this
      state.loginBtn = true
      const validateFieldsKey = customActiveKey === 'tab1' ? ['account', 'password'] : ['mobile', 'captcha']
      console.info(validateFieldsKey)
      if (this.tenantOpen) {
        validateFieldsKey.push('tenantCode')
      }
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        this.loginParams = values
        console.info(this.$ls)
        if (!err) {
        const count = this.$ls.get(values.account) ? this.$ls.get(values.account) : '0'
        console.info(count)
          // 是否开启验证码
          if (this.captchaOpen && count > 1) {
            this.$refs.verify.show()
            state.loginBtn = false
            return
          }
          const loginParams = { ...values }
          delete loginParams.account
          loginParams.account = values.account
          loginParams.customActiveKey = customActiveKey
          // this.handlePasswordLevel(loginParams.password)
          if (this.tenantOpen) {
            loginParams.tenantCode = values.tenantCode
          }
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    /**
     * 获取验证码
     */
    verifySuccess (params) {
      this.loginParams.code = params.captchaVerification
      console.log(JSON.stringify(this.loginParams))
      this.loginParams.customActiveKey = this.customActiveKey
      this.Login(this.loginParams).then((res) => this.loginSuccess(res))
        .catch(err => this.requestFailed(err))
        .finally(() => {
          this.state.loginBtn = false
        })
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
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      console.info(this.$store.state.user.info.sfcz)
      console.info(this.$store.state.user.info.sfcz == '1')
        if (this.$store.state.user.info.sfcz == '1') {
          this.$router.push({ path: '/order/zhsz' })
        } else {
          this.$router.push({ path: '/' })
        }
        this.isLoginError = false
        // 加载字典所有字典到缓存中
        this.dictTypeData().then((res) => { })
    },
    requestFailed (err) {
      console.info('error', err)
      this.accountLoginErrMsg = err.message
      this.isLoginError = true
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
    padding: 24px;
    letter-spacing: 1px;
    color: #024bb1;
  }
 .tabtitle{
    font-weight: 600;
    font-size: 16px;
    color: #333;
    padding: 12px 0 0 0 ;
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
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
