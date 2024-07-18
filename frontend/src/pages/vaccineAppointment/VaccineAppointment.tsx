import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { format, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useColorModeValue,
    FormErrorMessage,
    Image,
    useToast,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'

import VaccineAppointmentSchema from '../../zod'
import { useLocalStorageManager } from '../../hooks/useLocalStorageManager/useLocalStorageManager'
import { useModal } from '../../context/ModalContext'
import { FORMAT_DATE, FORMAT_TIME, MAX_BIRTH_DATE, MAX_SCHEDULE_TIME, MIN_BIRTH_DATE, MIN_SCHEDULE_TIME } from '../../utils/constants'
import SuccessModal from '../../components/modal/successmodal/SuccessModal'
import { useAvailableHours } from '../../hooks/useAvailableHours/useAvailableHours'
import { useUnavailableDays } from '../../hooks/useUnavailableDays/useUnavailableDays'
import fetcher from '../../services/api'
import { CreateVaccineAppointment } from '../../types/CreateVaccineAppointment'

const VaccineAppointment = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const { showModal } = useModal()
    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger,
        control,
    } = useForm<CreateVaccineAppointment>({
        resolver: zodResolver(VaccineAppointmentSchema),
        mode: 'onBlur',
    })

    const toast = useToast()

    const selectedDate = watch('date')
    const selectedTime = watch('time')
    const availableHours = useAvailableHours(selectedDate)
    const { unavailableDays, currentDateAvailableHours } = useUnavailableDays()

    useEffect(() => {
        registerLocale('pt-br', ptBR)
        setDefaultLocale('pt-br')
        const savedData = localStorage.getItem('vaccine-appointment-form')

        if (savedData) {
            const parsedData = JSON.parse(savedData)
            for (const [key, value] of Object.entries(parsedData)) {
                const dateValue =
                    key === 'birthDate' || key === 'date'
                        ? new Date(value as string)
                        : (value as string | Date)
                setValue(key as keyof CreateVaccineAppointment, dateValue)
            }
            if (parsedData.name !== '') {
                trigger()
            }
        }
        
    }, [setValue, trigger])

    useLocalStorageManager(watch, isSubmitted)

    const onSubmit: SubmitHandler<CreateVaccineAppointment> = async (
        form: CreateVaccineAppointment
    ) => {
        try {
            setLoading(true)
            await fetcher.post('/api/appointments', form)
            localStorage.removeItem('vaccine-appointment-form')
            setIsSubmitted(true)
            showModal(
                'Agendamento realizado com sucesso!',
                `Tudo pronto para a sua vacinação! Estarei te esperando no dia ${format(form.date, FORMAT_DATE)} às ${form.time}. Não esqueça de trazer sua identidade, comprovante de residência e é claro, a máscara! ;) `
            )
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({
                    title: 'Erro ao agendar vacina',
                    description: err.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const filterAvailableTimes = useCallback(
        (time: Date) => {
            const currentDate = new Date();
    
            if (
                selectedDate &&
                format(selectedDate, FORMAT_DATE) === format(currentDate, FORMAT_DATE)
            ) {
                return currentDateAvailableHours.includes(format(time, FORMAT_TIME));
            }
            return availableHours.includes(format(time, FORMAT_TIME));
        },
        [selectedDate, currentDateAvailableHours, availableHours]
    );

    const filterAvailableDates = useCallback(
        (date: Date) => {
            const currentDate = new Date();    
            const isUnavailable = unavailableDays.some(unavailableDay =>
                format(unavailableDay, FORMAT_DATE) === format(date, FORMAT_DATE)
            );
    
            return !isUnavailable && isAfter(date.setHours(17), currentDate);
        },
        [unavailableDays]
    );

    return (
        <Flex
            minH={'calc(100vh - 60px)'}
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center">
                    <Heading fontSize="4xl">Agende já sua vacina</Heading>
                </Stack>
                <Box
                    rounded="lg"
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow="lg"
                    p={8}
                >
                    <Stack
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        spacing={4}
                    >
                        <FormControl id="name" isInvalid={!!errors.name}>
                            <FormLabel>Nome</FormLabel>
                            <Input
                                data-testid="name"
                                type="text"
                                {...register('name')}
                                aria-label="Nome"
                            />
                            <FormErrorMessage>
                                {errors.name?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl
                            id="birthDate"
                            isInvalid={!!errors.birthDate}
                        >
                            <FormLabel>Data de Nascimento</FormLabel>
                            <Flex style={{ position: 'relative' }}>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            showYearDropdown             
                                            selected={field.value}
                                            onChange={(date) =>
                                                field.onChange(date)
                                            }
                                            minDate={MIN_BIRTH_DATE}
                                            maxDate={MAX_BIRTH_DATE }
                                            locale="pt-br"
                                            dateFormat={FORMAT_DATE}
                                            customInput={
                                                <Input
                                                    data-testid="birth-date"
                                                    minW="290px"
                                                />
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                                <CalendarIcon
                                    style={{ position: 'absolute' }}
                                    ml="260px"
                                    mt={'12px'}
                                    color="gray.300"
                                />
                            </Flex>
                            <FormErrorMessage>
                                {errors.birthDate?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl id="date" isInvalid={!!errors.date}>
                            <FormLabel>Data do Agendamento</FormLabel>
                            <Flex style={{ position: 'relative' }}>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            excludeDates={unavailableDays.map(
                                                (date) => new Date(date)
                                            )}
                                            filterDate={filterAvailableDates}
                                            onChange={(date) => {
                                                field.onChange(date)
                                                setValue('time', '')
                                            }}
                                            minDate={new Date()}
                                            locale="pt-br"
                                            dateFormat={FORMAT_DATE}
                                            customInput={
                                                <Input
                                                    data-testid="schedule-date"
                                                    minW="290px"
                                                />
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                                <CalendarIcon
                                    style={{ position: 'absolute' }}
                                    ml="260px"
                                    mt="12px"
                                    color="gray.300"
                                />
                            </Flex>
                            <FormErrorMessage>
                                {errors.date?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl id="time" isInvalid={!!errors.time}>
                            <FormLabel>Hora</FormLabel>
                            <Flex style={{ position: 'relative' }}>
                                <Controller
                                    name="time"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={
                                                field.value
                                                    ? new Date(
                                                          `01/01/2000 ${field.value}`
                                                      )
                                                    : null
                                            }
                                            onChange={(date) =>
                                                field.onChange(
                                                    format(
                                                        date as Date,
                                                        FORMAT_TIME
                                                    )
                                                )
                                            }
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            minTime={
                                                MIN_SCHEDULE_TIME
                                            }
                                            maxTime={
                                                MAX_SCHEDULE_TIME
                                            }
                                            filterTime={filterAvailableTimes}
                                            timeCaption="Time"
                                            dateFormat={FORMAT_TIME}
                                            customInput={
                                                <Input
                                                    data-testid="hour"
                                                    minW="290px"
                                                />
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                                <Image
                                    style={{ position: 'absolute' }}
                                    mt="12px"
                                    ml="260px"
                                    src="clock.svg"
                                    alt="clock"
                                    boxSize="16px"
                                />
                            </Flex>
                            <FormErrorMessage>
                                {errors.time?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Button
                            mt="2rem"
                            bg="#da4c44"
                            isDisabled={!isValid || loading || !selectedTime}
                            isLoading={loading}
                            loadingText="Agendando..."
                            color="white"
                            _hover={{
                                bg: '#d03e35',
                            }}
                            type="submit"
                            data-testid="agendar"
                        >
                            Agendar
                        </Button>
                        <SuccessModal />
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}

export default VaccineAppointment
