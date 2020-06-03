import { config } from 'dotenv';
config();
import express, { Express } from 'express';
import routes from './routes';

class App {
  server: Express;
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // this.server.use(Express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
