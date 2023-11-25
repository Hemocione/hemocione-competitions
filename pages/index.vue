<template>
  <NavBar />
  <div class="summaries-list">
    <h1 :style="{ margin: 0 }">Competições</h1>
    <div>
      <div :style="{ margin: '10px 0 15px 0' }">
        Clique em uma competição para registrar sua doação ou acessar as
        informações.
      </div>
    </div>
    <div>
      <div :class="onGoingSwitchClass" @click="switchOnGoing(true)">
        Em andamento
      </div>
      <div :class="closedSwitchClass" @click="switchOnGoing(false)">
        Encerradas
      </div>
    </div>
    <div>
      <CompetitionSummary
        v-for="s in summaries"
        :title="s.title"
        :start="s.start"
        :end="s.end"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const onGoing = ref(false);
const summaries = [
  {
    title: "Semana Universitária de Doação de Sangue de São Paulo",
    start: new Date(),
    end: new Date(),
  },
  {
    title: "Competição IDOR: Enfermagem x Radiologia",
    start: new Date(),
    end: new Date(),
  },
];

const onGoingSwitchClass = computed(() => [
  "switch",
  onGoing.value ? "switch-on" : "switch-off",
]);

const closedSwitchClass = computed(() => [
  "switch",
  onGoing.value ? "switch-off" : "switch-on",
]);

function switchOnGoing(v: boolean) {
  if (v == onGoing.value) return;
  onGoing.value = v;
}
</script>

<style>
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

.summaries-list {
  padding: 20px;
  margin: auto;
  margin-top: 0;
  width: 70%;
  background-color: white;
  height: 100%;
}
</style>
