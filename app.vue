<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useServerHead({
  title: "Copa Hemocione",
});
useServerSeoMeta({
  title: "Copa Hemocione",
  description:
    "Encontre competições de doação de sangue próximas a você e ajude a salvar vidas!",
  ogDescription:
    "Encontre competições de doação de sangue próximas a você e ajude a salvar vidas!",
  ogImage:
    "https://cdn.hemocione.com.br/events/uploads/1699940076138-logo_hemocione_fb-2(1).png",
  twitterCard: "summary_large_image",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
});
</script>
