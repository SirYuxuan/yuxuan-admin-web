<template>
  <div style="display: inline-block">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="520px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="109px">
        <el-form-item :label="$t('view.userCenter.oldPass')" prop="oldPass">
          <el-input v-model="form.oldPass" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
        <el-form-item :label="$t('view.userCenter.newPass')" prop="newPass">
          <el-input v-model="form.newPass" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
        <el-form-item :label="$t('view.userCenter.confPass')" prop="confirmPass">
          <el-input v-model="form.confirmPass" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">{{ $t('public.cancel') }}</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">{{ $t('public.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { updatePass } from '@/api/system/user'
import {recordRoute} from "@/config/setting.config";
import HeyUI from "heyui";
import i18n from '@/plugins/i18n'
export default {
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.form.newPass !== value) {
          callback(new Error(i18n.t('view.userCenter.error.twoPass')))
        } else {
          callback()
        }
      } else {
        callback(new Error(i18n.t('view.userCenter.error.repPass')))
      }
    }
    return {
      loading: false, dialog: false, title: this.$t('view.userCenter.updatePassTitle'), form: { oldPass: '', newPass: '', confirmPass: '' },
      rules: {
        oldPass: [
          { required: true, message: i18n.t('view.userCenter.error.oldPass'), trigger: 'blur' }
        ],
        newPass: [
          { required: true, message:  i18n.t('view.userCenter.error.newPass'), trigger: 'blur' },
          { min: 6, max: 20, message: i18n.t('view.userCenter.error.lenPass'), trigger: 'blur' }
        ],
        confirmPass: [
          { required: true, validator: confirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          updatePass(this.form).then(res => {
            this.resetForm()
            HeyUI.$Message({
              text: i18n.t('view.userCenter.passSuccess'),
              type: 'success',
            })
            setTimeout(() => {
              store.dispatch('user/logout')
              if (recordRoute) {
                const fullPath = this.$route.fullPath
                this.$router.push(`/login?redirect=${fullPath}`)
              } else {
                this.$router.push('/login')
              }

            }, 1500)
          }).catch(err => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { oldPass: '', newPass: '', confirmPass: '' }
    }
  }
}
</script>

<style scoped>

</style>
