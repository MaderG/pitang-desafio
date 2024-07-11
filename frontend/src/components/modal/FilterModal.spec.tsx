import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterModal from './FilterModal';
import { ModalProvider, useModal } from '../../context/ModalContext';

const mockProps = {
  date: null,
  setDate: jest.fn(),
  availableDates: [new Date('2024-07-10')],
  selectedStatuses: ['Pendente'],
  setSelectedStatuses: jest.fn(),
  applyFilters: jest.fn(),
};

const TestComponent = () => {
  const { showModal } = useModal();
  return (
    <>
      <button onClick={() => showModal('Filtrar agendamentos', '')}>
        Filtrar agendamentos
      </button>
      <FilterModal {...mockProps} />
    </>
  );
};

describe('<FilterModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
  });

  it('should render without crashing', () => {
    const filterButton = screen.getByText('Filtrar agendamentos');
    fireEvent.click(filterButton);
    expect(screen.getByText('Data de Agendamento:')).toBeInTheDocument();
    expect(screen.getByText('Status do Agendamento:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aplicar Filtros' })).toBeInTheDocument();
  });

  it('should close the modal when the close button is clicked', async () => {
    const filterButton = screen.getByText('Filtrar agendamentos');
    fireEvent.click(filterButton);
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Data de Agendamento:')).not.toBeInTheDocument();
    });
  });

  it('should add a status when a new status checkbox is checked', () => {
    fireEvent.click(screen.getByText('Filtrar agendamentos'));
    const statusCheckbox = screen.getByLabelText('Cancelado');
    fireEvent.click(statusCheckbox);
    const applyButton = screen.getByRole('button', { name: 'Aplicar Filtros' });
    fireEvent.click(applyButton);
    expect(mockProps.setSelectedStatuses).toHaveBeenCalledWith(['Pendente', 'Cancelado']);
  });

  it('should reset the modal state when the close button is clicked', async () => {
    const filterButton = screen.getByText('Filtrar agendamentos');
    fireEvent.click(filterButton);
    const statusCheckbox = screen.getByLabelText('Cancelado');
    fireEvent.click(statusCheckbox);

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Data de Agendamento:')).not.toBeInTheDocument();
    });

    fireEvent.click(filterButton);

    const pendingCheckbox = screen.getByLabelText('Pendente');
    expect(pendingCheckbox).toBeChecked();

    const canceledCheckbox = screen.getByLabelText('Cancelado');
    expect(canceledCheckbox).not.toBeChecked();

    expect(mockProps.setDate).not.toHaveBeenCalled();
    expect(mockProps.setSelectedStatuses).not.toHaveBeenCalled();
  });

  it('should call applyFilters when the apply button is clicked', () => {
    fireEvent.click(screen.getByText('Filtrar agendamentos'));
    const applyButton = screen.getByRole('button', { name: 'Aplicar Filtros' });
    fireEvent.click(applyButton);
    expect(mockProps.applyFilters).toHaveBeenCalledTimes(1);
  })

  it('should apply the selected date when the apply button is clicked', () => {
    fireEvent.click(screen.getByText('Filtrar agendamentos'));
    const dateInput = screen.getByTestId('input');
    fireEvent.change(dateInput, { target: { value: '2024-07-10' } });
    const applyButton = screen.getByRole('button', { name: 'Aplicar Filtros' });
    fireEvent.click(applyButton);
    expect(mockProps.setDate).toHaveBeenCalledWith(new Date('2024-07-10'));
  });
});

