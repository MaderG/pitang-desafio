import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useUnavailableDays } from './useUnavailableDays'
import fetcher from '../../services/api'

jest.mock('../../services/api')

const mockedFetcher = fetcher as jest.Mocked<typeof fetcher>

const TestComponent: React.FC = () => {
    const {unavailableDays} = useUnavailableDays()

    return (
        <div>
            <ul data-testid="days-list">
                {unavailableDays.map((day, index) => (
                    <li key={index}>{day.toISOString()}</li>
                ))}
            </ul>
        </div>
    )
}

describe('useUnavailableDays', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should fetch unavailable days successfully', async () => {
        const mockDays = ['2023-12-01', '2023-12-02', '2023-12-03']
        mockedFetcher.get.mockResolvedValue(mockDays)

        render(<TestComponent />)

        await waitFor(() => {
            expect(screen.getByText('2023-12-01T03:00:00.000Z')).toBeInTheDocument()
            expect(screen.getByText('2023-12-02T03:00:00.000Z')).toBeInTheDocument()
            expect(screen.getByText('2023-12-03T03:00:00.000Z')).toBeInTheDocument()
        })
    })

    it('should add current date if after 18:00', async () => {
        const mockDays = ['2023-12-01', '2023-12-02', '2023-12-03']
        mockedFetcher.get.mockResolvedValue(mockDays)

        const mockDate = new Date('2023-12-04T21:00:00.000Z')
        jest.useFakeTimers().setSystemTime(mockDate)

        render(<TestComponent />)

        await waitFor(() => {
            expect(screen.getByText('2023-12-01T03:00:00.000Z')).toBeInTheDocument()
            expect(screen.getByText('2023-12-02T03:00:00.000Z')).toBeInTheDocument()
            expect(screen.getByText('2023-12-03T03:00:00.000Z')).toBeInTheDocument()
            expect(screen.getByText((content, element) => 
                element?.tagName.toLowerCase() === 'li' && 
                content.startsWith('2023-12-04T21:00:00') // está tendo 0.5 ms de deiferença
            )).toBeInTheDocument()
        })

        jest.useRealTimers()
    })

    it('should handle error during fetch', async () => {
        const mockError = new Error('Failed to fetch unavailable days')
        mockedFetcher.get.mockRejectedValue(mockError)

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        render(<TestComponent />)

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch unavailable days')
        })

        consoleSpy.mockRestore()
    })
})
