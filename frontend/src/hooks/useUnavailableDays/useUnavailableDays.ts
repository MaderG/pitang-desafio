import { useState, useEffect } from 'react'
import fetcher from '../../services/api'
import { isAfter } from 'date-fns'

export const useUnavailableDays = () => {
    const [unavailableDays, setUnavailableDays] = useState<Date[]>([])
    const [currentDateAvailableHours, setCurrentDateAvailableHours] = useState<string[]>([])

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
                if (currentDate.getHours() >= 17 ) {
                    unavailableDays.push(currentDate)
                }
                setUnavailableDays(unavailableDays)
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message)
                }
            }
        }

        const fetchAvailableTimesToday = async () => {
            const currentDate = new Date();
            if (currentDate) {
                try {
                    const dateString = currentDate.toISOString().split('T')[0]
                    const response: string[] = await fetcher.get(
                        `/api/available-times?date=${dateString}`
                    )

                    if (response.length === 0) {
                        setUnavailableDays(prev => [...prev, currentDate])
                    }

                    const lastAvailableHour = Number(response[response.length - 1].split(':')[0])

                    const filteredHours = response.filter(hour => {
                        const [hourStr, minuteStr] = hour.split(':');
                        const hourDate = new Date();
                        hourDate.setHours(Number(hourStr), Number(minuteStr));
                        return isAfter(hourDate, currentDate);
                    });

                    const currentHour = currentDate.getHours()

                    if (lastAvailableHour <= currentHour) {
                        setUnavailableDays(prev => [...prev, currentDate])
                        console.log(unavailableDays)
                    }

                    setCurrentDateAvailableHours(filteredHours)
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(err.message)
                    }
                }
            }
        }

        fetchUnavailableDays()
        fetchAvailableTimesToday()
    }, [])

    return { unavailableDays, currentDateAvailableHours }
}