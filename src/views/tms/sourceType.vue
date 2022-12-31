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
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="typeName" label="类型名称"></el-table-column>
				<el-table-column label="是否删除" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.delFlag === 1 ? 'danger' : scope.row.delFlag === 0 ? 'success' : ''"
						>
							{{ scope.row.delFlag === 1 ? '是':'否' }}
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
						<el-button text :icon="Edit" @click="handleEdit(scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
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
				<el-form-item label="类型名称">
					<el-input v-model="form.typeName"></el-input>
				</el-form-item>
        <el-form-item label="是否删除">
          <el-radio-group v-model="form.delFlag">
            <el-radio  :label="1">是</el-radio>
            <el-radio  :label="0">否</el-radio>
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

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { sourceTypeSaveEdit ,sourceTypeList } from '@/api/tms/sourceType';

interface TableItem {
	id: number;
  typeName: string;
  delFlag: number;
  createTime: string;
  updateTime: string;
}

const query = reactive({
  pageNo: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  sourceTypeList(query).then(data => {
    console.log(data)
		tableData.value = data.records;
		pageTotal.value = data.total || 50;
	});
};
getData();

// 查询操作
const handleSearch = () => {
	query.pageNo = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageNo = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			tableData.value.splice(index, 1);
		})
		.catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  id: undefined,
  typeName: '',
  delFlag: 0
});
let idx: number = -1;
const handleEdit = (row: any) => {
  form.id = row.id;
  form.typeName = row.typeName;
	form.delFlag = row.delFlag;
	editVisible.value = true;
};
//新增
const handleCreate = () => {
  form.id = undefined;
  form.typeName ='';
  form.delFlag = 0;
  editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
  sourceTypeSaveEdit(form).then(response => {
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
