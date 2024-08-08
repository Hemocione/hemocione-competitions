<template>
  <div>
    <TemplateCompetitionContent2 :disablePodium="false">
      <template #podium-content>
        <div class="blood-view">
          <h4>TOTAL DE DOAÇÕES REALIZADAS</h4>
          <h1 class="blood-amount-donation">
            {{
              donationsAmount < 1000
                ? donationsAmount
                : donationsAmount / 1000 + "K"
            }}
          </h1>
          <div class="general-view">
            <img
              src="/images/HemoLogo.svg"
              class="view-img"
              style="width: 60%"
            />
          </div>
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
  donationsAmount: number;
  mappedRankByCompetition: any;
}>();
</script>
<style>
.general-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.view-img {
  margin-bottom: 30%;
}

.blood-amount-donation {
  position: absolute;
  margin-top: 28%;
  color: white;
}

.blood-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  position: relative;
}
</style>
