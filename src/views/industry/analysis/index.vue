<template>
  <div style="padding: 10px">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="浏览" name="browse">
            <el-tree
              :data="marketGroupData"
              :load="getMarketGroupData"
              :props="defaultProps"
              highlight-current
              :expand-on-click-node="true"
              style="height: 650px; overflow: scroll"
              lazy
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                  <img
                    v-if="!data.isLeaf"
                    style="width: 16px"
                    :src="'//cdn.base.yuxuan66.com/eve/icon/' + data.iconFile"
                    alt=""
                  />
                  <img
                    v-else
                    :src="`https://imageserver.eveonline.com/Type/${data.id}_32.png`"
                    style="width: 16px"
                    alt=""
                  />
                  <span style="margin-left: 2px; vertical-align: top">
                    {{ node.label }}
                  </span>
                </span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="收藏" name="quickBar">收藏</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-if="typeId" :span="20">
        <el-card shadow="never" body-style="padding: 0">
          <img
            :src="`https://imageserver.eveonline.com/Type/${typeId}_64.png`"
            style="width: 64px; display: inline-block"
            alt=""
          />
          <div class="type-info">
            <span class="title">{{ typeInfo.chainGrouping }}</span>
            <span class="name">
              {{ typeInfo.type.name }} - {{ typeInfo.type.nameEn }} -
              {{ typeInfo.type.id }}
            </span>
          </div>
        </el-card>
        <el-tabs type="border-card">
          <el-tab-pane label="制造成本">
            <div v-if="!typeInfo.isMake">该物品无法制造</div>
            <div v-else>
              <el-row>
                <el-col :span="8">
                  <div>
                    <span>材料</span>
                    <el-input-number
                      v-model="setting.me"
                      controls-position="right"
                      :max="10"
                      :min="0"
                      style="margin-left: 10px; width: 85px"
                      size="mini"
                    ></el-input-number>
                    <el-progress
                      style="
                        width: 200px;
                        display: inline-block;
                        margin-left: 10px;
                        text-align: center;
                      "
                      :format="formatME"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="setting.me * 10"
                    ></el-progress>
                  </div>
                  <div>
                    <span>时间</span>
                    <el-input-number
                      v-model="setting.te"
                      controls-position="right"
                      :max="20"
                      :min="0"
                      style="margin-left: 10px; width: 85px"
                      size="mini"
                    ></el-input-number>
                    <el-progress
                      style="
                        width: 200px;
                        display: inline-block;
                        margin-left: 10px;
                        text-align: center;
                      "
                      :format="formatTE"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="setting.te * 5"
                    ></el-progress>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span>流程</span>
                    <el-input-number
                      v-model="setting.line"
                      controls-position="right"
                      :max="typeInfo.maxLimit"
                      :min="1"
                      style="margin-left: 10px; width: 85px"
                      size="mini"
                    ></el-input-number>
                    <el-progress
                      style="
                        width: 200px;
                        display: inline-block;
                        margin-left: 10px;
                        text-align: center;
                      "
                      :format="formatLine"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="(setting.line / typeInfo.maxLimit) * 100"
                    ></el-progress>
                  </div>
                  <div>
                    <span>并行</span>
                    <el-input-number
                      v-model="setting.parallel"
                      controls-position="right"
                      :max="20"
                      :min="0"
                      style="margin-left: 10px; width: 285px"
                      size="mini"
                    ></el-input-number>
                  </div>
                </el-col>
                <el-col :span="6">
                  <el-button
                    style="margin-top: 10px"
                    type="primary"
                    icon="el-icon-plus"
                  >
                    加入制造队列(当前已规划0条)
                  </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button style="margin-top: 10px" type="primary">
                    计算制造价格
                  </el-button>
                </el-col>
              </el-row>
              <el-row style="margin-top: 5px">
                制造星系：
                <el-select
                  :loading="searchLoading"
                  :remote-method="getStartSolarSystem"
                  filterable
                  remote
                  placeholder="制造星系"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in starList"
                    :key="item.value"
                    :label="item.display"
                    :value="item.value"
                  ></el-option>
                </el-select>
                制造税率：
                <el-input
                  v-model="blurry"
                  clearable
                  placeholder="输入税率"
                  style="width: 100px; margin-left: 10px"
                  class="filter-item"
                />
                制造建筑：
                <el-input
                  v-model="blurry"
                  clearable
                  placeholder="输入税率"
                  style="width: 100px; margin-left: 10px"
                  class="filter-item"
                />
                制造加成：
                <el-input
                  v-model="blurry"
                  clearable
                  placeholder="输入税率"
                  style="width: 100px; margin-left: 10px"
                  class="filter-item"
                />
                反应建筑：
                <el-input
                  v-model="blurry"
                  clearable
                  placeholder="输入税率"
                  style="width: 100px; margin-left: 10px"
                  class="filter-item"
                />
                反应加成：
                <el-input
                  v-model="blurry"
                  clearable
                  placeholder="输入税率"
                  style="width: 100px; margin-left: 10px"
                  class="filter-item"
                />
              </el-row>

              <el-row>
                <el-col :span="10">

                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史价格">历史价格</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-else :span="20">
        <span
          style="
            display: block;
            width: 100%;
            margin: 200px auto auto;
            font-size: 30px;
            color: #999;
            text-align: center;
          "
        >
          请先选择商品
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { get } from '@/api/crud/crud'
  import Vue from 'vue'

  export default {
    name: 'Index',
    data() {
      return {
        starList:[],
        setting: {},
        activeName: 'browse',
        marketGroupData: [],
        typeId: 0,
        typeInfo: {},
        searchLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf',
        },
      }
    },
    methods: {
      formatLine(percentage) {
        const maxLimit = this.typeInfo.maxLimit
        return Math.ceil((percentage * maxLimit) / 100) + '/' + maxLimit
      },
      formatTE(percentage) {
        return percentage / 5 + '/20'
      },
      formatME(percentage) {
        return percentage / 10 + '/10'
      },
      getStartSolarSystem(query) {
        if (query !== '') {
          this.searchLoading = true
          t('flagShip/getSolarSystem/' + query).then(res => {
          })
        }
      },
      getMarketGroupData(node, resolve) {
        let pid = 0
        if (typeof node === 'object') {
          pid = node.data.id || 0
        }
        let param = {
          pid: pid,
          blurry: this.blurry,
          hasType: node.data.hasType,
        }
        if (typeof node !== 'object') {
          if (this.blurry !== '') {
            delete param.pid
          }
        }
        get('/analysis/queryMarketGroup', param).then((res) => {
          if (pid === 0) {
            this.marketGroupData = res.data
          } else {
            resolve(res.data)
          }
        })
      },
      handleNodeClick(data) {
        if (data.isLeaf) {
          t('/analysis/getTypeInfo', { id: data.id }).then((res) => {
            this.typeId = data.id
            this.typeInfo = res.data
            this.setting = {
              me: 10,
              te: 20,
              line: 1,
              parallel: 1,
            }
          })
        }
      },
    },
  }
</script>
<style>
  .el-progress-bar__inner {
    text-align: center;
  }
</style>
<style scoped lang="scss">
  .type-info {
    display: inline-block;
    margin-left: 20px;
    color: $base-color-default;
    position: absolute;
    top: 10px;

    span {
      display: block;
    }

    .name {
      margin-top: 5px;
      font-size: 20px;
    }
  }
</style>
