<template>
  <div class="container">
    <a-page-header style="border-bottom: 1px solid rgb(235, 237, 240)" title="返回" @back="() => $router.go(-1)">
    </a-page-header>
    <a-spin :spinning="spinning">
      <a-divider></a-divider>
      <a-row style="padding:  0 20px;margin: 0 40px;">
        <a-col :span="5"> <span class="title">订单号：</span>{{ data.ddh }}</a-col>
        <a-col :span="5"> <span class="title">订单日期：</span>{{ data.ddrq }}</a-col>
        <a-col :span="9">
          <span class="title">客户名称：{{ data.khmc }}</span></a-col
        >
        <a-col :span="5">
          <span class="title">订单总金额：</span><span class="amount">{{ data.ddzje }}￥</span>
        </a-col>
      </a-row>
      <div class="search-wrapper">
        <h3>收货人信息</h3>
        <a-row :gutter="gutter">
          <a-col :span="22" :offset="2"> {{ data.lxr }}，{{ data.lxdh }}， {{ data.shdz }} </a-col>
        </a-row>
        <a-divider></a-divider>
        <h3>合同信息</h3>
        <a-row :gutter="gutter">
          <a-col :span="22" :offset="2">
            电子合同:<a-button type="link" @click="ht">{{ data.dzhtbh }}</a-button
            ><a-button type="link" @click="carouselVisiable = true">查看纸质签署合同</a-button>
          </a-col>
        </a-row>
        <a-divider></a-divider>
        <h3>付款信息</h3>
        <a-row :gutter="gutter">
          <a-col :span="22" :offset="2">
            汇款底单：<a-button type="link" v-for="(item,index) in data.hkddList" :key="index" @click="showDD(item.fjlj)">{{ item.fjmc }}</a-button>
          </a-col>
        </a-row>
        <a-divider></a-divider>
      </div>
      <div class="search-wrapper" v-for="(mx, index) in data.ddmxList" :key="index">
        <h3>产品清单</h3>
        <div class="popover">
          <a-popover title="" trigger="click" placement="topRight">
            <template slot="content">
              <a-timeline>
                <a-timeline-item v-for="(item, i) in mx.ddlcrzList" :key="'gz'+i" v-show="item.syxs=='1'">
                  <div><span style="color: rgba(24, 144, 255, 1);">{{ item.rzjdmc }}</span>{{ ': ' + (item.jgms?item.jgms:item.zdrmc) }}</div>
                  <div>{{ item.zdsj }}</div>
                </a-timeline-item>
              </a-timeline>
            </template>
            <a-button type="link">
              订单流程跟踪<a-icon type="down"></a-icon>
            </a-button>
          </a-popover>
        </div>
        <a-row :gutter="gutter">
          <a-col :span="24">
            <a-table
              bordered
              :columns="columns"
              :data-source="[mx]"
              :rowKey="(record) => record.ddmxls"
              :pagination="false"
            >
              <template slot="action" slot-scope="text, record">
                <a-button
                  type="info"
                  :class="{ blue: record.ddzt != '7'&&record.ddzt != '10'&&record.ddzt != '11', green: record.ddzt == '7', orange: record.ddzt == '10', red: record.ddzt == '11'}"
                >
                  {{ record.zt | getStatus }}
                </a-button>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-divider></a-divider>
        <h3>发票信息</h3>
        <a-row :gutter="gutter" v-for="(fm, j) in mx.ddfpxxList" :key="'fh'+j">
          <a-col span="8" offset="2"> 发货单号：{{ fm.fhdh }} </a-col>
          <a-col span="8"> 发票号: <a-button type="link" @click="showFP(fm.fphm)">{{ fm.fphm }}</a-button> </a-col>
        </a-row>
        <a-divider></a-divider>
        <h3>物流信息</h3>
        <a-row :gutter="gutter" v-for="(wl, k) in mx.ddwlxxList" :key="'wl'+k">
          <a-col span="6" offset="2"> 发货单号：{{ wl.fhdh }} </a-col>
          <a-col span="4"> 数量: {{ wl.js }} </a-col>
          <a-col span="12"> 物流单: {{ wl.wlgs + '_' }}<span style="color: rgba(24, 144, 255, 1);">{{ wl.wldh }}</span>{{ '_' + wl.fyrq }} </a-col>
        </a-row>
      </div>
    </a-spin>
    <a-modal :visible="fpVisiable" title="查看" width="800px" :footer="null" @cancel="fpVisiable = false">
      <a-spin :spinning="imgLoading">
        <img :src="fphm" alt="图片不存在" style="max-width: 99%"/>
      </a-spin>
    </a-modal>
    <a-modal :visible="hkddVisible" title="查看" width="800px" :footer="null" @cancel="closeDD">
      <img :src="url" alt="图片不存在" style="max-width: 99%"/>
    </a-modal>
    <a-modal :visible="carouselVisiable" width="600px" title="查看电子合同" :footer="null" @cancel="carouselVisiable = false">
      <a-carousel arrows>
        <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
          <a-icon type="left-circle" :key="props.index" />
        </div>
        <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" :key="props.index" />
        </div>
        <div v-for="(item, index) in data.zzhtList" :key="index">
          <img :src="item.wjlj" />
        </div>
        <div>
          <img src="~@/assets/welcome.png" />
        </div>
        <div>
          <img src="~@/assets/welcome.png" />
        </div>
      </a-carousel>
    </a-modal>
  </div>
</template>
<script>
import order from '@/api/order'
import moment from 'moment'
import { mapActions } from 'vuex'
const path = process.env.VUE_APP_FTP
console.info(process.env.VUE_APP_API_BASE_URL)
console.info(process.env.VUE_APP_FTP)
export default {
  data() {
    return {
      url: '',
      imgLoading: false,
      carouselVisiable: false,
      hkddVisible: false,
      fpVisiable: false,
      fphm: '',
      spinning: false,
      labelCol: { style: 'width: 220px; text-align: right; padding: 0 40px;' },
      gutter: 0,
      data: {},
      visible: false,
      tableHeight: window.innerHeight - 265,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      // queryParam: {},
      queryParam: { userid: this.$route.query.userid },
      // 表头
      columns: [
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
        },
        {
          title: '已发数量',
          align: 'center',
          dataIndex: 'yfsl',
          width: 60
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    }
  },
  watch: {
    '$route.query.ddls': function() {
      console.info(this.$route.query)
      this.queryDetail()
    }
  },
  created() {
    console.info(this.$route.query)
    this.queryDetail()
    window.addEventListener('resize', this.getHeight)
  },
  filters: {
    getStatus: order.getStatus
  },
  methods: {
    showDD(fjlj) {
      this.hkddVisible = true
      console.info(path)
      this.url = path + fjlj
    },
    closeDD() {
      this.hkddVisible = false
      this.url = ''
    },
    showFP(fphm) {
      console.info(fphm)
      // this.fphm = 'http://' + location.host + '/order/invoiceView?fphm=' + fphm
      this.fpVisiable = true
      this.imgLoading = true
      order
        .invoiceView({ fphm: fphm })
        .then(res => {
            const myBlob = new window.Blob([res])
              console.log(myBlob)
              const qrUrl = window.URL.createObjectURL(myBlob)
              console.log(qrUrl)
              this.fphm = qrUrl
            //   window.URL.revokeObjectURL(qrUrl)
        }).finally(() => {
          this.imgLoading = false
        })
    },
    ht() {
      order
        .econtractView({ dzhtbh: this.data.dzhtbh })
        .then(res => {
          if (res.code === 200) {
            window.open(res.data, '电子合同')
          }
        })
    },
    queryDetail() {
      this.spinning = true
      order
        .orderDetail({ ddls: this.$route.query.ddls })
        .then(res => {
          if (res.code === 200) {
            this.data = res.data
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
.container {
  background-color: #fff;
  padding: 0 0 50px 0;
  /deep/ .ant-divider-horizontal {
    margin: 2px 0 12px 0;
    background-color: #fff;
  }
  .title {
    font-weight: 500;
    color: #000;
    font-size: 16px;
  }
  .amount {
    color: orange;
    font-weight: 600;
  }
}
.container .search-wrapper {
  border: solid 2px orange;
  margin: 6px 40px 20px 40px;
  padding: 20px 20px;
  position: relative;
  /deep/ .ant-divider-horizontal {
    margin: 14px 0 12px 0;
    background-color: rgba(255, 165, 0, 0.5);
  }
  .status {
    border-color: rgba(24, 144, 255, 0.4);
    background-color: rgba(24, 144, 255, 0.2);
    border-radius: 3px;
    color: rgba(24, 144, 255, 0.8);
    padding: 0;
    width: 100px;
    margin: 0;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }

  .popover {
    position: absolute;
    right: 0;
    top: 0;
    margin: 10px 0 0 0;
  }
  /deep/ .ant-form .ant-row {
    margin: 6px 0;
  }
  /deep/ .ant-table-thead > tr > th {
    padding: 3px;
  }
  /deep/ .ant-table-tbody > tr > td {
    padding: 3px;
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
