import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { intencaoCreateSchema } from '@/lib/validations/intencao';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * POST /api/intencoes
 * Cria uma nova intenção de participação
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validation = intencaoCreateSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Dados inválidos',
        400,
        validation.error.format()
      );
    }

    const { nome, email, empresa, motivacao } = validation.data;

    // Verificar se o email já existe
    const existingIntencao = await prisma.intencao.findUnique({
      where: { email },
    });

    if (existingIntencao) {
      return errorResponse(
        ErrorCodes.CONFLICT,
        'Este email já possui uma intenção cadastrada',
        409
      );
    }

    // Criar intenção
    const intencao = await prisma.intencao.create({
      data: {
        nome,
        email,
        empresa,
        motivacao,
      },
    });

    return successResponse(
      intencao,
      'Intenção de participação registrada com sucesso!',
      201
    );
  } catch (error) {
    console.error('Erro ao criar intenção:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}

/**
 * GET /api/intencoes
 * Lista todas as intenções (rota protegida - admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros de query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Construir filtros
    const where = status ? { status } : {};

    // Buscar intenções com paginação
    const [intencoes, total] = await Promise.all([
      prisma.intencao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.intencao.count({ where }),
    ]);

    return successResponse(intencoes);
  } catch (error) {
    console.error('Erro ao listar intenções:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
