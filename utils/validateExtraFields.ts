// const extraFieldsTypes = ['text', 'select', 'multi-select', 'checkbox', 'switch', 'date', 'datetime'] as const; -- IDEAL
const extraFieldsTypes = ['text'] as const; // HOJE
type ExtraFieldType = typeof extraFieldsTypes[number];

export interface ExtraField {
  slug: string;
  label: string;
  required: boolean;
  type: ExtraFieldType;
}

export type ExtraFields = ExtraField[];

export interface ExtraFieldResponse {
  slug: string;
  value: string;
}

export type ExtraFieldsResponse = ExtraFieldResponse[];

// extra fields are configured in the competition
// extra fields response are the user input in the donation for each extra field
//
// A checagem de tipo que existia aqui comparava `response.type`, campo que nao
// existe em ExtraFieldResponse — o resultado era `undefined !== 'text'`, sempre
// verdadeiro, o que reprovaria qualquer campo preenchido. O bug nunca apareceu
// porque a funcao nunca era chamada; ela virou TODO no handler de registro.
// Agora que a matricula do aluno depende dela, valida o que importa de fato:
// campo obrigatorio presente e nao vazio.
export const isValidExtraFieldsResponse = (
  extraFields: ExtraFields,
  extraFieldsResponse: ExtraFieldsResponse,
) => {
  if (!Array.isArray(extraFieldsResponse)) return false;

  // A resposta vem do corpo do request: uma entrada null, string ou numero faria
  // o acesso a `.slug` estourar dentro do handler de registro.
  const isEntry = (e: unknown): e is ExtraFieldResponse =>
    typeof e === "object" && e !== null && "slug" in e;

  if (!extraFieldsResponse.every(isEntry)) return false;

  for (const extraField of extraFields) {
    const response = extraFieldsResponse.find((e) => e.slug === extraField.slug);

    if (extraField.required) {
      if (!response) return false;
      if (typeof response.value !== "string" || !response.value.trim()) {
        return false;
      }
    }

    if (response && typeof response.value !== "string") return false;
  }

  return true;
};
