import { StatusInfo, StatusValue } from "../types/Status";

export const statusMapping: Record<StatusValue, StatusInfo> = {
  PENDING: { translated: 'Pendente', color: 'orange.400' },
  CANCELED: { translated: 'Cancelado', color: 'red.400' },
  FINISHED: { translated: 'Finalizado', color: 'green.400' }
};

export const getStatusInfo = (status: StatusValue): StatusInfo => {
  return statusMapping[status] || { translated: 'Desconhecido', color: 'gray.200' };
};
