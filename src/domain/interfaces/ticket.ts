


export interface Ticket {
  id: string;
  number: number;// Ticket 1, Ticket 2, etc.
  createdAt: Date;
  handleAtDesk?: string; // esta propiedad permite saber en qué escritorio se atenderá un ticket
  handleAt?: Date; // fecha en la que el ticket fue tomado para comenzarse a atender en un escritorio
  done: boolean;// para saber si el ticket ya terminó de ser atendido
  
}
