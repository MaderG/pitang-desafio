import { useEffect } from 'react'
import { FieldValues } from 'react-hook-form'

export const useLocalStorageManager = (
    watch: () => FieldValues,
    isSubmitted: boolean
) => {
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (!isSubmitted) {
                const dataToSave = JSON.stringify(watch())
                localStorage.setItem('vaccine-appointment-form', dataToSave)
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [watch, isSubmitted])
}
