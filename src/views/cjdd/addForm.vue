<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form ref="form" :form="form" v-bind="formItemLayout">
        <a-form-item label="客户名称">
          <a-input
            placeholder="请输入客户名称"
            disabled
            v-decorator="[
              'khmc',
              {
                rules: [{ required: true, message: '客户名称必填!' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="" style="display: none;">
          <a-input type="hidden" v-decorator="[ 'khbh', { rules: []} ]"/>
        </a-form-item>
        <a-form-item label="" style="display: none;">
          <a-input type="hidden" v-decorator="[ 'id', { rules: []} ]"/>
        </a-form-item>
        <a-form-item label="收货人">
          <a-input
            placeholder="请输入收货人"
            v-decorator="[
              'shrs',
              {
                rules: [{ required: true, message: '收货人必填!' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="收货地址">
          <a-input
            placeholder="请输入收货地址"
            v-decorator="[
              'shdz',
              {
                rules: [{ required: true, message: '收货地址必填!' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input
            placeholder="请输入联系电话"
            v-decorator="[
              'lxdh',
              {
                rules: [{ required: true, message: '联系电话必填!' },
                        { pattern: /^\d+$/, message: '联系电话必须是数字!' },
                        { min: 11, message: '联系电话不少于11位!' }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="默认地址" >
          <a-switch
            v-decorator="[
              'mrdz',
              { valuePropName: 'checked',
                rules: []
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import shdz from '@/api/shdz'
export default {
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      title: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'shdz' })
    }
  },
  methods: {
    open(title, data, khbh, khmc) {
      this.visible = true
      this.title = title
      setTimeout(() => {
        console.info(this.form, { khmc: khmc, khbh: khbh })
        this.form.setFieldsValue({ khmc: khmc, khbh: khbh })
        if (data) {
          this.form.setFieldsValue({ id: data.id, shrs: data.shrs, shdz: data.shdz, lxdh: data.lxdh, mrdz: data.mrdz == '1' })
        }
      }, 1000)
    },
    handleCancel() {
      // 清空已选择的
      this.visible = false
    },
    /**
     * 提交表单
     */
    handleSubmit() {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        console.info(values)
        if (!err) {
          if (values.mrdz) {
            values.mrdz = '1'
          } else {
            this.$message.warn('必须有一个默认地址！')
            return
          }
          if (!values.id) {
            shdz
              .add(values)
              .then(res => {
                if (res.success) {
                  this.$message.success('新增成功')
                  this.confirmLoading = false
                  this.$emit('ok', '')
                  this.handleCancel()
                }
              })
              .finally(res => {
                this.confirmLoading = false
              })
          } else {
            shdz
              .edit(values)
              .then(res => {
                if (res.success) {
                  this.$message.success('修改成功')
                  this.confirmLoading = false
                  this.$emit('ok', '')
                  this.handleCancel()
                } else {
                  this.$message.error('修改失败') // + res.message
                }
              })
              .finally(res => {
                this.confirmLoading = false
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
