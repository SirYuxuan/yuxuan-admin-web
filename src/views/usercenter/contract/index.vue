<template>
  <div style="padding: 0 10px 0 10px">
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="monitorView"
      title="设置监控条件"
      width="500px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="定价类型" prop="title">
          <el-radio v-model="form.priceType" :label="1">收单</el-radio>
          <el-radio v-model="form.priceType" :label="2">卖单</el-radio>
        </el-form-item>
        <el-form-item label="自主定价" prop="title">
          <el-radio v-model="form.usePrice" :label="1">使用</el-radio>
          <el-radio v-model="form.usePrice" :label="2">不适用</el-radio>
        </el-form-item>
        <el-form-item label="通知比例" prop="title">
          <el-input-number
            v-model="form.min"
            :min="1"
            :max="100"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="监控范围" prop="title">
          <el-select v-model="form.range" placeholder="请选择">
            <el-option :key="1" label="全部可见" value="1" />
            <el-option :key="2" label="只看联盟" value="2" />
            <el-option :key="3" label="只看公开" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知方式" prop="title">
          <el-checkbox v-model="checked">邮箱通知</el-checkbox>
          <el-checkbox v-model="checked">QQ消息</el-checkbox>
          <el-checkbox v-model="checked">游戏邮件</el-checkbox>
          <el-checkbox v-model="checked">游戏内弹出窗口</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="monitorView = false">取消</el-button>
        <el-button type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <el-tabs>
      <el-tab-pane label="我的合同">我的合同</el-tab-pane>
      <el-tab-pane label="合同监控">
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              placeholder="输入物品名称，位置搜索"
              style="width: 250px; margin-left: 10px"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rr-operation />
          </div>
          <crud-operation :permission="permission">
            <template slot="left">
              <el-button
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-setting"
                @click="setMonitorView()"
              >
                监控条件设置
              </el-button>
            </template>
          </crud-operation>
        </div>

        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          class="rounded-head"
          @sort-change="crud.toSort"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            prop="title"
            label="所属角色"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <img
                style="vertical-align: middle"
                :src="`https://images.evetech.net/characters/${scope.row.characterId}/portrait?size=32`"
                alt=""
              />
              <span style="margin-left: 10px">
                {{ scope.row.characterName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="所属账号" />
          <el-table-column prop="solarSystemName" sortable label="所在星系" />

          <el-table-column prop="planetType" sortable label="行星类型" />
          <el-table-column prop="produce" sortable label="产出物" />
          <el-table-column prop="numPins" sortable label="设施数量" />
          <el-table-column prop="upgradeLevel" sortable label="基地等级" />
          <el-table-column prop="lastUpdate" sortable label="更新时间" />
        </el-table>
        <pagination />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  let defaultForm = {
    title: null,
    url: null,
    localPath: null,
  }
  export default {
    name: 'Index',
    components: {
      RrOperation,
      CrudOperation,
      Pagination,
    },
    data() {
      return {
        rules: [],
        form: {
          min: 90,
          priceType: 1,
          usePrice: 1
        },
        monitorView: false,
        permission: {
          add: ['none'],
          edit: ['none'],
          del: ['none'],
        },
      }
    },
    // eslint-disable-next-line vue/order-in-components
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: 'SDE',
        url: '/accountPi',
        sort: ['createTime,desc'],
      })
    },
    methods: {
      setMonitorView() {
        this.monitorView = true
      },
    },
  }
</script>

<style scoped></style>
