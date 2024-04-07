<template>
  <NuxtLink class="summaryBox" to="/competitionRank">
    <div :style="{ flex: 9 }">
      <h4 class="card-title">
        {{ title }}
      </h4>

      <h5 class="card-start">INÍCIO: {{ formatDate(start) }}</h5>
      <h5 class="card-end">TÉRMINO: {{ formatDate(end) }}</h5>
    </div>
    <div class="arrow">
      <img class="arrow-img" src="/images/bodylessArrow.svg" />
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

defineProps({
  title: String,
  start: Date,
  end: Date,
});

const formatDate = (date: any) => {
  return dayjs(date).format("DD/MM/YYYY [ÀS] HH:mm[H]");
};
</script>

<style>
.summaryBox {
  display: flex;
  border: solid #dbdde0 2px;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
}

.card-title {
}
.card-start {
  color: #52575c;
}
.card-end {
  color: #52575c;
}

.arrow {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arrow-img {
  height: 50px;
}
</style>
