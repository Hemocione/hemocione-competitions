<template>
  <div class="details-container">
    <NuxtLink class="back-arrow" to="/">
      <img src="/images/arrow.svg" />
    </NuxtLink>

    <div class="details-strip">
      <div class="details-title">
        <h1>{{ competitionName }}</h1>
      </div>
      <div class="status-teams">
        <div
          class="details-status"
          :style="`background-color:${statusInfo.color}`"
        >
          {{ statusInfo.status }}
        </div>

        <el-select
          v-if="allInstitutionDonations.length > 1"
          v-model="selectedType"
          class="detail-team-select"
          placeholder="Ranking"
          value-key="id"
        >
          <el-option
            v-for="(type, idx) in rankingTypes"
            :label="type"
            :value="type"
            :key="idx"
          />
        </el-select>
      </div>
      <div class="details-grid">
        <div class="podium">
          <div
            class="place-strip"
            v-for="(team, idx) in rankingTeamsClass"
            :key="idx"
          >
            <div :style="{ flex: 5 }" />
            <div class="team-image-name">
              <div :style="{ 'margin-bottom': '10px' }">
                <img class="podium-user" src="/images/defaultAvatar.svg" />
              </div>
              <div>{{ team.name }}</div>
            </div>
            <div :class="`${team.class} podium-step`">
              <img class="medal" :src="`/images/${team.medal}.svg`" />
              <span>{{ team.donation_count }}</span>
            </div>
          </div>
        </div>
        <div class="ranking">
          <div class="ranking-title">
            <span class="f1">Classificação</span>
            <span class="f1">{{ labelByType }}</span>
            <span class="f1">Doações</span>
          </div>
          <div
            class="ranking-row"
            v-for="(team, idx) in content"
            :key="team.id"
          >
            <span class="f1">{{ idx + 1 }}</span>
            <span class="f1">{{ team.name }}</span>
            <span class="f1">{{ team.donation_count }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="donationsIsOpen" class="register-sticky">
      <div class="register-button-strip">
        <NuxtLink :to="`/competition/${slug}/register`">
          <el-button class="register-button" type="primary">
            + Registrar nova doação
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import dayjs from "dayjs";

const selectedType = ref<string>("");

const route = useRoute();
const slug = route.params.slug;

const { data: competition } = await useFetch(`/api/v1/competitions/${slug}`);

const competitionName = computed(
  () => competition?.value?.name ?? "Copa Hemocione"
);

const importantDates = computed(() => {
  const now = dayjs();
  const end = dayjs(competition?.value?.end_at);
  const start = dayjs(competition?.value?.start_at);

  return { now, end, start };
});

const donationsIsOpen = computed(() => {
  const { now, end, start } = importantDates.value;
  return now.isAfter(start) && now.isBefore(end);
});

const statusInfo = computed(() => {
  const { now, end, start } = importantDates.value;

  if (now.isAfter(end))
    return {
      status: "FINALIZADO",
      color: "#FB4E4E",
    };
  if (now.isAfter(start))
    return {
      status: "EM ANDAMENTO",
      color: "#40DD7F",
    };
  return {
    status: "AGUARDANDO",
    color: "#f3f2f1",
  };
});

const competitionTeams = computed(() =>
  _.reverse(
    _.sortBy(
      competition.value?.competitionTeams.map((c) => ({
        id: c.id,
        donation_count: c.donation_count,
        name: c.teams.name,
      })),
      "donation_count"
    )
  )
);

const rankingTypes = computed(() => ["Equipe", "Instituição"]);
const labelByType = computed(() => {
  return (
    {
      Equipe: "Equipes",
      Instituição: "Instituições",
    }[selectedType?.value] || "Equipes"
  );
});

const allInstitutionDonations = computed(() => {
  const institutions = (competition.value?.competitionTeams ?? []).map((e) => ({
    ...e.teams.institutions,
    donation_count: e.donation_count,
  }));
  const newMap = Object.entries(_.groupBy(institutions, "name")).map(
    ([key, value]) => ({
      name: key,
      id: value[0].id,
      donation_count: value.reduce(
        (acc, curr) => acc + (curr?.donation_count ?? 0),
        0
      ),
    })
  );

  return _.sortBy(newMap, "donation_count");
});

const content = computed(() => {
  return (
    {
      Equipe: competitionTeams.value,
      Instituição: allInstitutionDonations.value,
    }[selectedType.value] || competitionTeams.value
  );
});

const rankingTeamsClass = computed(() => [
  { class: "snd", medal: "silver", ...content.value[1] },
  { class: "st", medal: "gold", ...content.value[0] },
  { class: "rd", medal: "bronze", ...content.value[2] },
]);
</script>

<style>
  .details-container {
    display: flex;
    background-color: white;
  }
  .details-strip {
    flex: 3;
    margin-bottom: 15vh;
    padding: 0 20%;
  }
  .details-title {
    text-align: center;
    margin-bottom: 60px;
  }
  .details-status {
    display: flex;
    align-items: center;
    height: 30px;
    color: white;
    border-radius: 200px;
    padding: 15px;
  }
  .status-teams {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
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
    border-radius: 5px;
    border-bottom: 0px;
    margin-top: 30px;
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .ranking-title {
    background-color: #f3f2f1;
    padding: 20px;
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
  .register-sticky {
    position: fixed;
    border-top: solid #dbdde0 2px;
    background-color: white;
    height: 10vh;
    width: 70vw;
    bottom: 0;
    display: flex;
  }
  .register-button-strip {
    margin: auto;
    flex: 4;
  }
  .register-button {
    height: 40px;
    background-color: #e93c3c;
    width: 100%;
  }
  .podium {
    border: solid #dbdde0 2px;
    width: 60%;
    height: 380px;
    background-color: #f9f9fa;
    border-radius: 5px;
    padding: 8px;
    display: flex;
    gap: 3%;
  }
  .place-strip {
    display: flex;
    flex-direction: column;
    gap: 18px;
    flex: 1;
    height: 100%;
  }
  .podium-step {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 15px 0px;
    text-align: center;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
  }
  .team-image-name {
    text-align: center;
  }
  .snd.podium-step {
    background-color: #efefef;
    flex: 15;
  }
  .st.podium-step {
    background-color: #ffebc2;
    flex: 100;
  }
  .rd.podium-step {
    background-color: #dfd0cc;
    flex: 5;
  }
  .podium-user {
    height: 60px;
  }
  .medal {
    height: 50px;
  }
  .back-arrow {
    position: absolute;
    margin: 25px 0px 0px 15px;
  }
  .f1 {
    flex: 1;
  }

  @media screen and (max-width: 753px) {
    .details-strip {
      padding: 0 10%;
    }
    .podium {
      width: 100%;
    }
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

