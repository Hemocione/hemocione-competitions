<template>
  <NuxtLink class="summaryBox" :to="`/competition/${slug}`">
    <div :style="{ flex: 9 }">
      <h4 class="card-title">
        {{ title }}
      </h4>

      <h5 class="card-letter">INÍCIO: {{ formatDate(start) }}</h5>
      <h5 class="card-letter">TÉRMINO: {{ formatDate(end) }}</h5>
    </div>
    <div class="arrow">
      <img class="arrow-img" src="/images/bodylessArrow.svg" />
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

defineProps({
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
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
    font-size: 18px;
  }
  .card-letter {
    color: #52575c;
    letter-spacing: 0.5px;
    font-weight: 500;
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
