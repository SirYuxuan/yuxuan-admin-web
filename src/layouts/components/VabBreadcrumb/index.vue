<template>
  <el-breadcrumb class="breadcrumb-container" separator=">">
    <el-breadcrumb-item v-for="item in list" :key="item.path">
      {{ routeTitle(item.meta) }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'VabBreadcrumb',
    data() {
      return {
        list: this.getBreadcrumb(),
      }
    },
    watch: {
      $route() {
        this.list = this.getBreadcrumb()
      },
    },
    methods: {
      routeTitle(meta){
        return this.$i18n.locale === 'zh' ? meta.title : (meta.enTitle || 'Default')
      },
      getBreadcrumb() {
        return this.$route.matched.filter(
          (item) => item.name && item.meta.title
        )
      },
    },
  }
</script>

<style lang="scss" scoped>
  .breadcrumb-container {
    height: $base-nav-bar-height;
    font-size: $base-font-size-default;
    line-height: $base-nav-bar-height;

    ::v-deep {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          a {
            display: flex;
            float: left;
            font-weight: normal;
            color: #515a6e;

            i {
              margin-right: 3px;
            }
          }
        }

        &:last-child {
          .el-breadcrumb__inner {
            a {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
