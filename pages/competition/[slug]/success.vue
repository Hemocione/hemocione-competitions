<template>
  <div class="main-container">
    <h2>{{ competition?.name }}</h2>
    <img src="../../../assets/images/check-donation.svg" alt="checked-icon">

    <h3>Doação registrada com sucesso!</h3>
    <img
      src="../../../assets/images/shared.svg"
      alt="share-icon"
      @click="handleShare"
    >
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug;
const { data: competition } = await useFetch(`/api/v1/competitions/${slug}`);
if (!competition.value) {
  navigateTo("https://hemocione.com.br", { external: true });
}


function handleShare () {
  // TODO: implementar a lógica de compartilhamento
  console.log('clicked')
}
</script>

<style>
.main-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.main-container h2 {
  margin-bottom: 100px;
}
.main-container img {
  margin: 60px 0;
}
.main-container h3 {
  color: #52575c;
  font-weight: normal;
}
</style>
