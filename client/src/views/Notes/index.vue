<template>
  <button @click="goToArticleDetail(noteId)">查看详情</button>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const noteId = "123456";

const goToArticleDetail = (id) => {
  router.push({
    name: "ArticlesDetail",
    params: { id: id },
    query: { from: "Notes", title: "文章详情 123456" },
  });
};
</script>
