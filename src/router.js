import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import CreateQueue from './views/CreateQueue.vue';
import JoinQueue from './views/JoinQueue.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/create', component: CreateQueue, name: 'create' },
  { path: '/join', component: JoinQueue }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
