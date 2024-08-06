<template>
  <div>
    <header>
      <p>Olá bem vindo a tela de compartilhamento!</p>
    </header>
    <main>
      <p>
        Essa é a tela de compartilhamento, aqui você pode compartilhar o link da
        competição com seus amigos!
      </p>
    </main>
    <footer>
      <p>Espero que tenha gostado!</p>
    </footer>
    <CommonCoolFooter>
      <el-button @click="copyUrl"> Copiar link </el-button>
    </CommonCoolFooter>
  </div>
</template>

<script setup lang="ts">
// TODO: finish this page
import { useUserStore } from "~/store/user";

definePageMeta({
  middleware: ["auth"],
});

const { user, registerInfluence } = useUserStore();

if (!user) {
  // navigateTo("/unauthorized");
}
const route = useRoute();
const competitionSlug = route.params.competitionSlug as string;
const competitionTeamId = route.params.competitionTeamId as string;

onMounted(async () => {
  await registerInfluence(
    competitionSlug,
    Number(competitionTeamId),
  )
});

const copyUrl = async () => {
 
  const params = {
    email_influencer: user?.email as string,
    competition_team_id: competitionTeamId as string,
  };

  const url = new URLSearchParams();
  for (const key in params) {
    const value = params[key as keyof typeof params];
    url.append(key, value);
  }

  const urlToCopy = `${window.location.origin}/competition/${competitionSlug}/register?${url.toString()}`;
  navigator.clipboard.writeText(urlToCopy);
};
</script>
