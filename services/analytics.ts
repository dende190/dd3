import { database } from '../lib/database';
import { User_word } from '../database/entity/user_word';
import { User } from '../database/entity/user';
import { Word } from '../database/entity/word';
import { Attempt_word } from '../database/entity/attempt_word';

export const analyticsService = {
  getUserAttempts: async function(userId) {
    const userAttempts = await (
      database
      .connection
      .createQueryBuilder()
      .select(['"attemptWordId"', 'is_correct'])
      .from(User_word, 'user_word')
      .where('"userId" = :userId', {userId})
      .getRawMany()
    );

    let userAttemptsReturn = {
      attempts: [],
      wins: 0,
    };
    userAttempts.forEach(userAttempt => {
      if (!userAttemptsReturn.attempts.includes(userAttempt.attemptWordId)) {
        userAttemptsReturn.attempts.push(userAttempt.attemptWordId);
      }

      if (userAttempt.is_correct) {
        userAttemptsReturn.wins++;
      }
    });

    return userAttemptsReturn;
  },
  getRanking: async function () {
    const usersRanking = await (
      database
      .connection
      .createQueryBuilder()
      .select(['email', 'COUNT(user_word.id) wins'])
      .from(User_word, 'user_word')
      .innerJoin('user_word.user', 'user')
      .where('is_correct')
      .groupBy('user.id, "attemptWordId"')
      .orderBy('COUNT(user_word.id)', 'DESC')
      .limit(10)
      .getRawMany()
    );

    return usersRanking;
  },
  getWordsCorrects: async function () {
    const wordsCorrects = await (
      database
      .connection
      .createQueryBuilder()
      .select(['word.text word', 'COUNT(user_word.id) wins'])
      .from(User_word, 'user_word')
      .innerJoin('user_word.attempt_word', 'attempt_word')
      .innerJoin('attempt_word.word', 'word')
      .where('is_correct')
      .groupBy('word.text')
      .orderBy('COUNT(user_word.id)', 'DESC')
      .getRawMany()
    );

    return wordsCorrects;
  },
};
