<template>
  <div>
    <p>Dados atualizados ao final de cada dia.</p>
    <TemplateCompetitionContent2 :disablePodium="false">
      <template #podium-content>
        <div class="engagement-view">
          <h4>TOTAL DE CURTIDAS</h4>
          <h1 class="engagement-amount-likes">{{ engagementAmount }}</h1>
          <img src="/images/curtidas_icon.svg" />
          <p>curtidas</p>
        </div>
      </template>
      <template #ranking-content>
        <Ranking :ranking="mappedRankByCompetition" />
      </template>
    </TemplateCompetitionContent2>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  mappedRankByCompetition: any;
  engagementAmount: number;
}>();
</script>
<style>
.engagement-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  position: relative;
}

.engagement-amount-likes {
  position: absolute;
  margin-left: 1%;
  margin-top: 24%;
  color: white;
}
</style>
