<script setup lang="ts">
import type { ButtonColorData, CDialogEmits, CDialogProps } from '@/types';
import { Button, Dialog, InputText } from 'primevue';
import { ref, watch } from 'vue';
import ButtonColor from './ButtonColor.vue';

const modelValue = defineModel<boolean>('visible', {
  default: false,
});

const emit = defineEmits<CDialogEmits>();

const props = withDefaults(defineProps<CDialogProps>(), {
  data: undefined,
});

const listName = ref<string>('');
const colors = ref<string>('');

const setColor = (e: {
  event: PointerEvent | Event;
  data: ButtonColorData;
}): void => {
  colors.value = e?.data?.color as string;
};

const submitAction = async (): Promise<void> => {
  emit('submit', {
    id: props?.data?._id,
    name: listName?.value as string,
    colors: colors?.value,
  });
};

watch(
  () => props?.data,
  () => {
    colors.value = props?.data?.color as string;
    listName.value = props?.data?.name as string;
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
    :header="header"
    :style="{ width: '25rem' }"
    :pt="{
      header: '!px-5 !pt-4',
    }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4 w-full pt-4">
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm">
          <span>Name</span>
          <span class="text-red-500"> * </span>
        </label>
        <InputText
          v-model="listName"
          id="taskName"
          name="taskName"
          size="small"
        />
      </div>
      <div class="flex flex-row gap-2">
        <label for="email" class="text-sm">
          <span>Color :</span>
        </label>
        <ButtonColor
          @submit="setColor"
          :clickable="true"
          :data="{
            id: props.data?._id as string,
            name: props.data?.name as string,
            color: colors as string,
          }"
        />
      </div>
      <div class="flex justify-end">
        <Button
          @click="submitAction"
          type="button"
          label="Add"
          size="small"
          class="!bg-blue-500 !text-[#EAEFFE] hover:!bg-blue-400"
        />
      </div>
    </div>
  </Dialog>
</template>
