<template>
  <div class="main">
    <div class="main-form-container column">
      <header class="header">
        <h2>{{ competition?.name }}</h2>
        <div>
          <h3>Olá, {{ user?.givenName }}!</h3>
          <h4>{{ presentationText }}</h4>
        </div>
      </header>
      <form
        class="form"
        @submit="handleSubmit"
        v-if="!isCompetitionInFuture && !isCompetitionInPast"
      >
        <!-- Institution Select -->
        <TransitionGroup name="slide-fade-down" appear>
          <div class="column" key="institution" v-if="institutions.length > 1">
            <label class="label-form">Instituição <span>*</span></label>
            <el-select
              v-model="(form.institutionId as number)"
              size="large"
              :placeholder="'Selecione sua Instituição'"
              @change="() => (form.competitionTeamId = null)"
              required
              filterable
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

          <el-button
            class="grey-button"
            type="primary"
            size="large"
            native-type="submit"
            @click="goToLogin()"
            >{{ `Não é ${userName}? Entre como outro doador.` }}</el-button
          >
          <!-- Team Select -->
          <div v-if="isInstitutionSelected" class="column" key="team">
            <label class="label-form">Equipe <span>*</span></label>
            <el-select
              v-model="(form.competitionTeamId as number)"
              size="large"
              :placeholder="'Selecione sua equipe'"
              required
              filterable
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
              capture="environment"
              @change="handleFileSelect($event)"
            />
            <label class="label-form"
              >Comprovante de doação
              <span v-if="competition?.mandatory_proof">*</span></label
            >
            <Transition name="fade" appear mode="out-in">
              <div
                class="camera-icon-container"
                key="camera-init"
                onclick="document.getElementById('file-input').click()"
                v-if="!uploadingImage && !form.proof"
              >
                <NuxtImg src="/images/cam.svg" alt="camera-icon" />
              </div>
              <div
                class="camera-photo-taken-container"
                key="image-taken"
                v-else-if="form.proof && !uploadingImage"
              >
                <el-icon
                  size="40"
                  onclick="document.getElementById('file-input').click()"
                  class="retry"
                >
                  <ElIconCameraFilled
                    style="
                      position: absolute;
                      right: 0;
                      top: 0;
                      padding: 0.5rem;
                      cursor: pointer;
                    "
                  />
                </el-icon>
                <img
                  :src="form.proof"
                  alt="Comprovante de Doação"
                  class="taken-image"
                />
              </div>
              <div
                class="camera-icon-container"
                key="loading"
                v-else-if="uploadingImage"
              >
                <CommonLogoLoader />
              </div>
            </Transition>
          </div>

          <!-- Extra Fields -->
          <div
            v-for="(field, idx) in extraFields"
            v-if="isTeamSelected"
            :key="field.slug + idx"
            class="column"
          >
            <label class="label-form"
              >{{ field.label }} <span v-if="field.required">*</span></label
            >
            <el-input
              v-model="form.extraFields[field.slug]"
              size="large"
              :placeholder="field.label"
              :required="field.required"
            ></el-input>
          </div>
        </TransitionGroup>
      </form>
    </div>
    <common-cool-footer
      hide-toggle
      height="fit-content"
      desktop-border-radius="0"
    >
      <el-button
        type="primary"
        size="large"
        native-type="submit"
        :disabled="
          !canRegisterDonation ||
          registeringDonation ||
          isCompetitionInFuture ||
          isCompetitionInPast
        "
        :loading="registeringDonation"
        @click="handleSubmit"
        >{{ coolButtonText }}</el-button
      >
    </common-cool-footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
import { uniqBy, sortBy } from "lodash";
import dayjs from "dayjs";
import { redirectToID } from "~/middleware/auth";

definePageMeta({
  middleware: ["auth"],
});

const { user, token, getDonationByCompetitionSlug, registerDonation } =
  useUserStore();

if (!user) {
  navigateTo("/unauthorized");
}
const route = useRoute();
const slug = route.params.slug;

const uploadingImage = ref(false);
const registeringDonation = ref(false);

const { data: competition } = await useFetch(`/api/v1/competitions/${slug}`);
const donation = await getDonationByCompetitionSlug(String(slug));
const goToSuccess = () => {
  navigateTo(
    `/competition/${slug}/success?name=${encodeURIComponent(
      competition.value?.name ?? "Copa Hemocione"
    )}`
  );
};

const goToLogin = () => {
  redirectToID(`/competition/${slug}/register`);
};

if (donation) {
  goToSuccess();
}

const extraFields = competition.value?.extraFields as unknown as ExtraField[];
const extraFieldsSlugs = extraFields?.map((e) => e.slug) ?? [];
const requiredExtraFieldsSlugs =
  extraFields?.filter((e) => e.required).map((e) => e.slug) ?? [];

if (!competition.value?.published) {
  navigateTo("https://hemocione.com.br", { external: true });
}

const isCompetitionInFuture =
  new Date(Date.parse(competition.value?.start_at as string)) > new Date();
const isCompetitionInPast =
  new Date(Date.parse(competition.value?.end_at as string)) < new Date();

const initialDate = dayjs(competition.value?.start_at).format("DD/MM/YYYY");
const finalDate = dayjs(competition.value?.end_at).format("DD/MM/YYYY");

const presentationText = isCompetitionInFuture
  ? `${competition.value?.name} ainda não começou. Aguarde até a data de início (${initialDate}) para registrar sua doação.`
  : isCompetitionInPast
  ? "A copa já acabou. Obrigado por participar!"
  : "Selecione sua equipe para registrar sua doação.";

export type Competition = typeof competition.value;

const form = ref({
  competitionTeamId: null as number | null | undefined,
  proof: "",
  institutionId: null as number | null | undefined,
  extraFields: {
    ...Object.fromEntries(extraFieldsSlugs.map((slug) => [slug, ""])),
  },
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

const competitionTeams = computed(() =>
  sortBy(
    competition.value?.competitionTeams.filter(
      (compTeams) =>
        compTeams.teams?.institutions?.id === form.value.institutionId
    ),
    "teams.name"
  )
);

const userName = computed(() => user?.givenName);

if (institutions.value.length === 1) {
  form.value.institutionId = institutions?.value[0]?.id;
}

const isTeamSelected = computed(() => form.value.competitionTeamId);
const isInstitutionSelected = computed(() => form.value.institutionId);
const allRequiredExtraFieldsFilled = computed(() =>
  requiredExtraFieldsSlugs.every((slug) => form.value.extraFields[slug])
);

const canRegisterDonation = computed(() => {
  return (
    isTeamSelected.value &&
    allRequiredExtraFieldsFilled.value &&
    (!competition.value?.mandatory_proof || form.value.proof)
  );
});

const coolButtonText = computed(() => {
  if (isCompetitionInFuture) {
    return "Aguardando início da Copa Hemocione";
  }
  if (isCompetitionInPast) {
    return `Copa Hemocione encerrada em ${finalDate}`;
  }
  if (!canRegisterDonation.value) {
    return "Preencha os Campos Obrigatórios";
  }
  return "Registrar Doação";
});

const MB = 1024 * 1024;

async function handleFileSelect(event: any) {
  uploadingImage.value = true;
  const files = event.target?.files;
  if (!files.length) {
    return;
  }
  if (files.length > 1) {
    ElMessage.error("Envie apenas uma imagem.");
    return;
  }

  const file = files[0] as File;
  // check if file is an image
  if (!file.type.includes("image")) {
    ElMessage.error("Envie uma imagem válida.");
    return;
  }

  // check if file is less than 5mb
  if (file.size > 5 * MB) {
    ElMessage.error("Envie uma imagem menor que 5 MB");
    return;
  }

  // TODO: check if File is older than competition start
  // TODO: check file location + add bloodbank to form

  const message = ElMessage({
    message: "Enviando imagem...",
    type: "info",
    duration: 0,
  });
  try {
    const { url } = await uploadImage(file, { userToken: String(token) });
    message.close();
    ElMessage({
      message: "Imagem enviada com sucesso!",
      type: "success",
      duration: 3000,
    });
    form.value.proof = url;
  } catch (error) {
    message.close();
    console.error("Error uploading image", error);
    ElMessage({
      type: "error",
      message: "Erro ao enviar imagem. Por favor, tente novamente.",
      duration: 3000,
    });
  }

  uploadingImage.value = false;
}

const extraFieldsResponse = computed(() => {
  const keys = Object.keys(form.value.extraFields);
  return (
    keys.map((key) => ({
      slug: key,
      value: form.value.extraFields[key],
    })) ?? []
  );
});

async function handleSubmit(event: any) {
  registeringDonation.value = true;
  event.preventDefault();
  if (!canRegisterDonation.value || !form.value.competitionTeamId) {
    return;
  }

  const payload = {
    competitionTeamId: form.value.competitionTeamId,
    proof: form.value.proof,
    extraFields: extraFieldsResponse.value,
  };
  try {
    await registerDonation(String(slug), payload);
  } catch (error) {
    ElMessage({
      type: "error",
      message: "Erro ao registrar doação. Por favor, tente novamente.",
      duration: 3000,
    });
    registeringDonation.value = false;
    return;
  }

  registeringDonation.value = false;
  goToSuccess();
}
</script>
<style scoped>
.retry {
  background-color: var(--hemo-color-secondary);
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  min-height: var(--hemo-page-min-height);
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
  margin: 0;
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
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 4/1;
  padding: 1rem;
}

.camera-photo-taken-container {
  border: 1px solid #dbdde0 !important;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.taken-image {
  width: 100%;
  min-height: 10svh;
  max-height: 50svh;
  object-fit: contain;
}
#file-input {
  display: none;
}
.el-input--large .el-input__wrapper {
  height: 56px;
  border-radius: 0.5rem;
}

.grey-button {
  border: 1px solid #f3f2f1 !important;
  color: var(--hemo-color-primary) !important;
  background-color: #f3f2f1 !important;
  display: flex;
  text-wrap: wrap;
}
</style>
