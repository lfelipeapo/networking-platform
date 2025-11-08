'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { membroCreateSchema, type MembroCreateInput } from '@/lib/validations/membro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MembroInfo {
  id: string;
  nome: string;
  email: string;
  empresa: string;
  tokenUsado: boolean;
}

export default function CadastroPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [membroInfo, setMembroInfo] = useState<MembroInfo | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembroCreateInput>({
    resolver: zodResolver(membroCreateSchema),
    defaultValues: {
      token: resolvedParams.token,
    },
  });

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submitSuccess, router]);

  const validateToken = async () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const response = await fetch(`/api/membros/${resolvedParams.token}`);

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || 'Token inválido');
      }

      const result = await response.json();
      setMembroInfo(result.data);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Erro ao validar token'
      );
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: MembroCreateInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/membros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        alert(result.error?.message || 'Erro ao completar cadastro');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Validando convite...</p>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{validationError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600">Sucesso! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Seu cadastro foi completado com sucesso! Bem-vindo ao grupo de
              networking.
            </p>
            <div className="rounded-md bg-green-50 p-4 text-center">
              <p className="text-sm text-green-800">
                Você será redirecionado para o login em{' '}
                <span className="font-bold text-green-900">{countdown}</span>{' '}
                segundo{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Ir para Login Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Complete seu Cadastro
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Bem-vindo, {membroInfo?.nome}!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
            <CardDescription>
              Complete seu cadastro com as informações abaixo para finalizar
              sua participação no grupo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4 rounded-md bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nome:</p>
                  <p className="text-sm text-gray-900">{membroInfo?.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email:</p>
                  <p className="text-sm text-gray-900">{membroInfo?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Empresa:</p>
                  <p className="text-sm text-gray-900">{membroInfo?.empresa}</p>
                </div>
              </div>

              <input type="hidden" {...register('token')} />

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  error={errors.telefone?.message}
                  {...register('telefone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  type="text"
                  placeholder="Diretor Comercial"
                  error={errors.cargo?.message}
                  {...register('cargo')}
                />
              </div>

              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Completar Cadastro
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
