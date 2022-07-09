import { config } from '../config/config';
import { DataSource } from 'typeorm';
const DATABASE_TYPE = 'postgres';
import { User } from '../database/entity/user';
import { Word } from '../database/entity/word';
import { User_word } from '../database/entity/user_word';
import { Attempt_word } from '../database/entity/attempt_word';

const AppDataSource = new DataSource({
  type: DATABASE_TYPE,
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  entities: [User, Word, User_word, Attempt_word],
  synchronize: true,
  logging: false,
});

(
  AppDataSource
  .initialize()
);
export const database = {
  connection: AppDataSource,
  insert: async function (entity, dataJson) {
    let entityClass = new entity();
    for (let data in dataJson) {
      entityClass[data] = dataJson[data];
    }

    await AppDataSource.manager.save(entityClass)
    return entityClass.id
  }
}
