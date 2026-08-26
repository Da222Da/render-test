import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import Layout from "@/components/Layout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: {
          title: "打狼 2026",
        },
      },
      {
        path: "/notes",
        name: "Notes",
        component: () => import("@/views/Notes/index.vue"),
        meta: {
          title: "Unreal Engine 攻略笔记",
        },
      },
      {
        path: "/articles/:id",
        name: "ArticlesDetail",
        component: () => import("@/views/Articles/index.vue"),
        props: true,
        meta: {
          title: (route: any) => route.query.title || "文章详情",
          parent: (route: any) => route.query.parent || "",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 在路由跳转前，动态设置 query 参数
// router.beforeEach((to, from) => {
//   console.log("to::: ", to);
//   console.log("from::: ", from);
//   return true;
// });

export default router;
