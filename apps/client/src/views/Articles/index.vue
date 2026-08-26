<template>文章详情: {{ id }}</template>

<script setup>
import { onMounted } from "vue";
// 👉 直接声明 props，就像接收普通数据一样
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  // 直接使用 props.id
  fetchData(props.id);
});

const fetchData = (id) => {
  // 调用 API 获取数据...
};
</script>
