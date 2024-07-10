import { ReactNode } from "react";

export type ModalContentType = ReactNode; 

export interface ModalContextType {
  isOpen: boolean;
  title: string;
  message: string;
  showModal: (title: string, message: string) => void;
  closeModal: () => void;
}

export type ModalProviderProps = {
  children: ReactNode;
}
