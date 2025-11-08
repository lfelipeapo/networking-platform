import { NextRequest } from 'next/server';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * POST /api/admin/auth
 * Autentica administrador usando variável de ambiente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Senha é obrigatória',
        400
      );
    }

    // Verificar senha contra variável de ambiente
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password !== adminPassword) {
      return errorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Senha incorreta',
        401
      );
    }

    // Gerar token simples (em produção, usar JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');

    return successResponse(
      { token },
      'Autenticação realizada com sucesso'
    );
  } catch (error) {
    console.error('Erro na autenticação admin:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
