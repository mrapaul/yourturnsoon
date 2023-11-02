import Vue from "vue";
import Router from "vue-router";
import LandingPage from "./components/LandingPage.vue";
import CreateQueue from "./views/CreateQueue.vue";
import JoinQueue from "./views/JoinQueue.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingPage,
    },
    {
      path: "/create",
      name: "create",
      component: CreateQueue,
    },
    {
      path: "/join",
      name: "join",
      component: JoinQueue,
    },
  ],
});

export default router;
