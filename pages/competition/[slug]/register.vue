<template>
  <div class="main">
    <div class="main-form-container column">
      <header class="header">
        <h2>{{ competition?.name }}</h2>
        <div class="user-name-wrapper">
          <h3>Olá, {{ user?.givenName }}!</h3>
          <span v-if="influencedByFirstName" class="influenced-by"
            >Indicado por <b>{{ influencedByFirstName }}</b></span
          >
        </div>
        <h4 v-if="presentationText">{{ presentationText }}</h4>
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
              :disabled="teamInfluenceControlled"
            >
              <el-option
                v-for="(institution, idx) in institutions"
                :key="institution?.id ?? idx"
                :label="institution?.name ?? idx"
                :value="institution?.id ?? idx"
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
              </el-option>
            </el-select>
          </div>
          <!-- Team Select -->
          <div v-if="isInstitutionSelected" class="column" key="team">
            <label class="label-form">Equipe <span>*</span></label>
            <el-select
              v-model="(form.competitionTeamId as number)"
              size="large"
              :placeholder="'Selecione sua equipe'"
              required
              filterable
              :disabled="teamInfluenceControlled"
            >
              <el-option
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
                  <span>
                    {{ compTeam.teams?.name }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </div>
          <!-- Autodeclaracao: so aparece em copa participativa -->
          <div
            class="column"
            key="kind"
            v-if="isParticipation && isTeamSelected"
          >
            <label class="label-form">Você conseguiu doar? <span>*</span></label>
            <span class="proof-type-text">
              Vale participar mesmo sem conseguir doar. Se a pré-triagem apontou
              algum impedimento, sua participação continua contando para a sua
              unidade.
            </span>
            <el-radio-group v-model="form.kind" size="large">
              <el-radio-button value="donation">Sim, eu doei</el-radio-button>
              <el-radio-button value="participation">
                Não consegui doar
              </el-radio-button>
            </el-radio-group>
          </div>

          <!-- Proof Field -->
          <div class="column" key="proof" v-if="isTeamSelected">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              :capture="
                competition?.proof_type === 'document' ? 'environment' : 'user'
              "
              @change="handleFileSelect($event)"
            />
            <label class="label-form"
              >{{
                isParticipation
                  ? "Comprovante da sua participação"
                  : "Comprovante de doação"
              }}
              <span v-if="competition?.mandatory_proof && !form.proofUrl"
                >*</span
              ></label
            >
            <span class="proof-type-text">{{ proofText }}</span>
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
import type { MessageHandler } from "element-plus";

definePageMeta({
  middleware: ["auth"],
});

const { user, token, getDonationByCompetitionSlug, registerDonation } =
  useUserStore();

const route = useRoute();
const slug = route.params.slug;
const code = route.query.code ? String(route.query.code) : null;

// Quem chega pelo caminho "reprovado na pre-triagem" vem com kind e o
// comprovante ja na URL. O radio segue editavel: o campo e autodeclarado, entao
// mentir pelo query param equivale a mentir clicando.
const initialKind =
  route.query.kind === "participation" ? "participation" : "donation";
const externalProofUrl = route.query.proofUrl ? String(route.query.proofUrl) : "";

const uploadingImage = ref(false);
const registeringDonation = ref(false);

const [{ data: competition }, { data: influence }, donation] =
  await Promise.all([
    useFetch(`/api/v1/competitions/${slug}`),
    code
      ? useFetch(`/api/v1/competitions/${slug}/influence/codes/${code}`)
      : { data: ref(null) },
    getDonationByCompetitionSlug(String(slug)),
  ]);

if (influence.value && influence.value.hemocioneID === user?.id) {
  influence.value = null; // prevent self-influence
}

const goToSuccess = () => {
  return navigateTo(
    `/competition/${slug}/success?name=${encodeURIComponent(
      competition.value?.name ?? "Copa Hemocione"
    )}`
  );
};

const goToLogin = async () => {
  let redirectPath = `/competition/${slug}/register`;
  if (influencedBy.value) redirectPath += `?code=${influencedBy.value.code}`;

  await redirectToID(redirectPath);
};

if (donation) {
  await goToSuccess();
}

const influencedBy = computed(() =>
  influence.value && influence.value.hemocioneID !== user?.id
    ? influence.value
    : null
);
const influencedByFirstName = computed(
  () =>
    influencedBy.value?.user_name?.split(" ")[0] ||
    influencedBy.value?.user_name
);

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

const teamInfluenceControlled = Boolean(
  influence.value?.competitionTeamId &&
    competition.value?.influence_controls_team
);

const isParticipationCompetition = competition.value?.mode === "participation";

const presentationText = isCompetitionInFuture
  ? `${competition.value?.name} ainda não começou. Aguarde até a data de início (${initialDate}) para registrar sua ${
      isParticipationCompetition ? "participação" : "doação"
    }.`
  : isCompetitionInPast
  ? "A copa já acabou. Obrigado por participar!"
  : teamInfluenceControlled
  ? null
  : isParticipationCompetition
  ? "Selecione sua unidade para registrar sua participação na campanha."
  : "Selecione sua equipe para registrar sua doação.";

const proofText =
  competition.value?.proof_type === "document"
    ? "Envie uma foto do comprovante de doação de sangue"
    : competition.value?.proof_type === "any"
    ? "Envie qualquer registro da sua ida ao banco de sangue: uma selfie no local, foto do comprovante ou da pulseira. Se você não pôde doar, o comprovante da pré-triagem já vale."
    : "Envie uma foto sua realizando a doação de sangue (pode ser uma selfie!)";

export type Competition = typeof competition.value;

const isParticipation = computed(
  () => competition.value?.mode === "participation",
);

const form = ref({
  competitionTeamId: null as number | null | undefined,
  proof: "",
  proofUrl: externalProofUrl,
  kind: initialKind as "donation" | "participation",
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

const selectCompetitionTeamId = (id: number) => {
  const competitionTeam = competitionTeams.value.find(
    (compTeam) => compTeam.id === id
  );
  const institutionId = competitionTeam?.teams?.institutions?.id;
  form.value = {
    ...form.value,
    competitionTeamId: id,
    institutionId,
  };
};

if (teamInfluenceControlled && influence.value?.competitionTeamId) {
  selectCompetitionTeamId(influence.value?.competitionTeamId);
}

const canRegisterDonation = computed(() => {
  return (
    isTeamSelected.value &&
    allRequiredExtraFieldsFilled.value &&
    // O comprovante da pre-triagem, recebido por proofUrl, satisfaz a exigencia
    // de prova: quem foi reprovado nao tem foto de doacao para enviar.
    (!competition.value?.mandatory_proof ||
      form.value.proof ||
      form.value.proofUrl)
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
  return isParticipation.value ? "Registrar Participação" : "Registrar Doação";
});

const MB = 1024 * 1024;

class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

async function handleFileSelect(event: any) {
  uploadingImage.value = true;
  const files = event.target?.files;
  let message: MessageHandler | null = null;

  try {
    if (!files.length) {
      throw new ImageUploadError("Envie ao menos uma imagem.");
    }

    if (files.length > 1) {
      throw new ImageUploadError("Envie apenas uma imagem.");
    }

    const file = files[0] as File;
    // check if file is an image
    if (!file.type.includes("image")) {
      throw new ImageUploadError("Envie uma imagem válida.");
    }

    // check if file is less than 10mb
    if (file.size > 10 * MB) {
      throw new ImageUploadError("Envie uma imagem menor que 10 MB");
    }

    // TODO: check if File is older than competition start
    // TODO: check file location + add bloodbank to form

    message = ElMessage({
      message: "Enviando imagem...",
      type: "info",
      duration: 0,
    });
    const { url } = await uploadImage(file, { userToken: String(token) });
    message.close();
    ElMessage({
      message: "Imagem enviada com sucesso!",
      type: "success",
      duration: 3000,
    });
    form.value.proof = url;
  } catch (error: any) {
    message?.close();
    const errorMessage =
      error instanceof ImageUploadError
        ? error.message
        : "Erro ao enviar imagem. Por favor, tente novamente.";
    ElMessage({
      type: "error",
      message: errorMessage,
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

const GEO_TIMEOUT_MS = 8000;

/**
 * Geolocalizacao best-effort. NUNCA rejeita: geo e enriquecimento de prova, nao
 * pre-requisito de registro.
 *
 * Dentro do app, o iframe precisa de allow="geolocation" e o build nativo
 * precisa das permissoes de plataforma. Em app antigo isso simplesmente nao vem
 * — e o registro tem que funcionar do mesmo jeito.
 */
async function captureGeo(): Promise<
  { lat: number; lng: number; accuracy?: number } | { reason: string }
> {
  if (!import.meta.client || !navigator.geolocation) {
    return { reason: "unavailable" };
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) =>
        resolve({
          reason: err.code === err.PERMISSION_DENIED ? "denied" : "timeout",
        }),
      { timeout: GEO_TIMEOUT_MS, maximumAge: 60_000 },
    );
  });
}

async function handleSubmit(event: any) {
  registeringDonation.value = true;
  event.preventDefault();
  if (!canRegisterDonation.value || !form.value.competitionTeamId) {
    return;
  }
  const influenceId = influencedBy?.value?.id;

  const geo = isParticipation.value ? await captureGeo() : undefined;

  const payload = {
    competitionTeamId: form.value.competitionTeamId,
    proof: form.value.proof,
    proofUrl: form.value.proofUrl || undefined,
    kind: isParticipation.value ? form.value.kind : "donation",
    geo,
    extraFields: extraFieldsResponse.value,
    influenceId,
    competitionName: competition.value?.name,
  };

  // TODO: do this inside registerDonation. pass this info in payload.
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
  await goToSuccess();
}
</script>
<style scoped>
.user-name-wrapper {
  width: 100%;
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
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
  gap: 1rem;
  padding-bottom: 1rem;
}
.header h2 {
  text-align: center;
  color: #25282b;
  margin: 0;
}
.header h3 {
  color: #52575c;
  font-weight: 600;
  margin: 0;
  display: flex;
  width: 100%;
}
.header h4 {
  color: #52575c;
  font-weight: normal;
  margin: 0;
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

.proof-type-text {
  font-size: 0.8rem;
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

.influenced-by {
  padding: 0.35rem 0.7em;
  background-color: var(--midsummer-dream);
  color: var(--cornflower-blue);
  border-radius: 0.5rem;
  width: 100%;
  font-size: 0.75rem;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
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
</style>
