<template>
  <a-card :bordered="false" style="height: 100%;padding: 30px 20px;" >
    <div >尊敬的客户，您好：
    </div>
    <div style="text-indent: 32px;">欢迎登录罗欣商业订单管理平台，为了帮您快速了解平台，进行采购订单的制作，建议您查看平台用户手册，了解订单制作流程。
    </div>
    <div style="text-indent: 32px;"><img src="~@/assets/welcome.png" width="40" height="40"/></div>
    <div style="height: 200px;"></div>
    <div style="margin:100px auto;">
      <div style="color: red; font-size: 18px;"><a-icon type="exclamation-circle" style="font-size: 24px;margin-right: 10px;"/>友情提醒</div>
      <div style="text-indent: 32px;">为了保证及时供货，建议每天14:00前提交订单。</div>
    </div>
  </a-card>
</template>

<script>

</script>

<style lang="less" scoped>
  div{
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    margin: 15px 0;
  }
  /deep/ .ant-card-body{
    height: 100%;
  }
</style>
