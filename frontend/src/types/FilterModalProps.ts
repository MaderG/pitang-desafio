export type FilterModalProps = {
    date: Date | null
    setDate: (date: Date | null) => void
    availableDates: Date[]
    selectedStatuses: string[]
    setSelectedStatuses: (statuses: string[]) => void
}
