import React from 'react';
import { Th } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { SortableHeaderProps } from '../types/SortableHeaderProps';


const SortableHeader: React.FC<SortableHeaderProps> = ({ field, label, sortBy, order, setSortBy, setOrder, isDisabled, width='100px' }) => {
  const isActive = sortBy === field;
  const toggleOrder = () => {
    if (!isDisabled){
    if (isActive) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }}
  };

  return (
    <Th minW={width} cursor={isDisabled ? 'default' : "pointer"} onClick={isDisabled ? undefined : toggleOrder}>
      {label} {isActive && (order === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
    </Th>
  );
};

export default SortableHeader;