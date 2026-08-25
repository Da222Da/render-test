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
      },
      {
        path: "/notes",
        name: "Notes",
        component: () => import("@/views/Notes/index.vue"),
        meta: {
          title: "攻略笔记",
        },
      },
      {
        path: "/articles/:id",
        name: "ArticlesDetail",
        component: () => import("@/views/Articles/index.vue"),
        props: true,
        meta: {
          title: (route: any) => route.query.title || "文章详情",
          parent: (route: any) => route.query.from || "",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
