<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="container">
    <a-card :bordered="true" :style="{ padding: '10px 10px' }">
      <a-row>
        <a-col :span="2"> 订单信息 </a-col>
        <a-col :span="2" :offset="20">
          <a-button type="link" @click="showOrderModal = true">选择订单模板</a-button>
        </a-col>
      </a-row>
      <a-divider></a-divider>
      <div class="search-wrapper">
        <a-form-model ref="form" :model="form" :labelCol="labelCol" :wrapper-col="wrapperCol" :rules="rules">
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="采购方：" prop="kh">
                <a-select v-model="form.kh" mode="default" @change="changeKH()">
                  <a-select-option
                    :value="item.synm + ';' + item.symc + ';' + item.sybm"
                    v-for="(item, index) in $store.state.user.gxList"
                    :key="index"
                  >
                    {{ item.symc }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="7" :offset="1">
              <a-form-model-item label="汇款底单：" prop="hkdd">
                <a-input-search v-model="form.hkdd" read-only placeholder="" @search="changeHKDD">
                  <a-button slot="enterButton">
                    <a-icon type="close" />
                  </a-button>
                </a-input-search>
              </a-form-model-item>
            </a-col>
            <a-form-item label="汇款底单：" style="display: none" prop="hkddurl">
              <a-input v-model="form.hkddurl" style="vertical-align: middle"></a-input>
            </a-form-item>
            <a-col :span="2">
              <a-form-model-item>
                <a-upload
                  :multiple="true"
                  accept="image/*"
                  :file-list="fileList"
                  @change="handleFileChange"
                  :beforeUpload="beforeUpload"
                  :showUploadList="false"
                  name="file"
                  style="width: 30px"
                >
                  <a-button style="background-color: #1890ff; color: #fff; vertical-align: middle">
                    <a-icon type="upload" /> 选择文件
                  </a-button>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="2"> 收货人信息 </a-col>
          </a-row>
          <a-divider></a-divider>
          <a-radio-group class="addressGroup" v-model="form.shrs" @change="handleDz">
            <a-radio
              v-for="(item, index) in data"
              :key="index"
              :checked="form.shrs == item.shrs + ',' + item.lxdh + ',' + item.shdz"
              :value="item.shrs + ',' + item.lxdh + ',' + item.shdz"
              :disabled="item.id == ''"
            >
              <a-card v-if="item.id && item.id.length > 0">
                <template slot="title">
                  <div style="display: block">
                    <span class="title">{{ item.shrs }}</span>
                    <a-button type="link" class="editAddress" @click="newAddress(index)">编辑</a-button>
                    <a-button type="link" class="defaultAddress" v-if="item.mrdz !== '1'" @click="setDefault(index)">设为默认</a-button>
                  </div>
                </template>
                <div style="margin: 5px 0 25px 0">{{ item.lxdh }}</div>
                <div class="address">{{ item.shdz }}</div>
                <div class="address-checked"></div>
              </a-card>
              <a-card
                class="newAddress"
                @click="newAddress(null)"
                :bodyStyle="{ width: '220px', height: '100px' }"
                v-else
              >
                <template slot="title">
                  <div style="display: block"></div>
                </template>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <a-icon type="plus" style="width: 210px; height: 60px; font-size: 60px; color: #ccc"></a-icon>
                  <span style="color: #999">添加新地址</span>
                </div>
              </a-card>
            </a-radio>
          </a-radio-group>
          <a-divider></a-divider>
          <a-button type="primary" @click="$refs.product.open()">选择产品</a-button>
          <a-table
            :pagination="false"
            :columns="columns"
            :dataSource="form.ddmxList"
            :scroll="{ x: 600 }"
            :rowKey="
              (record) => {
                return parseFloat(10000000000 * Math.random()).toFixed(0) + ''
              }
            "
            bordered
          >
            <template slot="slaction" slot-scope="text, record, index">
              <a-input-number :step="10" :value="text" @blur="(e) => checkSl(index, e.target.value, 'sl')" />
            </template>
            <template slot="djaction" slot-scope="text, record, index">
              <a-input-number :step="0.01" :value="text" @blur="(e) => checkSl(index, e.target.value, 'dj')" />元
            </template>
            <template slot="khjaction" slot-scope="text, record, index">
              <a-input-number :step="0.01" :value="text" @blur="(e) => checkSl(index, e.target.value, 'khj')" />
            </template>
            <template slot="jeaction" slot-scope="text, record, index"> ￥ {{ je(index) }} 元 </template>
            <template slot="action" slot-scope="text, record, index">
              <a-button type="link" @click="del(index)">删除</a-button>
            </template>
          </a-table>
          <a-row :gutter="gutter" style="margin: 10px 0">
            <a-col :span="3" :offset="17">
              <span style="display: block; padding: 5px 0; line-height: 1.5">订单总金额：</span>
            </a-col>
            <a-col :span="4">
              <span style="display: block; padding: 5px 0; line-height: 1.5" class="amount">{{ form.ddzje }}元</span>
            </a-col>
          </a-row>
          <a-divider></a-divider>
          <a-row :gutter="gutter">
            <a-col :span="3" :offset="18">
              <a-button type="primary" @click="modalVisible = true"> 存为模板 </a-button>
            </a-col>
            <a-col :span="3">
              <a-button type="primary" @click="saveDD"> 提交订单 </a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <Product ref="product" @closeModal="closeModal"></Product>
    <OrderModal ref="orderModal" :showOrderModal="showOrderModal" @closeModal="closeModal"></OrderModal>
    <SearchForm ref="searchForm" @ok="selectOk" />
    <add-form ref="addForm" @ok="handleOk" />
    <a-modal title="新增选项" :visible="selectvisible" @ok="newOk" @cancel="selectvisible = false">
      账期天数：<a-input-number v-model="newZQ" :step="1"></a-input-number>
    </a-modal>
    <a-modal title="" :visible="modalVisible" @ok="saveModal" @cancel="modalVisible = false">
      模板名称：<a-input v-model="form.mbmc" allow-clear></a-input>
    </a-modal>
  </div>
</template>
<script>
import { Product, OrderModal, SearchForm } from '@/components'
import order from '@/api/order'
import u from '@/utils/util'
import shdz from '@/api/shdz'
import addForm from './addForm.vue'
export default {
  components: {
    Product,
    OrderModal,
    SearchForm,
    addForm
  },
  data() {
    return {
      data: [],
      rules: { kh: [
          { required: true, message: '采购方必选！', trigger: 'blur' }
        ],
        hkdd: [
          { required: true, message: '汇款底单必传！', trigger: 'blur' }
        ]
      },
      formField: {
        fhjlmc: ['fhjlmc', 'fhjlid'],
        khjlmc: ['khjlmc', 'khjlid'],
        sfmc: ['sfmc', 'sfbh'],
        xslxmc: ['xslxmc', 'xslxbh'],
        khlxmc: ['khlxmc', 'khlxbh'],
        csokhmc: ['csokhmc', 'csokhbh'],
        khmc: ['khmc', 'khbh', 'khnm']
      },
      modalVisible: false,
      showOrderModal: false,
      fileList: [],
      newZQ: 0,
      selectvisible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      gutter: 0,
      tableHeight: window.innerHeight - 265,
      // 表头
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 60,
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'cpmc',
          width: 100
        },
        {
          title: '包装规格',
          align: 'center',
          width: 130,
          dataIndex: 'bzgg'
        },
        {
          title: '产品编码',
          align: 'center',
          dataIndex: 'cpbm',
          width: 100
        },
        {
          title: '生产企业',
          align: 'center',
          dataIndex: 'scqymc',
          width: 150,
          ellipsis: true
        },
        {
          title: '件装量',
          align: 'center',
          dataIndex: 'jzl',
          width: 100
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'sl',
          scopedSlots: { customRender: 'slaction' },
          width: 100
        },
        {
          title: '件数',
          align: 'center',
          dataIndex: 'js',
          customRender: (text, record, index) => text + '元',
          width: 100
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'dj',
          scopedSlots: { customRender: 'djaction' },
          width: 120
        },
        {
          title: '金额',
          align: 'center',
          dataIndex: 'je',
          scopedSlots: { customRender: 'jeaction' },
          width: 100
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ],
      form: {
        ddzje: 0,
        shrs: '',
        kh: '',
        hkdd: '',
        hkddurl: '',
        hkddList: [],
        khmc: '',
        khnm: '',
        khbh: '',
        lxr: '',
        lxdh: '',
        shdz: '',
        ddh: '',
        ddrq: '',
        skdmc: '',
        mbmc: '',
        skdbh: '',
        fhjlid: '',
        fhjlmc: '',
        khjlid: '',
        ddmxList: [],
        zdrmc: '',
        zdrid: ''
      }
    }
  },
  watch: {
    '$route.query.ddls': {
      immediate: true,
      deep: true,
      handler(nv) {
        console.info(nv)
        if (nv) {
          this.queryDetail()
        }
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
  },
  methods: {
     queryDetail() {
      this.spinning = true
      order
        .orderDetail({ ddls: this.$route.query.ddls })
        .then(async res => {
          if (res.code === 200) {
           const record = res.data
            console.info(record)
        const kh = record.khnm + ';' + record.khmc + ';' + record.khbh
        await shdz.list({ khbh: record.khnm }).then((res) => {
          if (res.code === 200) {
            this.data = res.data
            console.info(this.data)
            this.data.push({ id: '' })
          }
        })

         Object.assign(this.form, {
          kh: kh,
          lxr: record.lxr,
          lxdh: record.lxdh,
          shdz: record.shdz,
          shrs: record.lxr + ',' + record.lxdh + ',' + record.shdz,
          khmc: record.khmc,
          khnm: record.khnm,
          khbh: record.khbh,
          hkdd: '',
          hkddurl: '',
          ddmxList: record.mxList,
          ddzje: record.ddzje
         })
         console.info(this.form)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    saveDD() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (u.isEmptyStr(this.form.khmc) || u.isEmptyStr(this.form.khnm)) {
            this.$message.error('请选择客户！')
            return false
          }
          if (u.isEmptyStr(this.form.shrs)) {
            this.$message.error('请选择收货地址！')
            return false
          }
          if (this.form.ddmxList.length < 1) {
            this.$message.error('请选择产品！')
            return false
          }
          for (let i = 0; i < this.form.ddmxList.length; i++) {
            console.info(this.form.ddmxList[i].sl, typeof this.form.ddmxList[i].sl)
            if (u.isLE0(this.form.ddmxList[i].sl)) {
              this.$message.error('第' + (i + 1) + '行数量值无效！')
              return false
            }
            if (u.isLE0(this.form.ddmxList[i].dj)) {
              this.$message.error('第' + (i + 1) + '行单价值无效！')
              return false
            }
            console.info(
              parseFloat(this.form.ddmxList[i].dj),
              parseFloat(this.form.ddmxList[i].sl),
              parseFloat(this.form.ddmxList[i].je)
            )
            if (
              parseFloat(this.form.ddmxList[i].dj) * parseFloat(this.form.ddmxList[i].sl) !==
              parseFloat(this.form.ddmxList[i].je)
            ) {
              this.$message.error('第' + (i + 1) + '行单价数量与金额不符！')
              return false
            }
          }
          this.form.sjly = 'order'
          console.info(this.$store.state.user)
          this.form.zdrid = this.$store.state.user.info.yhmc
          this.form.zdrmc = this.$store.state.user.info.syzhid
        if (this.form.hkdd.length > 0) {
          const hkdd = this.form.hkdd.split(';')
          const hkddurl = this.form.hkddurl.split(';')
          for (let i = 0; i < hkdd.length; i++) {
            if (!u.isEmptyStr(hkdd[i])) {
              this.form.hkddList.push({ fjlj: hkddurl[i], fjmc: hkdd[i] })
            }
          }
        }
          order.createOrder(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.clear()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    saveModal() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (u.isEmptyStr(this.form.mbmc)) {
            this.$message.error('请输入模板名称！')
            return false
          }
          if (u.isEmptyStr(this.form.khmc) || u.isEmptyStr(this.form.khnm)) {
            this.$message.error('请选择客户！')
            return false
          }
          if (this.form.ddmxList.length < 1) {
            this.$message.error('请选择产品！')
            return false
          }
          for (let i = 0; i < this.form.ddmxList.length; i++) {
            console.info(this.form.ddmxList[i].sl, typeof this.form.ddmxList[i].sl)
            if (u.isLE0(this.form.ddmxList[i].sl)) {
              this.form.$message.error('第' + (i + 1) + '行数量值无效！')
              return false
            }
            if (u.isLE0(this.form.ddmxList[i].dj)) {
              this.form.$message.error('第' + (i + 1) + '行单价值无效！')
              return false
            }
            console.info(
              parseFloat(this.form.ddmxList[i].dj),
              parseFloat(this.form.ddmxList[i].sl),
              parseFloat(this.form.ddmxList[i].je)
            )
            if (
              parseFloat(this.form.ddmxList[i].dj) * parseFloat(this.form.ddmxList[i].sl) !==
              parseFloat(this.form.ddmxList[i].je)
            ) {
              this.form.$message.error('第' + (i + 1) + '行单价数量与金额不符！')
              return false
            }
          }
          this.form.sjly = 'order'
          this.form.zdrid = this.$store.state.user.info.yhmc
          this.form.zdrmc = this.$store.state.user.info.syzhid
        if (this.form.hkdd.length > 0) {
          const hkdd = this.form.hkdd.split(';')
          const hkddurl = this.form.hkddurl.split(';')
          for (let i = 0; i < hkdd.length; i++) {
            if (!u.isEmptyStr(hkdd[i])) {
              this.form.hkddList.push({ fjlj: hkddurl[i], fjmc: hkdd[i] })
            }
          }
        }
          order.templateAdd(Object.assign({ mxList: this.form.ddmxList }, this.form)).then((res) => {
            if (res.code === 200) {
              this.$message.success('模板保存成功')
              this.mbmc = ''
              this.modalVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    clear() {
      this.$refs['form'].resetFields()
      this.form.ddzje = 0
      this.data = []
      this.form.kh = ''
      this.form.shrs = ''
      this.form.mbmc = ''
      this.form.ddmxList = []
      // 验证该发货经理是否有对应的ERP账套业务员编码
      // this.querySHDZ()
    },
    handleDz(e) {
      console.info(e.target.value)
      let dz = e.target.value
      dz = dz.split(',')
      this.form.lxr = dz[0]
      this.form.lxdh = dz[1]
      this.form.shdz = dz[2]
    },
    changeKH(e) {
      let v = this.form.kh
      v = v.split(';')
      this.form.khmc = v[1]
      this.form.khnm = v[0]
      this.form.khbh = v[2]
      this.querySHDZ(this.form.khnm)
    },
    /**
     * 上传文件
     */
    beforeUpload(file, fileList) {
      this.fileList = fileList
      const fileName = file.name
      this.formData = new FormData()
      this.formData.append('file', file)
      order.uploadImg(this.formData).then((res) => {
        console.info(res)
        this.form.hkdd = this.form.hkdd + fileName + ';'
        this.form.hkddurl = this.form.hkddurl + res.data + ';'
      })
      return false
    },
    changeHKDD() {
      this.form.hkdd = ''
      this.form.hkddurl = ''
    },
    handleFileChange(info) {
      let fileList = [...info.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2)

      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })
      this.fileList = fileList
    },
    newOk() {
      console.log(this.newZQ)
      let b = false
      for (const i of this.zqList) {
        if (this.newZQ === i) {
          b = true
        }
      }
      if (!b) {
        this.zqList.push(this.newZQ)
      }
      this.newZQ = 0
      this.selectvisible = false
    },
    je(index) {
      const je = parseFloat(parseFloat(this.form.ddmxList[index].sl) * parseFloat(this.form.ddmxList[index].dj)).toFixed(2)
      return isNaN(je) ? 0 : je
    },
    js(index) {
      let je = parseFloat(parseFloat(this.form.ddmxList[index].sl) / parseFloat(this.form.ddmxList[index].jzl)).toFixed(2)
      je = je > 1 ? parseInt(je) : je
      return isNaN(je) ? 0 : je
    },
    setDdzje() {
      let je = 0
      this.form.ddmxList.forEach((item, index) => {
        je = je + parseFloat(item.je)
      })
      this.form.ddzje = isNaN(je) ? 0 : parseFloat(je).toFixed(2)
    },
    checkSl(index, value, column) {
      const target = this.form.ddmxList[index]
      if (column === 'sl' && parseFloat(value) % 10 !== 0) {
        this.$message.error('数量必须是10的倍数')
        target['sl'] = 0
      } else {
        target[column] = value
      }
      target['je'] = this.je(index)
      target['js'] = this.js(index)
      this.$set(this.form.ddmxList, index, target)
      this.setDdzje()
    },
    del(index) {
      this.form.ddmxList.splice(index, 1)
    },
    newAddress(index) {
      console.info()
      if (index !== this.data.size - 1) {
        this.$refs.addForm.open('收货人地址', this.data[index], this.form.khnm, this.form.khmc)
      } else {
        this.$refs.addForm.open('收货人地址', {}, this.form.khnm, this.form.khmc)
      }
    },
    setDefault(index) {
      this.data[index].mrdz = '1'
      shdz.setDefault(this.data[index]).then((res) => {
        if (res.code === 200) {
          this.$message.info('设置成功')
          this.querySHDZ(this.form.khnm)
        }
      })
    },
    querySHDZ(khbh) {
      shdz.list({ khbh: khbh }).then((res) => {
        if (res.code === 200) {
          this.data = res.data
          console.info(this.data)
          this.data.push({ id: '' })
          for (const i in res.data) {
            if (res.data[i].mrdz === '1') {
              this.form.shdz = res.data[i].shdz
              this.form.lxr = res.data[i].shrs
              this.form.lxdh = res.data[i].lxdh
              this.form.shrs = res.data[i].shrs + ',' + res.data[i].lxdh + ',' + res.data[i].shdz
            }
          }
        }
      })
    },
    handleOk() {
      this.querySHDZ(this.form.khnm)
    },
    selectOk({ obj, formName }) {
      console.info('selectOk', obj, formName)
      console.info('selectOk', this.form)
      this.form = obj
      // 客户名称数据获取后继续获取收货人信息列表
      if (formName === 'khmc') {
        this.querySHDZ(this.form.khbh)
        this.querySYCG(this.form.khnm)
      }
      if (formName === 'xslxmc') {
        this.form.khlxmc = obj.xslxmc
        this.form.khlxbh = obj.xslxbh
      }
      if (formName === 'fhjlmc') {
        this.form.khjlmc = obj.fhjlmc
        this.form.khjlid = obj.fhjlid
        this.queryXSLX()
      }
    },
    async closeModal(type, record) {
      console.info('closeModal', type, record)
      if (record) {
      if (type === 'product') {
        this.form.ddmxList.push(Object.assign({ js: 0, sl: 0, dj: 0 }, record))
      } else if (type === 'modal') {
        console.info(record)
        const kh = record.khnm + ';' + record.khmc + ';' + record.khbh
        await shdz
        .list({ khbh: record.khnm })
        .then((res) => {
          if (res.code === 200) {
            this.data = res.data
            console.info(this.data)
            this.data.push({ id: '' })
          }
        })

         Object.assign(this.form, {
          kh: kh,
          lxr: record.lxr,
          lxdh: record.lxdh,
          shdz: record.shdz,
          shrs: record.lxr + ',' + record.lxdh + ',' + record.shdz,
          khmc: record.khmc,
          khnm: record.khnm,
          khbh: record.khbh,
          hkdd: '',
          hkddurl: '',
          ddmxList: record.mxList,
          ddzje: record.ddzje
         })
         console.info(this.form)
      }
    }
      this.showOrderModal = false
    },
    handleChange(info) {
      let fileList = [...info.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2)

      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })

      this.fileList = fileList
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 265
    }
  }
}
</script>
<style lang="less" scoped>
.container /deep/ .ant-divider-horizontal {
  margin: 2px 0 12px 0;
}
/deep/ .ant-table-thead > tr > th {
  padding: 5px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 5px;
}
.container /deep/ .search-wrapper {
  .ant-form {
    margin: 0 0 10px 0;
    // 查询按钮样式
    .ant-input-search {
      .ant-btn-primary {
        background-color: #fff;
        border-color: #ddd;
        .anticon {
          color: #aaa;
        }
      }
      .ant-btn-primary:hover,
      .ant-btn-primary:focus {
        background-color: #fff;
        border-color: #eee;
      }
    }
    .ant-input-group-addon {
      border: none;
      padding: 0;
    }
    form /deep/ .ant-select,
    form .ant-cascader-picker {
      widows: 100%;
    }
    .amount {
      color: orange;
      font-weight: 700;
    }
  }
}
.container /deep/ .addressGroup .ant-radio-wrapper {
  border: none;
  margin: 0 10px 0 10px;
  .ant-radio {
    display: none;
  }
  .newAddress .ant-card-head {
    border: none;
  }
  .ant-card-bordered {
    width: 240px;
    height: 160px;
    padding: 0 5px 10px 5px;
    .ant-card-head {
      padding: 3px 2px;
      min-height: 30px;
      border: none;
    }
    .ant-card-body {
      padding: 3px 10px;
    }
    .ant-card-head-title {
      padding: 10px 0 0 5px;
    }
    .title {
      padding-left: 3px;
    }
    .editAddress {
      position: absolute;
      right: 60px;
      top: 10px;
    }
    .defaultAddress {
      position: absolute;
      right: 0px;
      top: 10px;
      margin: 0;
    }
    .address {
      margin-right: 20px;
      white-space: normal;
    }
  }
}
.container /deep/ .addressGroup .ant-radio-wrapper-checked {
  .ant-card-bordered {
    border-color: red;
    border-style: dashed;
    .address-checked {
      background: url(https://img.alicdn.com/tfs/TB1zLJRRpXXXXcrXXXXXXXXXXXX-30-600.png) no-repeat;
      width: 28px;
      height: 28px;
      background-position: 0 -272px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
.container /deep/ .addressGroup .ant-radio-disabled + span {
  color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.container /deep/ .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled):focus-within {
  outline: none;
}

.table-operator {
  margin-bottom: 18px;
}
</style>
