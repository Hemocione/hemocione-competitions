<template>
  <div>
    <TemplateCompetitionContent2 :disablePodium="false">
      <template #podium-content>
        <div class="blood-view">
          <h4>TOTAL DE DOAÇÕES REALIZADAS</h4>
          <h1 class="blood-amount-donation">
            {{ formattedDonationsAmount }}
          </h1>
          <div class="general-view">
            <img
              src="/images/HemoLogo.svg"
              class="view-img"
              style="width: 60%"
            />
          </div>
        </div>
      </template>
      <template #ranking-content>
        <Ranking :ranking="mappedRankByCompetition" />
      </template>
    </TemplateCompetitionContent2>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  donationsAmount: number;
  mappedRankByCompetition: any;
}>();

const formattedDonationsAmount = computed(() => {
  const amount = props.donationsAmount;

  if (amount < 1000) {
    return amount.toString();
  }

  if (amount < 1000000) {
    // For thousands (K)
    const thousands = amount / 1000;
    if (thousands < 10) {
      // For numbers like 1.5K, 2.3K, etc.
      return Math.round(thousands * 10) / 10 + "K";
    } else {
      // For numbers like 10K, 25K, 999K
      return Math.floor(thousands) + "K";
    }
  }

  if (amount < 1000000000) {
    // For millions (M)
    const millions = amount / 1000000;
    if (millions < 10) {
      // For numbers like 1.5M, 2.3M, etc.
      return Math.round(millions * 10) / 10 + "M";
    } else {
      // For numbers like 10M, 25M, 999M
      return Math.floor(millions) + "M";
    }
  }

  // For billions (B)
  const billions = amount / 1000000000;
  if (billions < 10) {
    // For numbers like 1.5B, 2.3B, etc.
    return Math.round(billions * 10) / 10 + "B";
  } else {
    // For numbers like 10B, 25B, etc.
    return Math.floor(billions) + "B";
  }
});
</script>
<style scoped>
.general-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.view-img {
  margin-bottom: 30%;
}

.blood-amount-donation {
  position: absolute;
  margin-top: 28%;
  color: white;
  font-size: 1.8rem;
}

.blood-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  position: relative;
}
</style>
