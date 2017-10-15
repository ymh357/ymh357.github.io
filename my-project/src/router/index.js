import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home.vue'
import Demo from '../pages/Demo.vue'
import About from '../pages/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
          path: '/page1',
          name: 'Home',
          component: Home
      },{
          path: '/page2',
          name: 'Demo',
          component: Demo
      },{
          path: '/page3',
          name: 'About',
          component: About
      }
  ]
})
