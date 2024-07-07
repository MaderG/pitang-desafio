export const statusMapping = {
  Pendente: 'PENDING',
  Cancelado: 'CANCELLED',
  Concluído: 'CONCLUDED'
};

export function mapStatusToEnglish(status: string): string {
  return statusMapping[status as keyof typeof statusMapping] || status;
}

export function mapStatusesToEnglish(statuses: string[]): string[] {
  return statuses.map(mapStatusToEnglish);
}