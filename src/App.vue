<template>
  <div id="yuxuan-basic-admin-app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {},
    watch: {
      '$i18n.locale'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.reload()
        }
      },
    },
  }
</script>
