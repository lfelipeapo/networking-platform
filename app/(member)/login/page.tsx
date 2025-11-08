'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/lib/contexts/MemberContext';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useMember();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email);
      router.push('/indicacoes');
    } catch (err) {
      setError('Email não encontrado. Verifique se você completou seu cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login de Membro</CardTitle>
          <CardDescription>
            Entre com seu email para acessar o sistema de indicações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Entrar
            </Button>

            <p className="text-center text-sm text-gray-600">
              Ainda não é membro?{' '}
              <a href="/intencao" className="text-blue-600 hover:underline">
                Manifeste seu interesse
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
