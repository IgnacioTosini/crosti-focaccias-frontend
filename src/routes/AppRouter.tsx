import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage/HomePage"
import { AbmPage } from "../pages/AbmPage/AbmPage"

export const AppRouter = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/abm" element={<AbmPage />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </Suspense>
    )
}