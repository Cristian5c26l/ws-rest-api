import { Router } from "express";
import { TicketController } from "./controller";




export class TicketRoutes {

  static get routes(): Router {
    const router = Router();
    const ticketController = new TicketController();
    
    // Rutas definidas
    
    // GET a /api/ticket para saber todos los tickets
    router.get('/', ticketController.getTickets);

    // GET a /api/ticket/last para saber cual fue el ultimo ticket 
    router.get('/last', ticketController.getLastTicketNumber);

    // GET a /api/ticket/pending para saber los tickets pendientes de atender
    router.get('/pending', ticketController.pendingTickets);

    // POST a /api/ticket para crear un nuevo ticket
    router.post('/', ticketController.createTicket);

    // GET a /api/ticket/draw/numeroDeEscritoriooDesk para tomar un ticket y asignarlo al escritorio o desk 1, 2, o 3
    router.get('/draw/:desk', ticketController.drawTicket);


    // PUT a /api/ticket/done/:ticketId para indicar que el ticket con id ticketId ya está terminado
    router.put('/done/:ticketId', ticketController.ticketFinished);

    // GET a /api/ticket/working-on para mostrar los tickets que se estan atendiendo (al conectarse al websocketserver de WssService, literalmente puedo enviarle toda la información que yo necesito, pero mantendremos la comunicacion con websockets lo minimo necesario y trabajar cuando yo sepa el momento que se va a disparar una única vez, entonces, ahí es donde voy a mandar esas peticiones HTTP. Aunque todas estas rutas se pueden solicitar por protocolo WS o websocket. LOS WEBSOCKETS PODRIAN VERSE COMO UN SUSTITUTO DE LOS METODOS (COMO GET, POST, PUT) HTTP PERO ESTÁ A MI ELECCIÓN SI QUIERO REEMPLAZARLOS TOTALMENTE CON WEBSOCKETS. COMO RECOMENDACIÓN, HAY QUE OCUPAR LOS WEBSOCKETS SOLAMENTE CUANDO SE REQUIERA DE comunicacion EN TIEMPO REAL)
    router.get('/working-on', ticketController.workingOn);


    return router;
  } 

}
