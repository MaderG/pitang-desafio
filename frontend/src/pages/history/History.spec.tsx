import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import History from './History';
import { ModalProvider } from '../../context/ModalContext';
import { ChakraProvider } from '@chakra-ui/react';

declare const global: {
  fetch: jest.Mock;
};
global.fetch = jest.fn();

const mockAppointmentsResponse = {
  totalPages: 1,
  appointments: [
    { id: 523, name: "John Doe", date: "2029-01-01T13:00:00.000Z", status: "Pendente" }
  ],
  allAppointments: 1
};

const mockDatesResponse = ['2029-01-01', '2029-01-02', '2029-01-03'];

describe('<History />', () => {

  beforeEach(() =>{
    global.fetch.mockRestore();
  })

  it('should render without crashing', async () => {
    global.fetch.mockImplementation((url: string) => {
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointmentsResponse)
        });
      } else if (url.includes('/api/available-days')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDatesResponse)
        });
      }
      return Promise.reject(new Error('not found'));
    });

    await act(async () => {
      render(
        <ChakraProvider>
          <ModalProvider>
            <History />
          </ModalProvider>
        </ChakraProvider>
      );
    });

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
  });

  it('should display pagination controls', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointmentsResponse)
        });
      }
      if (url.includes('/api/available-days')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDatesResponse)
        });
      }
    });

    await act(async () => {
      render(
        <ChakraProvider>
          <ModalProvider>
            <History />
          </ModalProvider>
        </ChakraProvider>
      );
    });

    await waitFor(() => expect(screen.getByLabelText('Next')).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText('Next'));
    await waitFor(() => expect(screen.getByTestId('pageNumber')).toBeInTheDocument());
  });

  it('should handle no data state', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({appointments: [], allAppointments: 0, totalPages: 0})
        });
      }
      if (url.includes('/api/available-days')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
    });

    await act(async () => {
      render(
        <ChakraProvider>
          <ModalProvider>
            <History />
          </ModalProvider>
        </ChakraProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Nenhum agendamento encontrado :(')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch appointments')));
  
    await act(async () => {
      render(
        <ChakraProvider>
          <ModalProvider>
            <History />
          </ModalProvider>
        </ChakraProvider>
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar os agendamentos/)).toBeInTheDocument();
    });
  });

  it('should not be able to change to next page if there is only one page', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointmentsResponse)
        });
      }
      if (url.includes('/api/available-days')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDatesResponse)
        });
      }
    });

    await act(async () => {
      render(
        <ChakraProvider>
          <ModalProvider>
            <History />
          </ModalProvider>
        </ChakraProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Next')).toBeDisabled();
    });
  })

  it('should not be able to change to previous page if there is only one page', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointmentsResponse)
        });
      }
      if (url.includes('/api/available-days')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDatesResponse)
        });
      }
    });

    await act(async () => {
      render(
        <ChakraProvider>
          <ModalProvider>
            <History />
          </ModalProvider>
        </ChakraProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Previous')).toBeDisabled();
    });
  })

});
