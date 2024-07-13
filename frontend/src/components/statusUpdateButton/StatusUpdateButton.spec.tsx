import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import StatusUpdateButton from './StatusUpdateButton'
import fetcher from '../../services/api'
import { StatusUpdateButtonProps } from '../../types/StatusUpdateButtonProps'
import { ChakraProvider } from '@chakra-ui/react'

jest.mock('../../services/api')

const renderStatusUpdateButton = (props: StatusUpdateButtonProps) => {
    return render(
        <ChakraProvider>
            <StatusUpdateButton {...props} />
        </ChakraProvider>
    )
}

describe('<StatusUpdateButton />', () => {
    beforeEach(() => {
        ;(fetcher.put as jest.Mock).mockClear()
    })

    it('should render correctly', () => {
        const { getByTestId } = renderStatusUpdateButton({
            id: '1',
            currentStatus: 'Finalizado',
            fetchData: jest.fn(),
        })

        expect(getByTestId('currentStatus')).toBeInTheDocument()
        expect(getByTestId('currentStatus')).toHaveTextContent('Finalizado')
    })

    it('should update status when a new status is selected', async () => {
        ;(fetcher.put as jest.Mock).mockResolvedValue({ ok: true })

        const fetchData = jest.fn()
        const { getByTestId } = renderStatusUpdateButton({
            id: '1',
            currentStatus: 'Finalizado',
            fetchData,
        })

        fireEvent.click(getByTestId('currentStatus'))
        fireEvent.click(getByTestId('menu-item-Pendente'))

        await waitFor(() => {
            expect(fetchData).toHaveBeenCalledTimes(1)
        })
    })

    it('should display all menu items correctly', () => {
        const { getByTestId } = renderStatusUpdateButton({
            id: '1',
            currentStatus: 'Finalizado',
            fetchData: jest.fn(),
        })

        fireEvent.click(getByTestId('menu-item-Finalizado')) // Abre o menu
        expect(getByTestId('menu-item-Cancelado')).toBeInTheDocument()
        expect(getByTestId('menu-item-Pendente')).toBeInTheDocument()
        expect(getByTestId('menu-item-Finalizado')).toBeInTheDocument()
    })

    it('should display error toast on API failure', async () => {
        ;(fetcher.put as jest.Mock).mockRejectedValue(
            new Error('Failed to update status')
        )

        const { getByTestId } = renderStatusUpdateButton({
            id: '1',
            currentStatus: 'Finalizado',
            fetchData: jest.fn(),
        })

        fireEvent.click(getByTestId('currentStatus'))
        fireEvent.click(getByTestId('menu-item-Pendente'))

        await waitFor(() => {
            expect(screen.getByRole('status')).toHaveTextContent(
                'Erro ao atualizar status'
            )
        })
    })

    it('should call fetch with the correct parameters on status change', async () => {
        ;(fetcher.put as jest.Mock).mockResolvedValue({ ok: true })

        const fetchData = jest.fn()
        const { getByTestId } = renderStatusUpdateButton({
            id: '1',
            currentStatus: 'Finalizado',
            fetchData,
        })

        fireEvent.click(getByTestId('currentStatus'))
        fireEvent.click(getByTestId('menu-item-Cancelado'))

        await waitFor(() => {
            expect(fetcher.put).toHaveBeenCalledWith(`/api/appointments/1`, {
                status: 'Cancelado',
            })
        })
    })

    it('should not call fetch if the status is the same', async () => {
        const fetchData = jest.fn()
        const { getByTestId } = renderStatusUpdateButton({
            id: '1',
            currentStatus: 'Finalizado',
            fetchData,
        })

        fireEvent.click(getByTestId('currentStatus'))
        fireEvent.click(getByTestId('menu-item-Finalizado'))

        await waitFor(() => {
            expect(fetcher.put).not.toHaveBeenCalled()
        })
    })
})
