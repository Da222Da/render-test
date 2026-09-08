<!-- src/views/users.vue -->
<template>
  <div class="users-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <el-card>
      <!-- 用户列表表格 -->
      <el-table
        :data="users"
        style="width: 100%"
        :loading="loading"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" min-width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="150"></el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="150">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link  size="small" @click="openEditUserDialog(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDeleteUser(row.id)">删除</el-button>
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

    <!-- 添加/编辑用户的弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑用户' : '添加用户'"
      v-model="userDialogVisible"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';

import usersService from '@/api/usersService';
import { User } from '@/types/api';

import { ElMessage, ElMessageBox } from 'element-plus';

// 搜索表单数据
const searchForm = reactive({
  username: '',
  email: '',
  phone: '',
});

// 用户表单数据（用于添加/编辑）
const userForm = reactive({
  id: null as number | null,
  username: '',
  email: '',
  phone: '',
  password: '',
});

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
  ],
  phone: [
    { required: false, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
};

// 控制弹窗显示
const userDialogVisible = ref(false);
const isEdit = ref(false);

// 表单引用
const userFormRef = ref();

// 用户列表和相关状态
const users = ref<User[]>([]);
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

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const params = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      username: searchForm.username,
      email: searchForm.email,
    };
    const { data } = await usersService.getUsers(params);
    users.value = data?.rows?.length ? data.rows : [];
    pagination.total = data.total;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索用户
const handleSearch = () => {
  pagination.pageNo = 1;
  fetchUsers();
};

// 重置搜索表单
const handleReset = () => {
  searchForm.username = '';
  searchForm.email = '';
  searchForm.phone = '';
  pagination.pageNo = 1;
  fetchUsers();
};

// 打开添加用户弹窗
const openAddUserDialog = () => {
  isEdit.value = false;
  userForm.id = null;
  userForm.username = '';
  userForm.email = '';
  userForm.phone = '';
  userForm.password = '';
  userDialogVisible.value = true;
};

// 打开编辑用户弹窗
const openEditUserDialog = (user: User) => {
  isEdit.value = true;
  userForm.id = user.id;
  userForm.username = user.username;
  userForm.email = user.email;
  userForm.phone = user.phone;
  userForm.password = ''; // 不显示密码
  userDialogVisible.value = true;
};

// 提交用户表单（添加或编辑）
const handleSubmitUser = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑用户
        try {
          await usersService.updateUser(userForm.id!, {
            username: userForm.username,
            email: userForm.email,
            phone: userForm.phone,
          });
          ElMessage.success('用户编辑成功');
          userDialogVisible.value = false;
          fetchUsers();
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '编辑用户失败');
        }
      } else {
        // 添加用户
        try {
          await usersService.addUser({
            username: userForm.username,
            email: userForm.email,
            phone: userForm.phone,
            password: userForm.password,
          });
          ElMessage.success('用户添加成功');
          userDialogVisible.value = false;
          fetchUsers();
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '添加用户失败');
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
  userDialogVisible.value = false;
};

// 删除用户
const handleDeleteUser = (id: number) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await usersService.deleteUser(id);
        ElMessage.success('用户删除成功');
        fetchUsers();
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '删除用户失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  fetchUsers();
}
// 分页更改
const handlePageChange = (val: number) => {
  pagination.pageNo = val;
  fetchUsers();
};

// 在组件挂载时获取用户列表
onMounted(() => {
  fetchUsers();
});

</script>

<style scoped lang="scss">
.users-container {
  // padding: 20px;

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
