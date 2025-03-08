<template>
  <div>
    <p v-if="!competitionEnded">
      Faça a diferença ao participar do nosso Ranking de Indicações! Conquiste
      uma posição de destaque ao inspirar outras pessoas a doar. Quanto mais
      você engajar, mais alto será seu ranking. Juntos, podemos transformar
      vidas.
      <NuxtLink :to="`/competition/${slug}/influence`" class="highlight-link">
        Clique aqui para começar e fazer a diferença!
      </NuxtLink>
    </p>
    <p v-else>
      Veja o Ranking de Indicação e descubra quem foram os destaques da
      copa.
    </p>
    <TemplateCompetitionContent2 :disablePodium="true">
      <template #podium-content>
        <div class="content">
          <Ranking :ranking="influenceRanking" v-if="influenceRanking.contents.length" style="width: 100%" />
          <img v-else src="/images/illustrations/hemo-friends.png" class="empty-image" />
        </div>
      </template>
    </TemplateCompetitionContent2>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  influenceRanking: any;
  slug: string | string[];
  competitionEnded?: boolean;
}>();
</script>
<style scoped>
.highlight-link {
  color: #ff5733;
  font-weight: bold;
  text-decoration: underline;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-top: 1rem;
}

.empty-image {
  max-width: 90%;
}
</style>
