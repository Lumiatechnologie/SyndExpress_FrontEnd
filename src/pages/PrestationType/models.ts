export interface PrestationTypeDTO {
  id?: number;
  code: string;
  description: string;
}

export interface PrestationTypeState {
  data: PrestationTypeDTO[];
  loading: boolean;
  error?: string;
}