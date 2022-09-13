<template>
  <div id="app">
    <header class="el-header" style="height: 60px">4H市场销量</header>
    <div class="main">
      <el-row :gutter="20">
        <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
          <div class="head-container">
            <el-input
              v-model="blurry"
              clearable
              size="small"
              placeholder="输入类型名称搜索"
              prefix-icon="el-icon-search"
              class="filter-item"
              @input="getMarketGroupData"
            />
          </div>
          <el-tree
            :data="marketGroupData"
            :load="getMarketGroupData"
            :props="defaultProps"
            highlight-current
            :expand-on-click-node="false"
            style="height: 650px; overflow: scroll"
            lazy
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <img
                  style="width: 16px"
                  :src="'//cdn.base.yuxuan66.com/eve/icon/' + data.iconFile"
                  alt=""
                />
                <span style="margin-left: 2px; vertical-align: top">
                  {{ node.label }}
                </span>
              </span>
            </span>
          </el-tree>
        </el-col>
        <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input
                v-model="query.blurry"
                clearable
                size="mini"
                placeholder="输入名称搜索"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
              <rr-operation />
            </div>
            <crud-operation :permission="permission">
              <template slot="left">
                <el-checkbox-group v-model="query.meta">
                  <el-checkbox label="全部数据" @change="all" />
                  <el-checkbox label="一级科技" @change="checkBox" />
                  <el-checkbox label="二级科技" @change="checkBox" />
                  <el-checkbox label="故事线" @change="checkBox" />
                  <el-checkbox label="势力" @change="checkBox" />
                  <el-checkbox label="官员" @change="checkBox" />
                  <el-checkbox label="死亡空间" @change="checkBox" />
                  <el-checkbox label="三级科技" @change="checkBox" />
                  <el-checkbox label="高级" @change="checkBox" />
                  <el-checkbox label="限时提供" @change="checkBox" />
                  <el-checkbox label="势力建筑" @change="checkBox" />
                  <el-checkbox label="二级科技建筑" @change="checkBox" />
                  <el-checkbox label="一级科技建筑" @change="checkBox" />
                </el-checkbox-group>
              </template>
            </crud-operation>
          </div>

          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            @sort-change="crud.toSort"
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column
              show-overflow-tooltip
              prop="typeId"
              label="物品名称"
              min-width="200"
              sortable="custom"
            >
              <template slot-scope="scope">
                <img
                  style="vertical-align: middle"
                  :src="`https://images.evetech.net/Type/${scope.row.typeId}_32.png`"
                  alt=""
                />
                <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              prop="sellPrice"
              label="本地卖单"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.sellPrice) }} ISK
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="buyPrice"
              label="本地收单"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.buyPrice) }} ISK
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="sellNum"
              label="卖单数量"
              min-width="100"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.sellNum) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="buyNum"
              label="收单数量"
              min-width="100"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.buyNum) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="`order`"
              label="本月成交"
              min-width="100"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.order) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="highest"
              label="成交高位"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.highest) }} ISK
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="lowest"
              label="成交低位"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ toThousands(scope.row.lowest) }} ISK
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jita"
              label="吉他卖单"
              min-width="200"
              sortable="custom"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.jitaSellPrice > scope.row.sellPrice">
                  <span style="color: green">
                    {{ toThousands(scope.row.jitaSellPrice) }} ISK ,{{
                      scope.row.jitaSellPrice === 0
                        ? 100
                        : Math.floor(
                            (scope.row.sellPrice / scope.row.jitaSellPrice) *
                              100
                          )
                    }}
                    %
                  </span>
                </div>
                <div v-else>
                  <span style="color: red">
                    {{ toThousands(scope.row.jitaSellPrice) }} ISK ,{{
                      scope.row.jitaSellPrice === 0
                        ? 100
                        : Math.floor(
                            (scope.row.sellPrice / scope.row.jitaSellPrice) *
                              100
                          )
                    }}
                    %
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jitaBuyPrice"
              label="吉他收单"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span style="color: green">
                  {{ toThousands(scope.row.jitaBuyPrice) }} ISK
                </span>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  Array.prototype.indexOf = function (val) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === val) return i
    }
    return -1
  }
  Array.prototype.remove = function (val) {
    const index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1)
    }
  }
  import { get } from '../../api/crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import UdOperation from '@/components/Crud/UD.operation'
  import { toThousands } from '@/utils/common'
  import Pagination from '@/components/Crud/Pagination'
  export default {
    cruds() {
      return CRUD({ title: 'SDE', url: 'market', crudMethod: null })
    },
    mixins: [presenter(), header(), form({}), crud()],
    components: {
      RrOperation,
      CrudOperation,
      Pagination,
    },
    data() {
      return {
        query: {
          meta: ['全部数据'],
        },
        lastTime: '',
        permission: {
          add: ['none'],
          edit: ['none'],
          del: ['none'],
        },
        blurry: '',
        roles: [],
        depts: [],
        marketGroupData: [],
        roleDatas: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf',
        },
      }
    },
    created() {
      this.crud.optShow.download = false
    },
    methods: {
      [CRUD.HOOK.beforeRefresh]() {
        this.crud.query['meta'] = this.query.meta
      },
      all(val){
        if(val){
          this.query.meta = ['全部数据']
        }else{
          this.query.meta = []
        }
      },
      checkBox(val) {
        this.query.meta.remove('全部数据')
      },
      toThousands(num) {
        return toThousands(num)
      },
      handleNodeClick(data) {
        this.crud.query.marketGroupId = data.id
        this.crud.toQuery()
      },
      getMarketGroupData(node, resolve) {
        let pid = 0
        if (typeof node === 'object') {
          pid = node.data.id || 0
        }
        let param = {
          pid: pid,
          blurry: this.blurry,
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
    },
  }
</script>

<style scoped>
  .result {
    color: red;
  }

  .row {
    line-height: 30px;
    height: 41px;
  }

  .main {
    background-color: #e9eef3;
    color: #333;
    padding: 20px;
  }

  .el-header {
    background-color: #b3c0d1;
    color: #333;
    letter-spacing: 10px;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    line-height: 60px;
  }
</style>
