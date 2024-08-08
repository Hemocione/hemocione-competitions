<template>
  <div class="switch-container">
    <div class="switch-content">
      <div
        v-for="(item, idx) in props.items"
        :key="idx"
        :class="getSwitchClass(idx)"
        @click="switchOnGoing(idx)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: {
    name: string;
  }[];
}>();

const emit = defineEmits<{
  (e: 'update:selected', value: string): void;
}>();

const currentSelected = ref(0);

const switchOnGoing = (idx: number) => {
  currentSelected.value = idx;
  emit('update:selected', props.items[idx].name);
};

const getSwitchClass = (idx: number) => [
  "switch",
  idx === currentSelected.value ? "switch-on" : "switch-off",
];
</script>

<style scoped>
.switch-container {
  display: flex;
  flex-direction: column;
}
.switch-content {
  display: flex;
  flex-direction: row;
}
.switch {
  display: inline-block;
  height: 26px;
  margin-right: 40px;
  margin-bottom: 20px;
  cursor: pointer;
}
.switch-on {
  border-bottom: solid 5px #bb0a08;
}
.switch-off {
  color: gray;
}
</style>
