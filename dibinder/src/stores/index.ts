import { api } from "@/utils/axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useOtpStore = defineStore('otp', () => {
    const email = ref<string | null>();
    const reason = ref<string | null>();
    const countdown = ref<number>(0);

    function forVerify(emailValue: string, reasonValue: string) {
        email.value = emailValue;
        reason.value = reasonValue;
    }

     return {
        email,
        reason,
        countdown,
        forVerify,
    };
});

export const useAuthStore = defineStore('auth', () => {
    const userId = ref<string | null>();
    const userName = ref<string | null>();
    const userPhotoUrl = ref<string | null>();
    const token = ref<string | null>();
    const authWith = ref<string | null>();
    const isAuthenticated = computed(() => !!token.value);

    function setUser(
        id: string | null,
        newToken: string | null,
        name: string | null,
        photoUrl: string | null,
        auth: string | null
    ) {
        if (id) {
        userId.value = id;
      }
      if (newToken) {
        token.value = newToken;
      }
      if (auth) {
        authWith.value = auth;
      }
      userName.value = name;
      userPhotoUrl.value = photoUrl;
    }

    function getUser() {
      return {
        id: userId.value,
        name: userName.value,
        photoUrl: userPhotoUrl.value,
      };
    }

    function clearUser() {
      userId.value = null;
      userName.value = null;
      userPhotoUrl.value = null;
      token.value = null;
    }

    async function fetchUser() {
      try {
        const { data } = await api.get("/user");
        userId.value = data._id;
        userName.value = data.name;
        userPhotoUrl.value = data.photoUrl;
      } catch (error) {
        console.error("Failed to fetch data user:", error);
      }
    }

    return {
        userId,
        userName,
        userPhotoUrl,
        token,
        authWith,
        isAuthenticated,
        setUser,
        getUser,
        clearUser,
        fetchUser,
    };
}, {
    persist: {
        key: 'authUser',
        storage: localStorage,
    },
});