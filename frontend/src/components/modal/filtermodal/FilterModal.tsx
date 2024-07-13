import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Checkbox,
    Input,
    VStack,
    HStack,
    Image,
} from '@chakra-ui/react'

import { useModal } from '../../../context/ModalContext'
import { FORMAT_DATE } from '../../../utils/constants'
import { FilterModalProps } from '../../../types/FilterModalProps'

const FilterModal = ({
    date,
    setDate,
    availableDates,
    selectedStatuses,
    setSelectedStatuses,
    applyFilters,
}: FilterModalProps) => {
    const { isOpen, closeModal, title, message } = useModal()
    const [tempDate, setTempDate] = useState<Date | null>(date)
    const [tempStatuses, setTempStatuses] = useState<string[]>([
        ...selectedStatuses,
    ])

    const handleApplyFilters = () => {
        if (
            tempDate &&
            availableDates.some(
                (availableDate) =>
                    availableDate.toDateString() === tempDate.toDateString()
            )
        ) {
            setDate(tempDate)
        }
        setSelectedStatuses(tempStatuses)
        closeModal()
        applyFilters()
    }

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setTempDate(date)
        }
    }

    const handleStatusChange = (status: string, isChecked: boolean) => {
        setTempStatuses((prev) =>
            isChecked ? [...prev, status] : prev.filter((s) => s !== status)
        )
    }

    const handleClose = () => {
        setTempDate(date)
        setTempStatuses([...selectedStatuses])
        closeModal()
    }

    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton data-testid="close-button" />
                <ModalBody>
                    <Text>{message}</Text>
                    <VStack spacing={4} align="stretch">
                        <VStack align="left">
                            <Text>Data de Agendamento:</Text>
                            <DatePicker
                                selected={tempDate}
                                onChange={handleDateChange}
                                includeDates={availableDates}
                                locale="pt-br"
                                dateFormat={FORMAT_DATE}
                                customInput={
                                    <Input data-testid="input" maxW="350px" />
                                }
                            />
                            <Image
                                cursor="pointer"
                                onClick={() => setTempDate(null)}
                                maxW="25px"
                                src="broom.svg"
                                position="absolute"
                                right="40px"
                                bottom="160px"
                            />
                        </VStack>
                        <VStack align="left">
                            <Text>Status do Agendamento:</Text>
                            <HStack>
                                {['Pendente', 'Cancelado', 'Finalizado'].map(
                                    (status) => (
                                        <Checkbox
                                            key={status}
                                            colorScheme="orange"
                                            isChecked={tempStatuses.includes(
                                                status
                                            )}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    status,
                                                    e.target.checked
                                                )
                                            }
                                        >
                                            {status}
                                        </Checkbox>
                                    )
                                )}
                            </HStack>
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        bg="#da4c44"
                        color="white"
                        _hover={{ bg: '#d03e35' }}
                        onClick={handleApplyFilters}
                    >
                        Aplicar Filtros
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default FilterModal
