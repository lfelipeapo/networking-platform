import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { intencaoUpdateStatusSchema } from '@/lib/validations/intencao';
import { generateToken } from '@/lib/utils/token';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * PATCH /api/intencoes/:id
 * Atualiza o status de uma intenção (aprovar/recusar)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar chave administrativa
    const adminKey = request.headers.get('X-Admin-Key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return errorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Acesso não autorizado',
        401
      );
    }

    const body = await request.json();

    // Validar dados de entrada
    const validation = intencaoUpdateStatusSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Dados inválidos',
        400,
        validation.error.format()
      );
    }

    const { status } = validation.data;

    // Verificar se a intenção existe
    const intencao = await prisma.intencao.findUnique({
      where: { id },
    });

    if (!intencao) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Intenção não encontrada',
        404
      );
    }

    // Atualizar status da intenção
    const intencaoAtualizada = await prisma.intencao.update({
      where: { id },
      data: { status },
    });

    // Se aprovado, criar membro com token
    if (status === 'APROVADO') {
      const token = generateToken();

      const membro = await prisma.membro.create({
        data: {
          nome: intencao.nome,
          email: intencao.email,
          empresa: intencao.empresa,
          token,
        },
      });

      const conviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cadastro/${token}`;

      // Simular envio de email
      console.log('='.repeat(60));
      console.log('📧 SIMULAÇÃO DE ENVIO DE EMAIL');
      console.log('='.repeat(60));
      console.log(`Para: ${membro.email}`);
      console.log(`Assunto: Bem-vindo ao Grupo de Networking!`);
      console.log(`\nOlá ${membro.nome},\n`);
      console.log(
        'Sua intenção de participar do grupo foi aprovada! 🎉\n'
      );
      console.log('Complete seu cadastro acessando o link abaixo:\n');
      console.log(conviteLink);
      console.log('\n' + '='.repeat(60) + '\n');

      return successResponse(
        {
          intencao: intencaoAtualizada,
          membro: {
            id: membro.id,
            nome: membro.nome,
            email: membro.email,
            token: membro.token,
            tokenUsado: membro.tokenUsado,
          },
          conviteLink,
        },
        'Intenção aprovada! Convite gerado com sucesso.'
      );
    }

    return successResponse(
      { intencao: intencaoAtualizada },
      'Status da intenção atualizado com sucesso!'
    );
  } catch (error) {
    console.error('Erro ao atualizar intenção:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno do servidor',
      500
    );
  }
}
