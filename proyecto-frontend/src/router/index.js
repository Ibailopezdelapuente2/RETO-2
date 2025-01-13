import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../components/Login.vue'), // Vista de login
    },
    {
      path: '/user', // Ruta para la vista de usuario (después del login exitoso)
      name: 'user',
      component: () => import('../views/UserView.vue'), // Vista del usuario
    },
  ],
})

export default router
