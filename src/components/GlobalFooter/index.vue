<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <!-- <a href="https://www.github.com/vueComponent/pro-layout" target="_blank">Pro Layout</a>
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank">Github</a>
      <a href="https://www.github.com/sendya/" target="_blank">@Sendya</a> -->
    </template>
    <template v-slot:copyright>
      <!-- <a href="https://github.com/vueComponent" target="_blank">vueComponent</a> -->
      <div class="copyright">
        Copyright © 2021 <a target="_blank" href="http://www.luoxin.cn">罗欣药业</a> All rights reserved. luoxin 1.0.0
      </div>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
