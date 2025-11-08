import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          Plataforma de Gestão para Grupos de Networking
        </h1>
        <p className="mb-12 text-xl text-gray-600">
          Digitalize e otimize a gestão dos membros e suas interações
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Manifestar Interesse</CardTitle>
              <CardDescription>
                Deseja participar do nosso grupo de networking?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/intencao">
                <Button className="w-full">Enviar Intenção</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Área Administrativa</CardTitle>
              <CardDescription>
                Gerencie intenções e membros do grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login">
                <Button variant="secondary" className="w-full">
                  Acessar Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="border-2 border-green-500">
            <CardHeader>
              <CardTitle>Área do Membro</CardTitle>
              <CardDescription>
                Acesse o sistema de indicações de negócios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full">Fazer Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Funcionalidades
          </h2>
          <div className="grid gap-4 text-left md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Gestão de Membros
              </h3>
              <p className="text-sm text-gray-600">
                Formulário de intenção, aprovação administrativa e cadastro
                completo
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Sistema de Indicações
              </h3>
              <p className="text-sm text-gray-600">
                Crie e gerencie indicações de negócios entre membros
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Acompanhamento
              </h3>
              <p className="text-sm text-gray-600">
                Monitore o status das indicações e interações do grupo
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Desenvolvido com Next.js, React, TypeScript e PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}
