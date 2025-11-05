import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { indicacaoCreateSchema } from '@/lib/validations/indicacao';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * POST /api/indicacoes
 * Cria uma nova indicação de negócio
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validation = indicacaoCreateSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Dados inválidos',
        400,
        validation.error.format()
      );
    }

    const { indicadorId, indicadoId, empresaContato, descricao } =
      validation.data;

    // Verificar se os membros existem
    const [indicador, indicado] = await Promise.all([
      prisma.membro.findUnique({ where: { id: indicadorId } }),
      prisma.membro.findUnique({ where: { id: indicadoId } }),
    ]);

    if (!indicador || !indicado) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Um ou ambos os membros não foram encontrados',
        404
      );
    }

    // Criar indicação
    const indicacao = await prisma.indicacao.create({
      data: {
        indicadorId,
        indicadoId,
        empresaContato,
        descricao,
      },
      include: {
        indicador: {
          select: {
            nome: true,
            empresa: true,
          },
        },
        indicado: {
          select: {
            nome: true,
            empresa: true,
          },
        },
      },
    });

    return successResponse(
      indicacao,
      'Indicação criada com sucesso!',
      201
    );
  } catch (error) {
    console.error('Erro ao criar indicação:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}

/**
 * GET /api/indicacoes
 * Lista indicações (feitas ou recebidas por um membro)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membroId = searchParams.get('membroId');
    const tipo = searchParams.get('tipo'); // 'feitas' ou 'recebidas'
    const status = searchParams.get('status');

    if (!membroId || !tipo) {
      return errorResponse(
        ErrorCodes.BAD_REQUEST,
        'Parâmetros membroId e tipo são obrigatórios',
        400
      );
    }

    if (tipo !== 'feitas' && tipo !== 'recebidas') {
      return errorResponse(
        ErrorCodes.BAD_REQUEST,
        'Tipo deve ser "feitas" ou "recebidas"',
        400
      );
    }

    // Construir filtros
    const where: {
      indicadorId?: string;
      indicadoId?: string;
      status?: string;
    } = tipo === 'feitas' ? { indicadorId: membroId } : { indicadoId: membroId };

    if (status) {
      where.status = status;
    }

    // Buscar indicações
    const indicacoes = await prisma.indicacao.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        indicador: {
          select: {
            id: true,
            nome: true,
            empresa: true,
          },
        },
        indicado: {
          select: {
            id: true,
            nome: true,
            empresa: true,
          },
        },
      },
    });

    return successResponse(indicacoes);
  } catch (error) {
    console.error('Erro ao listar indicações:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
