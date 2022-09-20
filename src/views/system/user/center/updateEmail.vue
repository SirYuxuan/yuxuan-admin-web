<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="565px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px">
        <el-form-item :label="$t('view.userCenter.newEmail')" prop="email">
          <el-input v-model="form.email" auto-complete="on" style="width: 200px;" />
          <el-button :loading="codeLoading" :disabled="isDisabled" size="small" @click="sendCode">{{ buttonName }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('view.userCenter.code')" prop="code">
          <el-input v-model="form.code" max-length="6" style="width: 400px;" />
        </el-form-item>
        <el-form-item :label="$t('view.userCenter.password')" prop="pass">
          <el-input v-model="form.pass" type="password" style="width: 400px;" />
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
import {encrypt} from '@/utils/encrypt'
import { isEmail,userValid } from '@/utils/validate'
import { sendUpdateMail, updateEmail } from '@/api/system/user'
import HeyUI from "heyui";
export default {
  props: {
    email: {
      type: String,
      required: false
    }
  },
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error(this.$t('view.userCenter.error.email')))
      } else if (value === this.email) {
        callback(new Error(this.$t('view.userCenter.error.email1')))
      } else if (isEmail(value)) {
        userValid(callback, 'email', value, this.$t('view.userCenter.error.emailUse'))
      } else {
        callback(new Error(this.$t('view.userCenter.error.emailFmt')))
      }
    }
    return {
      loading: false, dialog: false, title: this.$t('view.userCenter.editEmail'), form: { pass: '', email: '', code: '' },
      user: { email: '', password: '' }, codeLoading: false,
      buttonName: this.$t('view.userCenter.getCode'), isDisabled: false, time: 60,
      rules: {
        pass: [
          { required: true, message: this.$t('view.userCenter.error.password'), trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validMail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('view.userCenter.codeNull'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sendCode() {
        this.$refs['form'].validateField('email',(v)=>{
          if(!v){
            this.codeLoading = true
            this.buttonName = this.$t('view.userCenter.codeSend')
            const _this = this
            sendUpdateMail(this.form.email).then(res => {
              HeyUI.$Message({
                text: this.$t('view.userCenter.codeSendSuccess'),
                type: 'success',
              })
              this.codeLoading = false
              this.isDisabled = true
              this.buttonName = this.time-- + ' ' + this.$t('view.userCenter.ris')
              let that = this
              this.timer = window.setInterval(function() {
                _this.buttonName = _this.time + ' ' + that.$t('view.userCenter.ris')
                --_this.time
                if (_this.time < 0) {
                  _this.buttonName = that.$t('view.userCenter.resend')
                  _this.time = 60
                  _this.isDisabled = false
                  window.clearInterval(_this.timer)
                }
              }, 1000)
            }).catch(err => {
              this.codeLoading = false
              window.clearInterval(this.timer)
              this.time = 60
              this.buttonName = this.$t('view.userCenter.getCode')
              this.isDisabled = false
            })
          }
        })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          let email = this.form.email

          updateEmail(this.form).then(res => {
            this.loading = false
            this.resetForm()
            this.$emit('setEmail',email)
            HeyUI.$Message({
              text: this.$t('view.userCenter.emailChange'),
              type: 'success',
            })

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
      window.clearInterval(this.timer)
      this.time = 60
      this.buttonName = this.$t('view.userCenter.getCode')
      this.isDisabled = false
      this.form = { pass: '', email: '', code: '' }
    }
  }
}
</script>

<style scoped>

</style>
