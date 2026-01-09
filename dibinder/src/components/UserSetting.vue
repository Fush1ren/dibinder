<script setup lang="ts">
import { useAuthStore, useUserStore } from '@/stores';
import type { UserSettingEmits } from '@/types';
import {
  Button,
  Dialog,
  InputText,
  Message,
  Password,
  useToast,
} from 'primevue';
import { ref, watch } from 'vue';

const modelValue = defineModel<boolean>('visible', {
  default: false,
});

const emits = defineEmits<UserSettingEmits>();

const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();

const userName = ref<string>();
const email = ref<string>();
const changePassword = ref<string>();
const confirmPassword = ref<string>();

const menu = ref<{
  profile: boolean;
  changePassword: boolean;
}>({
  profile: true,
  changePassword: false,
});

const formValid = ref<{
  name?: {
    invalid: boolean;
    message: string;
  };
  email?: {
    invalid: boolean;
    message: string;
  };
  changePassword?: {
    invalid: boolean;
    message: string;
  };
  confirmPassword?: {
    invalid: boolean;
    message: string;
  };
}>({
  name: {
    invalid: false,
    message: '',
  },
  email: {
    invalid: false,
    message: '',
  },
  changePassword: {
    invalid: false,
    message: '',
  },
  confirmPassword: {
    invalid: false,
    message: '',
  },
});

const getProfile = async (): Promise<void> => {
  const userId = authStore?.userId as string;
  await userStore.getUser(userId);
  userName.value = userStore.user?.name;
  email.value = userStore.user?.email;
};

const showMenu = (type: 'profile' | 'changePassword'): void => {
  if (type === 'profile') {
    if (menu.value?.profile) return;
    menu.value = {
      profile: true,
      changePassword: false,
    };
  } else {
    if (menu.value?.changePassword) return;
    menu.value = {
      profile: false,
      changePassword: true,
    };
  }
};

const updateProfile = async (): Promise<void> => {
  try {
    if (formValid?.value?.name?.invalid || formValid?.value?.email?.invalid)
      return;

    await userStore.updateUser({
      name: userName.value as string,
      email: email.value as string,
      photoUrl: '',
    });

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Update Profile Successfully!',
      life: 3000,
    });

    emits('close', false);
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: 'Failed',
      detail: `${(e as Error)?.message}`,
      life: 3000,
    });
  }
};

const changePaswordUser = async (e: any): Promise<void> => {
  try {
    console.log(e);
  } catch (e) {
    console.error(e);
  }
};

watch(
  () => modelValue.value,
  async (model, oldModel) => {
    if (!model) {
      menu.value = { profile: true, changePassword: false };
      formValid.value = {
        name: {
          invalid: false,
          message: '',
        },
        email: {
          invalid: false,
          message: '',
        },
        changePassword: {
          invalid: false,
          message: '',
        },
        confirmPassword: {
          invalid: false,
          message: '',
        },
      };
      return;
    }

    if (model && model !== oldModel) {
      await getProfile();
    }
  },
  { immediate: true },
);

watch(
  () => menu.value.profile,
  async (isProfile) => {
    if (isProfile && modelValue.value) {
      await getProfile();
    }
    formValid.value = {
      name: {
        invalid: false,
        message: '',
      },
      email: {
        invalid: false,
        message: '',
      },
      changePassword: {
        invalid: false,
        message: '',
      },
      confirmPassword: {
        invalid: false,
        message: '',
      },
    };
  },
);

watch(
  () => userName.value,
  () => {
    if (userName.value?.length === 0) {
      formValid.value.name = {
        invalid: true,
        message: 'Name is required!',
      };
    } else {
      formValid.value.name = {
        invalid: false,
        message: '',
      };
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => email.value,
  () => {
    if (email.value?.length === 0) {
      formValid.value.email = {
        invalid: true,
        message: 'Email is required!',
      };
    } else {
      formValid.value.email = {
        invalid: false,
        message: '',
      };
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => ({
    changePass: changePassword.value,
    confirmPass: confirmPassword.value,
  }),
  ({ changePass, confirmPass }) => {
    if (changePass?.length === 0) {
      formValid.value.changePassword = {
        invalid: true,
        message: 'Change Password is required!',
      };
    } else {
      formValid.value.changePassword = {
        invalid: false,
        message: '',
      };
    }

    if (confirmPass?.length === 0) {
      formValid.value.confirmPassword = {
        invalid: true,
        message: 'Confirm Password is required!',
      };
    } else if (confirmPass !== changePass) {
      formValid.value.confirmPassword = {
        invalid: true,
        message: 'Change Password & Confirm Password not match!',
      };
    } else {
      formValid.value.confirmPassword = {
        invalid: false,
        message: '',
      };
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :draggable="false"
    class="w-[60%] h-[80%]"
    :pt="{
      header: {
        class: '!justify-end',
      },
      pcCloseButton: {
        class: '!text-red-500',
      },
      content: {
        class: '!w-full !h-full',
      },
    }"
  >
    <div class="w-full h-full">
      <div class="w-full h-full flex gap-2">
        <div class="w-[20%] px-2 pb-2">
          <div class="flex flex-col gap-3">
            <div @click="showMenu('profile')" class="cursor-pointer">
              <span>Profile</span>
            </div>
            <div @click="showMenu('changePassword')" class="cursor-pointer">
              <span>Change Password</span>
            </div>
          </div>
        </div>
        <span class="h-full border border-black pb-2" />
        <div class="w-[80%] h-full">
          <form
            v-if="menu?.profile && !menu?.changePassword"
            class="px-4 pb-2"
            @submit.prevent="updateProfile"
          >
            <div class="flex flex-col pb-4 gap-2">
              <span class="font-medium">Profile</span>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-2">
                <label for="email" class="text-sm">
                  <span>Name</span>
                  <span class="text-red-500"> * </span>
                </label>
                <InputText
                  v-model="userName"
                  :default-value="userName"
                  id="name"
                  name="name"
                  size="small"
                />
                <Message
                  v-if="formValid?.name?.invalid"
                  class="text-xs"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ formValid?.name?.message }}
                </Message>
              </div>
              <div class="flex flex-col gap-2">
                <label for="email" class="text-sm">
                  <span>Email</span>
                  <span class="text-red-500"> * </span>
                </label>
                <InputText
                  v-model="email"
                  id="email"
                  name="email"
                  size="small"
                  type="email"
                />
                <Message
                  v-if="formValid?.email?.invalid"
                  class="text-xs"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ formValid?.email?.message }}
                </Message>
              </div>
            </div>
            <div class="flex justify-end py-4">
              <Button
                type="submit"
                label="Update Profile"
                size="small"
                class="!bg-blue-500 !text-[#EAEFFE] hover:!bg-blue-400"
              />
            </div>
          </form>
          <form
            v-else-if="!menu?.profile && menu?.changePassword"
            class="px-4 pb-2"
            @submit.prevent="changePaswordUser"
          >
            <div class="flex flex-col pb-4 gap-2">
              <span class="font-medium">Change Password</span>
              <span>Create a new password for your account</span>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-2">
                <label for="newPassword" class="text-sm">
                  <span>New Password</span>
                  <span class="text-red-500"> * </span>
                </label>
                <Password
                  v-model="changePassword"
                  input-id="newPassword"
                  name="newPassword"
                  toggle-mask
                  fluid
                  size="small"
                  :feedback="false"
                />
                <Message
                  v-if="formValid?.changePassword?.invalid"
                  class="text-xs"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ formValid?.changePassword?.message }}
                </Message>
              </div>
              <div class="flex flex-col gap-2">
                <label for="confirmNewPassword" class="text-sm">
                  <span>Confirm New Password</span>
                  <span class="text-red-500"> * </span>
                </label>
                <Password
                  v-model="confirmPassword"
                  input-id="confirmNewPassword"
                  name="confirmNewPassword"
                  toggle-mask
                  fluid
                  size="small"
                  :feedback="false"
                />
                <Message
                  v-if="formValid?.confirmPassword?.invalid"
                  class="text-xs"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ formValid?.confirmPassword?.message }}
                </Message>
              </div>
            </div>
            <div class="flex justify-end py-4">
              <Button
                type="submit"
                label="Change Password"
                size="small"
                class="!bg-blue-500 !text-[#EAEFFE] hover:!bg-blue-400"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </Dialog>
</template>
