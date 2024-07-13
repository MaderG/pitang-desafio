import { useState, useEffect } from 'react'
import fetcher from '../../services/api'

const useAvailableDates = () => {
    const [availableDates, setAvailableDates] = useState<Date[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAvailableDates = async () => {
        setLoading(true)
        try {
            const response = await fetcher.get('/api/available-days')
            const dates = response.map(
                (date: string) => new Date(date + 'T00:00:00-03:00')
            )
            setAvailableDates(dates)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchAvailableDates()
    }, [])

    return { availableDates, loading, error, refetch: fetchAvailableDates }
}

export default useAvailableDates
