import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'PP', {locale: ptBR});
  } catch (error) {
    console.error("Erro ao formatar a data: ", error);
    return "Erro na data";
  }
}