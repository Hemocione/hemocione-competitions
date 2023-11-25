<template>
  <NavBar />
  <div class="details-main-body">
    <div :style="{ flex: 2 }">
      <NuxtLink to="/">
        <img :style="{ margin: '40px' }" src="/img/arrow.svg"
      /></NuxtLink>
    </div>
    <div class="details">
      <div class="details-title">
        <h1>Competição IDOR: Enfermagem x Radiologia</h1>
      </div>
      <div class="status-teams">
        <div class="details-status">EM ANDAMENTO</div>
      </div>
      <div class="details-grid">
        <div class="last-donators">
          <div class="last-donators-title">Últimos doadores</div>
          <div class="last-donators-item">
            <div :style="{ flex: 1 }"><img src="/img/defaultAvatar.svg" /></div>
            <span :style="{ flex: 8 }">Doador da Silva Nome Gra...</span>
            <span class="last-donators-item-blood-type">A+</span>
          </div>
          <div class="last-donators-item">
            <div :style="{ flex: 1 }"><img src="/img/defaultAvatar.svg" /></div>
            <span :style="{ flex: 8 }">Doador da Silva</span>
            <span class="last-donators-item-blood-type">A+</span>
          </div>
          <div class="last-donators-item">
            <div :style="{ flex: 1 }"><img src="/img/defaultAvatar.svg" /></div>
            <span :style="{ flex: 8 }">Doador da Silva</span>
            <span class="last-donators-item-blood-type">A+</span>
          </div>
        </div>
        <div class="podium"></div>
        <div class="ranking">
          <div class="ranking-title">
            <span :style="{ flex: 1 }">Classificação</span>
            <span :style="{ flex: 1 }">Equipes</span>
            <span :style="{ flex: 1 }">Doações</span>
          </div>
        </div>
      </div>
    </div>
    <div :style="{ flex: 2 }"></div>
  </div>
</template>

<style>
.details-main-body {
  display: flex;
}
.details {
  flex: 6;
}
.details-title {
  text-align: center;
  margin-bottom: 60px;
}
.details-status {
  background-color: #f3f2f1;
  padding: 10px;
  display: inline-block;
  border-radius: 15px;
  border: solid #dbdde0 2px;
}
.status-teams {
  margin-bottom: 35px;
}
.last-donators {
  border: solid #dbdde0 2px;
  border-bottom: 0px;
  border-radius: 5px;
  margin-right: 15px;
}
.last-donators-title {
  background-color: #f3f2f1;
  padding: 10px;
  border-bottom: solid #dbdde0 2px;
}
.last-donators-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: solid #dbdde0 2px;
}
.last-donators-item-blood-type {
  flex: 1;
  color: #bb0a08;
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.podium {
  border: solid #dbdde0 2px;
  margin-left: 15px;
  border-radius: 5px;
}
.ranking {
  border: solid #dbdde0 2px;
  border-radius: 5px;
  border-bottom: 0px;
  margin-top: 30px;
  grid-column-start: 1;
  grid-column-end: 3;
}
.ranking-title {
  background-color: #f3f2f1;
  padding: 20px;
  border-bottom: solid #dbdde0 2px;
  display: flex;
  text-align: center;
}
</style>
