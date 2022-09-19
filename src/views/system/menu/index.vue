<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          :placeholder="$t('crud.fuzzySearch')"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker
          v-model="query.createTime"
          class="date-item"
        />
        <rr-operation />
      </div>
      <crud-operation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getMenus"
      :data="crud.data"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('view.menuMan.title')"
        width="125px"
        prop="title"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('view.menuMan.enTitle')"
        width="125px"
        prop="enTitle"
      />
      <el-table-column prop="icon" :label="$t('view.menuMan.icon')" align="center" width="60px">
        <template slot-scope="scope">
          <vab-remix-icon
            :icon-class="scope.row.icon ? scope.row.icon : ''"
            class="vab-remix-icon"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" :label="$t('view.menuMan.sort')">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="permission"
        :label="$t('view.menuMan.permissionMark')"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="component"
        :label="$t('view.menuMan.component')"
      />
      <el-table-column prop="isLink" :label="$t('view.menuMan.link')" width="115px">
        <template slot-scope="scope">
          {{  $yesOrNo(scope.row.isLink) }}
        </template>
      </el-table-column>
      <el-table-column prop="cache" :label="$t('view.menuMan.cache')" width="75px">
        <template slot-scope="scope">
          {{  $yesOrNo(scope.row.cache) }}

        </template>
      </el-table-column>
      <el-table-column prop="hidden" :label="$t('view.menuMan.visible')" width="75px">
        <template slot-scope="scope">
          {{  $yesOrNo(!scope.row.hidden) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('public.createTime')" width="150px" />
      <el-table-column :label="$t('public.op')" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :msg="$t('view.menuMan.delTips')"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="700px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="130px"
      >
        <el-form-item :label="$t('view.menuMan.menuType')" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 228px">
            <el-radio-button label="0">{{$t('view.menuMan.catalog')}}</el-radio-button>
            <el-radio-button label="1">{{ $t('view.menuMan.menu') }}</el-radio-button>
            <el-radio-button label="2">{{ $t('view.menuMan.button') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          :label="$t('view.menuMan.icon')"
          prop="icon"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              style="width: 499px"
              :placeholder="$t('view.menuMan.selectIcon')"
              readonly
            >
              <vab-remix-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="vab-remix-icon"
                style="width: 16px; height: 30px"
              />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          :label="$t('view.menuMan.linkMenu')"
          prop="isLink"
        >
          <el-radio-group v-model="form.isLink" size="mini" style="width: 185px;">

            <el-radio-button label="true">{{$t('public.yes')}}</el-radio-button>
            <el-radio-button label="false">{{$t('public.no')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() === '1'"
          :label="$t('view.menuMan.cache')"
          prop="cache"
        >
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">{{$t('public.yes')}}</el-radio-button>
            <el-radio-button label="false">{{$t('public.no')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          :label="$t('view.menuMan.visible')"
          prop="hidden"
        >
          <el-radio-group v-model="form.hidden" size="mini" style="width: 185px">
            <el-radio-button label="false">{{$t('public.yes')}}</el-radio-button>
            <el-radio-button label="true">{{$t('public.no')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          :label="$t('view.menuMan.title')"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :style="
              form.type.toString() === '0' ? 'width: 499px' : 'width: 185px'
            "
            :placeholder="$t('view.menuMan.title')"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          :label="$t('view.menuMan.enTitle')"
          prop="enTitle"
        >
          <el-input
            v-model="form.enTitle"
            :style="
              form.type.toString() === '0' ? 'width: 499px' : 'width: 185px'
            "
            :placeholder="$t('view.menuMan.enTitle')"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() === '2'"
          :label="$t('view.menuMan.buttonName')"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :placeholder="$t('view.menuMan.buttonName')"
            style="width: 185px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '0'"
          :label="$t('view.menuMan.permissionMark')"
          prop="permission"
        >
          <el-input
            v-model="form.permissionStr"
            :disabled="form.isLink.toString() === 'true'"
            :placeholder="$t('view.menuMan.permissionMark')"
            style="width: 185px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          :label="$t('view.menuMan.routePath')"
          prop="path"
        >
          <el-input
            v-model="form.path"
            :label="$t('view.menuMan.routePath')"
            style="width: 185px"
          />
        </el-form-item>
        <el-form-item  :label="$t('view.menuMan.sort')" prop="menuSort">
          <el-input-number
            v-model.number="form.sort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 185px"
          />
        </el-form-item>
        <el-form-item
          v-show="
            form.isLink.toString() !== 'true' && form.type.toString() === '1'
          "
          :label="$t('view.menuMan.componentName')"
          prop="name"
        >
          <el-input
            v-model="form.name"
            style="width: 185px"
            :label="$t('view.menuMan.componentName')"
          />
        </el-form-item>
        <el-form-item
          v-show="
            form.isLink.toString() !== 'true' && form.type.toString() === '1'
          "
          :label="$t('view.menuMan.component')"
          prop="component"
        >
          <el-input
            v-model="form.component"
            style="width: 185px"
            :label="$t('view.menuMan.component')"
          />
        </el-form-item>
        <el-form-item :label="$t('view.menuMan.superiorMenu')" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :load-options="loadMenus"
            style="width: 499px"
            :placeholder="$t('view.menuMan.superiorMenu')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{$t('public.cancel')}}</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
        >
          {{$t('public.confirm')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import crudMenu from '@/api/system/menu'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from '@/components/IconSelect'
  import UdOperation from '@/components/Crud/UD.operation'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import DateRangePicker from '@/components/DateRangePicker'
  import { get } from '@/api/crud/crud'
  import i18n from "@/plugins/i18n";
  const defaultForm = {
    id: null,
    title: null,
    sort: 999,
    path: null,
    component: null,
    name: null,
    isLink: false,
    roles: [],
    pid: 0,
    icon: null,
    cache: false,
    hidden: false,
    type: 0,
    permissionStr: null,
  }
  export default {
    name: 'Menu',
    cruds() {
      return CRUD({ title: 'view.menuMan.crudTitle', url: 'menu', crudMethod: crudMenu })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: {
      RrOperation,
      CrudOperation,
      UdOperation,
      DateRangePicker,
      Treeselect,
      IconSelect,
    },
    watch:{
      'form.type'(){
        try{
          this.$refs.form.clearValidate()
        }catch (e){}
      }
    },
    computed:{
      rules(){
        return{
          path: [
            { required: true, message: i18n.t('view.menuMan.error.path'), trigger: 'blur' }
          ],
          title: [
            { required: true, message: i18n.t('view.menuMan.error.title'), trigger: 'blur' }
          ],
          enTitle: [
            { required: true, message: i18n.t('view.menuMan.error.enTitle'), trigger: 'blur' }
          ],
          sort: [
            { required: true, message: i18n.t('view.menuMan.error.sort'), trigger: 'blur' }
          ],
          pid: [
            { required: true, message: i18n.t('view.menuMan.error.superiorMenu'), trigger: 'blur' }
          ],
          component: [
            { required: true, message: i18n.t('view.menuMan.error.component'), trigger: 'blur' }
          ],
        }
      }
    },
    data() {
      return {
        permission: {
          add: 'menu:add',
          edit: 'menu:edit',
          del: 'menu:del',
        },
          menus: [],
      }
    },
    methods: {
      // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
        this.menus = []
        if (form.id != null) {
          if (form.pid === null) {
            form.pid = 0
          }
          this.queryMenuTree(form.id)
        } else {
          this.menus.push({ id: 0, label: this.$t('view.menuMan.topMenu'), children: null })
        }
      },
      queryMenuTree(id) {
        let that = this
        get('/menu/queryMenuTree', { id: id }).then((res) => {
          const date = res.data
          this.buildMenu(date)
          this.menus = [{ id: 0, label: that.$t('view.menuMan.topMenu'), children: date }]
        })
      },
      buildMenu(depts) {
        let that = this
        depts.forEach((data) => {
          data.label = that.$i18n.locale === 'zh' ? data.title: data.enTitle
          data.isLeaf = data.hasChildren
          if (data.children) {
            this.buildMenu(data.children)
          }
          if (data.hasChildrenData && !data.children) {
            data.children = null
          }
        })
      },
      loadMenus({ action, parentNode, callback }) {
        let that = this
        if (action === LOAD_CHILDREN_OPTIONS) {
          get('/menu', { pid: parentNode.id }).then((res) => {
            parentNode.children = res.data.content.map(function (obj) {
              obj.label = that.$i18n.locale === 'zh' ? obj.title : obj.enTitle
              if (obj.hasChildren) {
                obj.children = null
              }
              return obj
            })
            setTimeout(() => {
              callback()
            }, 100)
          })
        }
      },
      getMenus(tree, treeNode, resolve) {
        const params = { pid: tree.id }
        setTimeout(() => {
          get('/menu', params).then((res) => {
            resolve(res.data.content)
          })
        }, 100)
      },
      // 选中图标
      selected(name) {
        this.form.icon = name
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .vue-treeselect__control,
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
