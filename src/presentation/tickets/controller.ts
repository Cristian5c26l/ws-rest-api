import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";




export class TicketController {
  
  // DI - WssService
  constructor(
    private readonly ticketService: TicketService = new TicketService(),
  ) {}

  public getTickets = async (req: Request, res: Response) => {
    res.json( this.ticketService.tickets );
  }

  public getLastTicketNumber = async (req: Request, res: Response) => {
    res.json( this.ticketService.lastTicketNumber );
  }

  public pendingTickets = async (req: Request, res: Response) => {// Metodo que retorna todos los tickets pendientes (tickets que tienen handleAtDesk como undefined, que significa que no está en ningun escritorio siendo atendido)
    res.json( this.ticketService.pendingTickets );
  }

  public createTicket = async (req: Request, res: Response) => {
    res.status(201).json( this.ticketService.createTicket() );// 201 indica que se creó el registro correctamente
  }

  public drawTicket = async (req: Request, res: Response) => {// Metodo usado para colocar el "ticket siguiente" que no tenga asignado un escritorio especifico (handleAtDesk sea undefined o null), en un escritorio especifico (req.params.desk)
    
    const desk = req.params.desk;

    res.json( this.ticketService.drawTicket(desk) );
  }

  public ticketFinished = async (req: Request, res: Response) => {
    
    const ticketId = req.params.ticketId;

    res.json( this.ticketService.onFinishedTicket(ticketId) );
  }

  public workingOn = async (req: Request, res: Response) => {
    res.json( this.ticketService.lastWorkingOnTickets );
  }

}
