import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import VaccineAppointment from './pages/vaccineAppointment/VaccineAppointment'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import History from './pages/history/History'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import React from 'react'
import Footer from './components/footer/Footer'

const App = () => {
    React.useEffect(() => {
        registerLocale('pt-br', ptBR)
        setDefaultLocale('pt-br')
    })

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    element={
                        <>
                            <Navbar />
                            <Outlet />
                            <Footer />
                        </>
                    }
                >
                    <Route element={<Home />} path="/" />
                    <Route
                        element={<VaccineAppointment />}
                        path="/vaccine-appointment"
                    />
                    <Route element={<History />} path="/appointments" />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
