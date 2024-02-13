<template>
  <div class="main-form-container">
    <header>
      <h2>Cachaceiros de Plantão</h2>
      <h3>Olá, carluxoow!</h3>
      <p>Selecione sua equipe para registrar a doação</p>
    </header>
    <select>
      <option
        v-for="(item, idx) in ['forró boys', 'forró perfeito', 'soró silva']"
        :key="idx + item"
      >
        {{ item }}
      </option>
    </select>
    <input />
    <input />
  </div>
</template>
<script setup lang="ts">
const props = defineProps(["competitionName", "name"]);
</script>
<style>
.main-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: red;
  /* justify-content: center; */
  flex-direction: column;
}
</style>