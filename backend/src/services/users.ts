import bcrypt from 'bcrypt';
import { query } from '../db';
import { User } from '../types';

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export async function getUsers(): Promise<User[]> {
  return query<User[]>('SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 100');
}

export async function createUser(data: NewUser) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return query('INSERT INTO users (`name`, `email`, `password`) VALUES (?, ?, ?)', [
    data.name,
    data.email,
    passwordHash,
  ]);
}
