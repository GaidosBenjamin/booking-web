export interface LocalizedString {
  en: string;
  ro: string;
}

export interface LocalizedArray {
  en: string[];
  ro: string[];
}

export interface CocRule {
  icon: string;
  title: LocalizedString;
  number: string;
  description: LocalizedString;
  bulletPoints?: LocalizedArray;
}

export interface CocContent {
  rules: CocRule[];
  title: LocalizedString;
  introduction: LocalizedString;
}

export interface CodeOfConductResponse {
  id: string;
  content: CocContent;
  active: boolean;
  createdOn: string;
}

export interface AgreementResponse {
  id: string;
  codeOfConductId: string;
  userId: string;
  agreedOn: string;
}

export interface CreateAgreementRequest {
  codeOfConductId: string;
}
