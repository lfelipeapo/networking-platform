import { IntencaoForm } from '@/components/forms/IntencaoForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IntencaoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Grupo de Networking
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manifeste seu interesse em participar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Intenção de Participação</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para manifestar seu interesse em
              fazer parte do nosso grupo de networking focado em geração de
              negócios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntencaoForm />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Após o envio, sua solicitação será analisada por nossa equipe.
          </p>
          <p className="mt-1">
            Em caso de aprovação, você receberá um email com instruções para
            completar seu cadastro.
          </p>
        </div>
      </div>
    </div>
  );
}
