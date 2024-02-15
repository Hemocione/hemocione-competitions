<template>
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
      <div class="column">
        <label class="label-form">Instituição <span>*</span></label>
        <el-select
          v-model="form.institutionId"
          class="input-style"
          size="large"
          :placeholder="'Selecione sua Instituição'"
          @change="form.team = ''"
        >
          <el-option
            v-for="item in institutions"
            :key="item?.id"
            :label="item?.name"
            :value="item?.id"
          >
            {{ item?.name }}
          </el-option>
        </el-select>
      </div>

      <!-- Team Select -->
      <div v-if="isInstitutionSelected" class="column">
        <label class="label-form">Equipe <span>*</span></label>
        <el-select
          v-model="form.team"
          class="input-style"
          size="large"
          :placeholder="'Selecione sua equipe'"
        >
          <el-option
            v-for="compTeam in competitionTeamsOfSelectedInstitution"
            :key="compTeam.id"
            :label="compTeam?.teams?.name"
            :value="compTeam?.teams?.id"
          >
            {{ compTeam.teams?.name }}
          </el-option>
        </el-select>
      </div>

      <!-- Matricula Field -->
      <div v-if="getExtraField('matricula')" class="column">
        <label class="label-form"
          >Matrícula
          <span v-if="getExtraField('matricula')?.required">*</span></label
        >
        <el-input v-model="form.matricula" class="input-style" />
      </div>

      <!-- Proof Field -->

      <div class="column">
        <label class="label-form"
          >Comprovante de doação
          <span v-if="competition?.mandatory_proof">*</span></label
        >
        <div
          class="camera-icon-container"
          onclick="document.getElementById('file-input').click()"
        >
          <img src="../../../assets/images/cam.svg" alt="camera-icon" />
        </div>

        <input
          id="file-input"
          type="file"
          accept="image/*"
          @change="handleFileSelect($event)"
        />
      </div>
      <!-- TODO: adicionar componente que o guimaboy fez -->
      <button class="input-style">Registrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
import { uniqBy } from "lodash";

definePageMeta({
  middleware: ["auth"],
});
const { user } = useUserStore();

const route = useRoute();
const slug = route.params.slug;
const { data: competition } = await useFetch(`/api/v1/competitions/${slug}`);
if (!competition.value) {
  navigateTo("https://hemocione.com.br", { external: true });
}

export type Competition = typeof competition.value;

const form = ref({
  team: "",
  matricula: "",
  comprovante: "",
  institutionId: null,
} as Record<string, any>);

const institutions = computed(() =>
  uniqBy(
    competition.value?.competitionTeams.map((e) => e.teams?.institutions),
    "id"
  )
);

const isInstitutionSelected = computed(() => form.value.institutionId);
const competitionTeamsOfSelectedInstitution = computed(() => {
  const selectedId = isInstitutionSelected.value;
  if (!selectedId) return [];

  return competition.value?.competitionTeams.filter(
    (compTeams) => compTeams.teams?.institutions?.id === selectedId
  );
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

// TODO: Add correct type
interface ExtraField {
  slug: string;
  label: string;
  required: boolean;
  type: "text";
}

function getExtraField(field: string): ExtraField | null {
  const extraFields = competition.value?.extraFields;
  if (!Array.isArray(extraFields)) return null;
  return (
    (extraFields as unknown as ExtraField[]).find((e) => e.slug === field) ??
    null
  );
}
</script>
  <style>
.main-form-container {
  width: 100%;
  height: 100%;
  align-items: center;
}
.column {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.header h2 {
  text-align: center;
  color: #25282b;
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
  width: 100%;
  max-width: 50%;
  border-radius: 10px;

  margin-top: 40px;
}
.label-form {
  font-size: 16px;
  color: #52575c;
  margin: 15px 0;
}
.label-form span {
  color: red;
}
.input-style {
  border-radius: 8px;
  height: 56px;
}
.camera-icon-container {
  border: 1px solid #dbdde0 !important;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
}
#file-input {
  display: none;
}
.el-input--large .el-input__wrapper {
  height: 56px;
  border-radius: 8px;
}
</style>
  