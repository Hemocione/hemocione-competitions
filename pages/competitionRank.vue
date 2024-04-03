<template>
  <div class="details-container">
    <NuxtLink class="back-arrow" to="/">
      <img src="/images/arrow.svg" />
    </NuxtLink>

    <div class="details-strip">
      <div class="details-title">
        <h1>Competição IDOR: Enfermagem x Radiologia</h1>
      </div>
      <div class="status-teams">
        <div class="details-status">EM ANDAMENTO</div>
        <div :style="{ flex: 70 }" />
        <el-select class="detail-team-select" placeholder="Equipes">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </div>
      <div class="details-grid">
        <div class="podium">
          <div class="place-strip">
            <div :style="{ flex: 5 }" />
            <div class="team-image-name">
              <div :style="{ 'margin-bottom': '10px' }">
                <img class="podium-user" src="/images/defaultAvatar.svg" />
              </div>
              <div>EQUIPE A</div>
            </div>
            <div class="snd podium-step">
              <img class="medal" src="/images/silver.svg" />
              <br />
              <br />
              <span>12</span>
            </div>
          </div>
          <div class="place-strip">
            <div :style="{ flex: 5 }" />
            <div class="team-image-name">
              <div :style="{ 'margin-bottom': '10px' }">
                <img class="podium-user" src="/images/defaultAvatar.svg" />
              </div>
              <div>EQUIPE B</div>
            </div>
            <div class="st podium-step">
              <img class="medal" src="/images/gold.svg" />
              <br />
              <br />
              <span>13</span>
            </div>
          </div>
          <div class="place-strip">
            <div :style="{ flex: 5 }" />
            <div class="team-image-name">
              <div :style="{ 'margin-bottom': '10px' }">
                <img class="podium-user" src="/images/defaultAvatar.svg" />
              </div>
              <div>EQUIPE C</div>
            </div>
            <div class="rd podium-step">
              <img class="medal" src="/images/bronze.svg" />
              <br />
              <br />
              <span>9</span>
            </div>
          </div>
        </div>
        <div class="ranking">
          <div class="ranking-title">
            <span :style="{ flex: 1 }">Classificação</span>
            <span :style="{ flex: 1 }">Equipes</span>
            <span :style="{ flex: 1 }">Doações</span>
          </div>
          <div class="ranking-row">
            <span :style="{ flex: 1 }">1</span>
            <span :style="{ flex: 1 }">Equipe B</span>
            <span :style="{ flex: 1 }">13</span>
          </div>
          <div class="ranking-row">
            <span :style="{ flex: 1 }">2</span>
            <span :style="{ flex: 1 }">Equipe C</span>
            <span :style="{ flex: 1 }">15</span>
          </div>
          <div class="ranking-row">
            <span :style="{ flex: 1 }">3</span>
            <span :style="{ flex: 1 }">Equipe D</span>
            <span :style="{ flex: 1 }">15</span>
          </div>
          <div class="ranking-row">
            <span :style="{ flex: 1 }">4</span>
            <span :style="{ flex: 1 }">Equipe E</span>
            <span :style="{ flex: 1 }">15</span>
          </div>
          <div class="ranking-row">
            <span :style="{ flex: 1 }">5</span>
            <span :style="{ flex: 1 }">Equipe F</span>
            <span :style="{ flex: 1 }">15</span>
          </div>
        </div>
      </div>
    </div>

    <div class="register-sticky">
      <div :style="{ flex: 1 }" />
      <div class="register-button-strip">
        <NuxtLink to="/donation">
          <el-button class="register-button" type="primary">
            + Registrar nova doação
          </el-button>
        </NuxtLink>
      </div>
      <div :style="{ flex: 1 }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";

defineProps({
  competitionId: {
    type: String,
    default: "",
  },
  teams: {
    type: Array,
    default: [
      { id: 1, name: "Pain", qtdDoacoes: 12 },
      { id: 2, name: "Los grandes", qtdDoacoes: 10 },
      { id: 3, name: "Loud", qtdDoacoes: 15 },
    ],
  },
});
// TODO: making dinamic 
// const ranking = computed(() => this.teams.value);

// navigateTo('https://hemocione.com.br', { external: true }) // for now
</script>

<style>
  .details-container {
    display: flex;
    width: 100%;
    background-color: white;
  }
  .details-main-body {
    display: flex;
  }
  .details-strip {
    flex: 3;
    margin-bottom: 15vh;
    padding: 0 10%;
  }
  .details-title {
    text-align: center;
    margin-bottom: 60px;
  }
  .details-status {
    text-align: center;
    height: 40px;
    background-color: #f3f2f1;
    border-radius: 200px;
    border: solid #dbdde0 2px;
    padding: 10px;
    display: inline-block;
  }
  .status-teams {
    display: flex;
    justify-content: center;
    align-items: center;
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
    display: flex;
    flex-direction: column;
  }
  .detail-team-select {
    height: 48px;
    width: 15%;
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
  .ranking-row {
    padding: 20px;
    border-bottom: solid #dbdde0 2px;
    display: flex;
    text-align: center;
    background-color: white;
  }
  .register-sticky {
    position: fixed;
    border-top: solid #dbdde0 2px;
    background-color: white;
    height: 10vh;
    width: 100%;
    bottom: 0;
    display: flex;
  }
  .register-button-strip {
    margin: auto;
    flex: 3;
  }
  .register-button {
    height: 40px;
    background-color: #e93c3c;
    width: 100%;
  }
  .podium {
    border: solid #dbdde0 2px;
    width: 60%;
    height: 380px;
    background-color: #f9f9fa;
    border-radius: 5px;
    padding: 8px;
    display: flex;
    gap: 3%;
  }
  .place-strip {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    height: 100%;
  }
  .podium-step {
    padding-top: 20px;
    text-align: center;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
  }
  .snd.podium-step {
    background-color: #efefef;
    flex: 10;
  }
  .st.podium-step {
    background-color: #ffebc2;
    flex: 20;
  }
  .rd.podium-step {
    background-color: #dfd0cc;
  }
  .team-image-name {
    text-align: center;
  }
  .podium-user {
    height: 60px;
  }
  .medal {
    height: 50px;
  }

  .back-arrow {
    position: fixed;
    margin: 15px 0px 0px 15px;
  }

  @media screen and (max-width: 753px) {
    .podium {
      width: 100%;
    }
    .detail-team-select {
      height: 48px;
      width: 30%;
    }
  }
</style>
