import { useState, useEffect } from 'react'
import fetcher from '../services/api'

export const useAvailableHours = (date: Date) => {
    const [availableHours, setAvailableHours] = useState<string[]>([])

    useEffect(() => {
        const fetchAvailableHours = async () => {
            try {
                const dateString = date.toISOString().split('T')[0]
                const response: string[] = await fetcher(
                    `/api/available-times?date=${dateString}`
                )
                setAvailableHours(response)
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message)
                }
            }
        }

        if (date) {
            fetchAvailableHours()
        }
    }, [date])

    return availableHours
}
