import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/login',
        component: () => import('@/views/LoginView.vue'),
        meta: { 
            title: 'Sign in - DiBinder' 
        }
    },
    {
        path: '/sign-up',
        component: () => import('@/views/SignUpView.vue'),
        meta: { 
            title: 'Sign up - DiBinder' 
        }
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    document.title = to?.meta?.title as string || 'DiBinder'; // Fallback title
    next();
});

export default router;