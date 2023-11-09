// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { defaultConfig, plugin as formKitPlugin } from '@formkit/vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faBuilding, faPhone, faGlobe, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEnvelope, faBuilding, faPhone, faGlobe, faCheck);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(formKitPlugin, defaultConfig);
app.use(router);

// If you're using Vue2Transitions in Vue 3, make sure you have a compatible version
// Otherwise, you might need to find an alternative or update your transitions to Vue 3 syntax
// app.use(Vue2Transitions);

app.mount('#app');
