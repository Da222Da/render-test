<!-- src/components/Layout/index.vue -->
<template>
  <div class="w-100 h-100">
    <Header />

    <!-- 内容区域 -->
    <div class="w-100 box-content">
      <el-row class="w-100 h-100 m-0" :gutter="20">
        <el-col :xs="0" :sm="4"></el-col>
        <el-col :xs="24" :sm="16" class="w-100 h-100 p-0">
          <!-- 面包屑 -->
          <Breadcrumb :height="BreadcrumbHeight" />

          <!-- 内容区域 -->
          <div :style="contentStyle">
            <router-view />
          </div>
        </el-col>
        <el-col :xs="0" :sm="4"></el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import Header from "./Header.vue";
import Breadcrumb from "./Breadcrumb.vue";

const BreadcrumbHeight = ref(30);
const contentStyle = computed(() => {
  return {
    height: `calc(100% - ${BreadcrumbHeight.value}px`,
  };
});
</script>

<style scoped>
.box-content {
  height: calc(100vh - 60px);
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
