<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('view.userCenter.title') }}</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="user.avatar ?  user.avatar : Avatar" :title="$t('view.userCenter.upload')" class="avatar" @click="toggleShow">
                <myUpload
                  field="attach"
                  :model-value="modelValue"
                  :headers="headers"
                  :url="baseURL+'attach/upload'"
                  :model-value.sync="modelValue"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info" >
              <li>
                <div style="height: 100%">
                <vab-remix-icon
                 icon-class="username"
                  class="vab-remix-icon"
                /> {{ $t('view.userCenter.account') }}<div class="user-right">{{ user.username }}</div></div></li>
              <li><div style="height: 100%">
                <vab-remix-icon icon-class="nickname" class="vab-remix-icon" /> {{ $t('view.userCenter.nickName') }} <div class="user-right">{{ user.nickName }}</div></div></li>
              <li><div style="height: 100%"><vab-remix-icon icon-class="phone" class="vab-remix-icon" /> {{ $t('view.userCenter.phone') }} <div class="user-right">{{ user.phone }}</div></div></li>
              <li><div style="height: 100%"><vab-remix-icon icon-class="email" class="vab-remix-icon" /> {{ $t('view.userCenter.email') }} <div class="user-right">{{ user.email }}</div></div></li>
              <li>
                <vab-remix-icon icon-class="anquan" class="vab-remix-icon" /> {{ $t('view.userCenter.setting') }}
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true" style="margin-right: 5px">{{ $t('view.userCenter.updatePassword') }}</a>
                  <a @click="$refs.email.dialog = true">{{ $t('view.userCenter.updateEmail') }}</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('view.userCenter.info')" name="first">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small" label-width="80px">
                <el-form-item :label="$t('view.userCenter.nickName')" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%" />
                  <span style="margin-left: 10px;color: #C0C0C0;">{{ $t('view.userCenter.userNick') }}</span>
                </el-form-item>

                <el-form-item :label="$t('view.userCenter.phone')" >
                  <el-input v-model="form.phone" style="width: 35%;" disabled/>
                  <el-button type="primary" icon="el-icon-edit" @click="$refs.phone.dialog = true"></el-button>
                </el-form-item>
                <el-form-item :label="$t('view.userManager.sex')">
                  <el-radio-group v-model="form.sex" style="width: 350px">
                    <el-radio :label="1">{{ $t('public.male') }}</el-radio>
                    <el-radio :label="0">{{ $t('public.female') }}</el-radio>
                    <el-radio :label="2">{{ $t('public.unknown') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">{{ $t('view.userCenter.saveConfig') }}</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--    操作日志    -->
            <el-tab-pane :label="$t('view.userCenter.opLog')" name="second">
              <el-table v-loading="loading" :data="data" style="width: 100%;">
                <el-table-column prop="title" :label="$t('view.userCenter.action')">
                  <template slot-scope="scope">
                    {{ $i18n.locale === 'zh'?scope.row.title:scope.row.enTitle }}
                  </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP" />
                <el-table-column :show-overflow-tooltip="true" prop="city" :label="$t('view.userCenter.ipSource')" />
                <el-table-column prop="browser" :label="$t('view.userCenter.browser')" />
                <el-table-column prop="time" :label="$t('view.userCenter.time')" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                >
                  <template slot="header">
                    <div style="display:inline-block;float: right;cursor: pointer" @click="init">{{ $t('public.createTime') }}<i class="el-icon-refresh" style="margin-left: 40px" /></div>
                  </template>
                  <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('public.op')" align="center">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-search" size="mini" type="primary" @click="open(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <el-pagination
                :total="total"
                :current-page="page + 1"
                style="margin-top: 8px;"
                layout="total, prev, pager, next, sizes"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('view.userCenter.details')"
      :visible.sync="dialogVisible"
      width="30%">

      <el-collapse accordion v-model="detailsActiveName">

        <el-collapse-item :title="$t('view.userCenter.requestParam')" name="param">
          <el-input
            type="textarea"
            :rows="3"
            disabled
            v-model="param">
          </el-input>
        </el-collapse-item>
        <el-collapse-item :title="$t('view.userCenter.returnVal')"  name="body">
          <el-input
            type="textarea"
            :rows="3"
            disabled
            v-model="body">
          </el-input>
        </el-collapse-item>
        <el-collapse-item title="User Agent" name="UserAgent">
          <el-input
            type="textarea"
            :rows="3"
            disabled
            v-model="userAgent">
          </el-input>
        </el-collapse-item>
      </el-collapse>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
    <el-button type="primary" @click="dialogVisible = false">{{ $t('public.confirm') }}</el-button>
  </span>
    </el-dialog>
    <updateEmail ref="email" @setEmail="setEmail" :email="user.email" />
    <updatePass ref="pass" />
    <updatePhone ref="phone" :phone="user.phone" @setPhone="setPhone"/>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import updatePass from './center/updatePass'
import updateEmail from './center/updateEmail'
import updatePhone from './center/updatePhone'
import { getAccessToken } from '@/utils/accessToken'
import store from '@/store'
import { isPhone } from '@/utils/validate'
import crud from '@/mixins/crud'
import { edit, getUserInfo } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import { baseURL } from '@/config/setting.config'
import HeyUI from "heyui";
export default {
  name: 'Center',
  components: { updatePass, updateEmail, updatePhone,  myUpload },
  mixins: [crud],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      baseURL: baseURL,
      param: null,
      body: null,
      userAgent: null,
      clazz: null,
      method: null,
      dialogVisible: false,
      baseApi: '',
      updateAvatarApi: '',
      user: {},
      modelValue: false,
      Avatar: Avatar,
      activeName: 'first',
      detailsActiveName: 'body',
      loading: false,
      saveLoading: false,
      headers: {
        'Authorization': getAccessToken()
      },
      form: {},
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  created() {
    getUserInfo(getAccessToken()).then((u) => {
      this.form = u.data
      this.user = u.data
    })
  },
  methods: {
    setEmail(email){
      this.form.email = email
      this.user.email = email
    },
    setPhone(phone){
      this.form.phone = phone
      this.user.phone = phone
    },
    open(row){
      this.param = row.param;
      this.body = row.body
      this.userAgent = row.ua
      this.clazz = row.clazz
      this.method = row.method
      this.detailsActiveName = 'body'
      this.dialogVisible = true
    },
    toggleShow() {
      this.modelValue = !this.modelValue
    },

    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.init()
      }
    },
    beforeInit() {
      this.url = '/log'
      return true
    },
    cropUploadSuccess(jsonData, field) {
      if(jsonData.code === 500){
        HeyUI.$Message({
          type:'error',
          text: `服务器保存失败，请重试`,
        })
        return false;
      }
      this.form.avatar = jsonData.data[0].url

      let param = {
        id: this.form.id,
        avatar: this.form.avatar
      }
      store.commit('user/setAvatar',this.form.avatar)
      edit(param).then(() => {
        HeyUI.$Message({
          type:'success',
          text: `头像修改成功`,
        })
      })

    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            let param = {}
            Object.assign(param,this.form)
            delete param.avatar
            edit(param).then(() => {
              HeyUI.$Message({
                type:'success',
                text: `编辑成功`,
              })
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    .vab-remix-icon{
      width: 1em;
      height: 1em;
      color: #999;
    }
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
