import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useAvailableHours } from './useAvailableHours'
import fetcher from '../../services/api'

jest.mock('../../services/api')

const mockedFetcher = fetcher as jest.Mocked<typeof fetcher>

interface TestComponentProps {
    date: Date | null
}

const TestComponent: React.FC<TestComponentProps> = ({ date }) => {
    const availableHours = useAvailableHours(date!)

    return (
        <div>
            <ul data-testid="hours-list">
                {availableHours.map((hour, index) => (
                    <li key={index}>{hour}</li>
                ))}
            </ul>
        </div>
    )
}

describe('useAvailableHours', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should fetch available hours successfully', async () => {
        const mockHours = ['08:00', '09:00', '10:00']
        mockedFetcher.get.mockResolvedValue(mockHours)
        const date = new Date('2023-12-01T00:00:00Z')

        render(<TestComponent date={date} />)

        await waitFor(() => {
            expect(screen.getByText('08:00')).toBeInTheDocument()
            expect(screen.getByText('09:00')).toBeInTheDocument()
            expect(screen.getByText('10:00')).toBeInTheDocument()
        })
    })

    it('should handle error during fetch', async () => {
        const mockError = new Error('Failed to fetch available hours')
        mockedFetcher.get.mockRejectedValue(mockError)
        const date = new Date('2023-12-01T00:00:00Z')

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        render(<TestComponent date={date} />)

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch available hours')
        })

        consoleSpy.mockRestore()
    })

    it('should not fetch if date is not provided', async () => {
        render(<TestComponent date={null} />)

        await waitFor(() => {
            expect(screen.queryByText('08:00')).not.toBeInTheDocument()
            expect(screen.queryByText('09:00')).not.toBeInTheDocument()
            expect(screen.queryByText('10:00')).not.toBeInTheDocument()
        })

        expect(mockedFetcher.get).not.toHaveBeenCalled()
    })
})
