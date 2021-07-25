import * as VueRouter from "vue-router";
import Canvas from "./components/Canvas.vue";
import Home from "./components/Home.vue";

const routes = [
  { path: "/", component: Home, props: true },
  { path: "/board", redirect: "/" },
  { path: "/board/:id", component: Canvas, props: true },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
