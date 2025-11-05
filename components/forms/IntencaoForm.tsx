'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { intencaoCreateSchema, type IntencaoCreateInput } from '@/lib/validations/intencao';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface IntencaoFormProps {
  onSuccess?: () => void;
}

export function IntencaoForm({ onSuccess }: IntencaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntencaoCreateInput>({
    resolver: zodResolver(intencaoCreateSchema),
  });

  const onSubmit = async (data: IntencaoCreateInput) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/intencoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: result.message || 'Intenção registrada com sucesso!',
        });
        reset();
        onSuccess?.();
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error?.message || 'Erro ao registrar intenção',
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Erro ao conectar com o servidor',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome" required>
          Nome Completo
        </Label>
        <Input
          id="nome"
          type="text"
          placeholder="João Silva"
          error={errors.nome?.message}
          {...register('nome')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="joao.silva@empresa.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="empresa" required>
          Empresa
        </Label>
        <Input
          id="empresa"
          type="text"
          placeholder="Empresa XYZ Ltda"
          error={errors.empresa?.message}
          {...register('empresa')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivacao" required>
          Por que você quer participar?
        </Label>
        <Textarea
          id="motivacao"
          placeholder="Desejo participar do grupo para expandir minha rede de contatos e gerar novas oportunidades de negócio..."
          rows={4}
          error={errors.motivacao?.message}
          {...register('motivacao')}
        />
        <p className="text-xs text-gray-500">Mínimo de 20 caracteres</p>
      </div>

      {submitMessage && (
        <div
          className={`rounded-md p-4 ${
            submitMessage.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
          role="alert"
        >
          {submitMessage.text}
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Enviar Intenção
      </Button>
    </form>
  );
}
