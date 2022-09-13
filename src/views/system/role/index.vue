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
          placeholder="输入名称或者描述搜索"
          style="width: 200px"
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
            <span class="role-span">角色列表</span>
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
            <el-table-column prop="name" label="名称" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              label="描述"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="165px"
              prop="createTime"
              label="创建日期"
            />
            <el-table-column
              label="操作"
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
              content="选择指定角色分配菜单"
              placement="top"
            >
              <span class="role-span">菜单分配</span>
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
              保存
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
          />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px" />
        </el-form-item>
        <el-form-item label="描述信息" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 380px"
            rows="5"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
        >
          确认
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
  const defaultForm = {
    id: null,
    name: null,
    remark: null,
  }
  export default {
    name: 'Role',
    cruds() {
      return CRUD({ title: '角色', url: 'role', crudMethod: crudRole })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: {
      RrOperation,
      CrudOperation,
      UdOperation,
      DateRangePicker,
      Pagination,
    },
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
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
            this.$baseNotify('保存成功','操作提示')
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