<template>
  <div class="main">
    <div class="main-form-container column">
    <header class="header">
      <h2>{{ competition?.name }}</h2>
      <div>
        <h3>Olá, {{ user?.givenName }}!</h3>
        <h4>Selecione sua equipe para registrar a doação</h4>
      </div>
    </header>
    <form class="form" @submit="handleSubmit">
      <!-- Institution Select -->
      <TransitionGroup name="slide-fade-down" appear>
        <div class="column" key="institution" v-if="institutions.length > 1">
          <label class="label-form">Instituição <span>*</span></label>
          <el-select
            v-model="form.institutionId"
            size="large"
            :placeholder="'Selecione sua Instituição'"
            @change="() => form.competitionTeamId = null"
            required
          >
            <el-option
              v-for="(institution, idx) in institutions"
              :key="institution?.id ?? idx"
              :label="institution?.name ?? idx"
              :value="institution?.id ?? idx"
            >
              {{ institution?.name }}
            </el-option>
          </el-select>
        </div>

        <!-- Team Select -->
        <div v-if="isInstitutionSelected" class="column" key="team">
          <label class="label-form">Equipe <span>*</span></label>
          <el-select
            v-model="form.competitionTeamId"
            size="large"
            :placeholder="'Selecione sua equipe'"
          >
            <el-option
              v-for="compTeam in competitionTeams"
              :key="compTeam.id"
              :label="compTeam?.teams?.name ?? compTeam.id"
              :value="compTeam.id"
            >
              {{ compTeam.teams?.name }}
            </el-option>
          </el-select>
        </div>
        <!-- Proof Field -->
        <div class="column" key="proof" v-if="isTeamSelected">
          <input
            id="file-input"
            type="file"
            accept="image/*"
            @change="handleFileSelect($event)"
          />
          <label class="label-form"
            >Comprovante de doação
            <span v-if="competition?.mandatory_proof">*</span></label
          >
          <div
            class="camera-icon-container"
            onclick="document.getElementById('file-input').click()"
          >
            <NuxtImg src="/images/cam.svg" alt="camera-icon" />
          </div>
        </div>

        <!-- Extra Fields -->
        <div
          v-for="(field, idx) in extraFields"
          v-if="isTeamSelected"
          :key="field.slug + idx"
          class="column"
        >
          <label class="label-form">{{ field.label }} <span v-if="field.required">*</span></label>
          <el-input
            v-model="form[field.slug]"
            size="large"
            :placeholder="field.label"
            :required="field.required"
          ></el-input>
        </div>
      </TransitionGroup>
    </form>
  </div>
  <common-cool-footer hide-toggle height="fit-content" desktop-border-radius="0">
      <el-button
        type="primary"
        size="large"
        native-type="submit"
        :disabled="!canRegisterDonation"
        >{{ canRegisterDonation ? 'Registrar Doação' : 'Preencha os Campos Obrigatórios' }}</el-button
      >
    </common-cool-footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
import { uniqBy } from "lodash";

definePageMeta({
  middleware: ["auth"],
});
const { user } = useUserStore();

console.log("User", user);

const route = useRoute();
const slug = route.params.slug;
const { data: competition } = await useFetch(`/api/v1/competitions/${slug}`);
const extraFields = competition.value?.extraFields as unknown as ExtraField[];
const extraFieldsSlugs = extraFields?.map((e) => e.slug) ?? [];

if (!competition.value) {
  navigateTo("https://hemocione.com.br", { external: true });
}

export type Competition = typeof competition.value;

const form = ref({
  competitionTeamId: null,
  proof: "",
  institutionId: null,
  extraFields: {
    ...Object.fromEntries(extraFieldsSlugs.map((slug) => [slug, ""])),
  },
} as Record<string, any>);

const institutions = computed(() =>
  uniqBy(
    competition.value?.competitionTeams.map((e) => e.teams?.institutions),
    "id"
  )
);

const competitionTeams = computed(() => competition.value?.competitionTeams.filter(
  (compTeams) => compTeams.teams?.institutions?.id === form.value.institutionId
));

if (institutions.value.length === 1) {
  form.value.institutionId = institutions?.value[0]?.id;
}

const isTeamSelected = computed(() => form.value.competitionTeamId);
const isInstitutionSelected = computed(() => form.value.institutionId);
const allRequiredExtraFieldsFilled = computed(() =>
  extraFieldsSlugs.every((slug) => form.value.extraFields[slug])
);

const canRegisterDonation = computed(() => {
  return isTeamSelected.value && allRequiredExtraFieldsFilled.value && (!competition.value?.mandatory_proof || form.value.proof);
});

function handleFileSelect(event: any) {
  const file = event.target.files[0];
  if (file) {
    // TODO: enviar para a cdn e pegar o link
    console.log("Arquivo selecionado:", file);

    // setar o valor do input com o path do arquivo
    form.value.comprovante = file.name;
  }
}

async function handleSubmit(event: any) {
  event.preventDefault();
  // TODO: validar required fields
  console.log("Formulário enviado!", form.value);

  // TODO: enviar na api
  await $fetch(`/api/v1/competitions/${slug}/donations`, {
    method: "POST",
    body: {
      competitionTeamId: form.value.team,
      proof: form.value.comprovante,
      extraFields: [
        {
          slug: "matricula",
          value: form.value.matricula,
        },
      ],
    },
    headers: {
      Authorization: `Bearer ****`
    }
  });
  // Enviar para rota

  await navigateTo(`/competition/${slug}/success`);
}
</script>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  position: relative;
}

.main-form-container {
  width: 100%;
  max-width: var(--hemo-page-max-width);
  min-height: var(--hemo-page-min-height);
  height: 100%;
  align-items: center;  
  background-color: white;
  padding: 1rem;
}
.column {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.header h2 {
  text-align: center;
  color: #25282b;
  margin: 0
}
.header h3 {
  color: #52575c;
  font-weight: 600;
}
.header h4 {
  color: #52575c;
  font-weight: normal;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.label-form {
  font-size: 1rem;
  color: #52575c;
  margin-bottom: 0.8rem;
}
.label-form span {
  color: red;
}
.camera-icon-container {
  border: 1px solid #dbdde0 !important;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 4/1;
}
#file-input {
  display: none;
}
.el-input--large .el-input__wrapper {
  height: 56px;
  border-radius: 8px;
}
</style>
  