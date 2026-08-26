<!-- src/components/Layout/index.vue -->
<template>
  <!-- 面包屑 -->
  <div class="box-breadcrumb" :style="{ height: height + 'px' }">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <template v-for="(item, index) in breadList">
        <el-breadcrumb-item v-if="item.name" :key="index" :to="item.path">{{ item.meta.title }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

defineProps({
  height: {
    type: Number,
    default: 30,
  },
});

let router = useRouter();
let route = useRoute();
const breadList = ref([]);

// 👉 新增：辅助函数，用于解析 meta 中的值（支持函数和静态值）
const resolveMetaValue = (value, route) => {
  if (!value) return;
  if (typeof value === "function") {
    return value(route); // 如果是函数，执行它并传入 route
  }
  return value; // 否则直接返回静态值
};
let getMatched = () => {
  // 解析当前路由的 title 和 parent
  const currentTitle = resolveMetaValue(route.meta?.title, route);
  const currentParentName = resolveMetaValue(route.meta?.parent, route);

  // 如果有 parent 约定
  if (currentParentName) {
    const parentRoute = router.getRoutes().find((r) => r.name === currentParentName);

    if (parentRoute) {
      // 解析父路由的 title（也可能是函数）
      const parentTitle = resolveMetaValue(parentRoute.meta?.title, route);

      breadList.value = [
        { ...parentRoute, meta: { ...parentRoute.meta, title: parentTitle } }, // 父路由记录
        { ...route, meta: { ...route.meta, title: currentTitle } }, // 当前路由记录
      ];
      return;
    }
  }

  // 默认逻辑：遍历 matched，并解析每个路由的 title（支持函数）
  breadList.value = route.matched
    .map((item) => {
      const title = resolveMetaValue(item.meta?.title, route);
      return { ...item, meta: { ...item.meta, title } };
    })
    .filter((item) => item.meta && item.meta.title);
};
onMounted(() => {
  getMatched();
});

// 监听路由路径是否发生变化，之后更改面包屑
watch(
  () => route.path,
  () => {
    getMatched();
  },
);
</script>

<style lang="scss" scoped>
.box-breadcrumb {
  display: flex;
  align-items: center;
}
</style>
