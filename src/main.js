import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { router } from "./routes";
import { setUpDB, store } from "./store";

setUpDB()
  .then(() => {
    const app = createApp(App);
    app.use(Antd);
    app.use(store);
    app.use(router);
    app.mount("#app");
  })
  .catch((ex) => {
    console.error(ex);
  });
