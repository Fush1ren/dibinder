import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import KeyFilter from 'primevue/keyfilter';
import App from './App.vue';
import Aura from '@primeuix/themes/aura';
import router from './router';
import './assets/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.directive('keyfilter', KeyFilter);
app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(ToastService);
app.mount('#app');