import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home.vue'
import Page2 from '../pages/Page2.vue'
import Page3 from '../pages/Page3.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
          path: '/page1',
          name: 'Page1',
          component: Home
      },{
          path: '/page2',
          name: 'Page2',
          component: Page2
      },{
          path: '/page3',
          name: 'Page3',
          component: Page3
      },{
          path: '/page4',
          name: 'Page4',
          component: Home
      }
  ]
})
