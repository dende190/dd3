import { database } from '../lib/database';
import { User } from '../database/entity/user';
const bcrypt = require('bcrypt');
const saltRounds = 10;

export const usersService = {
  login: async function({email, password}) {
    if (!email || !password) {
      return {};
    }

    const user = await (
      database
      .connection
      .createQueryBuilder()
      .select(['id', 'email', 'password'])
      .from(User, 'user')
      .where('email = :email', {email})
      .getRawOne()
    );

    if (!user) {
      return {};
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return {};
    }

    return {
      id: user.id,
      email: user.email,
    };
  },
  registrate: async function({
    name,
    email,
    password,
    passwordRepeat,
  }) {
    if (
      !name ||
      !email ||
      !password ||
      !passwordRepeat
    ) {
      return {};
    }

    if (password !== passwordRepeat) {
      return {};
    }

    const passwordWithBcrypt = await bcrypt.hash(password, saltRounds);
    const userId = (
      database
      .insert(User, {name, email, password: passwordWithBcrypt})
    );
    return {
      id: userId,
      email: email,
    };
  },
};
