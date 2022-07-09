import * as express from 'express';
import { config } from '../config/config';
import { usersService } from '../services/user';
const jwt = require('jsonwebtoken');
const JWT_EXPIRES = '1d';

export function usersRoute(app) {
  const router = express.Router();
  app.use('/user', router);

  router.post('/login', async (req, res, next) => {
    const userData = await usersService.login(req.body);
    if (!Object.values(userData).length) {
      res.json({login: false});
      return;
    }

    const token = jwt.sign(
      userData,
      config.jwtKey,
      {expiresIn: JWT_EXPIRES}
    );

    res.status(200).json({login: true, token: token});
  });

  router.post('/signup', async (req, res, next) => {
    const userData = await usersService.registrate(req.body);
    if (!Object.values(userData).length) {
      res.json({login: false});
      return;
    }

    const token = jwt.sign(
      userData,
      config.jwtKey,
      {expiresIn: JWT_EXPIRES}
    );

    res.status(200).json({login: true, token: token});
  });
}
