import React, { useState } from 'react';
import {
  Table, TableCaption, Thead, Tbody, Tr, Td, TableContainer, Flex, Center, IconButton,
  Heading,
  Spinner,
  Text,
  Box,
  Th
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import fetcher from '../services/api';
import SortableHeader from '../components/SortableHeaders';
import { SortOrder } from '../types/SortableHeaderProps';
import formatDate from '../utils/formatDate';
import formatTime from '../utils/formatTime';
import { Appointment } from '../types/Appointment';
import { useModal } from '../context/ModalContext';
import FilterModal from '../components/modal/FilterModal';
import { getStatusInfo } from '../utils/statusUtils';
import { StatusValue } from '../types/Status';
import StatusUpdateButton from '../components/StatusUpdateButton';
import useAvailableDates from '../hooks/useAvailableDates';

const History = () => {
  const [page, setPage] = useState<number>(1);
  const [date, setDate] = useState<Date | null>(null);
  const [order, setOrder] = useState<string>('asc');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('date');
  const [error, setError] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Pendente', 'Cancelado', 'Finalizado']);
  const { showModal } = useModal();

  const { availableDates, loading: datesLoading, error: datesError} = useAvailableDates();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher(`/api/appointments?page=${page}&date=${date}&status=${selectedStatuses}&sortBy=${sortBy}&order=${order}`);
      setAppointments(response.appointments);
      setTotalPages(response.totalPages);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Failed to fetch appointments', err);
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const applyFilters = () => {
    fetchData();
  };

  React.useEffect(() => {
    fetchData();
  }, [page, date, order, sortBy, selectedStatuses]);

  if (loading || datesLoading) {
    return (
      <Center minH="calc(100vh - 60px)">
        <Spinner size="xl" /> 
      </Center>
    );
  }

  if (error || datesError) {
    return (
      <Center minH='calc(100vh - 60px)'>
        <Heading as="h1" size="xl">Erro ao carregar os agendamentos :/</Heading>
      </Center>
    );
  }

  return (
    <Flex direction={'column'} justify={'space-between'} minH={'calc(100vh - 60px)'} bg={'gray.50'} p={4}>
      <Center>
        <IconButton
          icon={<img src="filter.svg" alt="Filter" style={{ width: '1.5em' }} />}
          onClick={() => showModal('Filtrar agendamentos', '')}
          aria-label="Filtrar agendamentos"
        />
      </Center>
      <Center mt="4">
        <TableContainer maxH='75vh'>
          <Table variant='simple'>
            <TableCaption>Histórico de agendamentos</TableCaption>
            <Thead>
              <Tr>
                <SortableHeader
                  width='150px'
                  field="name"
                  label="Nome"
                  sortBy={sortBy}
                  order={order as SortOrder}
                  setSortBy={setSortBy}
                  setOrder={setOrder}
                />
                <SortableHeader
                  field="status"
                  label="Status"
                  sortBy={sortBy}
                  order={order as SortOrder}
                  setSortBy={setSortBy}
                  setOrder={setOrder}
                />
                <SortableHeader
                  field="time"
                  label="Hora"
                  sortBy={sortBy}
                  order={order as SortOrder}
                  setSortBy={setSortBy}
                  setOrder={setOrder}
                  isDisabled={!date}
                />
                <SortableHeader
                  field="date"
                  label="Data"
                  sortBy={sortBy}
                  order={order as SortOrder}
                  setSortBy={setSortBy}
                  setOrder={setOrder}
                />
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments && appointments.map(appointment => {
                const statusInfo = getStatusInfo(appointment.status as StatusValue);
                return (
                  <Tr key={appointment.id}>
                    <Td>{appointment.name}</Td>
                    <Td color={statusInfo.color}>{statusInfo.translated}</Td>
                    <Td>{formatTime(appointment.date)}</Td>
                    <Td>{formatDate(appointment.date)}</Td>
                    <Td>
                      <StatusUpdateButton id={appointment.id.toString()} currentStatus={statusInfo.translated} fetchData={fetchData} />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <FilterModal date={date} setDate={setDate} availableDates={availableDates} applyFilters={applyFilters} selectedStatuses={selectedStatuses} setSelectedStatuses={setSelectedStatuses} />
        </TableContainer>
      </Center>
      {!appointments.length && (<Heading as="h2" size="md">Nenhum agendamento encontrado</Heading>)}
      <Box flex="1" />
      <Flex justify="center" align="center" mt="4" mb="4">
        <IconButton
          bg="#da4c44" 
          color="white"  
          _hover={{bg: '#d03e35'}}
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => setPage(page - 1)}
          isDisabled={page === 1}
        />
        <Text mx="4">{page}</Text>
        <IconButton
          bg="#da4c44" 
          color="white"  
          _hover={{bg: '#d03e35'}}
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => setPage(page + 1)}
          isDisabled={page === totalPages || totalPages === 0}
        />
      </Flex>
    </Flex>
  );
};

export default History;
