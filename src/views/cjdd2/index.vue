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
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          :labelCol="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="right">
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="生产企业：" >
                <a-select :style="dropdownStyle" @change="handleReset()" v-model="form.wwxt">
                  <a-select-option :value="item.value" v-for="(item, index) in wwxtList" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item> </a-col
            ><a-col :span="9" :offset="2">
              <a-form-model-item label="采购方：" prop="kh">
                <a-select v-model="form.kh" mode="default" :style="dropdownStyle" @change="changeKH">
                  <a-select-option :value="item.synm + ';' + item.symc+ ';' + item.sybm" v-for="(item, index) in $store.state.user.gxList" :key="index"> {{ item.symc }} </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="发货经理：" prop="fhjlmc">
                <a-input-search
                  v-model="form.fhjlmc"
                  allow-clear
                  placeholder=""
                  enter-button
                  @search="(value)=>{$refs.searchForm.open('选择发货经理', 'fhjlmc',value,this.form.wwxt)}"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" :offset="2">
              <a-form-model-item label="考核经理：" prop="khjlmc">
                <a-input-search
                  v-model="form.khjlmc"
                  allow-clear
                  placeholder=""
                  enter-button
                  @search="(value)=>{$refs.searchForm.open('选择考核经理', 'khjlmc',value,this.form.wwxt)}"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="销售类型：" prop="xslxmc">
                <a-input-search
                  v-model="form.xslxmc"
                  allow-clear
                  placeholder=""
                  enter-button
                  @search="(value)=>{$refs.searchForm.open('选择销售类型', 'xslxmc',value)}"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" :offset="2">
              <a-form-model-item label="考核类型：" prop="khlxmc">
                <a-input-search
                  v-model="form.khlxmc"
                  allow-clear
                  placeholder=""
                  enter-button
                  @search="(value)=>{$refs.searchForm.open('选择考核类型', 'khlxmc',value)}"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="省份：" prop="sfmc">
                <a-input-search
                  v-model="form.sfmc"
                  allow-clear
                  placeholder=""
                  enter-button
                  @search="(value)=>{$refs.searchForm.open('选择省份', 'sfmc',value)}"
                />
                <a-input type="hidden" v-model="form.sfbh" />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" :offset="2" v-show="this.form.xslxmc&&this.form.xslxmc.indexOf('商务')>=0">
              <a-form-model-item label="商务发货类型：" prop="swfhlx">
                <a-select v-model="form.swfhlx" :style="dropdownStyle">
                  <a-select-option :value="item" v-for="item in swfhlxList" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter" v-show="this.form.khlxmc&&this.form.khlxmc.indexOf('招商')>=0">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="CSO客户：" >
                <a-input-search
                  v-model="form.csokhmc"
                  allow-clear
                  placeholder=""
                  enter-button
                  @change="onChange('csokhmc')"
                  @search="$refs.searchForm.open('选择CSO客户', 'csokhmc', form.csokhmc)"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" :offset="2">
              <a-form-model-item label="CSO联系方式：" >
                <a-input placeholder="" v-model="form.csolxfs" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="2"> 收货人信息 </a-col>
          </a-row>
          <a-divider></a-divider>
          <a-radio-group class="addressGroup" size="large" v-model="form.shrs" @change="handleDz">
            <a-radio v-for="(item, index) in data" :key="index" :value="item.shrs+','+item.lxdh+','+item.shdz" :disabled="item.id==''">
              <a-card :bodyStyle="{ width: '250px', height: '100px' }" v-if="item.id&&item.id.length > 0">
                <template slot="title">
                  <div style="display: block">
                    <span class="title">{{ item.shrs }}</span>
                    <a-button type="link" class="editAddress" @click="newAddress(index)">编辑</a-button>
                    <a-button type="link" class="defaultAddress" v-if="item.mrdz !== '1'" @click="setDefault(index)">设为默认</a-button>
                  </div>
                </template>
                <div style="margin: 5px 0 25px 0;">{{ item.lxdh }}</div>
                <div class="address">{{ item.shdz }}</div>
                <div class="address-checked"></div>
              </a-card>
              <a-card class="newAddress" @click="newAddress(null)" :bodyStyle="{ width: '220px', height: '100px' }" v-else>
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
          <a-button type="primary" @click="$refs.product.open(form.wwxt)">选择产品</a-button>
          <a-table
            :pagination="false"
            :columns="columns"
            :dataSource="form.ddmxList"
            :scroll="{x: 600}"
            :rowKey="() => {return parseFloat(10000000000 * Math.random()).toFixed(0) + '' }"
            bordered
          >
            <template slot="slaction" slot-scope="text, record, index">
              <a-input-number :step="10" v-model="form.ddmxList[index].sl" @blur="e => handleChange(e.target.value,index,'sl')" />
            </template>
            <template slot="djaction" slot-scope="text, record, index">
              <a-input-number :step="0.01" v-model="form.ddmxList[index].dj" @blur="e => handleChange(e.target.value,index,'dj')" />
            </template>
            <template slot="khjaction" slot-scope="text, record, index">
              <a-input-number :step="0.01" v-model="form.ddmxList[index].khj" />
            </template>
            <template slot="mnaction" slot-scope="text, record, index">
              <div :class="{green: (form.ddmxList[index].sl)<=form.ddmxList[index].mnkcsl, red: (form.ddmxList[index].sl)>form.ddmxList[index].mnkcsl}"> {{ text }}</div>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <a-button type="link" @click="del(index)">删除</a-button>
            </template>
          </a-table>
          <a-row :gutter="gutter" style="margin: 10px 0">
            <a-col :span="3" :offset="18">
              <span style="display: block; padding: 5px 0; line-height: 1.5">订单总金额：</span>
            </a-col>
            <a-col :span="3">
              <span class="amount">{{ form.ddzje }}￥</span>
            </a-col>
          </a-row>
          <a-divider></a-divider>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="汇款方式：" >
                <a-radio-group v-model="form.hkfs">
                  <a-radio value="电汇"> 电汇 </a-radio>
                  <a-radio value="承兑"> 承兑 </a-radio>
                  <a-radio value="赊销"> 赊销 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="9" offset="2" v-show="this.form.hkfs=='赊销'">
              <a-form-model-item label="账期天数：" prop="zqts">
                <a-select v-model="form.zqts" style="width: calc(100% - 25px);padding: 0;box-sizing: border-box;vertical-align: middle;">
                  <a-select-option :value="item" v-for="item in zqList" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
                <a-button icon="plus" @click="selectvisible = true" style="width: 25px; border-left: none;box-sizing: border-box;vertical-align: middle;" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="汇款底单：" prop="hkdd" >
                <a-input-search
                  read-only
                  placeholder=""
                  v-model="form.hkdd"
                  @search="changeHKDD"
                >
                  <a-button slot="enterButton" >
                    <a-icon type="close" />
                  </a-button>
                </a-input-search>
              </a-form-model-item>
            </a-col>
            <a-col :span="2" >
              <a-upload
                :multiple="true"
                accept="image/*"
                :file-list="fileList"
                @change="handleFileChange"
                :beforeUpload="beforeUpload"
                :showUploadList="false"
                name="file"
                style="margin-top: 5px;display:block;"
              >
                <a-button>选择文件 </a-button>
              </a-upload>
            </a-col>
            <a-col :span="9">
              <a-form-model-item label="汇款日期：" prop="hkrq">
                <a-date-picker mode="date" v-model="form.hkrq" :style="dropdownStyle" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="汇款金额：" prop="hkje">
                <a-input-number :step="0.01" v-model="form.hkje" placeholder="" :style="dropdownStyle" />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" offset="2">
              <a-form-model-item label="收款账号：" prop="skzh">
                <a-select v-model="form.skzh" :style="dropdownStyle">
                  <a-select-option :value="item.value" v-for="(item, index) in zhList" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="汇款备注：" prop="hkbz" >
                <a-input v-model="form.hkbz" placeholder="" :style="dropdownStyle" />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" offset="2">
              <a-form-model-item label="发票开具：" prop="fpkj">
                <a-select v-model="form.fpkj" mode="default" :style="dropdownStyle">
                  <a-select-option :value="item.fpkjbm" v-for="(item, index) in fpkjList" :key="index">
                    {{ item.fpkjmc }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="资料：" >
                <a-checkbox-group
                  v-model="form.zlArr"
                  name="checkboxgroup"
                  :options="plainOptions"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" offset="2">
              <a-form-model-item label="商业采购：" prop="sycg" >
                <a-select v-model="form.sycg" :style="dropdownStyle" @change="changeSycg">
                  <a-select-option :value="item.yhzh+','+item.yhmc" v-for="(item, index) in sycgList" :key="index">
                    {{ item.yhmc }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="gutter">
            <a-col :span="9" :offset="2">
              <a-form-model-item label="订单备注：" prop="ddbz">
                <a-input placeholder="" v-model="form.ddbz" :style="dropdownStyle" />
              </a-form-model-item>
            </a-col>
            <a-col :span="9" offset="2">
              <a-form-model-item label="制单人：" >
                <a-input placeholder="" v-model="form.zdrmc" :style="dropdownStyle" read-only/>
              </a-form-model-item>
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
    <OrderModal :showOrderModal="showOrderModal" @closeModal="closeModal"></OrderModal>
    <SearchForm ref="searchForm" @ok="selectOk" />
    <add-form ref="addForm" @ok="handleOk" />
    <a-modal
      title="新增选项"
      :visible="selectvisible"
      @ok="newOk"
      @cancel="selectvisible = false"
    >
      账期天数：<a-input-number v-model="newZQ" :step="1"></a-input-number>
    </a-modal>
    <a-modal
      title="新增模板"
      :visible="modalVisible"
      @ok="saveModal"
      @cancel="modalVisible = false"
    >
      模板名称：<a-input v-model="form.mbmc" ></a-input>
    </a-modal>
  </div>
</template>
<script>
import { STable, Product, OrderModal, SearchForm } from '@/components'
import addForm from '../cjdd/addForm.vue'
import order from '@/api/order'
import shdz from '@/api/shdz'
import u from '@/utils/util'
import moment from 'moment'
import { mapActions } from 'vuex'
const plainOptions = ['随货同行', '发票', '冷藏车']
export default {
  components: {
    STable,
    Product,
    addForm,
    OrderModal,
    SearchForm
  },
  data () {
    return {
      modalVisible: false,
      wwxtList: [{ value: '001', name: '山东罗欣药业集团股份有限公司' },
      { value: '002', name: '山东裕欣药业有限公司' },
      { value: '009', name: '山东罗欣乐康制药有限公司' }],
      data: [],
      swfhlxList: ['商务集采', 'Y品种', '招商业务'],
      zqList: [30, 60, 70, 90],
      zhList: [
        { name: '罗欣公户', value: '3649' },
        { name: '裕欣公户', value: '3119' },
        { name: '乐康公户', value: '1773' },
        { name: '空白', value: '' }
      ],
      newZQ: 0,
      selectvisible: false,
      fpkjList: [],
      sycgList: [],
      formField: {
        fhjlmc: ['fhjlmc', 'fhjlid'],
        khjlmc: ['khjlmc', 'khjlid'],
        sfmc: ['sfmc', 'sfbh'],
        xslxmc: ['xslxmc', 'xslxbh'],
        khlxmc: ['khlxmc', 'khlxbh'],
        csokhmc: ['csokhmc', 'csokhbh', 'csolxfs'],
        khmc: ['khmc', 'khbh', 'khnm'],
        ejskhmc: ['ejskhmc', 'ejskhbh', 'ejskhnm']
      },
      showOrderModal: false,
      plainOptions,
      dropdownStyle: { width: '100%', padding: '0' },
      fileList: [],
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
          width: 100
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'dj',
          scopedSlots: { customRender: 'djaction' },
          width: 100
        },
        {
          title: '金额',
          align: 'center',
          dataIndex: 'je',
          scopedSlots: { customRender: 'jeaction' },
          width: 100
        },
        {
          title: '库存情况',
          align: 'center',
          dataIndex: 'kcqk',
          width: 100
        },
        {
          title: '考核价',
          align: 'center',
          dataIndex: 'khj',
          scopedSlots: { customRender: 'khjaction' },
          width: 100
        },
        {
          title: '政策信息',
          align: 'center',
          dataIndex: 'zcxx',
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
      rules: {
        fhjlmc: [
          {
            required: true,
            message: '请选择发货经理',
            trigger: ['blur', 'change']
          }
        ],
        khjlmc: [
          {
            required: true,
            message: '请选择考核经理',
            trigger: ['blur', 'change']
          }
        ],
        sfmc: [
          {
            required: true,
            message: '请选择省份',
            trigger: ['blur', 'change']
          }
        ]
      },
      showProduct: false,
      form: {
        ddzje: 0,
        wwxt: '001',
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
        zdrmc: this.$store.state.user.info.yhmc,
        zdrid: this.$store.state.user.info.yhzh,
        khjlmc: '',
        xslxbh: '',
        xslxmc: '',
        khlxbh: '',
        khlxmc: '',
        sfbh: '',
        sfmc: '',
        swfhlx: '',
        csokhbh: '',
        csokhmc: '',
        csolxfs: '',
        hkfs: '电汇',
        zqts: '',
        hkrq: '',
        hkje: '',
        skzh: '',
        hkbz: '',
        fpkj: '',
        zl: '',
        zlArr: ['随货同行', '发票'],
        sycg: '',
        sycgid: '',
        sycgmc: '',
        ddbz: '',
        zdrq: ''
      }
    }
  },
  created () {
    window.addEventListener('resize', this.getHeight)
    this.queryFPKJ()
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
        const sycg = record.sycgid + ',' + record.sycgmc
        const zl = record.zl ? record.zl.split('+') : []
        await shdz
        .list({ khbh: record.khnm })
        .then((res) => {
          if (res.code === 200) {
            this.data = res.data
            console.info(this.data)
            this.data.push({ id: '' })
          }
        })
        await order.syzhDict({ sybm: record.khbh })
        .then((res) => {
          if (res.code === 200) {
            this.sycgList = res.data.rows
          }
        })
        Object.assign(this.form, record)
        // setTimeout(() => {
          Object.assign(this.form, {
            wwxt: record.wwxt,
            kh: kh,
            lxr: record.lxr,
            lxdh: record.lxdh,
            shdz: record.shdz,
            shrs: record.lxr + ',' + record.lxdh + ',' + record.shdz,
            hkdd: '',
            hkddurl: '',
            zl: zl,
            sycg: sycg,
            ddmxList: record.mxList
           })
        // }, 5000)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    handleReset(value) {
      this.$refs['form'].resetFields()
      this.form.ddmxList = []
      this.data = []
      this.queryFPKJ()
    },
    changeHKDD() {
      this.form.hkdd = ''
      this.form.hkddurl = ''
    },
    saveDD() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (u.isEmptyStr(this.form.fhjlmc) || u.isEmptyStr(this.form.fhjlid)) {
        this.$message.error('请选择发货经理！')
        return false
      }
      if (u.isEmptyStr(this.form.khjlid) || u.isEmptyStr(this.form.khjlmc)) {
        this.$message.error('请选择考核经理！')
        return false
      }
      if (u.isEmptyStr(this.form.khmc) || u.isEmptyStr(this.form.khnm)) {
        this.$message.error('请选择客户！')
        return false
      }
      if ((this.form.hkfs === '赊销') && u.isEmptyStr(this.form.zqts)) {
        this.$message.error('请选择账期天数！')
        return false
      }
      for (let i = 0; i < this.form.ddmxList.length; i++) {
        if (u.isLE0(this.form.ddmxList[i].sl)) {
          this.$message.error('第' + (i + 1) + '行数量值无效！')
          return false
        }
        if (u.isLE0(this.form.ddmxList[i].dj)) {
          this.$message.error('第' + (i + 1) + '行单价值无效！')
          return false
        }
        console.info(parseFloat(this.form.ddmxList[i].dj), parseFloat(this.form.ddmxList[i].sl), parseFloat(this.form.ddmxList[i].je))
        if (parseFloat(this.form.ddmxList[i].dj) * parseFloat(this.form.ddmxList[i].sl) !== parseFloat(this.form.ddmxList[i].je)) {
          this.$message.error('第' + (i + 1) + '行单价数量与金额不符！')
          return false
        }
      }
        this.form.zl = this.form.zlArr.join('+')
        let sycg = this.form.sycg
        this.form.hkrq = moment(this.form.hkrq).format('YYYY-MM-DD')
        sycg = sycg.split(',')
        this.form.sycgid = sycg[0]
        this.form.sycgmc = sycg[1]
        this.form.sjly = 'order'
        this.form.hkddList = []
        if (this.form.hkdd.length > 0) {
          const hkdd = this.form.hkdd.split(';')
          const hkddurl = this.form.hkddurl.split(';')
          for (let i = 0; i < hkdd.length; i++) {
            if (!u.isEmptyStr(hkdd[i])) {
              this.form.hkddList.push({ fjlj: hkddurl[i], fjmc: hkdd[i] })
            }
          }
        }
        order.createOrderPC(this.form).then(res => {
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
          if (u.isEmptyStr(this.form.fhjlmc) || u.isEmptyStr(this.form.fhjlid)) {
        this.$message.error('请选择发货经理！')
        return false
      }
      if (u.isEmptyStr(this.form.khjlid) || u.isEmptyStr(this.form.khjlmc)) {
        this.$message.error('请选择考核经理！')
        return false
      }
      if (u.isEmptyStr(this.form.khmc) || u.isEmptyStr(this.form.khnm)) {
        this.$message.error('请选择客户！')
        return false
      }
      if ((this.form.hkfs === '赊销') && u.isEmptyStr(this.form.zqts)) {
        this.$message.error('请选择账期天数！')
        return false
      }
      for (let i = 0; i < this.form.ddmxList.length; i++) {
        if (u.isLE0(this.form.ddmxList[i].sl)) {
          this.$message.error('第' + (i + 1) + '行数量值无效！')
          return false
        }
        if (u.isLE0(this.form.ddmxList[i].dj)) {
          this.$message.error('第' + (i + 1) + '行单价值无效！')
          return false
        }
        console.info(parseFloat(this.form.ddmxList[i].dj), parseFloat(this.form.ddmxList[i].sl), parseFloat(this.form.ddmxList[i].je))
        if (parseFloat(this.form.ddmxList[i].dj) * parseFloat(this.form.ddmxList[i].sl) !== parseFloat(this.form.ddmxList[i].je)) {
          this.$message.error('第' + (i + 1) + '行单价数量与金额不符！')
          return false
        }
      }
        this.form.zl = this.form.zlArr.join('+')
        let sycg = this.form.sycg
        this.form.hkrq = moment(this.form.hkrq).format('YYYY-MM-DD')
        sycg = sycg.split(',')
        this.form.sycgid = sycg[0]
        this.form.sycgmc = sycg[1]
        this.form.sjly = 'order'
        this.form.hkddList = []
        if (this.form.hkdd.length > 0) {
          const hkdd = this.form.hkdd.split(';')
          const hkddurl = this.form.hkddurl.split(';')
          for (let i = 0; i < hkdd.length; i++) {
            if (!u.isEmptyStr(hkdd[i])) {
              this.form.hkddList.push({ fjlj: hkddurl[i], fjmc: hkdd[i] })
            }
          }
        }
        order.templateAdd(Object.assign({ mxList: this.form.ddmxList }, this.form)).then(res => {
          if (res.code === 200) {
            this.$message.success('模板保存成功')
            this.form.mbmc = ''
            this.modalVisible = false
          } else {
            this.$message.error(res.message)
          }
        })
        }
      })
    },
    je(index) {
        const je = parseFloat(parseFloat(this.form.ddmxList[index].sl) * parseFloat(this.form.ddmxList[index].dj)).toFixed(2)
        return (isNaN(je) ? 0 : je)
    },
    js(index) {
        let je = parseFloat(parseFloat(this.form.ddmxList[index].sl) / parseFloat(this.form.ddmxList[index].jzl)).toFixed(2)
        je = je > 1 ? parseInt(je) : je
       return (isNaN(je) ? 0 : je)
    },
    setDdzje() {
        let je = 0
        this.form.ddmxList.forEach(item => {
          je = je + parseFloat(item.je)
        })
          this.form.ddzje = (isNaN(je) ? 0 : parseFloat(je).toFixed(2))
    },
    handleChange(value, index, column) {
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
    queryFHjl(obj) {
      order
        .examineManageDict(obj)
        .then(res => {
          if (res.code === 200) {
            console.info(res.data)
            if (res.data && res.data.totalRows > 0) {
              this.form.fhjlmc = res.data.rows[0].rymc
              this.form.fhjlid = res.data.rows[0].rynm
              this.form.xslxbh = res.data.rows[0].xslx
              this.form.khjlmc = res.data.rows[0].rymc
              this.form.khjlid = res.data.rows[0].rynm
              this.queryXSLX()
            }
            // this.data = res.data
          }
        })
    },
    clear() {
      this.$refs['form'].resetFields()
      this.ddzje = 0
      this.data = []
      this.form.ddmxList = []
      this.shrs = ''
    },
    /**
         * 上传文件
         */
         beforeUpload (file, fileList) {
          const fileName = file.name
          const formData = new FormData()
          formData.append('file', file)
          order.uploadImg(formData).then(res => {
            console.info(res)
            this.form.hkdd = this.form.hkdd + fileName + ';'
            this.form.hkddurl = this.form.hkddList + res.data + ';'
          })
        return false
        },
      handleFileChange(info) {
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
      shdz
        .setDefault(this.data[index])
        .then(res => {
          if (res.code === 200) {
            this.$message.info('设置成功')
            this.querySHDZ(this.form.khnm)
          }
        })
    },
    handleDz(e) {
      let dz = e.target.value
      dz = dz.split(',')
      this.form.lxr = dz[0]
      this.form.lxdh = dz[1]
      this.form.shdz = dz[2]
    },
    changeSycg() {
      let v = this.form.sycg
      v = v.split(';')
      this.form.sycgmc = v[1]
      this.form.sycgid = v[0]
    },
    changeKH(e) {
      let v = this.form.kh
      v = v.split(';')
      this.form.khmc = v[1]
      this.form.khnm = v[0]
      this.form.khbh = v[2]
      this.querySHDZ(this.form.khnm)
      this.querySYCG(this.form.khnm)
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
    querySHDZ (khmc) {
      shdz
        .list({ khbh: khmc })
        .then((res) => {
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
        .catch((e) => {
          console.info(e)
        })
    },
    // 销售类型查询
    queryXSLX (khmc) {
      order.salesTypeDict({ khbh: khmc })
        .then((res) => {
          if (res.code === 200 && res.data.rows[0]) {
            const record = res.data.rows[0]
            this.form.xslxmc = record.lxmc
            this.form.xslxbh = record.lxbh
            this.form.khlxmc = record.lxmc
            this.form.khlxbh = record.lxbh
          }
        })
        .catch((e) => {
          console.info(e)
        })
    },
    // 商业采购查询
    querySYCG () {
      order.syzhDict({ sybm: this.form.khbh })
        .then((res) => {
          if (res.code === 200) {
            this.sycgList = res.data.rows
          }
        })
        .catch((e) => {
          console.info(e)
        })
    },
    queryFPKJ () {
      order.fpkjDict({})
        .then((res) => {
          if (res.code === 200) {
            this.fpkjList = res.data.rows
            console.info(this.data)
          }
        })
        .catch((e) => {
          console.info(e)
        })
    },
    del (index) {
      this.form.ddmxList.splice(index, 1)
    },
    handleOk() {
      this.querySHDZ(this.form.khnm)
    },
    selectOk({ obj, formName }) {
      console.info('selectOk', obj, formName)
        Object.assign(this.form, obj)
      // 客户名称数据获取后继续获取收货人信息列表
      if (formName === 'khmc') {
          this.querySHDZ(this.form.khnm)
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
        const obj = { khj: 0,
          sl: '0',
          je: '0.00',
          js: '0.00',
          dj: 0
        }
        Object.assign(obj, record)
        this.form.ddmxList.push(obj)
      } else if (type === 'modal') {
        console.info(record)
        const kh = record.khnm + ';' + record.khmc + ';' + record.khbh
        const sycg = record.sycgid + ',' + record.sycgmc
        const zl = record.zl.split('+')
        await shdz
        .list({ khbh: record.khnm })
        .then((res) => {
          if (res.code === 200) {
            this.data = res.data
            console.info(this.data)
            this.data.push({ id: '' })
          }
        })
        await order.syzhDict({ sybm: record.khbh })
        .then((res) => {
          if (res.code === 200) {
            this.sycgList = res.data.rows
          }
        })
        Object.assign(this.form, record)
        // setTimeout(() => {
          Object.assign(this.form, {
            wwxt: record.wwxt,
            kh: kh,
            lxr: record.lxr,
            lxdh: record.lxdh,
            shdz: record.shdz,
            shrs: record.lxr + ',' + record.lxdh + ',' + record.shdz,
            hkdd: '',
            hkddurl: '',
            zl: zl,
            sycg: sycg,
            ddmxList: record.mxList
           })
        // }, 5000)
      }
    }
      this.showOrderModal = false
    },
    getHeight () {
      this.tableHeight = window.innerHeight - 265
    },
    moment,
    ...mapActions(['Login', 'Logout'])
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
    .ant-row {
      margin-bottom: 10px;
      .ant-form-item-label {
        padding-right: 25px;
      }
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
    }
  }
  .amount {
  color: orange;
  font-weight: 700;
  display: block;
  padding: 5px 0;
  line-height: 1.5
}
  .ant-form-inline .ant-form-item .ant-select-selection--single {
    width: 100%;
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
    width:240px;
    height: 160px;
    padding: 0 5px 10px 5px;
    .ant-card-body {
      padding: 3px 10px;
    }
    .ant-card-head {
      padding: 3px 2px;
      min-height: 30px;
      border: none;
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
.container /deep/ .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled):focus-within {
  outline: none;
}

.table-operator {
  margin-bottom: 18px;
}
</style>
