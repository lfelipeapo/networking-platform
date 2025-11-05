import { generateToken, isValidTokenFormat } from '@/lib/utils/token';

describe('Token Utilities', () => {
  describe('generateToken', () => {
    it('deve gerar um token de 32 caracteres', () => {
      const token = generateToken();
      expect(token).toHaveLength(32);
    });

    it('deve gerar um token hexadecimal', () => {
      const token = generateToken();
      expect(token).toMatch(/^[a-f0-9]{32}$/);
    });

    it('deve gerar tokens únicos', () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('isValidTokenFormat', () => {
    it('deve validar um token válido', () => {
      const validToken = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
      expect(isValidTokenFormat(validToken)).toBe(true);
    });

    it('deve rejeitar um token com tamanho incorreto', () => {
      const shortToken = 'a1b2c3d4';
      expect(isValidTokenFormat(shortToken)).toBe(false);
    });

    it('deve rejeitar um token com caracteres inválidos', () => {
      const invalidToken = 'g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6';
      expect(isValidTokenFormat(invalidToken)).toBe(false);
    });

    it('deve rejeitar um token com letras maiúsculas', () => {
      const uppercaseToken = 'A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4';
      expect(isValidTokenFormat(uppercaseToken)).toBe(false);
    });

    it('deve rejeitar uma string vazia', () => {
      expect(isValidTokenFormat('')).toBe(false);
    });
  });
});
