<template>
  <div class="ranking">
    <div class="ranking-title">
      <span v-for="label in ranking.labels" :key="label" class="f1">{{
        label
      }}</span>
    </div>
    <div
      class="ranking-row"
      v-for="content in ranking.contents"
      :key="content.position"
    >
      <span v-for="(value, key) in content" :key="key" class="f1">{{
        value
      }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
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
  margin-top: 30px;
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
</style>
