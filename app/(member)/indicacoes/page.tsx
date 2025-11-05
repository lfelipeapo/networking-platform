'use client';

import { useState, useEffect } from 'react';
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

export default function IndicacoesPage() {
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
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NOVA':
        return 'Nova';
      case 'EM_CONTATO':
        return 'Em Contato';
      case 'FECHADA':
        return 'Fechada';
      case 'RECUSADA':
        return 'Recusada';
      default:
        return status;
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Minhas Indicações
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Gerencie suas indicações de negócio
            </p>
          </div>
          <Link href={`/indicacoes/nova?membroId=${membroId}`}>
            <Button>Nova Indicação</Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
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
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Carregando...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchIndicacoes} className="mt-4">
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        ) : indicacoes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                Nenhuma indicação {tipo === 'feitas' ? 'feita' : 'recebida'} no
                momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
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
                      {getStatusLabel(indicacao.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Descrição:
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {indicacao.descricao}
                      </p>
                    </div>

                    {tipo === 'recebidas' &&
                      indicacao.status !== 'FECHADA' &&
                      indicacao.status !== 'RECUSADA' && (
                        <div className="flex flex-wrap gap-2">
                          <Select
                            value={indicacao.status}
                            onChange={(e) =>
                              handleUpdateStatus(indicacao.id, e.target.value)
                            }
                            disabled={updatingId === indicacao.id}
                          >
                            <option value="NOVA">Nova</option>
                            <option value="EM_CONTATO">Em Contato</option>
                            <option value="FECHADA">Fechada</option>
                            <option value="RECUSADA">Recusada</option>
                          </Select>
                        </div>
                      )}

                    <p className="text-xs text-gray-500">
                      Criada em:{' '}
                      {new Date(indicacao.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
