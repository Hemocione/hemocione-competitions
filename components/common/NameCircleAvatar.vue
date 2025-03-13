<template>
  <div class="circle" :style="circleStyle">
    {{ abbreviation }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
  size?: number;
  fontSize?: number;
}>();

const colors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const abbreviation = computed(() => {
  const cleanedName = props.name.trim().replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, ""); // Remove caracteres especiais, mantendo espaços
  const words = cleanedName.split(/\s+/);
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
});

const color = computed(() => {
  const index = hashCode(props.name) % colors.length;
  return colors[index];
});

const circleStyle = computed(() => {
  const size = props.size || 50;
  const fontSize = props.fontSize || size * 0.4;
  return {
    backgroundColor: color.value,
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: `${size}px`,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: `${fontSize}px`,
  };
});
</script>

<style scoped>
.circle {
  text-transform: uppercase;
}
</style>
