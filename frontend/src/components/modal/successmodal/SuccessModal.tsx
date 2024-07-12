import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../../context/ModalContext'

const SuccessModal = () => {
    const { isOpen, closeModal, title, message } = useModal()
    const navigate = useNavigate()

    const handleClick = () => {
        closeModal()
        navigate('/')
    }

    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{message}</ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleClick}>
                        OK
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SuccessModal
