// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { defaultConfig, plugin as formKitPlugin } from "@formkit/vue";
import '@formkit/themes/genesis'

// Import the icons

const app = createApp(App);

app.use(formKitPlugin, defaultConfig);
app.use(router);

app.mount("#app");
