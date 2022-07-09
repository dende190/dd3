import * as express from 'express';
import { config } from '../config/config';
import { attemptService } from '../services/attempt';
const jwt = require('jsonwebtoken');

export function attemptRoute(app) {
  const router = express.Router();
  app.use('/attempt', router);

  router.post('/new', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const word = await attemptService.create();
    res.status(200).json({created: true});
  });

  router.post('/word', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userWord = req.body.word;
    if (!userWord.match(/\w{5}/)) {
      res.status(301).json({error: true, message: 'word is wrong'});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const {attemptId, attemptWord} = await attemptService.getLastAttempt();
    const attemptWin = await (
      attemptService
      .validateAttemptWin(userData.id, attemptId)
    );
    if (attemptWin) {
      res.status(301).json({error: true, message: 'Attempt Win'});
      return;
    }

    const attemptsCount = await (
      attemptService
      .getAttemptsCount(userData.id, attemptId)
    );
    if (attemptsCount >= 5) {
      res.status(301).json({error: true, message: 'maximum attempts'});
      return;
    }


    const validationWord = await (
      attemptService
      .validateWord(userData.id, userWord, attemptId, attemptWord)
    );
    res.status(200).json(validationWord);
  });
}
