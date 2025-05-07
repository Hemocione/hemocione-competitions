<template>
  <nav v-if="!isIframed" class="nav-bar">
    <NuxtLink to="/" class="logo-wrapper">
      <NuxtImg
        src="/images/logos/logo-horizontal-vermelha-branca.svg"
        alt="logo hemocione vermelha e branca"
        class="logo"
      />
    </NuxtLink>
    <ClientOnly>
      <NavBarLogin />
    </ClientOnly>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const isIframed = ref(route.query.iframed === "true");

onBeforeMount(() => {
  if (isIframed.value) {
    // override --hemo-navbar-height: 7dvh to 0 and --hemo-page-min-height: 93dvh; to 100dvh;
    // to make the page full screen
    document.documentElement.style.setProperty("--hemo-navbar-height", "0dvh");
    document.documentElement.style.setProperty(
      "--hemo-page-min-height",
      "100dvh"
    );
  }
});
</script>

<style scoped>
.nav-bar {
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  position: sticky;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background-color: var(--black-100);
  top: 0;
  left: 0;
  height: var(--hemo-navbar-height);
}

.hide {
  visibility: hidden;
}
.logo-wrapper {
  height: 100%;
}

.logo {
  height: 100%;
}
</style>
