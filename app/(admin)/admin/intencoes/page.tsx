'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Intencao {
  id: string;
  nome: string;
  email: string;
  empresa: string;
  motivacao: string;
  status: string;
  createdAt: string;
}

export default function AdminIntencoesPage() {
  const [intencoes, setIntencoes] = useState<Intencao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_secret_key_123';

  useEffect(() => {
    fetchIntencoes();
  }, []);

  const fetchIntencoes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/intencoes', {
        headers: {
          'X-Admin-Key': adminKey,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar intenções');
      }

      const result = await response.json();
      setIntencoes(result.data.intencoes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingId(id);

    try {
      const response = await fetch(`/api/intencoes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      await fetchIntencoes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'pendente';
      case 'APROVADO':
        return 'aprovado';
      case 'RECUSADO':
        return 'recusado';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <Button onClick={fetchIntencoes} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Gestão de Intenções
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Aprove ou recuse as solicitações de participação
          </p>
        </div>

        {intencoes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                Nenhuma intenção cadastrada no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {intencoes.map((intencao) => (
              <Card key={intencao.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{intencao.nome}</CardTitle>
                      <CardDescription>
                        {intencao.email} • {intencao.empresa}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(intencao.status)}>
                      {intencao.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Motivação:
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {intencao.motivacao}
                      </p>
                    </div>

                    {intencao.status === 'PENDENTE' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleUpdateStatus(intencao.id, 'APROVADO')
                          }
                          isLoading={processingId === intencao.id}
                          disabled={processingId !== null}
                          variant="primary"
                        >
                          Aprovar
                        </Button>
                        <Button
                          onClick={() =>
                            handleUpdateStatus(intencao.id, 'RECUSADO')
                          }
                          isLoading={processingId === intencao.id}
                          disabled={processingId !== null}
                          variant="danger"
                        >
                          Recusar
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Enviado em:{' '}
                      {new Date(intencao.createdAt).toLocaleString('pt-BR')}
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
