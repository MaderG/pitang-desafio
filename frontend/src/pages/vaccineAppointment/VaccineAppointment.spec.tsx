import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import VaccineAppointment from './VaccineAppointment'
import { ModalProvider } from '../../context/ModalContext'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import fetcher from '../../services/api'

jest.mock('../../services/api')

const mockAvailableHours = ['08:00', '09:00', '10:00']
const mockUnavailableDays = ['2029-01-01', '2029-01-02']

describe('<VaccineAppointment />', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('should render without crashing', async () => {
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        await waitFor(() =>
            expect(screen.getByText('Agende já sua vacina')).toBeInTheDocument()
        )
    })

    it('should handle form submission successfully', async () => {
        ;(fetcher.get as jest.Mock).mockResolvedValue({
            availableHours: mockAvailableHours,
            unavailableDays: mockUnavailableDays,
        })
        ;(fetcher.post as jest.Mock).mockResolvedValue({ ok: true })
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        await waitFor(() =>
            expect(screen.getByText('Agende já sua vacina')).toBeInTheDocument()
        )

        const nameInput = screen.getByTestId('name')
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })

        const birthDateInput = screen.getByTestId('birth-date')
        fireEvent.change(birthDateInput, { target: { value: '1990-02-01' } })

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.change(scheduleDateInput, { target: { value: '2029-01-02' } })

        const hourInput = screen.getByTestId('hour')
        fireEvent.change(hourInput, { target: { value: '08:00' } })

        await waitFor(() =>
            expect(screen.getByText('Agendar')).not.toBeDisabled()
        )

        fireEvent.click(screen.getByText('Agendar'))

        await waitFor(() =>
            expect(
                screen.getByText('Agendamento realizado com sucesso!')
            ).toBeInTheDocument()
        )
    })

    it('should handle form submission error', async () => {
        ;(fetcher.get as jest.Mock).mockResolvedValue({
            availableHours: mockAvailableHours,
            unavailableDays: mockUnavailableDays,
        })
        ;(fetcher.post as jest.Mock).mockRejectedValue(
            new Error('Failed to fetch appointments')
        )

        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        const nameInput = screen.getByTestId('name')
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })

        const birthDateInput = screen.getByTestId('birth-date')
        fireEvent.change(birthDateInput, { target: { value: '1990-02-01' } })

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.change(scheduleDateInput, { target: { value: '2029-01-02' } })

        const hourInput = screen.getByTestId('hour')
        fireEvent.change(hourInput, { target: { value: '08:00' } })

        await waitFor(() =>
            expect(screen.getByText('Agendar')).not.toBeDisabled()
        )

        fireEvent.click(screen.getByText('Agendar'))

        await waitFor(() =>
            expect(screen.getByRole('status')).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(
                screen.getByText('Erro ao agendar vacina')
            ).toBeInTheDocument()
        )
    })

    it('should validate required fields', async () => {
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        expect(screen.getByText('Agendar')).toBeDisabled()

        const nameInput = screen.getByTestId('name')
        fireEvent.blur(nameInput)

        const birthDateInput = screen.getByTestId('birth-date')
        fireEvent.blur(birthDateInput)

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.blur(scheduleDateInput)

        const hourInput = screen.getByTestId('hour')
        fireEvent.blur(hourInput)

        await waitFor(() => expect(screen.getByText('Agendar')).toBeDisabled())

        await waitFor(() =>
            expect(
                screen.getByText('Você precisa informar um nome')
            ).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(
                screen.getByText('Informe uma data de nascimento')
            ).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(
                screen.getByText('Informe uma data de vacinação')
            ).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(
                screen.getByText('Informe um horário de vacinação')
            ).toBeInTheDocument()
        )
    })

    it('should load saved form data from localStorage', async () => {
        const savedFormData = {
            name: 'John Doe',
            birthDate: '1990-01-01T03:00:00.000Z', // GMT -3
            date: '2029-01-03T03:00:00.000Z', // GMT -3
            time: '08:00',
        }
        localStorage.setItem(
            'vaccine-appointment-form',
            JSON.stringify(savedFormData)
        )

        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        await waitFor(() =>
            expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(screen.getByDisplayValue('01/01/1990')).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(screen.getByDisplayValue('03/01/2029')).toBeInTheDocument()
        )
        await waitFor(() =>
            expect(screen.getByDisplayValue('08:00')).toBeInTheDocument()
        )
    })

    it('should open modal if data is submitted and form is valid', async () => {
        ;(fetcher.get as jest.Mock).mockResolvedValue({
            availableHours: mockAvailableHours,
            unavailableDays: mockUnavailableDays,
        })
        ;(fetcher.post as jest.Mock).mockResolvedValue({ ok: true })
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        const nameInput = screen.getByTestId('name')
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })

        const birthDateInput = screen.getByTestId('birth-date')
        fireEvent.change(birthDateInput, { target: { value: '1990-02-01' } })

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.change(scheduleDateInput, { target: { value: '2029-01-02' } })

        const hourInput = screen.getByTestId('hour')
        fireEvent.change(hourInput, { target: { value: '08:00' } })

        await waitFor(() =>
            expect(screen.getByText('Agendar')).not.toBeDisabled()
        )

        fireEvent.click(screen.getByText('Agendar'))

        await waitFor(() =>
            expect(
                screen.getByText('Agendamento realizado com sucesso!')
            ).toBeInTheDocument()
        )
    })

    it('should redirect to home page if user clicks on "Ok" button', async () => {
        ;(fetcher.get as jest.Mock).mockResolvedValue({
            availableHours: mockAvailableHours,
            unavailableDays: mockUnavailableDays,
        })
        ;(fetcher.post as jest.Mock).mockResolvedValue({ ok: true })
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        const nameInput = screen.getByTestId('name')
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })

        const birthDateInput = screen.getByTestId('birth-date')
        fireEvent.change(birthDateInput, { target: { value: '1990-02-01' } })

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.change(scheduleDateInput, { target: { value: '2029-01-02' } })

        const hourInput = screen.getByTestId('hour')
        fireEvent.change(hourInput, { target: { value: '08:00' } })

        await waitFor(() =>
            expect(screen.getByText('Agendar')).not.toBeDisabled()
        )

        fireEvent.click(screen.getByText('Agendar'))

        await waitFor(() =>
            expect(
                screen.getByText('Agendamento realizado com sucesso!')
            ).toBeInTheDocument()
        )

        fireEvent.click(screen.getByText('OK'))

        await waitFor(() =>
            expect(screen.getByText('Agende já sua vacina')).toBeInTheDocument()
        )
    })

    it('should not be able to submit form if there are no available hours', async () => {
        ;(fetcher.get as jest.Mock).mockResolvedValue({
            availableHours: [],
            unavailableDays: mockUnavailableDays,
        })
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        const nameInput = screen.getByTestId('name')
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })

        const birthDateInput = screen.getByTestId('birth-date')
        fireEvent.change(birthDateInput, { target: { value: '1990-02-01' } })

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.change(scheduleDateInput, { target: { value: '2029-01-02' } })

        await waitFor(() => expect(screen.getByText('Agendar')).toBeDisabled())
    })

    it('should not be able to choose an unavailable date', async () => {
        ;(fetcher.get as jest.Mock).mockResolvedValue({
            availableHours: mockAvailableHours,
            unavailableDays: mockUnavailableDays,
        })
        await act(async () => {
            render(
                <ChakraProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <VaccineAppointment />
                        </BrowserRouter>
                    </ModalProvider>
                </ChakraProvider>
            )
        })

        const scheduleDateInput = screen.getByTestId('schedule-date')
        fireEvent.change(scheduleDateInput, { target: { value: '2029-01-01' } })

        await waitFor(() => expect(screen.getByText('Agendar')).toBeDisabled())
    })
})
