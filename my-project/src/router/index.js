import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home.vue'
import Demo from '../pages/Demo.vue'
import About from '../pages/About.vue'
import Article1 from '../pages/Article1.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
          path: '/page1',
          name: 'Article',
          component: Home,
          children: [
              {
                path: '/article1',
                component: Article1
              }
          ]
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
