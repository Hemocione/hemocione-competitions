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
      <div class="status-tag" :style="{ backgroundColor: statusColor }">
        <span class="tag-label">{{ status }}</span>
      </div>
      <img class="arrow-img" src="/images/bodylessArrow.svg" />
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

const props = defineProps({
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

const currentDate = dayjs();
const status = computed(() => {
  const startDate = dayjs(props.start);
  const endDate = dayjs(props.end);

  console.log(currentDate, startDate, endDate);
  if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
    return 'ABERTO';
  } 
  else if (currentDate.isBefore(startDate)) {
    return 'EM BREVE';
  }

  return 'ENCERRADO';

});

const statusColor = computed(() => {
  switch (status.value) {
    case 'ABERTO':
      return '#40DD7F'; // Verde
    case 'EM BREVE':
      return '#FFBC1F'; // Amarelo
    case 'ENCERRADO':
      return '#F44336'; // Vermelho
    default:
      return '#40DD7F'; // Verde padrão
  }
});

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

  .status-tag {
    display: inline-block;
    border-radius: 18px;
    padding: 2px 15px;
    margin: 10px 0;
    white-space: nowrap;
    width: 100px; 
    text-align: center; 
  }

  .tag-label {
    color: white;
    font-weight: regular;
    font-size: 14px;
    display: inline-block;
  }
</style>
