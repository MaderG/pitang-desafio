import { render, screen, waitFor } from '@testing-library/react'
import useAvailableDates from './useAvailableDates'
import fetcher from '../../services/api'

jest.mock('../../services/api')

const mockedFetcher = fetcher as jest.Mocked<typeof fetcher>

const TestComponent = () => {
    const { availableDates, loading, error, refetch } = useAvailableDates()

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {availableDates.map((date, index) => (
                    <li key={index}>{date.toISOString()}</li>
                ))}
            </ul>
            <button onClick={refetch}>Refetch</button>
        </div>
    )
}

describe('useAvailableDates', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should fetch available dates successfully', async () => {
        const mockDates = ['2023-12-01', '2023-12-02']
        mockedFetcher.get.mockResolvedValue(mockDates)

        render(<TestComponent />)

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        expect(screen.queryByText('Error:')).not.toBeInTheDocument()
        expect(screen.getByText('2023-12-01T03:00:00.000Z')).toBeInTheDocument()
        expect(screen.getByText('2023-12-02T03:00:00.000Z')).toBeInTheDocument()
    })

    it('should handle error during fetch', async () => {
        const mockError = new Error('Failed to fetch available dates')
        mockedFetcher.get.mockRejectedValue(mockError)

        render(<TestComponent />)

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        expect(screen.getByText('Error: Failed to fetch available dates')).toBeInTheDocument()
        expect(screen.queryByText('2023-12-01T03:00:00.000Z')).not.toBeInTheDocument()
    })

    it('should refetch available dates', async () => {
        const initialMockDates = ['2023-12-01']
        const updatedMockDates = ['2023-12-01', '2023-12-02']

        mockedFetcher.get.mockResolvedValueOnce(initialMockDates).mockResolvedValueOnce(updatedMockDates)

        render(<TestComponent />)

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        expect(screen.getByText('2023-12-01T03:00:00.000Z')).toBeInTheDocument()

        const refetchButton = screen.getByText('Refetch')
        mockedFetcher.get.mockResolvedValue(updatedMockDates)
        refetchButton.click()

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        expect(screen.getByText('2023-12-01T03:00:00.000Z')).toBeInTheDocument()
        expect(screen.getByText('2023-12-02T03:00:00.000Z')).toBeInTheDocument()
    })
})
