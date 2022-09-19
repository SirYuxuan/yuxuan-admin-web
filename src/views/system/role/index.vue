<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          size="small"
          clearable
          :placeholder="$t('crud.queryTips')"
          style="width: 250px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker
          v-model="query.createTime"
          class="date-item"
        />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">{{ $t('view.roleManager.listTitle') }}</span>
          </div>
          <el-table
            ref="table"
            v-loading="crud.loading"
            highlight-current-row
            style="width: 100%"
            :data="crud.data"
            @selection-change="crud.selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" :label="$t('view.roleManager.roleName')">
              <template slot-scope="scope">
                {{ $i18n.locale === 'zh' ? scope.row.name : scope.row.enName }}
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              :label="$t('view.roleManager.remark')"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="165px"
              prop="createTime"
              :label="$t('public.createTime')"
            />
            <el-table-column
              :label="$t('public.op')"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <udOperation :data="scope.row" :permission="permission" />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('view.roleManager.selectAssign')"
              placement="top"
            >
              <span class="role-span"> {{ $t('view.roleManager.menuAssign') }}</span>
            </el-tooltip>
            <el-button
              v-auth="'role:edit'"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >
              {{ $t('public.save') }}
            </el-button>
          </div>
          <el-tree
            ref="menu"
            lazy
            :data="menus"
            :default-checked-keys="menuIds"
            :load="getMenuDatas"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="menuChange"
          >
            <template slot-scope="{node, data}">
              {{ $i18n.locale === 'zh' ? data.title : data.enTitle }}
            </template>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="590px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-form-item :label="$t('view.roleManager.roleName')" prop="name">
          <el-input v-model="form.name" style="width: 380px" />
        </el-form-item>
        <el-form-item :label="$t('view.roleManager.enName')" prop="enName">
          <el-input v-model="form.enName" style="width: 380px" />
        </el-form-item>
        <el-form-item :label="$t('view.roleManager.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 380px"
            rows="5"
            type="textarea"
          />
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
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import crudRole from '@/api/system/role'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import UdOperation from '@/components/Crud/UD.operation'
  import DateRangePicker from '@/components/DateRangePicker'
  import Pagination from '@/components/Crud/Pagination'
  import { get } from '@/api/crud/crud'
  import i18n from '@/plugins/i18n'
  const defaultForm = {
    id: null,
    name: null,
    remark: null,
  }
  export default {
    name: 'Role',
    cruds() {
      return CRUD({ title: 'view.roleManager.title', url: 'role', crudMethod: crudRole })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: {
      RrOperation,
      CrudOperation,
      UdOperation,
      DateRangePicker,
      Pagination,
    },
    computed:{
      rules(){
        return{
          name: [
            { required: true, message: i18n.t('view.roleManager.error.name'), trigger: 'blur' }
          ],
          enName: [
            { required: true, message: i18n.t('view.roleManager.error.enName'), trigger: 'blur' }
          ]
        }
      }
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'title',
          isLeaf: 'hasChildrenData',
        },
        permission: {
          add: 'role:add',
          edit: 'role:edit',
          del: 'role:del',
        },
        menuIds: [],
        menus: [],
        showButton: false,
        menuLoading: false,
      }
    },
    methods: {
      getMenuDatas(node, resolve) {
        setTimeout(() => {
          get('/menu', { pid: node.data.id ? node.data.id : 0 }).then(
            (res) => {
              resolve(res.data.content)
            }
          )
        }, 100)
      },
      saveMenu() {
        this.menuLoading = true
        const role = { id: this.currentId, menus: [] }
        // 得到已选中的 key 值
        this.menuIds.forEach(function (id) {
          const menu = { id: id }
          role.menus.push(menu)
        })
        crudRole
          .editMenu(role)
          .then(() => {
            this.$baseNotify(i18n.t('public.saveSuccess'),i18n.t('public.tips'))
            this.menuLoading = false
            this.update()
          })
          .catch((err) => {
            this.menuLoading = false
          })
      },
      menuChange(menu) {
        // 获取该节点的所有子节点，id 包含自身
        get('/menu/child', { id: menu.id }).then((childIds) => {
          // 判断是否在 menuIds 中，如果存在则删除，否则添加
          childIds = childIds.data
          if (this.menuIds.indexOf(menu.id) !== -1) {
            for (let i = 0; i < childIds.length; i++) {
              const index = this.menuIds.indexOf(childIds[i])
              if (index !== -1) {
                this.menuIds.splice(index, 1)
              }
            }
          } else {
            for (let i = 0; i < childIds.length; i++) {
              const index = this.menuIds.indexOf(childIds[i])
              if (index === -1) {
                this.menuIds.push(childIds[i])
              }
            }
          }

          this.$refs.menu.setCheckedKeys(this.menuIds)
        })
      },
      // 触发单选
      handleCurrentChange(val) {
        if (val) {
          const _this = this
          // 清空菜单的选中
          this.$refs.menu.setCheckedKeys([])
          // 保存当前的角色id
          this.currentId = val.id
          // 初始化默认选中的key
          this.menuIds = []
          val.menus.forEach(function (data) {
            _this.menuIds.push(data.id)
          })
          this.showButton = true
        }
      },
    },
  }
</script>
