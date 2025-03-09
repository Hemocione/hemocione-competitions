<template>
  <div class="ranking-item">
    <img v-if="logo" :src="logo" alt="Logo" class="ranking-item__logo" />
    <CommonNameCircleAvatar v-else :name="label" :size="20" />

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
  gap: 8px;
  width: 100%;
}

.ranking-item__logo,
.ranking-item__avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.ranking-item__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}
</style>
