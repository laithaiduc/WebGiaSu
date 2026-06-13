import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { query } from '../db';
import type { User } from '../types';

const {
  JWT_SECRET = 'change_this_secret',
  REFRESH_TOKEN_SECRET = 'change_this_refresh_secret',
  ACCESS_TOKEN_EXPIRES_IN = '15m',
  REFRESH_TOKEN_EXPIRES_IN = '7d',
  NODE_ENV = 'development',
} = process.env;
const jwtSecret: jwt.Secret = JWT_SECRET as jwt.Secret;
const refreshSecret: jwt.Secret = REFRESH_TOKEN_SECRET as jwt.Secret;

const secure = NODE_ENV === 'production';

export type TokenPayload = {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, storedPassword: string) {
  return bcrypt.compare(password, storedPassword);
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, jwtSecret as jwt.Secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, refreshSecret as jwt.Secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}

export function parseCookies(cookieHeader?: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    if (!name) return;
    cookies[name.trim()] = decodeURIComponent(rest.join('=').trim());
  });
  return cookies;
}

export function getAccessTokenFromRequest(req: Request) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies.accessToken || null;
}

export function getRefreshTokenFromRequest(req: Request) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies.refreshToken || null;
}

export function getAccessTokenCookieOptions() {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 15,
    path: '/',
  };
}

export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  };
}

export function sendAccessToken(res: Response, token: string) {
  res.cookie('accessToken', token, getAccessTokenCookieOptions());
}

export function sendRefreshToken(res: Response, token: string) {
  res.cookie('refreshToken', token, getRefreshTokenCookieOptions());
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
}

export async function getUserById(id: number): Promise<User | null> {
  const rows = await query<User[]>('SELECT id, name, email, role, phone, gender, avatar, refresh_token FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function storeRefreshToken(userId: number, refreshToken: string) {
  await query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
}

export async function clearRefreshToken(userId: number) {
  await query('UPDATE users SET refresh_token = NULL WHERE id = ?', [userId]);
}

export async function findUserByRefreshToken(refreshToken: string): Promise<User | null> {
  const rows = await query<User[]>('SELECT id, name, email, role, phone, gender, avatar, refresh_token FROM users WHERE refresh_token = ?', [refreshToken]);
  return rows[0] || null;
}

export async function refreshTokens(req: Request, res: Response): Promise<TokenPayload | null> {
  const refreshToken = getRefreshTokenFromRequest(req);
  if (!refreshToken) return null;

  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return null;
  }

  const user = await findUserByRefreshToken(refreshToken);
  if (!user || user.id !== payload.id) {
    return null;
  }

  const tokenPayload: TokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  await storeRefreshToken(user.id, newRefreshToken);
  sendAccessToken(res, newAccessToken);
  sendRefreshToken(res, newRefreshToken);

  return tokenPayload;
}

export async function authenticateFromCookieHeader(cookieHeader?: string): Promise<TokenPayload | null> {
  const cookies = parseCookies(cookieHeader);
  const accessToken = cookies.accessToken;
  if (accessToken) {
    try {
      return verifyAccessToken(accessToken);
    } catch (error: any) {
      if (error.name !== 'TokenExpiredError') return null;
    }
  }

  const refreshToken = cookies.refreshToken;
  if (!refreshToken) return null;

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await findUserByRefreshToken(refreshToken);
    if (!user || user.id !== payload.id) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: Request, res: Response): Promise<TokenPayload | null> {
  const accessToken = getAccessTokenFromRequest(req);
  if (accessToken) {
    try {
      return verifyAccessToken(accessToken);
    } catch (error: any) {
      if (error.name !== 'TokenExpiredError') return null;
    }
  }

  return refreshTokens(req, res);
}
