import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

describe('Home Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        )
        expect(screen.getByText('Portal de Vacinação')).toBeInTheDocument()
    })

    it('displays the correct text', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        )
        expect(
            screen.getByText(
                'Nossa cidade está se mobilizando para garantir que todos recebam a vacina contra a COVID-19. Utilize nosso portal para agendar sua vacinação de forma rápida e segura. Verifique os horários disponíveis e garanta sua dose para proteger a si mesmo e aos outros.'
            )
        ).toBeInTheDocument()
    })

    it('contains a link to vaccine appointment page', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        )
        expect(screen.getByRole('link', { name: 'Agende sua vacina' })).toHaveAttribute(
            'href',
            '/vaccine-appointment'
        )
    })
})