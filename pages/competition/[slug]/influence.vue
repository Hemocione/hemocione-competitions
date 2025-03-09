<template>
  <div class="main">
    <header class="header">
      <NuxtLink :to="`/competition/${competitionSlug}`">
        <ElIcon>
          <ElIconArrowLeftBold />
        </ElIcon>
      </NuxtLink>
      <h2>Influencie pessoas a doarem sangue</h2>
    </header>
    <div class="main-container">
      <div class="success">
        <p v-html="influencedTitle" />
        <div v-if="competition?.influence_controls_team" style="width: 100%">
          <ElButton
            @click="toggleTeamDrawer"
            class="hemo-button"
            type="primary"
            size="large"
          >
            <template
              #icon
              v-if="competitionInfluence?.influence.competitionTeamId"
            >
              <NuxtImg
                v-if="currentInfluenceTeam?.logo_url"
                :src="currentInfluenceTeam?.logo_url"
                alt="Logo"
                class="logo_button"
                height="24"
                width="24"
              />
              <CommonNameCircleAvatar
                v-else
                :name="currentInfluenceTeamName || teamButtonLabel || ''"
                :size="24"
                style="border: 1px solid white"
              />
            </template>
            <template #icon v-else>
              <ElIconFlag />
            </template>
            {{ currentInfluenceTeamName || teamButtonLabel }}
          </ElButton>
          <span class="disclaimer-copy"
            >As próximas doações feitas por pessoas influenciadas por você serão
            computadas para o time selecionado!</span
          >
        </div>
        <img src="/images/illustrations/hemo-friends.png" class="friends" />
        <p v-html="influencedMessage" class="subtitle" />
        <div class="actions">
          <div class="action" @click="copyLink">
            <NuxtImg src="/images/icons/copy-link.svg" class="action-img" />
            Copiar Link
          </div>
          <NuxtLink
            :href="zapUrl"
            target="_blank"
            rel="noopener noreferrer"
            external
            class="action"
          >
            <NuxtImg src="/images/icons/zap.svg" class="action-img zap" />
            WhatsApp
          </NuxtLink>
          <div class="action" @click="more">
            <NuxtImg src="/images/icons/erllen-plus.svg" class="action-img" />
            Mais
          </div>
        </div>
      </div>
    </div>
    <ElDrawer
      v-model="teamDrawer"
      title="Escolha o time para o qual as doações serão computadas"
      :visible="teamDrawer"
      direction="btt"
      @close="teamDrawer = false"
      size="40%"
    >
      <TransitionGroup name="slide-fade-down" appear>
        <ElSelect
          v-model="selectedInstitution"
          placeholder="Selecione a instituição"
          clearable
          size="large"
          style="width: 100%; margin-bottom: 8px"
          v-if="institutions.length > 1"
          key="select-institution"
          :disabled="loadingSaveTeam"
        >
          <ElOption
            v-for="institution in institutions"
            :key="institution.id"
            :label="institution.name"
            :value="institution.id"
          >
            <div class="selection-wrapper">
              <NuxtImg
                v-if="institution?.logo_url"
                :src="institution?.logo_url"
                alt="Logo"
                class="logo_option"
                height="20"
                width="20"
              />
              <CommonNameCircleAvatar
                v-else
                :name="institution?.name"
                :size="20"
              />
              <span>{{ institution?.name }}</span>
            </div>
          </ElOption>
        </ElSelect>
        <ElSelect
          v-model="selectedCompTeamId"
          size="large"
          :placeholder="'Selecione sua equipe'"
          required
          filterable
          style="width: 100%"
          :disabled="!selectedInstitution || loadingSaveTeam"
        >
          <ElOption
            v-for="compTeam in competitionTeams"
            :key="compTeam.id"
            :label="compTeam?.teams?.name ?? compTeam.id"
            :value="compTeam.id"
          >
            <div class="selection-wrapper">
              <NuxtImg
                v-if="compTeam?.teams?.logo_url"
                :src="compTeam?.teams?.logo_url"
                alt="Logo"
                class="logo_option"
                height="20"
                width="20"
              />
              <CommonNameCircleAvatar
                v-else
                :name="compTeam?.teams?.name"
                :size="20"
              />
              <span>{{ compTeam?.teams?.name }}</span>
            </div>
          </ElOption>
        </ElSelect>
      </TransitionGroup>
      <ElButton
        @click="saveTeam"
        type="success"
        size="large"
        style="width: 100%; margin-top: 1rem"
        :loading="loadingSaveTeam"
        :disabled="
          !selectedCompTeamId || !selectedInstitution || loadingSaveTeam
        "
      >
        Salvar
      </ElButton>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
import { uniqBy, sortBy } from "lodash";
import { useUserStore } from "~/store/user";
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const userStore = useUserStore();
const competitionSlug = String(route.params.slug);
const competitionInfluence = ref(
  await userStore.getCompetitionInfluence(competitionSlug)
);

const currentInfluenceTeam = computed(
  () =>
    competition.value?.competitionTeams.find(
      (e) => e.id === competitionInfluence.value?.influence.competitionTeamId
    )?.teams
);

const currentInfluenceTeamName = computed(() => {
  const influenceCompetitionTeamId =
    competitionInfluence.value?.influence.competitionTeamId;
  if (!influenceCompetitionTeamId) {
    return "";
  }
  return currentInfluenceTeam.value?.name;
});

if (!competitionInfluence.value) {
  await navigateTo(`/competition/${competitionSlug}`);
  throw new Error("Competition not found");
}

const { data: competition } = await useFetch(
  `/api/v1/competitions/${competitionSlug}`
);

const influencedTitle = computed(() => {
  const amountInfluence =
    competitionInfluence.value?.influence.amountInfluence || 0;
  if (amountInfluence === 0) {
    return "<b>Você ainda não influenciou ninguém a doar sangue 🥲</b>";
  }

  if (amountInfluence === 1) {
    return "Até agora você influenciou <b>1 pessoa</b> a doar sangue, salvando até <b>4 vidas</b>!";
  }

  return `Até agora você influenciou <b>${amountInfluence} pessoas</b> a doarem sangue, salvando até <b>${
    amountInfluence * 4
  } vidas</b>!`;
});

const institutions = computed(() =>
  sortBy(
    uniqBy(
      competition.value?.competitionTeams.map((e) => e.teams?.institutions),
      "id"
    ),
    "name"
  )
);

const selectedInstitution = ref<number>();
if (institutions.value.length === 1) {
  selectedInstitution.value = institutions.value[0].id;
}

watch(
  () => selectedInstitution.value,
  (newValue) => {
    if (!newValue) {
      return;
    }
    selectedCompTeamId.value = undefined;
  }
);

const getCompTeamInstitutionid = (compTeamId: number) =>
  competition.value?.competitionTeams.find((e) => e.id === compTeamId)?.teams
    ?.institutions?.id;

const selectedCompTeamId = ref<number>();
if (competitionInfluence.value?.influence.competitionTeamId) {
  selectedInstitution.value = getCompTeamInstitutionid(
    competitionInfluence.value?.influence.competitionTeamId
  );
  nextTick(() => {
    if (competitionInfluence.value?.influence.competitionTeamId) {
      selectedCompTeamId.value =
        competitionInfluence.value?.influence.competitionTeamId;
    }
  });
}

const competitionTeams = computed(() =>
  sortBy(
    competition.value?.competitionTeams.filter(
      (compTeams) =>
        compTeams.teams?.institutions?.id === selectedInstitution.value
    ),
    "teams.name"
  )
);

const teamDrawer = ref(false);
const toggleTeamDrawer = () => {
  teamDrawer.value = !teamDrawer.value;
};

const teamButtonLabel = computed(() => {
  const influenceCompetitionTeamId =
    competitionInfluence.value?.influence.competitionTeamId;
  if (!influenceCompetitionTeamId) {
    return "Qual seu time?";
  }
  return competitionTeams.value.find((e) => e.id === influenceCompetitionTeamId)
    ?.teams?.name;
});

const influencedMessage = computed(() => {
  const amountInfluence =
    competitionInfluence.value?.influence.amountInfluence || 0;
  if (!amountInfluence) {
    return "Compartilhe seu link e influencie outras pessoas a salvarem vidas!";
  }

  return "Continue compartilhando seu link e influenciando mais pessoas 😀";
});

const shareUrl = computed(() => competitionInfluence.value?.shareUrl || "");

const copyLink = useDebounceFn(() => {
  navigator.clipboard.writeText(shareUrl.value);
  ElMessage({
    message: "Link copiado para a área de transferência!",
    type: "success",
  });
}, 300);

const zapUrl = getInfluenceWhatsappUrl(
  shareUrl.value,
  competition.value?.name || "Copa Hemocione"
);

const more = async () => {
  const sharePayload = {
    title: competition.value?.name || "Copa Hemocione",
    text: `Me ajude a salvar vidas! Doe sangue e participe da Copa Hemocione "${competition.value?.name}" de doação de sangue.`,
    url: shareUrl.value,
  };
  try {
    if (!navigator.share) {
      throw new Error("Share API not available");
    }
    await navigator.share(sharePayload);
  } catch (error) {
    console.error("Error sharing", error);
    copyLink();
  }
};

const loadingSaveTeam = ref(false);
const saveTeam = async () => {
  loadingSaveTeam.value = true;
  try {
    if (!selectedCompTeamId.value) {
      throw new Error("Selecione um time");
    }
    await userStore.setInfluenceCompTeam(
      competitionSlug,
      selectedCompTeamId.value
    );
    ElMessage({
      message: "Time salvo com sucesso!",
      type: "success",
    });
    const newInfluence = {
      ...competitionInfluence.value!,
      influence: {
        ...competitionInfluence.value!.influence,
        competitionTeamId: selectedCompTeamId.value!,
      },
    };
    competitionInfluence.value = newInfluence;
    nextTick(() => {
      toggleTeamDrawer();
    });
  } catch (error) {
    ElMessage({
      message: "Erro ao salvar time",
      type: "error",
    });
  } finally {
    loadingSaveTeam.value = false;
  }
};
</script>

<style scoped>
.success {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 80%;
  text-align: center;
  height: 100%;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  max-width: 95%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}

.action-img {
  cursor: pointer;
  width: 3rem;
  aspect-ratio: 1;
  border-radius: 25%;
  padding: 0.5rem;
  background-color: var(--crazy-gray);
}

.zap {
  background-color: var(--zap);
}

.success p {
  font-size: 1.2rem;
  margin: 0;
}

.copy-link {
  cursor: pointer;
  color: var(--hemo-color-primary-dark);
  font-weight: bold;
  word-wrap: break-word;
  white-space: wrap;
  text-align: center;
  max-width: 80%;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #dbdde0;
}

.header h2 {
  font-size: 1.1rem;
  margin: 0;
}

.main {
  display: flex;
  flex-direction: column;
  height: var(--hemo-page-min-height);
  width: 100%;
  max-width: var(--hemo-page-max-width);
  position: relative;
}

.main-container {
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 1rem;
}

.friends {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.subtitle {
  font-size: 1rem !important;
}

.hemo-button {
  width: 100%;
}

.hemo-button:deep(.el-icon) {
  width: 25px;
  height: 25px;
}

.hemo-button:deep(span) {
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block; /* ou block, se necessário */
}

.disclaimer-copy {
  font-size: 0.75rem;
  color: var(--hemo-color-text-secondary);
  text-align: center;
}

.selection-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selection-wrapper span {
  max-width: 70vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo_option {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
  object-fit: cover;
}

.logo_button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid white;
  object-fit: cover;
}
</style>
