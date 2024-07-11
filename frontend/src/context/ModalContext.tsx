import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ModalContextType } from '../types/ModalContextType'

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')

    const showModal = (modalTitle: string, modalMessage: string) => {
        setTitle(modalTitle)
        setMessage(modalMessage)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <ModalContext.Provider
            value={{ isOpen, title, message, showModal, closeModal }}
        >
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context)
        throw new Error('useModal must be used within a ModalProvider')
    return context
}
