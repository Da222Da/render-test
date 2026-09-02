<!-- src/views/register/index.vue -->
<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">注册</h2>
      <el-form :model="form" :rules="rules" ref="registerForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" style="width: 260px;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱" style="width: 260px;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <div style="display: flex;gap: 6px;">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" style="width: 260px;"></el-input>
            <!-- 密码强度指示器 -->
            <PasswordStrength v-if="form.password" :password="form.password" />
          </div>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"
            style="width: 260px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(registerForm)" :loading="loading">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <p class="login-link">
        已有账号？<router-link to="/login">登录</router-link>
      </p>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { FormInstance } from 'element-plus';

import PasswordStrength from '@/components/PasswordStrength/index.vue'; // 导入密码强度组件

// 定义表单模型
interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const form = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 30, message: '用户名长度在3到30个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

const registerForm = ref<FormInstance>();

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      handleRegister();
    }
  })
}
const handleRegister = async () => {
  try {
    loading.value = true;
    const params = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };
    await authStore.register(params);
    ElMessage.success('注册成功！请登录。');
    router.push({ name: 'Login' });
  } catch (error: any) {
      ElMessage.error(error?.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.register-container {
  width: 100vw;
  height: 100vh;
  /* 如果使用在线图片，示例：
  background-image: url('https://source.unsplash.com/random/1920x1080');
  */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  width: 458px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  /* 半透明背景以提升可读性 */
}

.register-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.login-link {
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
  text-align: center;
}

.login-link a {
  color: $primary;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
