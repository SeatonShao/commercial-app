<template>
  <a-modal
    title="新增菜单"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="一级目录"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入一级目录" v-decorator="['yxlxcdxxMl1', {rules: [{required: true, message: '请输入一级目录！'}]}]" />
        </a-form-item>
        <a-form-item
          label="二级目录"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入二级目录" v-decorator="['yxlxcdxxMl2', {rules: [{required: true, message: '请输入二级目录！'}]}]" />
        </a-form-item>
        <a-form-item
          label="菜单编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入菜单编码" v-decorator="['yxlxcdxxCdbm', {rules: [{required: false, message: '请输入菜单编码！'}]}]" />
        </a-form-item>
        <a-form-item
          label="菜单名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入菜单名称" v-decorator="['yxlxcdxxCdmc', {rules: [{required: true, message: '请输入菜单名称！'}]}]" />
        </a-form-item>
        <a-form-item
          label="排序号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入排序号" v-decorator="['yxlxcdxxPxh', {rules: [{required: false, message: '请输入排序号！'}]}]" />
        </a-form-item>
        <a-form-item
          label="上线日期"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-date-picker style="width: 100%" placeholder="请选择上线日期" v-decorator="['yxlxcdxxSxrq',{rules: [{ required: true, message: '请选择上线日期！' }]}]" @change="yxlxcdxxSxrqOnChange"/>
        </a-form-item>
        <a-form-item
          label="说明"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入说明" v-decorator="['yxlxcdxxSm', {rules: [{required: false, message: '请输入说明！'}]}]" />
        </a-form-item>
        <a-form-item v-show="false">
          <a-select style="width: 100%" placeholder="请选择状态" v-decorator="['yxlxcdxxZt', {rules: [{ required: true, message: '请选择状态！' }],initialValue: '在用'}]">
            <a-select-option defaultValue="All" v-for="(item,index) in yxlxcdxxZtData" :key="index" :value="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // import { yxlxcdxxAdd } from '@/api/modular/main/yxlxcdxx/yxlxcdxxManage'
  export default {
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        yxlxcdxxZtData: [],
        yxlxcdxxTyrqDateString: '',
        yxlxcdxxSxrqDateString: '',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this)
      }
    },
    methods: {
      // 初始化方法
      add (record) {
        this.visible = true
        const yxlxcdxxZtOption = this.$options
        this.yxlxcdxxZtData = yxlxcdxxZtOption.filters['dictData']('common_status')
      },
      /**
       * 提交表单
       */
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            for (const key in values) {
              if (typeof (values[key]) === 'object' && values[key] != null) {
                values[key] = JSON.stringify(values[key])
              }
            }
            values.yxlxcdxxTyrq = this.yxlxcdxxTyrqDateString || null
            values.yxlxcdxxSxrq = this.yxlxcdxxSxrqDateString || null
            // yxlxcdxxAdd(values).then((res) => {
            //   if (res.success) {
            //     this.$message.success('新增成功')
            //     this.confirmLoading = false
            //     this.$emit('ok', values)
            //     this.handleCancel()
            //   } else {
            //     this.$message.error('新增失败')// + res.message
            //   }
            // }).finally((res) => {
            //   this.confirmLoading = false
            // })
          } else {
            this.confirmLoading = false
          }
        })
      },
      yxlxcdxxTyrqOnChange (date, dateString) {
        this.yxlxcdxxTyrqDateString = dateString
      },
      yxlxcdxxSxrqOnChange (date, dateString) {
        this.yxlxcdxxSxrqDateString = dateString
      },
      handleCancel () {
        this.yxlxcdxxTyrqDateString = ''
        this.form.getFieldDecorator('yxlxcdxxTyrq', { initialValue: null })
        this.yxlxcdxxSxrqDateString = ''
        this.form.getFieldDecorator('yxlxcdxxSxrq', { initialValue: null })
        this.form.resetFields()
        this.visible = false
      }
    }
  }
</script>
