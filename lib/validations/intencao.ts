import { z } from 'zod';

/**
 * Schema de validação para criação de intenção de participação
 */
export const intencaoCreateSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  empresa: z
    .string()
    .min(2, 'Empresa deve ter no mínimo 2 caracteres')
    .max(100, 'Empresa deve ter no máximo 100 caracteres'),
  motivacao: z
    .string()
    .min(20, 'Motivação deve ter no mínimo 20 caracteres')
    .max(500, 'Motivação deve ter no máximo 500 caracteres'),
});

/**
 * Schema de validação para atualização de status de intenção
 */
export const intencaoUpdateStatusSchema = z.object({
  status: z.enum(['PENDENTE', 'APROVADO', 'RECUSADO'], {
    message: 'Status inválido',
  }),
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type IntencaoCreateInput = z.infer<typeof intencaoCreateSchema>;
export type IntencaoUpdateStatusInput = z.infer<typeof intencaoUpdateStatusSchema>;
