<template>
  <div class="ranking">
    <div class="ranking-title">
      <span v-for="label in ranking.labels" :key="label" class="f1">
        {{ label }}
      </span>
    </div>
    <div
      class="ranking-row"
      v-for="(content, idx) in filteredContents"
      :key="idx"
    >
      <span
        v-for="label in ranking.labels"
        :key="label"
        :class="{ 'bold-text': isUserContent(content) }"
        class="f1"
      >
        {{ content[label] || "" }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "~/store/user";

// Get the user from the store
const { user } = useUserStore();

const props = defineProps<{
  ranking: {
    labels: string[];
    contents: Record<string, string | number | null>[];
  };
}>();

// Computed property to filter contents based on labels
const filteredContents = computed(() => {
  return props.ranking.contents.filter((content) =>
    props.ranking.labels.every((label) => label in content)
  );
});

// Check if the content's id matches the user's id
const isUserContent = (content: Record<string, string | number | null>) =>
  user?.id === content.hemocioneID;
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
.bold-text {
  font-weight: bold;
}
</style>
