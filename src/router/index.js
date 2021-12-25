import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import(/* webpackChunkName: "Products" */ '../views/Products.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import(/* webpackChunkName: "Customers" */ '../views/Customers.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import(/* webpackChunkName: "Customers" */ '../views/Transactions.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
