import React from 'react'
import { render, act } from '@testing-library/react'
import { useLocalStorageManager } from './useLocalStorageManager'
import { FieldValues } from 'react-hook-form'

const mockWatch = jest.fn()
const mockIsSubmitted = false

interface TestComponentProps {
    watch: () => FieldValues
    isSubmitted: boolean
}

const TestComponent: React.FC<TestComponentProps> = ({ watch, isSubmitted }) => {
    useLocalStorageManager(watch, isSubmitted)
    return <div>Test Component</div>
}

describe('useLocalStorageManager', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorage.clear()
    })

    it('should save data to localStorage before unload if not submitted', () => {
        const mockData = { field1: 'value1', field2: 'value2' }
        mockWatch.mockReturnValue(mockData)

        render(<TestComponent watch={mockWatch} isSubmitted={mockIsSubmitted} />)

        act(() => {
            window.dispatchEvent(new Event('beforeunload'))
        })

        const savedData = localStorage.getItem('vaccine-appointment-form')
        expect(savedData).toBe(JSON.stringify(mockData))
    })

    it('should not save data to localStorage if form is submitted', () => {
        render(<TestComponent watch={mockWatch} isSubmitted={true} />)

        act(() => {
            window.dispatchEvent(new Event('beforeunload'))
        })

        const savedData = localStorage.getItem('vaccine-appointment-form')
        expect(savedData).toBeNull()
    })

    it('should clean up event listener on unmount', () => {
        const { unmount } = render(<TestComponent watch={mockWatch} isSubmitted={mockIsSubmitted} />)

        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })
})
