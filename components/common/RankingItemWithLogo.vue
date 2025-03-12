<template>
  <div class="ranking-item">
    <NuxtImg
      v-if="logo"
      :src="logo"
      alt="Logo"
      class="ranking-item__logo"
      height="25"
      width="25"
    />
    <CommonNameCircleAvatar
      v-else
      :name="avatarGeneratorLabel ?? label"
      :size="25"
    />

    <ElTooltip v-if="isOverflowing" :content="label" placement="top">
      <span ref="labelRef" class="ranking-item__label">{{ label }}</span>
    </ElTooltip>
    <span v-else ref="labelRef" class="ranking-item__label">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { ElTooltip } from "element-plus";

defineProps({
  label: {
    type: String,
    required: true,
  },
  avatarGeneratorLabel: {
    type: String,
    default: null,
  },
  logo: {
    type: String,
    default: null,
  },
});

const labelRef = ref(null);
const isOverflowing = ref(false);

onMounted(async () => {
  await nextTick();
  if (labelRef.value) {
    isOverflowing.value =
      labelRef.value.scrollWidth > labelRef.value.clientWidth;
  }
});
</script>

<style scoped>
.ranking-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.ranking-item__logo {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
  object-fit: cover;
}

.ranking-item__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}
</style>
