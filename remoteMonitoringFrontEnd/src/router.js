import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'
import operation from './views/operation.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'operation',
      component: operation
    }
  ]
})
