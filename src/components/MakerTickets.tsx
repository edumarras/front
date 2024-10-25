import React, { useState } from "react";
import axios from "axios";

const MakerTickets: React.FC = () => {
  const [ticket, setTicket] = useState({
    Titulo: "",
    Descricao: "",
    Prioridade: 1,
    ID_pessoa: 0,
    Status: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTicket((prev) => ({
      ...prev,
      [name]:
        name === "Prioridade" || name === "ID_pessoa" || name === "Status"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.224.128:80/mid/tickets",
        ticket
      );
      console.log("Ticket criado:", response.data);
      // Limpar o formulário ou redirecionar após a criação bem-sucedida
      setTicket({
        Titulo: "",
    Descricao: "",
    Prioridade: 1,
    ID_pessoa: 0,
    Status: 0,
      });
      alert("Ticket criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      alert("Erro ao criar ticket. Por favor, tente novamente.");
    }
  };

  return (
    <div className="maker-tickets-container">
      <h2>Criar Novo Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Titulo">Título:</label>
          <input
            type="text"
            id="Titulo"
            name="Titulo"
            value={ticket.Titulo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Descricao">Descrição:</label>
          <textarea
            id="Descricao"
            name="Descricao"
            value={ticket.Descricao}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Prioridade">Prioridade:</label>
          <select
            id="Prioridade"
            name="Prioridade"
            value={ticket.Prioridade}
            onChange={handleChange}
          >
            <option value={1}>Baixa</option>
            <option value={2}>Média</option>
            <option value={3}>Alta</option>
          </select>
        </div>
        <div>
          <label htmlFor="ID_pessoa">ID da Pessoa:</label>
          <input
            type="number"
            id="ID_pessoa"
            name="ID_pessoa"
            value={ticket.ID_pessoa}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Status">Status:</label>
          <select
            id="Status"
            name="Status"
            value={ticket.Status}
            onChange={handleChange}
          >
            <option value={0}>Aberto</option>
            <option value={1}>Em Andamento</option>
            <option value={2}>Concluído</option>
          </select>
        </div>
        <button type="submit">Criar Ticket</button>
      </form>
    </div>
  );
};

export default MakerTickets;
