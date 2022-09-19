<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <vab-remix-icon class="vab-remix-icon" icon-class="international" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">
        {{ $t('i18n.zh') }}
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        {{ $t('i18n.en') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      localStorage.setItem('locale',lang)
      this.$message({
        message: this.$t('i18n.msg'),
        type: 'success'
      })
    }
  }
}
</script>
