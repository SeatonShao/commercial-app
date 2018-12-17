<template functional>
  <a-sub-menu v-on="listeners" :key="data.key">
    <span slot="title"><a-icon :type="data.attrs.menuInfo.meta.icon" /><span>{{data.attrs.menuInfo.meta.title}}</span></span>
    <template v-for="item in data.attrs.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key">
        <a-icon :type="item.meta.icon" />
        <span>{{item.meta.title}}</span>
      </a-menu-item>
      <sub-menu v-else :menuInfo="item" :key="item.key"/>
    </template>
  </a-sub-menu>
</template>