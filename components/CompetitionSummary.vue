<template>
  <NuxtLink class="summaryBox" to="/competitionRank">
    <div :style="{ flex: 9 }">
      <h3 :style="{ margin: '0 0 10px 0' }">
        {{ title }}
      </h3>
      <span> INICIO: {{ start }} </span>
      <br>
      <br>
      <span> TÉRMINO: {{ end }} </span>
    </div>
    <div class="arrow">
      <img :style="{ height: '50px' }" src="/images/bodylessArrow.svg">
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: String,
  start: Date,
  end: Date
})
</script>

<style>
.summaryBox {
  display: flex;
  border: solid #dbdde0 2px;
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
}

.arrow {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
