import * as express from 'express';
import { config } from '../config/config';
import { analyticsService } from '../services/analytics';
const jwt = require('jsonwebtoken');

export function analyticsRoute(app) {
  const router = express.Router();
  app.use('/analytics', router);

  router.post('/user-attempts', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const userAttempts = await (
      analyticsService
      .getUserAttempts(req.body.userId)
    );
    (
      res
      .status(200)
      .json({attempts: userAttempts.attempts.length, wins: userAttempts.wins})
    );
  });

  router.post('/ranking', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const usersRanking = await analyticsService.getRanking();
    res.status(200).json(usersRanking);
  });

  router.post('/words-corrects', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const wordsCorrects = await analyticsService.getWordsCorrects();
    res.status(200).json(wordsCorrects);
  });
}
