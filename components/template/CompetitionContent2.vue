<template>
  <div class="details-grid">
    <div :class="{ podium: !disablePodium }">
      <slot name="podium-content"></slot>
    </div>
    <slot name="ranking-content"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  disablePodium: boolean;
}>();
</script>

<style scoped>
.details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.podium {
  border: solid #dbdde0 2px;
  width: 100%;
  min-height: 220px;
  background-color: #f9f9fa;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8%;
}
</style>
