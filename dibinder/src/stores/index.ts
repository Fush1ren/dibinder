import type { ListResponse , ResponseAPI, TasksResponse } from "@/types";
import { api } from "@/utils/axios";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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

export const useListStore = defineStore('list', () => {
  const lists = ref<ListResponse[]>();
  const listActive = ref<string>();

  function setListActive(id: string) {
    listActive.value = id;
  }

  function clearList() {
    listActive.value = undefined;
  }

  async function getList(): Promise<void> {
    const { data }  = await api.get('/list') as AxiosResponse<ResponseAPI<ListResponse[]>>;
    lists.value = data.data;
  }

  return {
    lists,
    listActive,
    getList,
    setListActive,
    clearList,
  }
}, {
    persist: {
      key: "list",
      storage: localStorage,
    },
});

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<TasksResponse[]>();

  async function getTasks(params?: any){
    const { data } = await api.get('/task', { params }) as AxiosResponse<ResponseAPI<TasksResponse[]>>;

    tasks.value = data.data;
  }

  return {
    tasks,
    getTasks,
  }
});

export const useSideBarStore = defineStore('sideBar', () => {
  const isOpen = ref<boolean>(true);

  function triggerSideBar(){
    isOpen.value = !isOpen.value;
  }

  return {
    isOpen,
    triggerSideBar,
  }
})