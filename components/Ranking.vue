<template>
  <div class="ranking">
    <div class="ranking-title">
      <span v-for="label in ranking.labels" :key="label" class="f1">
        {{ label }}
      </span>
    </div>
    <div
      class="ranking-row"
      v-for="(content, idx) in ranking.contents"
      :key="idx"
    >
      <span
        v-for="label in ranking.labels"
        :key="label"
        :class="{ 'bold-text': content.shouldHighlight, f1: true }"
      >
        {{ `${content[label]}` || "" }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  ranking: {
    labels: string[];
    contents: Record<string, string | number | null>[];
  };
}>();
</script>

<style scoped>
.ranking {
  border: solid #dbdde0 2px;
  border-radius: 8px;
  border-bottom: 0px;
}
.ranking-title {
  background-color: #f3f2f1;
  padding: 10px;
  border-bottom: solid #dbdde0 2px;
  display: flex;
  text-align: center;
}
.ranking-row {
  padding: 20px;
  border-bottom: solid #dbdde0 2px;
  display: flex;
  text-align: center;
  background-color: white;
}
.f1 {
  flex: 1;
}
.bold-text {
  font-weight: 700;
}
</style>
