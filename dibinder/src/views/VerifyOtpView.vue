<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOtpStore } from '@/stores';
import { Image, useToast } from 'primevue';
import { api } from '@/utils/axios';
import config from '@/config';
import OtpForm from '@/components/OtpForm.vue';

const router = useRouter();
const toast = useToast();
const otpStore = useOtpStore();
// const email = otpStore.email as string;
// const reason = otpStore.reason;
const email = ref<string>();
const reason = ref<string>();

onMounted(() => {
  email.value = otpStore.email as string;
  reason.value = otpStore.reason as string;

  if (!email.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No email found for OTP verification. Please try again!.',
      life: 3000,
    });
    router.push('/sign-up');
  }

  resendCountdown();
});

const resendCountdown = () => {
  otpStore.countdown = 120;
  const interval = setInterval(() => {
    if (otpStore.countdown > 0) {
      otpStore.countdown--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const onSubmitRegister = async (_e: any, otp: string) => {
  try {
    const response = await fetch(`${config?.api_url}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp,
      }),
    });

    const data = await response.json();

    if (data?.error) {
      toast.add({
        severity: 'error',
        summary: 'Failed',
        detail: `${data.message}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Account with email ${email} verified successfully!`,
      life: 3000,
    });

    router.push('/login');
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `${(e as Error).message}`,
      life: 3000,
    });
  }
};

const resendRegisterOtp = async () => {
  try {
    const response = await fetch(`${config?.api_url}/api/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const data = await response.json();

    if (data?.error) {
      toast.add({
        severity: 'error',
        summary: 'Failed',
        detail: `${data.message}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `OTP resend to ${email}!`,
      life: 3000,
    });

    resendCountdown();
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `${(e as Error).message}`,
      life: 3000,
    });
  }
};

const onSubmitChangePassword = async (_e: any, otp: string) => {
  try {
    const response = await api.post('/api/user/verify-otp', {
      email: email,
      otp,
    });

    if (response.status !== 200) {
      toast.add({
        severity: 'error',
        summary: 'Failed',
        detail: `${response.data?.message || 'Failed to verify OTP.'}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${response.data.message}`,
      life: 3000,
    });

    router.push('/settings/change-password');
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to send otp, try again!',
      life: 3000,
    });
  }
};

const resendChangePasswordOtp = async () => {
  try {
    const response = await api.post('/api/user/resend-otp', {
      email: email,
    });

    if (response.status != 200) {
      toast.add({
        severity: 'error',
        summary: 'Failed',
        detail: `${response.data?.message}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `OTP resend to ${email}!`,
      life: 3000,
    });

    resendCountdown();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `${(error as Error).message}`,
      life: 3000,
    });
  }
};
</script>
<template>
  <div
    class="flex flex-col bg-primary justify-center items-center min-h-screen"
  >
    <Image src="" />
    <div class="mb-4">
      <h2 class="text-center text-2xl font-bold mb-2">Verify OTP</h2>
      <p class="text-center text-gray-300">Enter the OTP sent to your email</p>
    </div>
    <div>
      <OtpForm
        v-if="reason == 'register'"
        @verify="onSubmitRegister"
        @resend="resendRegisterOtp"
        :email="email || ''"
        :reason="reason || ''"
      />
      <OtpForm
        v-if="reason == 'change-password'"
        @verify="onSubmitChangePassword"
        @resend="resendChangePasswordOtp"
        :email="email || ''"
        :reason="reason || ''"
      />
    </div>
  </div>
</template>
