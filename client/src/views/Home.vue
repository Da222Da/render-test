<template>
  <div class="w-100 h-100">
    <Markmap :value="convertedText" :enableToolbar="enableToolbar" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const enableToolbar = ref(true);

/**
 * 将 Markdown 风格的链接转换为 Vue 风格的链接
 * @param markdownText 包含 Markdown 链接的字符串
 * @returns 转换后的字符串
 */
const convertMarkdownLinksToVueLinks = (markdownText: string): string => {
  // 正则表达式匹配 Markdown 链接 [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // 替换函数
  const replaceFunction = (match: string, text: string, url: string) => {
    // 返回 Vue 风格的链接
    return `<a v-link href="${url}">${text}</a>`;
  };

  // 执行替换
  return markdownText.replace(markdownLinkRegex, replaceFunction);
};

const markdownText = `
# articles

- <a v-link href="/articles/123456">跳转</a>
- [test1](/articles/123456)
- [test2](/articles/123456)
`;

const convertedText = convertMarkdownLinksToVueLinks(markdownText);

// 在路由跳转前，动态设置 query 参数
router.beforeEach((to, from, next) => {
  to.query.from = "Home";
  next();
});
</script>
