<!-- src/components/PasswordStrength.vue -->
<template>
  <div class="password-strength">
    <el-progress :percentage="strengthPercentage" :status="progressStatus" />
    <div class="strength-text" :class="strengthClass">
      {{ strengthLabel }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import zxcvbn from 'zxcvbn';

interface Props {
  password: string;
}

const props = defineProps<Props>();

// 计算密码强度
const passwordStrength = computed(() => {
  return zxcvbn(props.password);
});

// 根据分数返回不同的标签和颜色
const strengthLabel = computed(() => {
  switch (passwordStrength.value.score) {
    case 0:
      return '极弱';
    case 1:
      return '弱';
    case 2:
      return '中';
    case 3:
      return '强';
    case 4:
      return '极强';
    default:
      return '';
  }
});

const strengthPercentage = computed(() => {
  return (passwordStrength.value.score + 1) * 20; // 分数0-4转换为20-100%
});

const progressStatus = computed(() => {
  switch (passwordStrength.value.score) {
    case 0:
      return 'exception'; // 红色
    case 1:
      return 'exception'; // 红色
    case 2:
      return 'warning'; // 黄色
    case 3:
      return 'success'; // 绿色
    case 4:
      return 'success'; // 绿色
    default:
      return 'info';
  }
});

const strengthClass = computed(() => {
  switch (passwordStrength.value.score) {
    case 0:
    case 1:
      return 'weak';
    case 2:
      return 'medium';
    case 3:
    case 4:
      return 'strong';
    default:
      return '';
  }
});
</script>

<style lang="scss" scoped>
.password-strength {
  display: flex;
  align-items: center;
}

.strength-text {
  font-size: 0.75rem;
  text-align: left;
  margin-left: -2rem;
}

.strength-text.weak {
  color: $danger; /* 红色 */
}

.strength-text.medium {
  color: $warning; /* 黄色 */
}

.strength-text.strong {
  color: $primary; /* 绿色 */
}
</style>
