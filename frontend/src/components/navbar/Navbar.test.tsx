import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { ChakraProvider } from '@chakra-ui/react'

describe('<Navbar />', () => {
    beforeEach(() => {
        render(
            <ChakraProvider>
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            </ChakraProvider>
        )
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    it('should render the logo and navigation links', () => {
        expect(screen.getByAltText('Logo da Pitang')).toBeInTheDocument()
        expect(screen.getAllByText('Inicio')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Agendar Vacina')[0]).toBeInTheDocument()
        expect(
            screen.getAllByText('Consultar Agendamentos')[0]
        ).toBeInTheDocument()
    })

    it('should toggle the mobile menu when the hamburger icon is clicked', async () => {
        const hamburgerIcon = screen.getByLabelText('Toggle Navigation')
        fireEvent.click(hamburgerIcon)

        await waitFor(() => {
            expect(screen.getByRole('link', { name: 'Inicio' })).toBeVisible()
            expect(
                screen.getByRole('link', { name: 'Agendar Vacina' })
            ).toBeVisible()
            expect(
                screen.getByRole('link', { name: 'Consultar Agendamentos' })
            ).toBeVisible()
        })

        fireEvent.click(hamburgerIcon)

        await waitFor(() => {
            expect(
                screen.queryByRole('link', { name: 'Inicio' })
            ).not.toBeVisible()
            expect(
                screen.queryByRole('link', { name: 'Agendar Vacina' })
            ).not.toBeVisible()
            expect(
                screen.queryByRole('link', { name: 'Consultar Agendamentos' })
            ).not.toBeVisible()
        })
    })

    it('should navigate to the correct routes when links are clicked', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        )

        const inicioLink = screen.getByRole('link', { name: 'Inicio' })
        const agendarVacinaLink = screen.getByRole('link', {
            name: 'Agendar Vacina',
        })
        const consultarAgendamentosLink = screen.getByRole('link', {
            name: 'Consultar Agendamentos',
        })

        fireEvent.click(inicioLink)
        expect(window.location.pathname).toBe('/')

        fireEvent.click(agendarVacinaLink)
        expect(window.location.pathname).toBe('/vaccine-appointment')

        fireEvent.click(consultarAgendamentosLink)
        expect(window.location.pathname).toBe('/appointments')
    })
})
