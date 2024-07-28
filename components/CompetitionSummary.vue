<template>
  <NuxtLink class="summaryBox" :to="`/competition/${slug}`">
    <img
      v-if="banner_background"
      class="background-img"
      :class="{ 'opacity-img': isClosed }"
      :src="banner_background"
    />
    <div :class="['content', { 'gray-text': isClosed }]">
      <p :class="['card-title', { 'gray-text': isClosed }]">
        {{ title }}
      </p>
      <div class="card-info">
        <div class="card-dates">
          <div class="card-date-item">
            <img
              class="card-dates-icons"
              :class="{ 'opacity-img': isClosed }"
              src="/images/gis_route-start.svg"
              alt="start_point"
            />
            <h5 :class="['card-letter', { 'gray-text': isClosed }]">
              {{ formatDate(start) }}
            </h5>
          </div>
          <div class="card-date-item">
            <img
              class="card-dates-icons"
              :class="{ 'opacity-img': isClosed }"
              src="/images/maki_racetrack.svg"
              alt="end_point"
            />
            <h5 :class="['card-letter', { 'gray-text': isClosed }]">
              {{ formatDate(end) }}
            </h5>
          </div>
        </div>
        <div class="card-feedback">
          <div class="status-tag" :style="{ backgroundColor: statusColor }">
            <span class="tag-label">{{ status }}</span>
          </div>
          <img class="arrow-img" src="/images/bodylessArrow.svg" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { computed } from "vue";

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
  banner_background: {
    type: String,
    required: false,
  },
});

const formatDate = (date: any) => dayjs(date).format("DD/MM/YYYY");

const currentDate = dayjs();
const status = computed(() => {
  const startDate = dayjs(props.start);
  const endDate = dayjs(props.end);

  if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
    return "ABERTO";
  }
  if (currentDate.isBefore(startDate)) {
    return "EM BREVE";
  }

  return "ENCERRADO";
});

const statusColor = computed(() => {
  switch (status.value) {
    case "ABERTO":
      return "#40DD7F"; // Verde
    case "EM BREVE":
      return "#FFBC1F"; // Amarelo
    case "ENCERRADO":
      return "#F44336"; // Vermelho
    default:
      return "#40DD7F"; // Verde padrão
  }
});

const isClosed = computed(() => status.value === "ENCERRADO");
</script>
<style scoped>
.summaryBox {
  display: flex;
  flex-direction: column;
  border: solid #dbdde0 2px;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
}
.content {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}

.card-title {
  font-size: 18px;
  margin: 10px 0;
}

.card-dates {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-right: auto;
}

.card-dates-icons {
  height: 1rem;
  width: 1rem;
}

.card-feedback {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-date-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-letter {
  color: #52575c;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin: 0;
}

.card-info {
  display: flex;
  align-items: center;
}

.arrow-img {
  margin-left: auto;
  height: 1.75rem;
}

.background-img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
}

.gray-text {
  color: #b0b0b0;
}

.opacity-img {
  opacity: 0.5;
}

.status-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  height: 1.5rem;
  border-radius: 16px;
  padding: 1px 15px;
}

.tag-label {
  color: white;
  font-weight: regular;
  font-size: 14px;
  display: inline-block;
}
</style>
