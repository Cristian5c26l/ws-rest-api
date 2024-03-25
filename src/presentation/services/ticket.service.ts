import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from "./wss.service";




export class TicketService {

  constructor(
    private readonly wssService = WssService.instance
  ) {}
  
  public readonly tickets: Ticket[] = [
    { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
  ];

  private workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter(ticket => !ticket.handleAtDesk);
  }

  public get lastWorkingOnTickets(): Ticket[] {
    return this.workingOnTickets.slice(0, 4);// Retorna los primeros 4 objetos Ticket del array workingOnTickets, los cuales son los mas nuevos que se estarán mostrando en pantalla

    console.log(this.workingOnTickets);

    // return this.workingOnTickets.filter(t => t.handleAtDesk && t.done===false);
  }

  public get lastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  public createTicket() {
    
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      number: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDesk: undefined,
    }

    this.tickets.push(ticket);// agregar ticket al final del array tickets

    // Cuando se crea un nuevo ticket hay que notificar por medio de websockets que hay un nuevo ticket creado
    this.onTicketNumberChanged(); 

    return ticket;
  }


  // Metodo para brindar el ticket siguiente a un escritorio en particular
  public drawTicket(desk: string) {
    const ticket = this.tickets.find(t => !t.handleAtDesk);
    if ( !ticket ) return { status: 'error', message: 'No hay tickets pendientes' };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({...ticket});// con ...ticket rompemos la referencia a ese ticket. unshift sirve para colocar el objeto al principio del array workingOnTickets

    // Usar websocket para notificar que el ticket ya se va a trabajar con él en un escritorio (Desk) 
    this.onTicketNumberChanged();

    this.onWorkingOnChanged();

    return { status: 'ok', ticket };


  }

  // Metodo para marcar un ticket como terminado (done = true)
  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find(t => t.id === id);
    if ( !ticket ) return { status: 'error', message: 'Ticket no encontrado' };// Podriamos arrojar una excepcion en caso de estar trabajando con bases de datos. Como todo lo estamos haciendo de manera sincrona, esta bien así.

    // Podriamos usar referencia directamente (ticket.done = true;) pero mejor haremos las modificaciones manualmente con un map
    this.tickets.map( ticket => {
      
      if ( ticket.id === id ) {
        ticket.done = true;
      }

      return ticket;

    } );

    this.workingOnTickets = this.workingOnTickets.filter(t => t.id !== id );// eliminar ticket con determinado id de la lista de tickets con los que se están trabajando. ESTO LO HICE YO DE MI PARTE, DE MANERA QUE, CUANDO SE FINALIZARA UN TICKET, ESE TICKET SE QUITARA DE LOS QUE SE ESTÁN TRABAJANDO


    return { status: 'ok' };
  }

  private onTicketNumberChanged() {
    this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length);// un Object puede ser un numero.
  }

  private onWorkingOnChanged() {
    this.wssService.sendMessage('on-working-changed', this.lastWorkingOnTickets);
  }

}
