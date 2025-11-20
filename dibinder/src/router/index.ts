import { useAuthStore } from "@/stores";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            useNavbar: true,
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
            title: "Dashboard",
            requireAuth: true,
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { 
            title: 'Sign in' 
        }
    },
    {
        path: '/sign-up',
        name: 'signup',
        component: () => import('@/views/SignUpView.vue'),
        meta: { 
            title: 'Sign up' 
        }
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('@/views/VerifyOtpView.vue'),
        meta: {
            title: 'Verify'
        }
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: () => import('@/views/AuthCallbackView.vue'),
        meta: {
            title: 'Auth Callback'
        }
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    document.title = to?.meta?.title ? `${to?.meta?.title as string } - DiBinder` : 'DiBinder'; // Fallback title
    
    const authStore = useAuthStore();

    const requireAuth = to?.meta?.requireAuth;
    const isAuthenticated = authStore.isAuthenticated;

    if (requireAuth && !isAuthenticated) {
        next({ name: "login" });
    } else if (
        (to.name === "login" || to.name === "signup") &&
        isAuthenticated
    ) {
        next({ name: "dashboard" });
    } else {
        next();
    }
});

export default router;