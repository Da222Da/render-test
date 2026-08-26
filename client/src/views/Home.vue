<template>
  <div class="w-100 h-100">
    <Markmap :value="markdownText" :enableToolbar="enableToolbar" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const enableToolbar = ref(true);

const markdownText = `
# articles

- [test1](/articles/123456?title=文章名称&parent=Home)
- [test2](/articles/123456)
`;
</script>
