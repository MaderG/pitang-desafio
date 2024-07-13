import { render, fireEvent, screen } from '@testing-library/react'
import { Table, ChakraProvider } from '@chakra-ui/react'
import SortableHeader from './SortableHeader'
import { SortableHeaderProps } from '../../types/SortableHeaderProps'

describe('<SortableHeader />', () => {
    const mockSetSortBy = jest.fn()
    const mockSetOrder = jest.fn()

    const props: SortableHeaderProps = {
        field: 'name',
        label: 'Name',
        sortBy: '',
        order: 'asc',
        setSortBy: mockSetSortBy,
        setOrder: mockSetOrder,
        isDisabled: false,
    }

    it('should render correctly', () => {
        render(
            <ChakraProvider>
                <Table>
                    <SortableHeader {...props} />
                </Table>
            </ChakraProvider>
        )

        expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('should call setSortBy and setOrder when clicked', () => {
        render(
            <ChakraProvider>
                <Table>
                    <SortableHeader {...props} />
                </Table>
            </ChakraProvider>
        )

        fireEvent.click(screen.getByText('Name'))
        expect(mockSetSortBy).toHaveBeenCalledWith('name')
        expect(mockSetOrder).toHaveBeenCalledWith('asc')
    })

    it('should toggle order on subsequent clicks', () => {
        render(
            <ChakraProvider>
                <Table>
                    <SortableHeader
                        {...{ ...props, sortBy: 'name', order: 'asc' }}
                    />
                </Table>
            </ChakraProvider>
        )

        fireEvent.click(screen.getByText('Name'))
        expect(mockSetOrder).toHaveBeenCalledWith('desc')
    })
})
