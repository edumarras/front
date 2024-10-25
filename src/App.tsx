import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import MakerTickets from "./components/MakerTickets";
import Tickets from "./components/Tickets";
import { useUser } from "./UserContext";
import "./styles.css";

const App: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, setUser } = useUser();

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleLoginSuccess = (userData: { id: number; login: string; adm: boolean }) => {
    setUser(userData);
    setShowRegister(false);
    setShowLogin(false);
  };

  const handleShowHome = () => {
    setShowRegister(false);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app-container">
      <h1>Ticket Solver</h1>
      {user && (
        <div className="user-info">
          <p>Você está logado como: {user.adm ? "admin" : "user"}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {!user && !showRegister && !showLogin && (
        <div className="button-container">
          <button onClick={handleShowRegister}>Criar Conta</button>
          <button onClick={handleShowLogin}>Fazer Login</button>
        </div>
      )}
      {showRegister && <RegisterForm handleShowHome={handleShowHome} />}
      {showLogin && (
        <LoginForm
          handleLoginSuccess={handleLoginSuccess}
          handleShowHome={handleShowHome}
        />
      )}
      {user && !user.adm && <Tickets />}
      {user && user.adm && (
        <>
          <h2>Área de Administração</h2>
          <MakerTickets />
        </>
      )}
    </div>
  );
};

export default App;
