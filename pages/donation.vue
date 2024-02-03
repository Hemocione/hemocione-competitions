<template>
  <el-container :style="{ 'min-height': '100%' }">
    <el-header :style="{ padding: '0px' }">
      <NavBar />
    </el-header>
    <el-main :style="{ display: 'flex' }">
      <div :style="{ flex: 1 }">
        <NuxtLink to="/">
          <img
            :style="{ margin: '40px' }"
            src="/img/arrow.svg"
          >
        </NuxtLink>
      </div>
      <div class="form-strip">
        <div class="details-title">
          <h1>Competição IDOR: Enfermagem x Radiologia</h1>
        </div>
        <div class="greetings">
          <h3>Olá, João Sangue Bom!</h3>
          <span>Selecione sua equipe para registrar a doação</span>
        </div>
      </div>
      <div :style="{ flex: 1 }" />
    </el-main>
    <el-footer :style="{ display: 'flex' }">
      <div :style="{ flex: 1 }" />
      <div class="register-button-strip">
        <NuxtLink to="/donation">
          <el-button class="register-button" type="primary">
            + Registrar nova doação
          </el-button>
        </NuxtLink>
      </div>
      <div :style="{ flex: 1 }" />
    </el-footer>
  </el-container>
</template>

<style>
.form-strip {
  flex: 3;
}
.greetings {
}
</style>
