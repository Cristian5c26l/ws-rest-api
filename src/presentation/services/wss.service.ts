import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface Options {
  server: Server;
  path?: string;// path o ruta al cual se conectarán los websockets (ws) de los clientes
}

export class WssService {
  
  private static _instance: WssService;
  private wss: WebSocketServer;

  private constructor(options: Options) {
    const { server, path = '/ws' } = options;// localhost:3000/ws por defecto

    this.wss = new WebSocketServer({server, path});// creacion del websocketserver
    this.start();// echar a andar o poner en operación el websocketserver (wss)
  }

  static get instance(): WssService {
    
    if ( !WssService._instance ) {
      throw 'WssService is not initialized';
    }



    return WssService._instance;// en otros lenguajes de programación, ocupamos el _ para indicar que la propiedad de una clase será privada. En este caso, lo usamos el guion bajo para que no se confunda con la propiedad instance (get instance()) de la clase WssService
  }

  static initWss( options: Options ) {
    if(WssService._instance) throw 'WssService is initialized';

    WssService._instance = new WssService(options);
  }

  public sendMessage(type: string, payload: Object) {// type en este caso será "addTicket" o "newTicket"
    this.wss.clients.forEach(client => {
      if ( client.readyState === WebSocket.OPEN ) {
        client.send(JSON.stringify({type, payload}));
      }
    });
  }

  public start() {

    // WebSocketServer esté a la espera de WebSocket's (WebSocket tipo WebSocket de la libreria ws) que se conecten a dicho WebSocketServer que estará apuntando a TODO
    this.wss.on('connection', (ws: WebSocket) => {
      
      console.log('Client connected');
      
      ws.on('close', () => console.log('Client disconnected'));

    });
  }

}
