<template>
  <div class="main-form-container">
    <header class="header">
      <h2>{{ props.competitionName }}</h2>
      <div>
        <h3>Olá, {{ props.name }}!</h3>
        <h4>Selecione sua equipe para registrar a doação</h4>
      </div>
    </header>
    <form class="form" @submit="handleSubmit">
      <label class="label-form">Equipe <span>*</span></label>
      <el-select
        v-model="form.team"
        class="input-style"
        size="large"
        :placeholder="'Selecione sua equipe'"
      >
        <el-option
          v-for="(item, idx) in teams"
          :key="idx + item"
          :label="item"
          :value="item"
        >
          {{ item }}
        </el-option>
      </el-select>

      <label class="label-form">Matrícula <span>*</span></label>
      <el-input v-model="form.matricula" class="input-style" />

      <label class="label-form">Comprovante de doação <span>*</span></label>
      <div
        class="camera-icon-container"
        onclick="document.getElementById('file-input').click()"
      >
        <img src="../assets/images/cam.svg" alt="camera-icon">
      </div>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        @change="handleFileSelect($event)"
      >
      <!-- TODO: adicionar componente que o guimaboy fez -->
      <button class="input-style">
        Registrar
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  competitionName: { type: String, required: true },
  name: { type: String, required: true }
})
const teams = ref([] as string[])
const form = ref({
  team: '',
  matricula: '',
  comprovante: ''
} as Record<string, string>)

onMounted(() => {
  teams.value = getTeam()
})

// TODO: fetch backend teams
function getTeam () {
  return ['forró boys', 'forró perfeito', 'forró rasgado']
}

function handleFileSelect (event: any) {
  const file = event.target.files[0]
  if (file) {
    // TODO: enviar para a cdn e pegar o link
    console.log('Arquivo selecionado:', file)

    // setar o valor do input com o path do arquivo
    form.value.comprovante = file.name
  }
}

async function handleSubmit (event: any) {
  event.preventDefault()
  console.log('Formulário enviado!', form.value)

  await navigateTo({
    name: 'donationcheck',
    query: {
      competitionName: props.competitionName
    }
  })
}

</script>
<style>
.main-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
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
