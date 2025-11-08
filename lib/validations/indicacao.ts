import { z } from 'zod';

/**
 * Schema de validação para criação de indicação
 */
export const indicacaoCreateSchema = z.object({
  indicadorId: z.string().cuid('ID do indicador inválido'),
  indicadoId: z.string().cuid('ID do indicado inválido'),
  empresaContato: z
    .string()
    .min(2, 'Empresa/Contato deve ter no mínimo 2 caracteres')
    .max(100, 'Empresa/Contato deve ter no máximo 100 caracteres'),
  descricao: z
    .string()
    .min(20, 'Descrição deve ter no mínimo 20 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
}).refine((data) => data.indicadorId !== data.indicadoId, {
  message: 'Um membro não pode criar uma indicação para si mesmo',
  path: ['indicadoId'],
});

/**
 * Schema de validação para atualização de status de indicação
 */
export const indicacaoUpdateStatusSchema = z.object({
  status: z.enum(['NOVA', 'EM_CONTATO', 'FECHADA', 'RECUSADA'], {
    message: 'Status inválido',
  }),
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type IndicacaoCreateInput = z.infer<typeof indicacaoCreateSchema>;
export type IndicacaoUpdateStatusInput = z.infer<typeof indicacaoUpdateStatusSchema>;
