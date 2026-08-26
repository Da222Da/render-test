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
const data = `
# articles

- [test1](/articles/123456?title=文章名称)
- [test2](/articles/123456?title=文章名称)
`;

const markdownText = addParentToMarkdownLinks(data, "Notes");

function addParentToMarkdownLinks(text: string, parentValue: string): string {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(linkRegex, (match, linkTitle, url) => {
    try {
      const urlObj = new URL(url, "http://localhost");
      urlObj.searchParams.set("parent", parentValue);
      return `[${linkTitle}](${urlObj.pathname}${urlObj.search}${urlObj.hash})`;
    } catch (e) {
      return match;
    }
  });
}
</script>
