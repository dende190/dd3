import 'reflect-metadata';
import { config } from '../../config/config';
import { DataSource } from 'typeorm';
import { Word } from '../entity/word';
const DATABASE_TYPE = 'postgres';
import { dictionary } from '../../utils/dictionary';

const AppDataSource = new DataSource({
  type: DATABASE_TYPE,
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  entities: [Word],
  synchronize: true,
  logging: false,
});

(
  AppDataSource
  .initialize()
  .then(async () => {
    let words = [];
    for (let dictionaryWord of dictionary) {
      words.push({text: dictionaryWord});
    }

    await (
      AppDataSource
      .createQueryBuilder()
      .insert()
      .into(Word)
      .values(words)
      .execute()
    );
    console.log('migration finished...');
  })
  .catch((error) => console.log(error))
);
