<template>
  <nav v-if="!isIframed" :class="{ 'nav-bar': true, hide: !validatedIframe }">
    <!-- <NuxtLink to="/" class="logo-wrapper"> TODO: uncomment when / is generally available. dont forget to use correct css classes-->
      <NuxtImg
        src="/images/logos/logo-horizontal.svg"
        alt="logo hemocione branca"
        class="logo-wrapper"
      />
    <!-- </NuxtLink> -->
  </nav>
</template>

<script setup lang="ts">
const isIframed = ref(false);
const validatedIframe = ref(false);

onMounted(() => {
  isIframed.value = window !== window.top;
  validatedIframe.value = true;
});
</script>

<style scoped>
.nav-bar {
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 1rem;
  position: sticky;
  align-items: center;
  background-color: var(--black-100);
  top: 0;
  left: 0;
  height: 7dvh;
}

.hide {
  visibility: hidden;
}
.logo-wrapper {
  width: 50%;
  max-width: 250px;
}

.logo {
  width: 100%;
}
</style>
