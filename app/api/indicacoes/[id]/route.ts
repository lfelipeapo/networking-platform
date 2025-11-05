import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { indicacaoUpdateStatusSchema } from '@/lib/validations/indicacao';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * PATCH /api/indicacoes/:id
 * Atualiza o status de uma indicação
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validar dados de entrada
    const validation = indicacaoUpdateStatusSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Dados inválidos',
        400,
        validation.error.format()
      );
    }

    const { status } = validation.data;

    // Verificar se a indicação existe
    const indicacao = await prisma.indicacao.findUnique({
      where: { id },
    });

    if (!indicacao) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Indicação não encontrada',
        404
      );
    }

    // Atualizar status da indicação
    const indicacaoAtualizada = await prisma.indicacao.update({
      where: { id },
      data: { status },
    });

    return successResponse(
      {
        id: indicacaoAtualizada.id,
        status: indicacaoAtualizada.status,
        updatedAt: indicacaoAtualizada.updatedAt,
      },
      'Status da indicação atualizado com sucesso!'
    );
  } catch (error) {
    console.error('Erro ao atualizar indicação:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
