import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../UserContext";

interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: number;
  status: number;
  id_pessoa: number;
}

const Tickets: React.FC = () => {
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [userResponse, openResponse] = await Promise.all([
          axios.get(`http://192.168.224.128:80/mid/tickets/usuario/${user.id}`),
          axios.get("http://192.168.224.128:80/mid/tickets/open")
        ]);

        setUserTickets(userResponse.data.tickets);
        setOpenTickets(openResponse.data.tickets);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const resolverTicket = async (ticketId: number) => {
    try {
      await axios.put(`http://192.168.224.128:80/mid/tickets/${ticketId}/complete`, {});
      
      setUserTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: 2 } : ticket
        )
      );
      setOpenTickets(prevTickets => 
        prevTickets.filter(ticket => ticket.id !== ticketId)
      );
    } catch (error) {
      console.error("Erro ao resolver ticket:", error);
    }
  };

  const atribuirTicket = async (ticketId: number) => {
    if (!user) return;
    try {
      await axios.put(`http://192.168.224.128:80/mid/tickets/${ticketId}/assign/${user.id}`);
      
      const ticketToMove = openTickets.find(ticket => ticket.id === ticketId);
      if (ticketToMove) {
        setUserTickets(prevTickets => [...prevTickets, { ...ticketToMove, id_pessoa: user.id }]);
        setOpenTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      }
    } catch (error) {
      console.error("Erro ao atribuir ticket:", error);
    }
  };

  const renderTicketList = (tickets: Ticket[], isUserTicket: boolean) => {
    return tickets
      .sort((a, b) => b.prioridade - a.prioridade)
      .map((ticket) => (
        <li key={ticket.id}>
          <h3>{ticket.titulo}</h3>
          <p>{ticket.descricao}</p>
          <p>Prioridade: {ticket.prioridade}</p>
          <p>Status: {ticket.status === 0 ? "Aberto" : ticket.status === 1 ? "Em Andamento" : "Concluído"}</p>
          {isUserTicket && ticket.status !== 2 && (
            <button onClick={() => resolverTicket(ticket.id)}>
              Resolver Ticket
            </button>
          )}
          {!isUserTicket && (
            <button onClick={() => atribuirTicket(ticket.id)}>
              Atribuir a Mim
            </button>
          )}
        </li>
      ));
  };

  if (loading) {
    return <p>Carregando tickets...</p>;
  }

  return (
    <div>
      <h1>Seus Tickets</h1>
      <ul>
        {userTickets.length > 0 ? renderTicketList(userTickets, true) : <p>Você não tem tickets atribuídos.</p>}
      </ul>

      <h1>Tickets em Aberto</h1>
      <ul>
        {openTickets.length > 0 ? renderTicketList(openTickets, false) : <p>Não há tickets em aberto.</p>}
      </ul>
    </div>
  );
};

export default Tickets;
