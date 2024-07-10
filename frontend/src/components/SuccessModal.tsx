import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from '@chakra-ui/react';
import { useModal } from '../context/ModalContext';
import { useNavigate } from 'react-router-dom';

const SuccessModal = () => {
  const { isOpen, title, message, closeModal } = useModal();
  const navigate = useNavigate();

  const handleClick = () => {
    closeModal();
    navigate('/')
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClick}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;