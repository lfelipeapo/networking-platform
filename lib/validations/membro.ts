import { z } from 'zod';

/**
 * Schema de validação para cadastro completo de membro
 */
export const membroCreateSchema = z.object({
  token: z
    .string()
    .length(32, 'Token inválido')
    .regex(/^[a-f0-9]{32}$/, 'Token inválido'),
  telefone: z
    .string()
    .min(10, 'Telefone deve ter no mínimo 10 caracteres')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional(),
  cargo: z
    .string()
    .min(3, 'Cargo deve ter no mínimo 3 caracteres')
    .max(100, 'Cargo deve ter no máximo 100 caracteres')
    .optional(),
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type MembroCreateInput = z.infer<typeof membroCreateSchema>;
