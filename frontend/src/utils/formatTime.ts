import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function formatTime(dateString: string) {
    try {
        return format(new Date(dateString), 'p', { locale: ptBR })
    } catch (error) {
        return 'Erro na hora'
    }
}
