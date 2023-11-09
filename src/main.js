// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { defaultConfig, plugin as formKitPlugin } from "@formkit/vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faBuilding,
  faCheck,
  faArrowRight,
  faKey,
  faSignInAlt,
  faPhone,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Add icons to the library
library.add(
  faEnvelope,
  faBuilding,
  faCheck,
  faArrowRight,
  faKey,
  faSignInAlt,
  faPhone,
  faGlobe
);
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(formKitPlugin, defaultConfig);
app.use(router);

app.mount("#app");
