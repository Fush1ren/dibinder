<script setup lang="ts">
import { useOtpStore } from '@/stores';
import type { OtpFormProps, ErrorsForm, OtpInput } from '@/types';
import type { FormResolverOptions } from '@primevue/forms';
import { InputOtp } from 'primevue';
import { onMounted, ref } from 'vue';

defineProps<OtpFormProps>();
const emit = defineEmits();

onMounted(() => {
  resendCountdown();
});

const otp = ref<string>();
const otpStore = useOtpStore();

const initialValues = ref<OtpInput>();

const resolver = (val: FormResolverOptions) => {
  const errors = {
    otp: [] as ErrorsForm[],
  };

  if (val?.values?.otp) {
    errors.otp = [
      {
        message: 'OTP is Required',
      },
    ];
  }

  return {
    errors,
  };
};

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
</script>
<template>
  <div>
    <Form
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="$emit('verify', 'click', otp)"
      class=""
    >
      <div class="flex flex-col gap-4">
        <Message
          v-if="$form.otp?.invalid"
          class="!text-xs !text-center"
          severity="error"
          size="small"
          >{{ $form.otp?.error.message }}</Message
        >
        <InputOtp
          v-model="otp"
          id="otp"
          name="otp"
          placeholder="Enter OTP"
          input-class="w-full p-3 border border-gray-300 rounded"
          integerOnly
          required
          :class="{ 'p-invalid': $form.otp?.invalid }"
          :length="6"
        />
      </div>
      <Button
        type="submit"
        label="Verify OTP"
        class="mt-5 !text-sm w-full !bg-blue-600 dark:!bg-blue-500 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white hover:!bg-blue-800 hover:dark:!bg-blue-700"
      />
    </Form>
    <div class="text-center mt-5">
      <p class="text-gray-600">
        Didn't receive the OTP?
        <span v-if="otpStore.countdown > 0" class="text-sm text-gray-500">
          (Resend in {{ otpStore.countdown }}s)</span
        >
        <a
          v-if="otpStore.countdown === 0"
          @click="$emit('resend')"
          class="text-blue-500 cursor-pointer transition-all duration-300 hover:underline"
          >Resend OTP</a
        >
      </p>
    </div>
  </div>
</template>
