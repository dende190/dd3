import { database } from '../lib/database';
import { Attempt_word } from '../database/entity/attempt_word';
import { Word } from '../database/entity/word';
import { User_word } from '../database/entity/user_word';
import { wordService } from './word';
const LETTER_POSTITION_STATUS = {
  'CORRECT': 1,
  'INCORRECT': 2,
  'NOT_FOUND': 3,
};

export const attemptService = {
  create: async function () {
    const wordsIdsUsed = await this.getWordsIdsUsed();
    const wordId = await wordService.getNew(wordsIdsUsed);
    const attemptId = await (
      database
      .connection
      .createQueryBuilder()
      .insert()
      .into(Attempt_word)
      .values([
        { word: wordId },
      ])
      .execute()
    );
  },
  getWordsIdsUsed: async function () {
    const wordsUsed = await (
      database
      .connection
      .createQueryBuilder()
      .select(['"wordId" id'])
      .from(Attempt_word, 'attempt_word')
      .getRawMany()
    );

    let wordsIdsUsed = [];
    wordsUsed.forEach(word => wordsIdsUsed.push(word.id))
    return wordsIdsUsed;
  },
  getLastAttempt: async function () {
    const attempt = await (
      database
      .connection
      .createQueryBuilder()
      .select(['attempt_word.id', 'word.text'])
      .from(Attempt_word, 'attempt_word')
      .innerJoinAndSelect('attempt_word.word', 'word')
      .orderBy('attempt_word.id', 'DESC')
      .getRawOne()
    );

    return {
      attemptId: attempt.attempt_word_id,
      attemptWord: attempt.word_text,
    };
  },
  validateWord: async function (userId, userWord, attemptId, attemptWord) {
    await (
      database
      .connection
      .createQueryBuilder()
      .insert()
      .into(User_word)
      .values([
        {
          user: userId,
          attempt_word: attemptId,
          word: userWord,
          is_correct: (userWord === attemptWord),
        },
      ])
      .execute()
    );

    let validationWord = [];
    for (let wordIterator = 0; wordIterator < 5; wordIterator++) {
      let letterStatus = LETTER_POSTITION_STATUS.NOT_FOUND;
      if (userWord[wordIterator] === attemptWord[wordIterator]) {
        letterStatus = LETTER_POSTITION_STATUS.CORRECT;
      } else if (attemptWord.includes(userWord[wordIterator])) {
        letterStatus = LETTER_POSTITION_STATUS.INCORRECT;
      }

      (
        validationWord
        .push({letter: userWord[wordIterator], value: letterStatus})
      );
    }

    return validationWord;
  },
  getAttemptsCount: async function (userId, attemptId) {
    const attemptsCount = await (
      database
      .connection
      .createQueryBuilder()
      .select(['COUNT(id)'])
      .from(User_word, 'user_word')
      .where('"userId" = :userId', {userId})
      .andWhere('"attemptWordId" = :attemptId', {attemptId})
      .getRawOne()
    );

    return parseInt(attemptsCount?.count);
  },
  validateAttemptWin: async function (userId, attemptId) {
    const attemptWin = await (
      database
      .connection
      .createQueryBuilder()
      .select(['is_correct'])
      .from(User_word, 'user_word')
      .where('"userId" = :userId', {userId})
      .andWhere('"attemptWordId" = :attemptId', {attemptId})
      .andWhere('is_correct')
      .getRawOne()
    );
    return attemptWin?.is_correct;
  }
};
