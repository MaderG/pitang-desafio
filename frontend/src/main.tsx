import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { ModalProvider } from './context/ModalContext.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ModalProvider>
            <ChakraProvider>
                <App />
            </ChakraProvider>
        </ModalProvider>
    </React.StrictMode>
)
