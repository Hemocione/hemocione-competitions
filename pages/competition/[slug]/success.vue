<template>
  <div class="main">
    <div class="main-container">
      <header class="header">
        <h2>{{ name || "Copa Hemocione" }}</h2>
      </header> 
      <div class="success">
        <img src="/images/check-donation.svg" alt="checked-icon">
        <span>Doação registrada com sucesso! Obrigado por salvar 4 vidas :)</span>
      </div>
    </div>
    <common-cool-footer hide-toggle height="fit-content" desktop-border-radius="0">
      <el-button type="default" size="large" @click="openInstagram"
        >Siga o Hemocione no Instagram
        <el-icon class="el-icon--right" size="30"
          ><NuxtImg src="/images/icons/instagram.svg" style="height: 100%"/></el-icon
      ></el-button>
      <el-button
        type="primary"
        size="large"
        @click="openHemocionePage"
        >Conheça mais o Hemocione</el-button
      >
    </common-cool-footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user';
const config = useRuntimeConfig();
definePageMeta({
  middleware: "auth",
})
const route = useRoute();
const name = route.query.name;
const { getDonationByCompetitionSlug } = useUserStore();
const openHemocionePage = () => {
  navigateTo("https://hemocione.com.br", { external: true });
};

const openInstagram = () => {
  navigateTo(config.public.instagramUrl, { external: true });
};

const donation = await getDonationByCompetitionSlug(String(route.params.slug));
if (!donation) {
  navigateTo(`/competition/${route.params.slug}/register`);
}
</script>

<style scoped>

.success {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  width: 80%;
  text-align: center;
  height: 100%;
}
.header {
  width: 100%;
}

.header h2 {
  font-size: 2rem;
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

.main-container h2 {
  font-size: 2rem;
  justify-self: flex-start;
}
</style>
