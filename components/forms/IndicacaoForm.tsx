'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { indicacaoCreateSchema, type IndicacaoCreateInput } from '@/lib/validations/indicacao';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface Membro {
  id: string;
  nome: string;
  empresa: string;
}

interface IndicacaoFormProps {
  indicadorId: string;
  onSuccess?: () => void;
}

export function IndicacaoForm({ indicadorId, onSuccess }: IndicacaoFormProps) {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [isLoadingMembros, setIsLoadingMembros] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_secret_key_123';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IndicacaoCreateInput>({
    resolver: zodResolver(indicacaoCreateSchema),
    defaultValues: {
      indicadorId,
    },
  });

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    try {
      const response = await fetch('/api/membros', {
        headers: {
          'X-Admin-Key': adminKey,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMembros(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    } finally {
      setIsLoadingMembros(false);
    }
  };

  const onSubmit = async (data: IndicacaoCreateInput) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/indicacoes', {
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
          text: result.message || 'Indicação criada com sucesso!',
        });
        reset({ indicadorId });
        onSuccess?.();
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error?.message || 'Erro ao criar indicação',
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
      <input type="hidden" {...register('indicadorId')} />

      <div className="space-y-2">
        <Label htmlFor="indicadoId" required>
          Membro Indicado
        </Label>
        <Select
          id="indicadoId"
          error={errors.indicadoId?.message}
          {...register('indicadoId')}
          disabled={isLoadingMembros}
        >
          <option value="">Selecione um membro</option>
          {membros
            .filter((m) => m.id !== indicadorId)
            .map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome} - {membro.empresa}
              </option>
            ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="empresaContato" required>
          Empresa/Contato Indicado
        </Label>
        <Input
          id="empresaContato"
          type="text"
          placeholder="Empresa ABC S.A."
          error={errors.empresaContato?.message}
          {...register('empresaContato')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao" required>
          Descrição da Oportunidade
        </Label>
        <Textarea
          id="descricao"
          placeholder="Oportunidade de fornecimento de software para gestão empresarial. Contato direto com o diretor de TI..."
          rows={4}
          error={errors.descricao?.message}
          {...register('descricao')}
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
        Criar Indicação
      </Button>
    </form>
  );
}
