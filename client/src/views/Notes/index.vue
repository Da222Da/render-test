<template>
  <div class="w-100 h-100">
    <Markmap :value="markdownText" :enableToolbar="enableToolbar" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { addParentToMarkdownLinks } from "@/util/index.ts";

const router = useRouter();
const enableToolbar = ref(true);
const data = `
# articles

- [test1](/articles/123456?title=文章名称)
  - test1-1
  - test1-2
- [test2](/articles/123456?title=文章名称)
`;

const markdownText = addParentToMarkdownLinks(data, "Notes");
</script>
