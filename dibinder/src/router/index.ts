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
        path: "/404",
        name: "notFoundView",
        component: () => import("@/views/NotFoundView.vue"),
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import('@/views/LogoutView.vue'),
        meta: {
            title: 'Logout',
            requiresAuth: true,
        }
    },
    {
        path: '/binder',
        name: 'binder',
        component: () => import('@/layouts/BinderLayout.vue'),
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: 'tasks',
                name: 'tasks',
                component: () => import('@/layouts/TasksLayout.vue'),
                children: [
                    {
                        path: ':taskType',
                        name: 'taskType',
                        component: () => import('@/views/task/TaskAllView.vue'),
                    },
                    {
                        path: 'calendar',
                        name: 'taskCalendar',
                        component: () => import('@/views/task/TaskCalendar.vue'),
                    },
                    // {
                    //     path: 'today',
                    //     name: 'taskToday',
                    //     component: () => import('@/views/task/TaskTodayView.vue'),
                    // }
                ]
            },
            {
                path: 'list/:listName',
                name: 'listTask',
                component: () => import('@/views/list/ListView.vue'),
            },
            {
                path: 'today',
                name: 'today',
                component: () => import('@/views/TodayBinderView.vue'),
            }
        ],
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
        path: '/auth/callback',
        name: 'auth-callback',
        component: () => import('@/views/AuthCallbackView.vue'),
        meta: {
            title: 'Auth Callback'
        }
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/404",
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
        next({ name: "tasks" });
    } else {
        next();
    }
});

export default router;