<template>
  <div>
    <NavBar />
    <div class="details-container">
      <div :style="{ flex: 1 }">
        <NuxtLink to="/">
          <img :style="{ margin: '40px' }" src="/img/arrow.svg">
        </NuxtLink>
      </div>
      <div class="details-strip">
        <div class="details-title">
          <h1>Competição IDOR: Enfermagem x Radiologia</h1>
        </div>
        <div class="status-teams">
          <div class="details-status">
            EM ANDAMENTO
          </div>
          <div :style="{ flex: 70 }" />
          <el-select placeholder="Equipes">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </div>
        <div class="details-grid">
          <div class="last-donators">
            <div class="last-donators-title">
              Últimos doadores
            </div>
            <div class="last-donators-item">
              <div :style="{ flex: 1 }">
                <img src="/img/defaultAvatar.svg">
              </div>
              <span :style="{ flex: 8 }">Doador da Silva Nome Gra...</span>
              <span class="last-donators-item-blood-type">A+</span>
            </div>
            <div class="last-donators-item">
              <div :style="{ flex: 1 }">
                <img src="/img/defaultAvatar.svg">
              </div>
              <span :style="{ flex: 8 }">Doador da Silva</span>
              <span class="last-donators-item-blood-type">A+</span>
            </div>
            <div class="last-donators-item">
              <div :style="{ flex: 1 }">
                <img src="/img/defaultAvatar.svg">
              </div>
              <span :style="{ flex: 8 }">Doador da Silva</span>
              <span class="last-donators-item-blood-type">A+</span>
            </div>
            <div class="last-donators-item">
              <div :style="{ flex: 1 }">
                <img src="/img/defaultAvatar.svg">
              </div>
              <span :style="{ flex: 8 }">Doador da Silva</span>
              <span class="last-donators-item-blood-type">A+</span>
            </div>
            <div class="last-donators-item">
              <div :style="{ flex: 1 }">
                <img src="/img/defaultAvatar.svg">
              </div>
              <span :style="{ flex: 8 }">Doador da Silva</span>
              <span class="last-donators-item-blood-type">A+</span>
            </div>
          </div>
          <div class="podium">
            <div class="place-strip">
              <div :style="{ flex: 5 }" />
              <div class="team-image-name">
                <div :style="{ 'margin-bottom': '10px' }">
                  <img class="podium-user" src="/img/defaultAvatar.svg">
                </div>
                <div>EQUIPE A</div>
              </div>
              <div class="snd podium-step">
                <img class="medal" src="/img/silver.svg">
                <br>
                <br>
                <span>12</span>
              </div>
            </div>
            <div class="place-strip">
              <div :style="{ flex: 5 }" />
              <div class="team-image-name">
                <div :style="{ 'margin-bottom': '10px' }">
                  <img class="podium-user" src="/img/defaultAvatar.svg">
                </div>
                <div>EQUIPE B</div>
              </div>
              <div class="st podium-step">
                <img class="medal" src="/img/gold.svg">
                <br>
                <br>
                <span>13</span>
              </div>
            </div>
            <div class="place-strip">
              <div :style="{ flex: 5 }" />
              <div class="team-image-name">
                <div :style="{ 'margin-bottom': '10px' }">
                  <img class="podium-user" src="/img/defaultAvatar.svg">
                </div>
                <div>EQUIPE C</div>
              </div>
              <div class="rd podium-step">
                <img class="medal" src="/img/bronze.svg">
                <br>
                <br>
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
      <div :style="{ flex: 1 }" />
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
  </div>
</template>

<script lang="ts" setup></script>

<style>
.details-container {
  display: flex;
}
.details-main-body {
  display: flex;
}
.details-strip {
  flex: 3;
  margin-bottom: 15vh;
}
.details-title {
  text-align: center;
  margin-bottom: 60px;
}
.details-status {
  flex: 12;
  text-align: center;
  height: 20px;
  background-color: #f3f2f1;
  border-radius: 15px;
  border: solid #dbdde0 2px;
  padding: 10px;
  display: inline-block;
}
.status-teams {
  display: flex;
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
  width: 100%;
}
.podium {
  border: solid #dbdde0 2px;
  background-color: #f9f9fa;
  margin-left: 15px;
  border-radius: 5px;
  padding-left: 4%;
  padding-right: 4%;
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
  padding: 20px;
  text-align: center;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
}
.snd.podium-step {
  background-color: #efefef;
  flex: 4;
}
.st.podium-step {
  background-color: #ffebc2;
  flex: 10;
}
.rd.podium-step {
  background-color: #dfd0cc;
  flex: 2;
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
</style>
