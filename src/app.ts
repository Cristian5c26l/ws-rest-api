import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';


(async()=> {
  main();
})();


function main() {

  const server = new Server({// server literalmente es el servidor de express
    port: envs.PORT,
  });

  const httpServer = createServer(server.app);// Literalmente, httpServer tiene las mismas configuraciones que el servidor de express server.app
  
  WssService.initWss({server: httpServer});

  server.setRoutes(AppRoutes.routes);

  // En este punto, httpServer contiene la configuración de websocket

  httpServer.listen( envs.PORT, () => {
    console.log(`Server running on port: ${ envs.PORT }`);
  });
  
}
