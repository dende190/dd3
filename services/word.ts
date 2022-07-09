import { database } from '../lib/database';
import { Word } from '../database/entity/word';

export const wordService = {
  getNew: async function(wordsIdsUsed) {
    const word = await (
      database
      .connection
      .createQueryBuilder()
      .select(['id'])
      .from(Word, 'word')
      .where(
        'id NOT IN (:...wordsIdsUsed)',
        {wordsIdsUsed: (!wordsIdsUsed.length ? [0] : wordsIdsUsed)}
      )
      .orderBy('RANDOM()')
      .getRawOne()
    );

    return word.id;
  },
  get: async function(wordId) {
    const word = await (
      database
      .connection
      .createQueryBuilder()
      .select(['text'])
      .from(Word, 'word')
      .where('id = :wordId', {wordId})
      .getRawOne()
    );

    return word.text;
  },
};
