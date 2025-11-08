'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/lib/contexts/MemberContext';
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
  const { member, isLoading: memberLoading, logout } = useMember();
  const router = useRouter();
  const [tipo, setTipo] = useState<'feitas' | 'recebidas'>('feitas');
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!memberLoading && !member) {
      router.push('/login');
    }
  }, [member, memberLoading, router]);

  useEffect(() => {
    if (member) {
      fetchIndicacoes();
    }
  }, [member, tipo]);

  const fetchIndicacoes = async () => {
    if (!member) return;

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `/api/indicacoes?membroId=${member.id}&tipo=${tipo}`;

      const response = await fetch(endpoint);

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
      case 'PENDENTE':
        return 'pendente';
      case 'EM_ANDAMENTO':
        return 'andamento';
      case 'CONCLUIDA':
        return 'aprovado';
      case 'CANCELADA':
        return 'recusado';
      default:
        return 'default';
    }
  };

  if (memberLoading) {
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
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Logado como: <strong>{member.nome}</strong> ({member.email})
            </p>
          </div>
          <Button onClick={logout} variant="secondary" size="sm">
            Sair
          </Button>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Minhas Indicações
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Gerencie suas indicações de negócio
            </p>
          </div>
          <Button onClick={() => router.push('/indicacoes/nova')}>
            Nova Indicação
          </Button>
        </div>

        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setTipo('feitas')}
            variant={tipo === 'feitas' ? 'primary' : 'secondary'}
          >
            Indicações Feitas
          </Button>
          <Button
            onClick={() => setTipo('recebidas')}
            variant={tipo === 'recebidas' ? 'primary' : 'secondary'}
          >
            Indicações Recebidas
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Carregando indicações...</p>
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
                Nenhuma indicação {tipo === 'feitas' ? 'feita' : 'recebida'}{' '}
                ainda.
              </p>
              {tipo === 'feitas' && (
                <Button
                  onClick={() => router.push('/indicacoes/nova')}
                  className="mt-4"
                >
                  Criar Primeira Indicação
                </Button>
              )}
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
                        {tipo === 'feitas' ? (
                          <>
                            Indicado para: {indicacao.indicado.nome} (
                            {indicacao.indicado.empresa})
                          </>
                        ) : (
                          <>
                            Indicado por: {indicacao.indicador.nome} (
                            {indicacao.indicador.empresa})
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(indicacao.status)}>
                      {indicacao.status.replace('_', ' ')}
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
                      indicacao.status !== 'CANCELADA' &&
                      indicacao.status !== 'CONCLUIDA' && (
                        <div className="flex gap-2">
                          <select
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                            onChange={(e) =>
                              handleUpdateStatus(indicacao.id, e.target.value)
                            }
                            disabled={updatingId === indicacao.id}
                            value={indicacao.status}
                          >
                            <option value="PENDENTE">Pendente</option>
                            <option value="EM_ANDAMENTO">Em Andamento</option>
                            <option value="CONCLUIDA">Concluída</option>
                            <option value="CANCELADA">Cancelada</option>
                          </select>
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

export default function IndicacoesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Carregando...
        </div>
      }
    >
      <IndicacoesContent />
    </Suspense>
  );
}
