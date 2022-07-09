import 'reflect-metadata';
import { config } from '../../config/config';
import { DataSource } from 'typeorm';
import { User } from '../entity/user';
import { Word } from '../entity/word';
import { User_word } from '../entity/user_word';
import { Attempt_word } from '../entity/attempt_word';
const DATABASE_TYPE = 'postgres';

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
  .then(async () => console.log('migration finished...'))
  .catch((error) => console.log(error))
);
