import { createRouter, createWebHistory } from 'vue-router';
import BusinessAuth from './components/BusinessAuth.vue';

const routes = [
  { path: '/', component: BusinessAuth }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
