<template>
  <div class="details-grid">
    <div class="podium">
      <slot name="podium-content"></slot>
    </div>
    <div class="ranking">
      <div class="ranking-title">
        <span class="f1">#</span>
        <span class="f1">{{ ranking.labelByType }}</span>
        <span class="f1">{{ ranking.labelByValue }}</span>
      </div>
      <div class="ranking-row" v-for="(content, idx) in ranking.contents" :key="idx">
        <span class="f1">{{ idx + 1 + "°" }}</span>
        <span class="f1">{{ content.name }}</span>
        <span class="f1">{{ content.value }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

defineProps<{
  ranking: {
    labelByType: string
    labelByValue: string
    contents: {
      name: string
      value: number | null
    }[]
  }
}>()

</script>
<style scoped>
.details-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  min-height: var(--hemo-page-min-height);
  width: 100%;
  position: relative;
}

.details-strip {
  width: 100%;
  max-width: var(--hemo-page-max-width);
  height: 100%;
  min-height: var(--hemo-page-min-height);
  background-color: white;
  padding: 20px 5%;
}

.details-title {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
}

.details-status {
  display: flex;
  align-items: center;
  height: 30px;
  color: white;
  border-radius: 200px;
  padding: 18px;
}

.status-teams {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 50px;
}

.details-grid {
  display: flex;
  flex-direction: column;
}

.detail-team-select {
  height: 48px;
  width: 30%;
}

.ranking {
  border: solid #dbdde0 2px;
  border-radius: 8px;
  border-bottom: 0px;
  margin-top: 30px;
  grid-column-start: 1;
  grid-column-end: 3;
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

.register-button {
  height: 40px;
  background-color: #e93c3c;
  width: 100%;
}

.podium {
  border: solid #dbdde0 2px;
  width: 100%;
  min-height: 220px;
  background-color: #f9f9fa;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8%;
}

.place-strip {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 60px;
  min-height: 280px;
}

.podium-step {
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  text-align: center;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}

.team-image-name {
  text-align: center;
}

.snd.podium-step {
  background-color: #efefef;
  flex: 5;
}

.st.podium-step {
  background-color: #ffebc2;
  flex: 100;
}

.rd.podium-step {
  background-color: #dfd0cc;
  flex: 0.8;
}

.podium-user {
  height: 60px;
}

.medal {
  height: 50px;
}

.f1 {
  flex: 1;
}

.competition-name {
  margin-left: 10px;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--hemo-text-color);
}

.back-arrow {
  width: 1.5rem;
  height: 1.5rem;
}

@media screen and (max-width: 753px) {
  .detail-team-select {
    height: 48px;
    width: 40%;
  }

  .register-button {
    height: 48px;
    flex: 10;
  }
}
</style>