import * as express from 'express';
import { Express } from 'express';
const app: Express = express();
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';
import { config } from './config/config';
import { usersRoute } from './routes/user';
import { attemptRoute } from './routes/attempt';
import { analyticsRoute } from './routes/analytics';

import 'reflect-metadata';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
  origin: config.cors,
  optionsSuccessStatus: 200,
}));

//Routes
usersRoute(app);
attemptRoute(app);
analyticsRoute(app);

app.listen(config.port, () => {
  console.log('Servidor escuchando en el puerto', config.port);
});
