<template>
  <el-container class="main-container">
    <el-main class="main-strip">
      <div class="summaries-list">
        <!-- Competition Header -->
        <h1 class="summary-title">Competições</h1>
        <p class="summary-subtitle">
          Clique em uma competições para registrar sua doação ou acessar as
          informações.
        </p>

        <!-- Competition Status Switch -->
        <div :class="onGoingSwitchClass" @click="switchOnGoing(true)">
          Em andamento
        </div>
        <div :class="closedSwitchClass" @click="switchOnGoing(false)">
          Encerradas
        </div>

        <!-- Competition Summaries -->
        <CompetitionSummary
          v-for="(summary, idx) in filteredSummaries"
          class="summaryBox"
          :key="summary.title + idx"
          :title="summary.name"
          :start="summary.start"
          :end="summary.end"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
navigateTo('https://hemocione.com.br', { external: true }) // for now

import dayjs from "dayjs";

const onGoing = ref(true);

const { data: competitions } = await useFetch(`/api/v1/competitions`);

const summaries = competitions.value?.map((competition) => ({
  name: competition.name,
  start: dayjs(competition.start_at).toDate(),
  end: dayjs(competition.end_at).toDate(),
}));

const closedSummaries = computed(() =>
  summaries.filter((summary) => summary.end < dayjs().toDate())
);
const onGoingSummaries = computed(() =>
  summaries.filter((summary) => summary.end >= dayjs().toDate())
);
const filteredSummaries = computed(() =>
  onGoing.value ? onGoingSummaries.value : closedSummaries.value
);

const onGoingSwitchClass = computed(() => [
  "switch",
  onGoing.value ? "switch-on" : "switch-off",
]);

const closedSwitchClass = computed(() => [
  "switch",
  onGoing.value ? "switch-off" : "switch-on",
]);

function switchOnGoing(v: boolean) {
  if (v === onGoing.value) {
    return;
  }
  onGoing.value = v;
}
</script>

<style scoped>
.main-container {
  display: flex;
}
.summaryBox {
  margin-bottom: 20px;
}
.header {
  padding: 0px;
}
.f1 {
  flex: 1;
}
.summary-title {
  margin: 0;
}
.summary-subtitle {
  margin: 10px 0 15px 0;
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
/* TODO: add missing mobile responsive style */
.summaries-list {
  padding: 20px;
  width: 60vw;
  background-color: white;
}
.main-strip {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #f9f9fa;
  height: 100%;
  padding: 0px;
}
</style>
