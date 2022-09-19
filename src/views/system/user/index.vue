<template>
  <div class="app-container">
    <el-row :gutter="20">

      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input
            v-model="query.blurry"
            clearable
            size="mini"
            :placeholder="$t('view.userManager.queryTips')"
            style="width: 250px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <rr-operation/>
        </div>
        <crud-operation :permission="permission"/>
      </div>

      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column show-overflow-tooltip type="selection"/>
        <el-table-column
          show-overflow-tooltip
          prop="username"
          :label="$t('view.userManager.userName')"
        />
        <el-table-column show-overflow-tooltip prop="nickName"  :label="$t('view.userManager.nickName')"/>
        <el-table-column show-overflow-tooltip prop="sex"  :label="$t('view.userManager.sex')">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 0">{{ $t('public.male') }}</span>
            <span v-else-if="scope.row.sex === 1">{{ $t('public.female') }}</span>
            <span v-else>{{ $t('public.unknown') }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="phone"  :label="$t('view.userManager.phone')"/>
        <el-table-column show-overflow-tooltip prop="email"  :label="$t('view.userManager.email')"/>
        <el-table-column  :label="$t('view.userManager.status')" align="center" prop="enabled">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 0" type="success" effect="dark">
              {{ $t('user.success') }}
            </el-tag>
            <el-tag v-if="scope.row.status === 1" type="danger" effect="dark">
              {{ $t('user.danger') }}
            </el-tag>
            <el-tag v-if="scope.row.status === 2" type="warning" effect="dark">
              {{ $t('user.warning') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="loginTime"  :label="$t('view.userManager.loginTime')"/>
        <el-table-column show-overflow-tooltip prop="loginCity"  :label="$t('view.userManager.loginCity')"/>
        <el-table-column show-overflow-tooltip prop="createTime"  :label="$t('public.createTime')"/>
        <el-table-column show-overflow-tooltip  :label="$t('public.op')" width="115">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination/>
    </el-row>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="690px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        style="padding-right: 0"
        label-width="92px"
        label-position="right"
      >
        <el-form-item :label="$t('view.userManager.userName')" prop="username">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item :label="$t('view.userManager.phone')" prop="phone">
          <el-input v-model.number="form.phone"/>
        </el-form-item>
        <el-form-item :label="$t('view.userManager.nickName')" prop="nickName">
          <el-input v-model="form.nickName"/>
        </el-form-item>
        <el-form-item :label="$t('view.userManager.email')" prop="email">
          <el-input v-model="form.email"/>
        </el-form-item>

        <el-form-item :label="$t('view.userManager.sex')">
          <el-radio-group v-model="form.sex" style="width: 200px">
            <el-radio :label="0">{{$t('public.male')}}</el-radio>
            <el-radio :label="1">{{$t('public.female')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('view.userManager.status')">
          <el-radio-group v-model="form.status">
            <el-radio :key="0" :label="0">{{ $t('user.success') }}</el-radio>
            <el-radio :key="1" :label="1">{{ $t('user.danger') }}</el-radio>
            <el-radio :key="2" :label="2">{{ $t('user.warning') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 0" :label="$t('view.userManager.role')" prop="roles">
          <el-select
            v-model="roleDatas"
            style="width: 465px"
            multiple
            :placeholder="$t('public.pleaseSelect')"
            @remove-tag="deleteTag"
            @change="changeRole"
          >
            <el-option
              v-for="item in roles"
              :key="item.name"
              :label="$i18n.locale === 'zh' ? item.name : item.enName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('public.cancel') }}</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
        >
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import i18n from '@/plugins/i18n'
import {get} from '@/api/crud/crud'
import CRUD, {presenter, header, form, crud} from '@/components/Crud/crud'
import CrudOperation from '@/components/Crud/CRUD.operation'
import RrOperation from '@/components/Crud/RR.operation'
import Pagination from '@/components/Crud/Pagination'
import UdOperation from '@/components/Crud/UD.operation'
import {isEmail, isPhone} from '@/utils/validate'
import crudUser from '@/api/system/user'

let defaultForm = {
  sex: 0,
  status: 0,
  id: null,
  username: null,
  phone: null,
  nickName: null,
  email: null,
  loginCity:null,
  loginIp: null,
}
let userRoles = []
const validUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('view.userManager.error.username')))
  } else {
    valid(callback, 'username', value, i18n.t('view.userManager.error.usernameUse'))
  }
}
const validEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('view.userManager.error.email')))
  } else if (!isEmail(value)) {
    callback(new Error(i18n.t('view.userManager.error.emailError')))
  } else {
    valid(callback, 'email', value, i18n.t('view.userManager.error.emailUse'))
  }
}
export default {
  name: 'UserManagement',
  components: {
    RrOperation,
    CrudOperation,
    Pagination,
    UdOperation,
  },
  cruds() {
    return CRUD({title: 'view.userManager.title', url: 'user', crudMethod: crudUser})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  computed:{
    rules(){
      return {
        roles: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.roleDatas.length === 0) {
                callback(new Error(i18n.t('view.userManager.error.role')))
              } else {
                callback()
              }
            },
          },
        ],
        username: [
          {required: true, trigger: 'blur', validator: validUsername},
        ],
        nickName: [
          {required: true, message: i18n.t('view.userManager.error.nickName'), trigger: 'blur'},
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            validator: validEmail,
          },
        ],
      }
    }
  },
  data() {
    const valid = (callback, field, value, msg) => {
      get('/user/checkExist', {
        field: field,
        data: value,
        type: this.form.id ? 'edit' : 'add',
      })
        .then((res) => {
          if (res.data) {
            callback(new Error(msg))
          } else {
            callback()
          }
        })
    }


    return {
      permission: {
        add: ['user:add'],
        edit: ['user:edit'],
        del: ['user:del'],
      },
      blurry: '',
      roles: [],
      depts: [],
      deptData: [],
      roleDatas: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
      },
    }
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：手机号后6位'
    this.getRoles()
  },
  methods: {
    getRoles() {
      get('/role/queryAll', {}).then((res) => {
        this.roles = res.data
      })
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.roles = userRoles
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.roleDatas = []
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.roleDatas = []
      userRoles = []
      const _this = this
      form.roles.forEach(function (role, index) {
        _this.roleDatas.push(role.id)
        const rol = {id: role.id}
        userRoles.push(rol)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function (data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function (data, index) {
        const role = {id: data}
        userRoles.push(role)
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
