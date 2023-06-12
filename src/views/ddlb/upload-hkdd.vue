<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    @cancel="handleCancel"
  >
  <template slot="footer">
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit" >
          确定
        </a-button>
      </template>
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-row>
          <a-col :span="10" :offset="2"> <span>订单号：</span>{{ data.ddh }}</a-col>
          <a-col :span="12"> <span>订单日期：</span>{{ data.ddrq }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="10" :offset="2">
            <span>客户名称：{{ data.khmc }}</span>
          </a-col>
          <a-col :span="12">
            电子合同:<a-button type="link" @click="ht" style="height: 100%; line-height: 1">{{ data.dzhtbh }}</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="gutter">
          <a-col :span="22" :offset="2">收货地址： {{ data.lxr }}， {{ data.lxdh }}， {{ data.shdz }} </a-col>
        </a-row>
        <a-row :gutter="gutter">
          <a-col :span="24">
            <a-table
              bordered
              :columns="columns"
              :data-source="data.ddmxList"
              :rowKey="(record) => record.ddmxls"
              :pagination="false"
            >
              <template slot="action" slot-scope="text, record">
                <a-button
                  type="info"
                  :class="{
                    blue: record.ddzt != '7' && record.ddzt != '10' && record.ddzt != '11',
                    green: record.ddzt == '7',
                    orange: record.ddzt == '10',
                    red: record.ddzt == '11'
                  }"
                >
                  {{ record.zt | getStatus }}
                </a-button>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3" :offset="18">
            <span style="display: block; padding: 5px 0; line-height: 1.5">订单总金额：</span>
          </a-col>
          <a-col :span="3">
            <span style="display: block; padding: 5px 0; line-height: 1.5" class="amount">{{ data.ddzje }}元</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3" :offset="2"> <span style="display:block; padding:6px 0; vertical-align: middle;">汇款底单：</span>
            </a-col>
          <a-col :span="7" >
            <a-input-search v-model="data.hkdd" read-only placeholder="" @search="changeHKDD">
              <a-button slot="enterButton">
                <a-icon type="close" />
              </a-button>
            </a-input-search>
          </a-col>
          <a-input v-model="data.hkddurl" style="display: none;"></a-input>
          <a-col :span="2">
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
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import order from '@/api/order'
import u from '@/utils/util'
import moment from 'moment'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      url: '',
      title: '上传汇款底单',
      confirmLoading: false,
      spinning: false,
      fileList: [],
      gutter: 0,
      data: {
        hkdd: '',
    hkddurl: '',
    hkddList: []
},
      visible: false,
      tableHeight: window.innerHeight - 265,
      // 表头
      columns: [
        {
          title: '序号',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          },
          width: 140
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'cpmc',
          width: 140
        },
        {
          title: '包装规格',
          align: 'center',
          dataIndex: 'bzgg',
          width: 140
        },
        {
          title: '产品编码',
          align: 'center',
          dataIndex: 'cpbm',
          width: 80,
          ellipsis: true
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'sl',
          width: 60
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'dj',
          width: 60,
          ellipsis: true
        },
        {
          title: '金额',
          align: 'center',
          dataIndex: 'je',
          width: 80
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
  },
  filters: {
    getStatus: order.getStatus
  },
  methods: {
    handleCancel() {
      // 清空已选择的
      this.visible = false
    },
    /**
     * 提交表单
     */
    handleSubmit() {
      this.confirmLoading = true
      if (this.data.hkdd.length > 0) {
          const hkdd = this.data.hkdd.split(';')
          const hkddurl = this.data.hkddurl.split(';')
          for (let i = 0; i < hkdd.length; i++) {
            if (!u.isEmptyStr(hkdd[i])) {
              this.data.hkddList.push({ fjlj: hkddurl[i], fjmc: hkdd[i] })
            }
          }
        }
            order
              .uploadReceipt(this.data)
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('上传成功')
                  this.confirmLoading = false
                  this.$emit('closeUploadHkdd', '')
                  this.handleCancel()
                }
              })
              .finally(res => {
                this.confirmLoading = false
              })
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
        this.data.hkdd = this.data.hkdd + fileName + ';'
        this.data.hkddurl = this.data.hkddurl + res.data + ';'
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
    showFP(fphm) {
      console.info(fphm)
      // this.fphm = 'http://' + location.host + '/order/invoiceView?fphm=' + fphm
      this.fpVisiable = true
      this.imgLoading = true
      order
        .invoiceView({ fphm: fphm })
        .then((res) => {
          const myBlob = new window.Blob([res])
          console.log(myBlob)
          const qrUrl = window.URL.createObjectURL(myBlob)
          console.log(qrUrl)
          this.fphm = qrUrl
          //   window.URL.revokeObjectURL(qrUrl)
        })
        .finally(() => {
          this.imgLoading = false
        })
    },
    ht() {
      order.econtractView({ dzhtbh: this.data.dzhtbh }).then((res) => {
        if (res.code === 200) {
          window.open(res.data, '电子合同')
        }
      })
    },
    queryDetail(ddls) {
      this.visible = true
      this.spinning = true
      order
        .orderDetail({ ddls: ddls })
        .then((res) => {
          if (res.code === 200) {
            Object.assign(this.data, res.data)
            for (let i = 0; i < this.data.ddmxList.length; i++) {
              this.data.ddmxList[i].visible = false
            }
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    getRandomInt(max, min = 0) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 265
    },
    moment,
    ...mapActions(['Login', 'Logout'])
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-modal-footer{
    text-align: center;
}
.search-wrapper {
  /deep/ .ant-table-thead > tr > th {
    padding: 3px;
  }
  /deep/ .ant-table-tbody > tr > td {
    padding: 3px;
  }
  /deep/ .ant-row {
    margin-bottom: 15px;
    columns: #000;
  }
  .amount {
    color: orange;
    font-weight: 700;
    display: block;
    padding: 5px 0;
    line-height: 1.5;
  }
  .orange {
    border-color: rgba(255, 165, 0, 0.3);
    background-color: rgba(255, 165, 0, 0.1);
    border-radius: 3px;
    color: rgba(255, 165, 0, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(255, 165, 0, 0.12);
    box-shadow: 0 2px 0 rgba(255, 165, 0, 0.045);
  }
  .blue {
    border-color: rgba(24, 144, 255, 0.3);
    background-color: rgba(24, 144, 255, 0.1);
    border-radius: 3px;
    color: rgba(24, 144, 255, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(24, 144, 255, 0.12);
    box-shadow: 0 2px 0 rgba(24, 144, 255, 0.045);
  }
  .green {
    border-color: rgba(0, 128, 0, 0.3);
    background-color: rgba(0, 128, 0, 0.1);
    border-radius: 3px;
    color: rgba(0, 128, 0, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(0, 128, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 128, 0, 0.045);
  }
  .red {
    border-color: rgba(255, 0, 0, 0.3);
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 3px;
    color: rgba(255, 0, 0, 1);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(255, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(255, 0, 0, 0.045);
  }
}
.table-operator {
  margin-bottom: 18px;
}

/*******************轮播图******************* */
.ant-carousel /deep/ .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel /deep/ .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel /deep/ .custom-slick-arrow:before {
  display: none;
}
.ant-carousel /deep/ .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel /deep/ .slick-slide h3 {
  color: #fff;
}
/************************************** */
</style>
