<!-- src/views/Permissions.vue -->
<template>
  <div class="permissions-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="权限名称">
          <el-input v-model="searchForm.name" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="openAddPermissionDialog">添加权限</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <el-card class="action-card">
      <!-- 权限列表表格 -->
      <el-table
        :data="permissions"
        style="width: 100%"
        :loading="loading"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="权限名称" width="150"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link  @click="openEditPermissionDialog(row)">编辑</el-button>
            <el-button type="danger" link  @click="handleDeletePermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination">
        <el-pagination
          background
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="pagination.pageNo"
          :total="pagination.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑权限的弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑权限' : '添加权限'"
      v-model="permissionDialogVisible"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form :model="permissionForm" :rules="permissionFormRules" ref="permissionFormRef" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="permissionForm.description" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmitPermission">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import permissionsService from '@/api/permissionsService';

// 定义权限类型
interface Permission {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 搜索表单数据
const searchForm = reactive({
  name: '',
});

// 权限表单数据（用于添加/编辑）
const permissionForm = reactive({
  id: null as number | null,
  name: '',
  description: '',
});

// 表单验证规则
const permissionFormRules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
  ],
  description: [
    { max: 200, message: '描述最多200个字符', trigger: 'blur' },
  ],
};

// 控制弹窗显示
const permissionDialogVisible = ref(false);
const isEdit = ref(false);

// 表单引用
const permissionFormRef = ref();

// 权限列表和相关状态
const permissions = ref<Permission[]>([]);
const loading = ref(false);

// 分页信息
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 获取权限列表
const fetchPermissions = async () => {
  loading.value = true;
  try {
    const params = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      name: searchForm.name,
    };
    const { data } = await permissionsService.getPermissions(params);
    permissions.value = data.rows;
    pagination.total = data.total;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取权限列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索权限
const handleSearch = () => {
  pagination.pageNo = 1;
  fetchPermissions();
};

// 重置搜索表单
const handleReset = () => {
  searchForm.name = '';
  pagination.pageNo = 1;
  fetchPermissions();
};

// 打开添加权限弹窗
const openAddPermissionDialog = () => {
  isEdit.value = false;
  permissionForm.id = null;
  permissionForm.name = '';
  permissionForm.description = '';
  permissionDialogVisible.value = true;
};

// 打开编辑权限弹窗
const openEditPermissionDialog = (permission: Permission) => {
  isEdit.value = true;
  permissionForm.id = permission.id;
  permissionForm.name = permission.name;
  permissionForm.description = permission.description || '';
  permissionDialogVisible.value = true;
};

// 提交权限表单（添加或编辑）
const handleSubmitPermission = () => {
  permissionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑权限
        try {
          await permissionsService.updatePermission(permissionForm.id!, {
            name: permissionForm.name,
            description: permissionForm.description,
          });
          ElMessage.success('权限编辑成功');
          permissionDialogVisible.value = false;
          fetchPermissions();
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '编辑权限失败');
        }
      } else {
        // 添加权限
        try {
          await permissionsService.addPermission({
            name: permissionForm.name,
            description: permissionForm.description,
          });
          ElMessage.success('权限添加成功');
          permissionDialogVisible.value = false;
          fetchPermissions();
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '添加权限失败');
        }
      }
    } else {
      ElMessage.error('请正确填写表单');
      return false;
    }
  });
};

// 关闭弹窗
const handleCloseDialog = () => {
  permissionDialogVisible.value = false;
};

// 删除权限
const handleDeletePermission = (id: number) => {
  ElMessageBox.confirm('确定要删除该权限吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await permissionsService.deletePermission(id);
        ElMessage.success('权限删除成功');
        fetchPermissions();
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '删除权限失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  fetchPermissions();
}
// 分页更改
const handlePageChange = (val: number) => {
  pagination.pageNo = val;
  fetchPermissions();
};
// 在组件挂载时获取权限列表
onMounted(() => {
  fetchPermissions();
});
</script>

<style scoped lang="scss">
.permissions-container {
  .search-card {
    margin-bottom: 1rem;
  }

  .pagination {
    margin-top: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .el-table .el-button {
    margin-right: 5px;
  }


  .el-dialog {
    /* 可根据需要自定义弹窗样式 */
  }
}
</style>

