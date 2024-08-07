import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
} from '@chakra-ui/react';

import { useModal } from '../../../context/ModalContext';
import { FORMAT_DATE } from '../../../utils/constants';
import { FilterModalProps } from '../../../types/FilterModalProps';

const FilterModal = ({
    date,
    setDate,
    availableDates,
    selectedStatuses,
    setSelectedStatuses,
}: FilterModalProps) => {
    const { isOpen, closeModal, title, message } = useModal();
    const [loading, setLoading] = useState(false);
    const [clearedDate, setClearedDate] = useState(false);
    const [tempDate, setTempDate] = useState<Date | null>(date);
    const [tempStatuses, setTempStatuses] = useState<string[]>(selectedStatuses);

    const handleApplyFilters = () => {
        setLoading(true);
        try {
            if (
                tempDate &&
                availableDates.some(
                    availableDate => availableDate.toDateString() === tempDate.toDateString()
                )
            ) {
                setDate(tempDate);
            }
            else {
                if (clearedDate){
                    setDate(null);            
                }
            }
            setSelectedStatuses(tempStatuses);
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    const handleDateChange = (date: Date | null) => {
        setTempDate(date);
    };

    useEffect(() => {     
    }, [tempStatuses]);

    const handleStatusChange = (status: string, isChecked: boolean) => {
        setTempStatuses(prev =>
            isChecked ? [...prev, status] : prev.filter(s => s !== status)
        );
    };

    const handleClose = () => {
        setTempDate(date);
        setTempStatuses(selectedStatuses);
        closeModal();
    };

    if (!isOpen) return null;

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
                                customInput={<Input data-testid="input" maxW="350px" />}
                            />
                            <Image
                                cursor="pointer"
                                onClick={() => {
                                  setClearedDate(true)
                                  setTempDate(null)
                                }}
                                maxW="25px"
                                data-testid="clear-date"
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
                                            isChecked={tempStatuses.includes(status)}
                                            onChange={(e) => handleStatusChange(status, e.target.checked)}
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
                        isDisabled={loading}
                        loadingText="Aplicando Filtros"
                    >
                        {loading ? "Aplicando..." : "Aplicar Filtros"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FilterModal;
