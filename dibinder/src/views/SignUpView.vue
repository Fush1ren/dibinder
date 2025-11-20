<script setup lang="ts">
import { ref } from 'vue';
import {
  Form,
  type FormResolverOptions,
  type FormSubmitEvent,
} from '@primevue/forms';
import {
  Button,
  Image,
  InputText,
  Message,
  Password,
  useToast,
} from 'primevue';
import type { ErrorsForm, RegisterInputValue } from '@/types';
import config from '@/config';
import { useRouter } from 'vue-router';
import { useOtpStore } from '@/stores';

const router = useRouter();
const toast = useToast();
const otpStore = useOtpStore();

const initialValues = ref<RegisterInputValue>();
const isLoading = ref(false);

const triggerButton = (path: string): void => {
  if (!path) return;
  router.push(path);
};

const signUpWithGoogle = (): void => {
  window.location.href = `${config.api_url}/api/auth/google`;
};

const resolver = async (
  val: FormResolverOptions,
): Promise<Record<string, any>> => {
  const values = val?.values;

  const errors = {
    name: [] as ErrorsForm[],
    email: [] as ErrorsForm[],
    password: [] as ErrorsForm[],
    confirm_password: [] as ErrorsForm[],
  };

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!values.name) {
    errors.name = [{ message: 'Name is required' }];
  }

  if (!values.email) {
    errors.email = [{ message: 'Email is required' }];
  } else if (!regexEmail.test(values.email)) {
    errors.email = [{ message: 'Email is not valid' }];
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required' }];
  } else if (!regexPassword.test(values.password)) {
    errors.password = [
      {
        message:
          'Password must be at least 8 characters long and contain at least one letter, one number, and one special character.',
      },
    ];
  }

  if (!values.confirm_password) {
    errors.confirm_password = [{ message: 'Confirm Password is required' }];
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = [{ message: 'Passwords do not match' }];
  }

  return {
    errors,
  };
};

const submitForm = async (e: FormSubmitEvent) => {
  try {
    isLoading.value = true;

    if (!e?.valid) return;

    const response = await fetch(`${config.api_url}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e?.states?.name?.value,
        email: e?.states?.email?.value,
        password: e?.states?.password?.value,
      }),
    });

    const data = await response.json();

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Check email for OTP verification',
      life: 3000,
    });

    otpStore.forVerify(data.email, 'register');
    console.log(data);
    router.push('/verify');
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="grid grid-cols-1 h-screen md:grid-cols-12 overflow-hidden">
    <div
      class="bg-primary flex flex-col gap-4 justify-center items-start px-5 md:px-20 py-10 col-span-1 w-full md:col-span-6 lg:col-span-5 overflow-y-auto"
    >
      <h3 class="w-full text-light text-center font-bold text-xl">
        Sign up for DiBinder
      </h3>

      <span class="w-full text-light text-center text-sm"
        >Have an Account?
        <a
          @click="triggerButton('/login')"
          class="text-blue-500 hover:text-blue-600 cursor-pointer"
          >Login</a
        >
      </span>

      <Form
        v-slot="$form"
        :initialValues
        :resolver="resolver"
        @submit="submitForm"
        class="flex flex-col gap-4 w-full pt-4"
      >
        <div class="flex flex-col gap-2">
          <label for="email" class="text-sm">
            <span>Name</span>
            <span class="text-red-500"> * </span>
          </label>
          <InputText id="name" name="name" />
          <Message
            v-if="$form?.name?.invalid"
            class="text-sm"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form?.name?.error?.message }}
          </Message>
        </div>
        <div class="flex flex-col gap-2">
          <label for="email" class="text-sm">
            <span>Email</span>
            <span class="text-red-500"> * </span>
          </label>
          <InputText id="email" name="email" />
          <Message
            v-if="$form?.email?.invalid"
            class="text-sm"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form?.email?.error?.message }}
          </Message>
        </div>
        <div class="flex flex-col gap-2">
          <label for="password" class="text-sm">
            <span>Password</span>
            <span class="text-red-500"> * </span>
          </label>
          <Password
            input-id="password"
            name="password"
            toggle-mask
            fluid
            :feedback="false"
          />
          <Message
            v-if="$form.password?.invalid"
            class="text-xs"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.password?.error.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-2">
          <label for="password" class="text-sm">
            <span>Confirm Password</span>
            <span class="text-red-500"> * </span>
          </label>
          <Password
            input-id="confirm_password"
            name="confirm_password"
            toggle-mask
            fluid
            :feedback="false"
          />
          <Message
            v-if="$form.confirm_password?.invalid"
            class="text-xs"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.confirm_password?.error.message }}</Message
          >
        </div>

        <div class="pt-4">
          <Button
            type="submit"
            label="Sign up"
            class="!bg-blue-500 !text-light hover:!bg-blue-400"
            fluid
          />
        </div>
      </Form>
      <div class="w-full flex flex-col gap-4 pt-6">
        <Button
          class="!text-light !border-[#52525b] hover:!bg-gray-300/10"
          fluid
          outlined
          @click="signUpWithGoogle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <g fill="none" fill-rule="evenodd" clip-rule="evenodd">
              <path
                fill="#f44336"
                d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
                opacity="0.987"
              />
              <path
                fill="#ffc107"
                d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
                opacity="0.997"
              />
              <path
                fill="#448aff"
                d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
                opacity="0.999"
              />
              <path
                fill="#43a047"
                d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
                opacity="0.993"
              />
            </g>
          </svg>
          <span class="p-button-label">Sign up with Google</span>
        </Button>
      </div>
    </div>
    <div class="hidden md:block md:col-span-6 lg:col-span-7">
      <Image
        src="/img/nick-martin-H2MpDlwc83c-unsplash.jpg"
        :pt="{
          image: {
            class: 'h-full object-cover',
          },
        }"
      />
      <span
        class="text-xs text-white stroke-black/50 absolute flex items-center gap-2 right-0 bottom-0 px-5 py-5"
      >
        <i class="pi pi-camera w-4 h-4" />
        Photo by
        <a
          href="https://unsplash.com/@nickanthony?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >Nick Martin</a
        >
        on
        <a
          href="https://unsplash.com/photos/a-snow-covered-mountain-range-with-trees-in-the-foreground-H2MpDlwc83c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
        >
          Unsplash
        </a>
      </span>
    </div>
  </div>
</template>
