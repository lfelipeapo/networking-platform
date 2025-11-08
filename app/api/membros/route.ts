import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { membroCreateSchema } from '@/lib/validations/membro';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * POST /api/membros
 * Completa o cadastro de um membro usando o token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validation = membroCreateSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Dados inválidos',
        400,
        validation.error.format()
      );
    }

    const { token, telefone, cargo } = validation.data;

    // Buscar membro pelo token
    const membro = await prisma.membro.findUnique({
      where: { token },
    });

    if (!membro) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'Token inválido', 404);
    }

    if (membro.tokenUsado) {
      return errorResponse(
        ErrorCodes.BAD_REQUEST,
        'Este token já foi utilizado',
        400
      );
    }

    // Atualizar membro com dados completos
    const membroAtualizado = await prisma.membro.update({
      where: { token },
      data: {
        telefone,
        cargo,
        tokenUsado: true,
      },
    });

    return successResponse(
      {
        id: membroAtualizado.id,
        nome: membroAtualizado.nome,
        email: membroAtualizado.email,
        empresa: membroAtualizado.empresa,
        telefone: membroAtualizado.telefone,
        cargo: membroAtualizado.cargo,
        tokenUsado: membroAtualizado.tokenUsado,
        createdAt: membroAtualizado.createdAt,
        updatedAt: membroAtualizado.updatedAt,
      },
      'Cadastro completado com sucesso! Bem-vindo ao grupo.'
    );
  } catch (error) {
    console.error('Erro ao completar cadastro:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}

/**
 * GET /api/membros
 * Lista todos os membros ativos (admin) OU busca membro por email (login)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    // Se tem email, é login de membro
    if (email) {
      const membro = await prisma.membro.findUnique({
        where: { email },
        select: {
          id: true,
          nome: true,
          email: true,
          empresa: true,
          cargo: true,
          telefone: true,
          tokenUsado: true,
        },
      });

      if (!membro) {
        return errorResponse(
          ErrorCodes.NOT_FOUND,
          'Membro não encontrado',
          404
        );
      }

      if (!membro.tokenUsado) {
        return errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Você ainda não completou seu cadastro',
          400
        );
      }

      return successResponse(membro, 'Membro encontrado');
    }

    // Caso contrário, é listagem admin
    const adminKey = request.headers.get('X-Admin-Key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return errorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Acesso não autorizado',
        401
      );
    }

    const membros = await prisma.membro.findMany({
      where: { tokenUsado: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        empresa: true,
        cargo: true,
        createdAt: true,
      },
    });

    return successResponse(membros);
  } catch (error) {
    console.error('Erro ao buscar/listar membros:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
