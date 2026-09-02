<!-- src/views/login.vue -->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登录</h2>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="register-link">
        还没有账号？<router-link type="primary" to="/register">注册</router-link>
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

// 定义表单模型
interface LoginForm {
  username: string;
  password: string;
}

const form = ref<LoginForm>({
  username: '',
  password: '',
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 30, message: '用户名长度在3到30个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' },
  ],
};

const loginForm = ref<FormInstance>();

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);

const handleLogin = async () => {
  try {
    await loginForm.value?.validate();
    loading.value = true;
    const params = { username: form.value.username, password: form.value.password };
    await authStore.login(params);
    router.push({ name: 'Dashboard' });
  } catch (error: any) {
    if (error instanceof Error) {
      ElMessage.error(error.message);
    } else {
      // ElMessage.error('登录失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  // background-image: url('//img.zzqlyx.com/user-system/background.jpg'); /* 本地图片路径 */
  /* 如果使用在线图片，示例：
  background-image: url('https://source.unsplash.com/random/1920x1080');
  */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 380px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 1); /* 半透明背景以提升可读性 */
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.register-link {
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: $primary;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
