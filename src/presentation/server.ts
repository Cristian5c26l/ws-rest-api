import express, { Router } from 'express';
import path from 'path';

interface Options {
  port: number;
  // routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: Options) {
    const { port, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;

    this.configure();
  }


  private configure() {
//* Middlewares
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    //this.app.use( this.routes );

    //* SPA
    // this.app.get('*', (req, res) => {// Esta funcion se ejecuta en caso de que ninguna ruta, a la que se le haga peticion, esté incluida en this.routes
    //   const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
    //   res.sendFile(indexPath);
    // });

    this.app.get(/^\/(?!api).*/, (req, res) => {// Esta funcion se ejecuta cuando la ruta, a la que se le haga peticion, no empiece con la palabra api. 
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    // Expresión regular para excluir todo lo que empiece con API: /^\/(?!api).*/
  }

  public setRoutes( router: Router ) {
    this.app.use(router);
  }
  
  
  async start() {
    
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}
