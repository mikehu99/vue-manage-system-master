<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.sourceId" placeholder="新闻源" clearable="" class="handle-select mr10">
          <el-option v-for="(source) in sourceList" :label="source.nameEn" :value="source.id" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
      </div>

      <!--列表-->
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column label="新闻源">
          <template #default="scope">
            {{getSourceName(scope.row.sourceId)}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="publishTime" label="发布时间"></el-table-column>
        <el-table-column prop="headImg" label="主图"></el-table-column>
        <el-table-column prop="tags" label="标签"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="textType" label="文本类型"></el-table-column>
        <el-table-column prop="textContent" label="文本内容"></el-table-column>
        <el-table-column prop="imgType" label="图片类型"></el-table-column>
        <el-table-column prop="imgUrl" label="图片链接"></el-table-column>
        <el-table-column prop="imgCaption" label="图片说明"></el-table-column>
        <el-table-column label="是否删除" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.delFlag === 1 ? 'danger' : scope.row.delFlag === 0 ? 'success' : ''"
            >
              {{ scope.row.delFlag === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.row)" >
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.row)">
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
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input v-model="form.publishTime"></el-input>
        </el-form-item>
        <el-form-item label="主图">
          <el-input v-model="form.headImg"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tags"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="文本类型">
          <el-input v-model="form.textType"></el-input>
        </el-form-item>
        <el-form-item label="文本内容">
          <el-input v-model="form.textContent"></el-input>
        </el-form-item>
        <el-form-item label="图片类型">
          <el-input v-model="form.imgType"></el-input>
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="图片说明">
          <el-input v-model="form.imgCaption"></el-input>
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

<script setup lang="ts" name="mapping">
import {ref, reactive, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {saveUpdate, getList} from '@/api/tms/mapping';
import { getList as getSourceList } from '@/api/tms/source';
interface TableItem {
}
const data = reactive({
  form: {},
  query:{
    pageNo: 1,
    pageSize: 10,
    sourceId:undefined
  }
});

const { form,query } = toRefs(data);
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const sourceList = ref([]);

// 获取表格数据
const getData = () => {
  getList(query.value).then(data => {
    console.log(data)
    tableData.value = data.records;
    pageTotal.value = data.total || 50;
  });
};
getData();
//获取可爬链接数据
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
const getSourceName = (id) => {
  let arr = sourceList.value.filter((i) => {return id == i.id;})
  return arr[0].nameEn;
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
    title: '',
    publishTime: '',
    headImg: '',
    tags: '',
    content: '',
    textType: '',
    textContent: '',
    imgType: '',
    imgUrl: '',
    imgCaption: '',
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
