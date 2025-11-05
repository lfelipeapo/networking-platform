import { randomBytes } from 'crypto';

/**
 * Gera um token único para convite de cadastro
 * @returns Token único de 32 caracteres hexadecimais
 */
export function generateToken(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Valida o formato de um token
 * @param token Token a ser validado
 * @returns true se o token é válido, false caso contrário
 */
export function isValidTokenFormat(token: string): boolean {
  return /^[a-f0-9]{32}$/.test(token);
}
