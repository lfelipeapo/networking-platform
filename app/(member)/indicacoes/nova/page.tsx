'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/lib/contexts/MemberContext';
import { IndicacaoForm } from '@/components/forms/IndicacaoForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function NovaIndicacaoContent() {
  const { member, isLoading, logout } = useMember();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !member) {
      router.push('/login');
    }
  }, [member, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Logado como: <strong>{member.nome}</strong> ({member.email})
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/indicacoes')}
              variant="secondary"
              size="sm"
            >
              Minhas Indicações
            </Button>
            <Button onClick={logout} variant="secondary" size="sm">
              Sair
            </Button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Nova Indicação</h1>
          <p className="mt-2 text-lg text-gray-600">
            Indique uma oportunidade de negócio para outro membro
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar Indicação</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para criar uma indicação de
              negócio para outro membro do grupo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IndicacaoForm indicadorId={member.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NovaIndicacaoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Carregando...
        </div>
      }
    >
      <NovaIndicacaoContent />
    </Suspense>
  );
}
