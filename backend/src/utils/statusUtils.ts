export const statusMapping = {
  Pendente: 'PENDING',
  Cancelado: 'CANCELED',
  Finalizado: 'FINISHED'
};

export function mapStatusToEnglish(status: string): string {
  return statusMapping[status as keyof typeof statusMapping] || status;
}

export function mapStatusesToEnglish(statuses: string[]): string[] {
  return statuses.map(mapStatusToEnglish);
}