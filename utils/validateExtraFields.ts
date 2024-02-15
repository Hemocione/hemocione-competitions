// const extraFieldsTypes = ['text', 'select', 'multi-select', 'checkbox', 'switch', 'date', 'datetime'] as const; -- IDEAL
const extraFieldsTypes = ['text'] as const; // HOJE
type ExtraFieldType = typeof extraFieldsTypes[number];

interface ExtraField {
  slug: string;
  label: string;
  required: boolean;
  type: ExtraFieldType;
}

type ExtraFields = ExtraField[];

interface ExtraFieldResponse {
  slug: string;
  type: ExtraFieldType;
  value: string;
}

type ExtraFieldsResponse = ExtraFieldResponse[];

// extra fields are configured in the competition
// extra fields response are the user input in the donation for each extra field
export const isValidExtraFieldsResponse = (extraFields: ExtraFields, extraFieldsResponse: ExtraFieldsResponse) => {
  for (const extraField of extraFields) {
    const response = extraFieldsResponse.find((e) => e.slug === extraField.slug);
    if (!response && extraField.required) {
      return false
    }

    if (response && response.type !== extraField.type) {
      return false
    }
  }
  return true
}