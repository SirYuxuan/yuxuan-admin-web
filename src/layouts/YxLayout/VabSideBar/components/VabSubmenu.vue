<template>
  <el-submenu
    ref="subMenu"
    :index="handlePath(item.path)"
    :popper-append-to-body="false"
  >
    <template slot="title">
      <vab-remix-icon
        v-if="item.meta && item.meta.icon"
        :icon-class="item.meta.icon"
        class="vab-remix-icon"
      />
      <span>{{ routeTitle(item.meta) }}</span>
      <el-tag
        v-if="item.meta && item.meta.badge"
        type="danger"
        style="margin-right: 20px"
        effect="dark"
      >
        {{ item.meta.badge }}
      </el-tag>
    </template>
    <slot />
  </el-submenu>
</template>

<script>
  import { isExternal } from '@/utils/validate'
  import path from 'path'

  export default {
    name: 'VabSubmenu',
    props: {
      routeChildren: {
        type: Object,
        default() {
          return null
        },
      },
      item: {
        type: Object,
        default() {
          return null
        },
      },
      fullPath: {
        type: String,
        default: '',
      },
    },
    methods: {
      routeTitle(meta){
        return this.$i18n.locale === 'zh' ? meta.title : (meta.enTitle || 'Default')
      },
      handlePath(routePath) {
        if (isExternal(routePath)) {
          return routePath
        }
        if (isExternal(this.fullPath)) {
          return this.fullPath
        }
        return path.resolve(this.fullPath, routePath)
      },
    },
  }
</script>
