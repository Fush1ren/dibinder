import type { BodyList, BodyTask, ListByIdResponse, ListDropdownResponse, ListResponse , ResponseAPI, TaskLengthResponse, TasksResponse } from "@/types";
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
  const listActive = ref<{
    id: string;
    name: string;
  }>();
  const list = ref<ListByIdResponse>();
  const listDropdown = ref<ListDropdownResponse[]>();

  function setListActive(data: ({
    id: string;
    name: string;
  })) {
    listActive.value = data;
  }

  function clearList() {
    listActive.value = undefined;
  }

  async function getList(): Promise<void> {
    const { data }  = await api.get('/list') as AxiosResponse<ResponseAPI<ListResponse[]>>;
    lists.value = data.data;
  }

  async function getListById(id: string): Promise<void> {
    const { data }  = await api.get(`/list/${id}`) as AxiosResponse<ResponseAPI<ListByIdResponse>>;
    list.value = data.data;
  }

  async function getListDropdown(): Promise<void> {
    const { data }  = await api.get('/list/dropdown') as AxiosResponse<ResponseAPI<ListDropdownResponse[]>>;
    listDropdown.value = data.data;
  }

  async function createList(body: BodyList): Promise<void>{
    await api.post('/list', body);
  }

  async function updateList(id: string, body: BodyList): Promise<void> {
    await api.patch(`/list/${id}`, body);
  }

  return {
    list,
    lists,
    listActive,
    listDropdown,
    getList,
    setListActive,
    clearList,
    getListDropdown,
    getListById,
    createList,
    updateList,
  }
}, {
    persist: {
      key: "list",
      storage: localStorage,
    },
});

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<TasksResponse[]>();
  const tasksLength = ref<TaskLengthResponse>();
  const taskDone = ref<boolean[]>([]);

  async function getTasks(params?: any){
    const { data } = await api.get('/task', { params }) as AxiosResponse<ResponseAPI<TasksResponse[]>>;

    tasks.value = data.data;
    taskDone.value = tasks.value?.map((d) => d.done);
    // const result = [] as TasksResponse[] ;
    // for (let i = 0; i < 2; i++) {
    //   data.data.forEach(item => {
    //     result.push(item)
    //   });
    // }

    // tasks.value = result;
  }

  async function getTaskLength() {
    const { data } = await api.get('/task/length') as AxiosResponse<ResponseAPI<TaskLengthResponse>>;
    tasksLength.value = data.data;
  }

  async function createTask(body: BodyTask) {
    await api.post('/task', body);
  }

  async function updateTask(id: string, body: BodyTask) {
    await api.patch(`/task/${id}`, body);
  }

  async function updateTaskDone(id: string, body: { done: boolean, subTask: { done: boolean; name: string }[]}) {
    await api.patch(`/task/${id}/done`, body);
  }

  async function deleteTask(id: string) {
    await api.delete(`/task/${id}`)
  }

  return {
    tasks,
    tasksLength,
    taskDone,
    getTasks,
    getTaskLength,
    updateTask,
    updateTaskDone,
    createTask,
    deleteTask,
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

export const useTaskDetailStore = defineStore('taskDetail', () => {
  const isOpen = ref<boolean>(false);
  const task = ref<TasksResponse>();

  function triggerTaskDetail(){
    isOpen.value = !isOpen.value;
  }

  function triggerAddNewTask() {
    clearTask()
    isOpen.value = true;
  }

  function closeTaskDetail() {
    isOpen.value = false;
  }

  function triggerEditTask(data: TasksResponse) {
    task.value = data;
    isOpen.value = true;
  }

  function clearTask() {
    task.value = undefined;
  }


  return {
    isOpen,
    task,
    triggerTaskDetail,
    triggerAddNewTask,
    closeTaskDetail,
    triggerEditTask,
    clearTask,
  }
})