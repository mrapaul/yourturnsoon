import { createRouter, createWebHistory } from 'vue-router';
import BusinessAuth from './components/BusinessAuth.vue';
import CreateQueue from './views/CreateQueue.vue';
import JoinQueue from './views/JoinQueue.vue';

const routes = [
  { path: '/', component: BusinessAuth },
  { path: '/create', component: CreateQueue, name: 'create' },
  { path: '/join', component: JoinQueue }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
