<!-- src/views/roles/index.vue -->
<template>
  <div class="roles-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <!-- 角色列表表格 -->
      <el-table
        :data="roles"
        style="width: 100%"
        :loading="loading"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
        <el-table-column prop="createdAt" label="权限" min-width="180">
          <template #default="{ row }">
            {{ formatPermissions(row.permissions) }}
          </template>
        </el-table-column>
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
            <el-button type="primary" link @click="openEditRoleDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDeleteRole(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑角色的弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      v-model="roleDialogVisible"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input :rows="2" type="textarea" v-model="roleForm.description" maxlength="100" show-word-limit placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-select
            v-model="roleForm.permissions"
            multiple
            placeholder="请选择权限"
            filterable
            clearable
            collapse-tags
            popper-class="custom-header"
            :max-collapse-tags="1"
          >
          <template #header>
            <el-checkbox
              v-model="checkAll"
              :indeterminate="indeterminate"
              @change="handleCheckAll"
            >
              全选
            </el-checkbox>
          </template>
            <el-option
              v-for="permission in permissions"
              :key="permission.id"
              :label="permission.name"
              :value="permission.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmitRole">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import rolesService from '@/api/roleService';
import permissionsService from '@/api/permissionsService';

import { ElMessage, ElMessageBox } from 'element-plus';
import type { CheckboxValueType } from 'element-plus'

// 定义角色类型
interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  [prop: string]: any;
}

// 定义权限类型
interface Permission {
  id: number;
  name: string;
  description?: string;
  [prop: string]: any;
}

// 搜索表单数据
const searchForm = reactive({
  name: '',
});

// 角色表单数据（用于添加/编辑）
const roleForm = reactive({
  id: null as number | null,
  name: '',
  description: '',
  permissions: [] as number[],
});

// 表单验证规则
const roleFormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  description: [
    { max: 100, message: '描述最多100个字符', trigger: 'blur' },
  ],
  permissions: [
    { type: 'array', required: true, message: '请选择至少一个权限', trigger: 'change' },
  ],
};

// 控制弹窗显示
const roleDialogVisible = ref(false);
const isEdit = ref(false);

// 表单引用
const roleFormRef = ref();

// 角色列表和相关状态
const roles = ref<Role[]>([]);
const loading = ref(false);

// 权限列表
const permissions = ref<Permission[]>([]);

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const formatPermissions = (permissions: Permission[]) => {
  return permissions.map((_) => _.name).join(', ');
};

const checkAll = ref(false)
const indeterminate = ref(false)

watch(() => roleForm.permissions, (val:any) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === permissions.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    roleForm.permissions = permissions.value.map((_) => _.id)
    console.log(roleForm.permissions)
  } else {
    roleForm.permissions = []
  }
}

// 获取角色列表
const fetchRoles = async () => {
  loading.value = true;
  try {
    const params = {
      name: searchForm.name,
    };
    const { data } = await rolesService.getRoles(params);
    roles.value = data?.length ? data : [];
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取角色列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取权限列表
const fetchPermissions = async () => {
  try {
    const params = {
      pageNo: 1,
      pageSize: 9999,
    };
    const { data } = await permissionsService.getPermissions(params);
    permissions.value = data?.rows?.length ? data.rows : [];
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取权限列表失败');
  }
};


// 搜索角色
const handleSearch = () => {
  fetchRoles();
};

// 重置搜索表单
const handleReset = () => {
  searchForm.name = '';
  fetchRoles();
};

// 打开添加角色弹窗
const openAddRoleDialog = () => {
  isEdit.value = false;
  roleForm.id = null;
  roleForm.name = '';
  roleForm.description = '';
  roleForm.permissions = [];
  roleDialogVisible.value = true;
};

// 打开编辑角色弹窗
const openEditRoleDialog = (role: Role) => {
  isEdit.value = true;
  roleForm.id = role.id;
  roleForm.name = role.name;
  roleForm.description = role.description || '';
  roleForm.permissions = role.permissions.map((_: any) => _.id);
  roleDialogVisible.value = true;
};

// 提交角色表单（添加或编辑）
const handleSubmitRole = () => {
  roleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑角色
        try {
          await rolesService.updateRole(roleForm.id!, {
            name: roleForm.name,
            description: roleForm.description,
            permissionIds: roleForm.permissions,
          });
          ElMessage.success('角色编辑成功');
          roleDialogVisible.value = false;
          fetchRoles();
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '编辑角色失败');
        }
      } else {
        // 添加角色
        try {
          await rolesService.addRole({
            name: roleForm.name,
            description: roleForm.description,
          });
          ElMessage.success('角色添加成功');
          roleDialogVisible.value = false;
          fetchRoles();
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '添加角色失败');
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
  roleDialogVisible.value = false;
};

// 删除角色
const handleDeleteRole = (id: number) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await rolesService.deleteRole(id);
        ElMessage.success('角色删除成功');
        fetchRoles();
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '删除角色失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 在组件挂载时获取角色列表
onMounted(() => {
  fetchRoles();
  fetchPermissions();
});

</script>

<style scoped lang="scss">
.roles-container {
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
