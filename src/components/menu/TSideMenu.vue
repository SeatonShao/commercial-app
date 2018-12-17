<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo />
    <a-menu
      :mode="mode"
      :theme="theme"
      :inlineCollapsed="collapsed"
      style="padding: 16px 0;"
    >
      <template v-for="item in menus">
        <a-menu-item v-if="!item.children && item.alwaysShow" :key="item.key">
          <a-icon :type="item.meta.icon" />
          <span>{{item.meta.title}}</span>
        </a-menu-item>
        <sub-menu v-else :menuInfo="item" :key="item.key"/>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
  import { mixin, mixinDevice } from '@/utils/mixin'
  import Logo from '../tools/Logo'
  import SubMenu from './SubMenu'

  export default {
    components: {
      'sub-menu': SubMenu,
      Logo
    },
    mixins: [mixin, mixinDevice],
    props: {
      mode: {
        type: String,
        required: false,
        default: 'inline'
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsible: {
        type: Boolean,
        required: false,
        default: false
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      menus: {
        type: Array,
        required: true
      }
    },
    data () {
      return {}
    },
    created () {
      console.log('menu mode:', this.mode)
    }
  }
</script>