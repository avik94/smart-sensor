import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home/Home.vue';
import ShowData from './views/ShowData.vue';
import Statistics from './views/Statistics/Statistics.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:name/:id',
      name: 'home',
      component: Statistics,
    },
    {
      path: '/:companyId',
      name: 'home',
      component: Statistics,
    },
    // {
    //   path: '/about',
    //   name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
    // {
    //   path: '/show-data',
    //   name: 'show-data',
    //   component: ShowData
    // },
    // {
    //   path: '/data-view/:name',
    //   name: 'data-view',
    //   component: Home
    // }
  ],
});
