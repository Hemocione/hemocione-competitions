<template>
  <div class="ranking" :style="`--col-count: ${columnCount}`">
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
          :class="{
            'bold-text': content.shouldHighlight,
            f1: true,
            component: true,
          }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
type SimpleContent = string | number | null;

const props = defineProps<{
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

const columnCount = computed(() => props.ranking.labels.length);

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
  display: grid;
  grid-template-columns: repeat(var(--col-count), 1fr);
  border: solid #dbdde0 2px;
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
}

.ranking-title,
.ranking-row {
  display: contents; /* Mantém a estrutura do grid */
  border: solid #dbdde0 2px;
}

.ranking-title span,
.ranking-row span,
.ranking-row .component {
  text-align: center;
  align-items: center;
  padding: 10px;
  border-bottom: solid #dbdde0 2px;
  background-color: white;
}

.ranking-row:last-of-type span,
.ranking-row:last-of-type .component {
  border-bottom: none;
}

.ranking-title span {
  background-color: #f3f2f1;
  font-weight: bold;
}

.bold-text {
  font-weight: 700;
}
</style>
