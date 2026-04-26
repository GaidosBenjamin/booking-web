export interface CodeOfConductResponse {
  id: string;
  content: Record<string, unknown>;
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
