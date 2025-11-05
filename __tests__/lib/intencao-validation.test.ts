import {
  intencaoCreateSchema,
  intencaoUpdateStatusSchema,
} from '@/lib/validations/intencao';

describe('Intencao Validation Schemas', () => {
  describe('intencaoCreateSchema', () => {
    it('deve validar dados corretos', () => {
      const validData = {
        nome: 'João Silva',
        email: 'joao.silva@empresa.com',
        empresa: 'Empresa XYZ Ltda',
        motivacao:
          'Desejo participar do grupo para expandir minha rede de contatos e gerar novas oportunidades de negócio.',
      };

      const result = intencaoCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome muito curto', () => {
      const invalidData = {
        nome: 'Jo',
        email: 'joao@empresa.com',
        empresa: 'Empresa XYZ',
        motivacao: 'Motivação com mais de 20 caracteres aqui',
      };

      const result = intencaoCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('nome');
      }
    });

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        nome: 'João Silva',
        email: 'email-invalido',
        empresa: 'Empresa XYZ',
        motivacao: 'Motivação com mais de 20 caracteres aqui',
      };

      const result = intencaoCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('deve rejeitar empresa muito curta', () => {
      const invalidData = {
        nome: 'João Silva',
        email: 'joao@empresa.com',
        empresa: 'E',
        motivacao: 'Motivação com mais de 20 caracteres aqui',
      };

      const result = intencaoCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('empresa');
      }
    });

    it('deve rejeitar motivação muito curta', () => {
      const invalidData = {
        nome: 'João Silva',
        email: 'joao@empresa.com',
        empresa: 'Empresa XYZ',
        motivacao: 'Motivação curta',
      };

      const result = intencaoCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('motivacao');
      }
    });

    it('deve rejeitar campos faltando', () => {
      const invalidData = {
        nome: 'João Silva',
        email: 'joao@empresa.com',
      };

      const result = intencaoCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('intencaoUpdateStatusSchema', () => {
    it('deve validar status PENDENTE', () => {
      const result = intencaoUpdateStatusSchema.safeParse({
        status: 'PENDENTE',
      });
      expect(result.success).toBe(true);
    });

    it('deve validar status APROVADO', () => {
      const result = intencaoUpdateStatusSchema.safeParse({
        status: 'APROVADO',
      });
      expect(result.success).toBe(true);
    });

    it('deve validar status RECUSADO', () => {
      const result = intencaoUpdateStatusSchema.safeParse({
        status: 'RECUSADO',
      });
      expect(result.success).toBe(true);
    });

    it('deve rejeitar status inválido', () => {
      const result = intencaoUpdateStatusSchema.safeParse({
        status: 'INVALIDO',
      });
      expect(result.success).toBe(false);
    });
  });
});
