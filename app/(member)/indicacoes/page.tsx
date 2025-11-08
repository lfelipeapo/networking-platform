'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Indicacao {
  id: string;
  empresaContato: string;
  descricao: string;
  status: string;
  createdAt: string;
  indicador: {
    id: string;
    nome: string;
    empresa: string;
  };
  indicado: {
    id: string;
    nome: string;
    empresa: string;
  };
}

function IndicacoesContent() {
  const searchParams = useSearchParams();
  const membroId = searchParams.get('membroId') || '';

  const [tipo, setTipo] = useState<'feitas' | 'recebidas'>('feitas');
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (membroId) {
      fetchIndicacoes();
    }
  }, [membroId, tipo]);

  const fetchIndicacoes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/indicacoes?membroId=${membroId}&tipo=${tipo}`
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar indicações');
      }

      const result = await response.json();
      setIndicacoes(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);

    try {
      const response = await fetch(`/api/indicacoes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      await fetchIndicacoes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'NOVA':
        return 'nova';
      case 'EM_CONTATO':
        return 'em_contato';
      case 'FECHADA':
        return 'fechada';
      case 'RECUSADA':
        return 'recusada';
      default:
        return 'nova';
    }
  };

  if (!membroId) {
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
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Minhas Indicações
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Gerencie suas indicações de negócios
            </p>
          </div>
          <Link href={`/indicacoes/nova?membroId=${membroId}`}>
            <Button>Nova Indicação</Button>
          </Link>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            variant={tipo === 'feitas' ? 'primary' : 'outline'}
            onClick={() => setTipo('feitas')}
          >
            Indicações Feitas
          </Button>
          <Button
            variant={tipo === 'recebidas' ? 'primary' : 'outline'}
            onClick={() => setTipo('recebidas')}
          >
            Indicações Recebidas
          </Button>
        </div>

        {isLoading && (
          <div className="text-center">
            <p className="text-gray-600">Carregando indicações...</p>
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && indicacoes.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                Nenhuma indicação encontrada.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && indicacoes.length > 0 && (
          <div className="grid gap-4">
            {indicacoes.map((indicacao) => (
              <Card key={indicacao.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{indicacao.empresaContato}</CardTitle>
                      <CardDescription>
                        {tipo === 'feitas'
                          ? `Para: ${indicacao.indicado.nome} (${indicacao.indicado.empresa})`
                          : `De: ${indicacao.indicador.nome} (${indicacao.indicador.empresa})`}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(indicacao.status)}>
                      {indicacao.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700">{indicacao.descricao}</p>
                  <p className="mb-4 text-sm text-gray-500">
                    Criada em:{' '}
                    {new Date(indicacao.createdAt).toLocaleDateString('pt-BR')}
                  </p>

                  {tipo === 'recebidas' && indicacao.status !== 'FECHADA' && (
                    <div className="flex gap-2">
                      <select
                        className="rounded border border-gray-300 px-3 py-2"
                        onChange={(e) =>
                          handleUpdateStatus(indicacao.id, e.target.value)
                        }
                        disabled={updatingId === indicacao.id}
                        value={indicacao.status}
                      >
                        <option value="NOVA">Nova</option>
                        <option value="EM_CONTATO">Em Contato</option>
                        <option value="FECHADA">Fechada</option>
                        <option value="RECUSADA">Recusada</option>
                      </select>
                      {updatingId === indicacao.id && (
                        <span className="text-sm text-gray-500">
                          Atualizando...
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function IndicacoesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <IndicacoesContent />
    </Suspense>
  );
}
