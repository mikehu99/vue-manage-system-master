<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        <el-button type="primary" icon="Delete" :disabled="multiple" @click="spiderUrlByTags">生成译文</el-button>
      </div>

      <!--列表-->
      <el-table :data="tableData" @selection-change="handleSelectionChange" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="sourceNameEn" label="新闻源"></el-table-column>
        <el-table-column prop="linkUrl" label="链接源"></el-table-column>
        <el-table-column prop="mappingId" label="映射"></el-table-column>
        <el-table-column prop="typeName" label="类型"></el-table-column>
        <el-table-column prop="tag" label="标签"></el-table-column>
        <el-table-column label="是否删除" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.delFlag === 1 ? 'danger' : scope.row.delFlag === 0 ? 'success' : ''"
            >
              {{ scope.row.delFlag === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.row)" v-permiss="16">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageNo"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="新闻源">
          <el-select v-model="form.sourceId" placeholder="选择新闻源">
            <el-option v-for="(source) in sourceList" :label="source.nameEn" :value="source.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接源">
          <el-select v-model="form.linkId" placeholder="选择新闻源">
            <el-option v-for="(link) in linkList" :label="link.url" :value="link.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="映射">
          <el-select v-model="form.mappingId" placeholder="映射">
            <el-option v-for="(mapping) in mappingList" :label="mapping.id" :value="mapping.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.typeId" placeholder="类型">
            <el-option v-for="(type) in sourceTypeList" :label="type.typeName" :value="type.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tag"></el-input>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-radio-group v-model="form.delFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="spiderTag">
import {ref, reactive, toRefs, watch} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {saveUpdate, getList} from '@/api/tms/spiderTag';
import { getList as getLinkList } from '@/api/tms/spiderLink';
import { getList as getMappingList } from '@/api/tms/mapping';
import { spiderByTag } from '@/api/tms/spiderUrl';
import { getList as getSourceList } from '@/api/tms/source';
import {getList as getSourceTypeList} from '@/api/tms/sourceType';

const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const data = reactive({
  form: {
    id: undefined,
    sourceId: undefined,
    linkId: undefined,
    mappingId: undefined,
    typeId: undefined,
    tag: '',
    delFlag: 0
  },
  query:{
    pageNo: 1,
    pageSize: 10
  },
  mappingQuery:{
    pageNo: 1,
    pageSize: 100,
    sourceId:undefined,
  },
  linkQuery:{
    pageNo: 1,
    pageSize: 100,
    sourceId:undefined,
  },
});
const { form,query,mappingQuery,linkQuery } = toRefs(data);
const tableData = ref([]);
const pageTotal = ref(0);
const linkList = ref([]);
const mappingList = ref([]);
const sourceList = ref([]);
const sourceTypeList = ref([]);
watch(() => form.value.sourceId, value => refreshMappingList(value))
watch(() => form.value.sourceId, value => refreshlinkList(value))

// 获取表格数据
const getData = () => {
  getList(query.value).then(data => {
    console.log(data)
    tableData.value = data.records;
    pageTotal.value = data.total || 50;
  });
};
getData();

//获取类型数据
const getSourceTypeData = () => {
  getSourceTypeList({
    pageNo: 1,
    pageSize: 100
  }).then(data => {
    console.log(data)
    sourceTypeList.value = data.records;
  });
};
getSourceTypeData();
const getSourceData = () => {
  getSourceList({
    pageNo: 1,
    pageSize: 100
  }).then(data => {
    console.log(data)
    sourceList.value = data.records;
  });
};
getSourceData();
//获取类型名称
const getTypeName = (id) => {
  let arr = sourceTypeList.value.filter((i) => {return id == i.id;})
  return arr[0].typeName
};
const getSourceName = (id) => {
  let arr = sourceList.value.filter((i) => {return id == i.id;})
  return arr[0].nameZh
};
//获取映射数据
const refreshMappingList = (value) => {
  mappingQuery.value.sourceId = value;
  getMappingList(mappingQuery.value).then(data => {
    console.log(data)
    mappingList.value = data.records;
  });
};
//获取可爬链接数据
const refreshlinkList = (value) => {
  linkQuery.value.sourceId = value;
  getLinkList(linkQuery.value).then(data => {
    console.log(data)
    linkList.value = data.records;
  });
};
//获取类型名称
const getLinkUrl = (id) => {
  let arr = linkList.value.filter((i) => {return id == i.id;})
  return arr[0].url;
};
// 查询操作
const handleSearch = () => {
  query.value.pageNo = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.value.pageNo = val;
  getData();
};

// 删除操作
const handleDelete = (row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    row.delFlag = 1;
    saveUpdate(row).then(response => {
      ElMessage.success("操作成功");
      getData();
    });
  }).catch(() => {
  });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    sourceId: undefined,
    linkId: undefined,
    mappingId: undefined,
    typeId: undefined,
    tag: '',
    delFlag: 0
  };
}
const handleEdit = (row: any) => {
  form.value = row;
  editVisible.value = true;
};
//新增
const handleCreate = () => {
  reset();
  editVisible.value = true;
};
const saveEdit = () => {
  editVisible.value = false;
  saveUpdate(form.value).then(response => {
    ElMessage.success("操作成功");
    getData();
  });
};
const spiderUrlByTags  = () => {
  // 二次确认删除
  ElMessageBox.confirm('确定要通过标签'+ids.value.join(',')+'生成链接吗？', '提示', {
    type: 'warning'
  }).then(() => {
    spiderByTag(ids.value.join(',')).then(response => {
      ElMessage.success("操作成功");
      getData();
    });
  }).catch(() => {
  });
};
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
