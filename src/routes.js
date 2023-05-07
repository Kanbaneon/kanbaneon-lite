import { defineAsyncComponent } from "vue";
import * as VueRouter from "vue-router";
import { store } from "./store";

const loginGuard = () => {
  if (!store.state.user.isLoggedIn) {
    return { path: "/login" };
  }
  return true;
};

const logoutGuard = () => {
  if (store.state.user.isLoggedIn) {
    return { path: "/" };
  }
  return true;
};

const routes = [
  {
    path: "/",
    component: () => import("./components/Home.vue"),
    beforeEnter: loginGuard,
    props: true,
  },
  {
    path: "/login",
    component: () => import("./components/Login.vue"),
    beforeEnter: logoutGuard,
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
  {
    path: "/:pathMatch(.*)*",
    component: () => import("./components/NotFound.vue"),
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
