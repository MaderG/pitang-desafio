import { ChevronDownIcon } from '@chakra-ui/icons'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useToast,
} from '@chakra-ui/react'
import fetcher from '../../services/api'
import { StatusUpdateButtonProps } from '../../types/StatusUpdateButtonProps'

const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
    id,
    currentStatus,
    fetchData,
}) => {
    const toast = useToast()

    const updateStatus = async (id: string, status: string) => {
        if (status === currentStatus) {
            return
        }
        try {
            await fetcher.put(`/api/appointments/${id}`, {
                status,
            })
            toast({
                title: 'Status atualizado com sucesso',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            fetchData()
        } catch (err) {
            if (err instanceof Error) {
                toast({
                    title: 'Erro ao atualizar status',
                    description: err.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    }

    const handleStatusChange = (newStatus: string) => {
        updateStatus(id, newStatus)
    }

    return (
        <Menu>
            <MenuButton
                data-testid="currentStatus"
                as={Button}
                rightIcon={<ChevronDownIcon />}
            >
                {currentStatus}
            </MenuButton>
            <MenuList>
                <MenuItem
                    data-testid="menu-item-Cancelado"
                    onClick={() => handleStatusChange('Cancelado')}
                >
                    Cancelado
                </MenuItem>
                <MenuItem
                    data-testid="menu-item-Pendente"
                    onClick={() => handleStatusChange('Pendente')}
                >
                    Pendente
                </MenuItem>
                <MenuItem
                    data-testid="menu-item-Finalizado"
                    onClick={() => handleStatusChange('Finalizado')}
                >
                    Finalizado
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default StatusUpdateButton
