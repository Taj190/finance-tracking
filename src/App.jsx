import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import SignUpSignIn from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";
import Language_selector from "./components/Language/language-selector";
function App() {
 const {t} = useTranslation()
  return (
    <>
    <h1>{t("greeting")}</h1>
    <Language_selector/>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path="/" element={<SignUpSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>

    </>
  );
}

export default App
