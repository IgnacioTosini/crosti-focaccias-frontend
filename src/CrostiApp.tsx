import { ToastContainer } from "react-toastify"
import { Footer } from "./components/Footer/Footer"
import { AppRouter } from "./routes/AppRouter"
import "react-toastify/dist/ReactToastify.css";

export const CrostiApp = () => {
  return (
    <>
      <AppRouter />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

