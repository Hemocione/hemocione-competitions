import type { CompetitionMode } from "@prisma/client";

/**
 * Vocabulario da copa por modo.
 *
 * Numa copa participativa a unidade contada e a PARTICIPACAO, nao a bolsa de
 * sangue — quem foi reprovado na pre-triagem tambem conta. Falar "doacao" nas
 * telas e nos rankings daria a entender que so doacao vale, que e justamente o
 * contrario da campanha.
 *
 * Centralizado aqui para nao espalhar ternario por tela: uma copa nova nao
 * deveria exigir cacar strings pelo repo.
 */
export function useCompetitionWording(
  mode?: MaybeRefOrGetter<CompetitionMode | string | null | undefined>,
) {
  const isParticipation = computed(() => toValue(mode) === "participation");

  return {
    isParticipation,
    /** "participação" | "doação" */
    noun: computed(() => (isParticipation.value ? "participação" : "doação")),
    /** "Participações" | "Doações" — usado como cabecalho de ranking */
    nounPluralCapitalized: computed(() =>
      isParticipation.value ? "Participações" : "Doações",
    ),
    /** "Registrar Participação" | "Registrar Doação" */
    registerCta: computed(() =>
      isParticipation.value ? "Registrar Participação" : "Registrar Doação",
    ),
    /** Titulo do contador geral */
    totalLabel: computed(() =>
      isParticipation.value
        ? "TOTAL DE PARTICIPAÇÕES REGISTRADAS"
        : "TOTAL DE DOAÇÕES REALIZADAS",
    ),
  };
}
