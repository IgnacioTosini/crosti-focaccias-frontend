import { ToastContainer } from "react-toastify"
import { Footer } from "./components/Footer/Footer"
import { ServerStatusIndicator } from "./components/ServerStatusIndicator/ServerStatusIndicator"
import { AppRouter } from "./routes/AppRouter"
import "react-toastify/dist/ReactToastify.css";

export const CrostiApp = () => {
  return (
    <>
      <ServerStatusIndicator />
      <AppRouter />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

