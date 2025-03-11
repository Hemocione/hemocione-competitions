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
      <template v-for="label in ranking.labels">
        <span
          :key="`${label}-text`"
          :class="{ 'bold-text': content.shouldHighlight, f1: true }"
          v-if="isContentLabelSimpleContent(content[label])"
        >
          {{ `${content[label]}` || "" }}
        </span>
        <component
          v-else
          :key="`${label}-component`"
          :is="content[label].component"
          v-bind="content[label].props"
          :class="{ 'bold-text': content.shouldHighlight, f1: true }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
type SimpleContent = string | number | null;

defineProps<{
  ranking: {
    labels: string[];
    contents: Record<
      string,
      | SimpleContent
      | {
          component: Component;
          props?: Record<string, unknown>;
        }
    >[];
  };
}>();

const isContentLabelSimpleContent = (
  contentLabel: unknown
): contentLabel is SimpleContent => {
  return (
    typeof contentLabel === "string" ||
    typeof contentLabel === "number" ||
    contentLabel === null
  );
};
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
  align-items: center;
}
.f1 {
  flex: 1;
  text-align: center;
  justify-content: center;
  height: 100%;
}
.bold-text {
  font-weight: 700;
}
</style>
