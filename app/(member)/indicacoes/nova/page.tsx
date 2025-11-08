'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IndicacaoForm } from '@/components/forms/IndicacaoForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function NovaIndicacaoContent() {
  const searchParams = useSearchParams();
  const indicadorId = searchParams.get('membroId') || '';

  if (!indicadorId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              ID do membro não fornecido. Por favor, acesse esta página através
              do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
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
            <IndicacaoForm indicadorId={indicadorId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NovaIndicacaoPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <NovaIndicacaoContent />
    </Suspense>
  );
}
