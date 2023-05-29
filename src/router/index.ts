import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const layout = () => import('../views/layout.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name:'layout',
    component: layout,
    redirect:'/student',
    children:[
      {
        path: '/student',
        name:'student',
        component: () => import('../views/student.vue'),
      },
      {
        path: '/answer',
        name:'answer',
        component: () => import('../views/answer.vue'),
      },
      {
        path: '/performance',
        name:'performance',
        component: () => import('../views/performance.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
