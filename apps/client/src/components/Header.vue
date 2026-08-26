<template>
  <div class="header-container">
    <el-menu :default-active="activeIndex" class="header-menu-container" mode="horizontal" :ellipsis="false" router>
      <el-menu-item index="0"> logo </el-menu-item>
      <!-- 打狼2026 & 攻略笔记 & 文章库 -->
      <el-menu-item index="/home">Test1</el-menu-item>
      <el-menu-item index="/notes">Test2</el-menu-item>
      <!-- <el-menu-item index="/articles">Test3</el-menu-item> -->
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const activeIndex = ref("/");

// 监听路由路径变化
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath;
  },
  { immediate: true }, // 立即执行一次，确保初始化正确
);
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  height: 60px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-menu-container {
  width: 100%;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
