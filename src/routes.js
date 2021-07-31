import { defineAsyncComponent } from "vue";
import * as VueRouter from "vue-router";
import { store } from "./utils/Data.store";

const routes = [
  {
    path: "/",
    component: defineAsyncComponent({
      loader: () => import("./components/Home.vue"),
    }),
    props: true,
  },
  { path: "/board", redirect: "/" },
  {
    path: "/board/:id",
    component: defineAsyncComponent({
      loader: () => import("./components/Canvas.vue"),
    }),
    props: true,
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach(async () => {
  await store.getFromDB();
});
