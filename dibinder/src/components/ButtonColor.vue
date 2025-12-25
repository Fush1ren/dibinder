<script setup lang="ts">
import type { ButtonColorEmits, ButtonColorProps } from '@/types';
import {
  Button,
  ColorPicker,
  InputGroup,
  InputGroupAddon,
  InputText,
  Popover,
} from 'primevue';
import { computed, ref, shallowRef, watch } from 'vue';

const props = withDefaults(defineProps<ButtonColorProps>(), {
  clickable: true,
});
const emit = defineEmits<ButtonColorEmits>();

const op = ref();
const inputKey = shallowRef<number>();
const hover = ref<boolean>(false);

const colors = ref<string>();
const newColor = computed(() => props.data?.color ?? '');
// convert hex ke RGBA dengan opacity 0.6
const rgbaColor = computed(() => {
  if (!newColor.value) return 'transparent';
  const hex = newColor.value?.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
});

const updateHover = computed(() => hover.value);

const buttonStyle = computed(() => ({
  backgroundColor: hover.value ? rgbaColor.value : `#${newColor.value}`,
}));

const toggle = (event: MouseEvent): void => {
  colors.value = props.data?.color;
  op.value?.toggle(event);
};

const handleKeypress = (event: KeyboardEvent): void => {
  const maxLength = 6;

  const isMaxLengthReached = maxLength === colors.value?.length;
  if (isMaxLengthReached) {
    event.preventDefault();

    if (isMaxLengthReached) {
      (inputKey.value as any)++;
    }
  }
};

const updateColor = (e?: PointerEvent | Event): void => {
  emit('submit', {
    event: e as PointerEvent | Event,
    data: {
      id: props?.data?.id,
      name: props?.data?.name,
      color: colors.value,
    },
  });
  op.value?.hide();
};

watch(
  () => op.value?.visible,
  () => {
    if (!op?.value?.visible) {
      colors.value = undefined;
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <button
    v-if="props.clickable"
    @click="toggle"
    :class="`relative !border-none mx-2 rounded-md transition-all duration-200 list-${props?.data?.id} cursor-pointer w-[32px] h-[28px] flex justify-center items-center`"
    :style="buttonStyle"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div
      v-if="updateHover"
      class="absolute inset-0 flex justify-center items-center pointer-events-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        @click.stop=""
      >
        <path
          fill="#fff"
          d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
        />
      </svg>
    </div>
  </button>
  <button
    v-else
    :class="`relative !border-none rounded-md transition-all duration-200 list-${props?.data?.id} cursor-pointer w-[20px] h-[20px] flex justify-center items-center`"
    :style="buttonStyle"
  />
  <Popover
    v-if="props.clickable"
    ref="op"
    :pt="{
      root: {
        class: '!bg-white',
      },
    }"
  >
    <div class="flex flex-row gap-3 items-center">
      <ColorPicker v-model="colors" format="hex" />
      <InputGroup>
        <InputGroupAddon
          :pt="{
            root: {
              class: '!bg-gray-200 !p-1 !border-black',
            },
          }"
        >
          <span class="text-lg font-bold text-black">#</span>
        </InputGroupAddon>
        <InputText
          :key="inputKey"
          v-model="colors"
          :name="`color-${data?.id ? `color-${data?.id}` : 'color'}`"
          class="!bg-transparent !text-black"
          type="text"
          :id="`${data?.id ?? 'color'}`"
          size="small"
          @keypress="handleKeypress"
          v-keyfilter.hex
        />
      </InputGroup>
      <Button
        @click="updateColor"
        label="Apply"
        size="small"
        type="button"
        class="!bg-blue-500 !text-white hover:!bg-blue-400"
      />
    </div>
  </Popover>
</template>
