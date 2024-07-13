import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SuccessModal from './SuccessModal'
import { ModalProvider, useModal } from '../../../context/ModalContext'

const TestComponent = () => {
    const { showModal } = useModal()
    return (
        <>
            <button
                onClick={() =>
                    showModal('Successo', 'Ação concluída com sucesso!')
                }
            >
                Mostrar Sucesso
            </button>
            <SuccessModal />
        </>
    )
}

describe('<SuccessModal />', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        render(
            <BrowserRouter>
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>
            </BrowserRouter>
        )
    })

    it('should render without crashing', () => {
        const successButton = screen.getByText('Mostrar Sucesso')
        fireEvent.click(successButton)
        expect(screen.getByText('Successo')).toBeInTheDocument()
        expect(
            screen.getByText('Ação concluída com sucesso!')
        ).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
    })

    it('should close the modal when the close button is clicked', async () => {
        const successButton = screen.getByText('Mostrar Sucesso')
        fireEvent.click(successButton)
        const closeButton = screen.getByRole('button', { name: 'Close' })
        fireEvent.click(closeButton)
        await waitFor(() => {
            expect(screen.queryByText('Successo')).not.toBeInTheDocument()
        })
    })

    it('should navigate to home when the OK button is clicked', async () => {
        const successButton = screen.getByText('Mostrar Sucesso')
        fireEvent.click(successButton)
        const okButton = screen.getByRole('button', { name: 'OK' })
        fireEvent.click(okButton)
        await waitFor(() => {
            expect(screen.queryByText('Successo')).not.toBeInTheDocument()
        })
        expect(window.location.pathname).toBe('/')
    })
})
