import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { isValidTokenFormat } from '@/lib/utils/token';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * GET /api/membros/:token
 * Valida um token e retorna informações básicas do membro
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Validar formato do token
    if (!isValidTokenFormat(token)) {
      return errorResponse(ErrorCodes.BAD_REQUEST, 'Token inválido', 400);
    }

    // Buscar membro pelo token
    const membro = await prisma.membro.findUnique({
      where: { token },
      select: {
        id: true,
        nome: true,
        email: true,
        empresa: true,
        tokenUsado: true,
      },
    });

    if (!membro) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Token não encontrado ou inválido',
        404
      );
    }

    if (membro.tokenUsado) {
      return errorResponse(
        ErrorCodes.BAD_REQUEST,
        'Este token já foi utilizado',
        400
      );
    }

    return successResponse(membro);
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
