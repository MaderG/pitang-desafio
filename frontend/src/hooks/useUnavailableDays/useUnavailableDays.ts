import { useState, useEffect } from 'react'
import fetcher from '../../services/api'

export const useUnavailableDays = () => {
    const [unavailableDays, setUnavailableDays] = useState<Date[]>([])
    useEffect(() => {
        const fetchUnavailableDays = async () => {
            try {
                const response: string[] = await fetcher.get(
                    '/api/unavailable-days'
                )
                const unavailableDays: Date[] = response.map(
                    (date) => new Date(date + 'T00:00:00-03:00')
                )
                const currentDate = new Date()
                if (currentDate.getHours() >= 18) {
                    unavailableDays.push(currentDate)
                }
                setUnavailableDays(unavailableDays)
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message)
                }
            }
        }

        fetchUnavailableDays()
    }, [])

    return unavailableDays
}
