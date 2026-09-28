import { createWebHashHistory, createRouter } from 'vue-router'

const home = () => import('@/pages/home/index.vue')
// import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: home }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router