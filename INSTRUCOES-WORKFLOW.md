# Instruções para Adicionar o Workflow do GitHub Actions

Devido a restrições de permissão do GitHub App, o arquivo de workflow do CI/CD não pôde ser enviado automaticamente. Siga as instruções abaixo para adicionar manualmente:

## Opção 1: Via Interface do GitHub

1. Acesse o repositório: https://github.com/lfelipeapo/networking-platform
2. Clique na aba "Actions"
3. Clique em "set up a workflow yourself"
4. Cole o conteúdo do arquivo `.github/workflows/ci.yml` que está no projeto local
5. Commit o arquivo

## Opção 2: Via Git com Permissões Adequadas

Se você tiver permissões de workflow no GitHub:

```bash
cd networking-platform
git add .github/workflows/ci.yml
git commit -m "ci: adicionar workflow do GitHub Actions"
git push
```

## Conteúdo do Workflow

O arquivo `.github/workflows/ci.yml` está presente no projeto local e contém:

- **Lint Job**: Verifica formatação e qualidade do código
- **Test Job**: Executa todos os testes e gera relatório de cobertura
- **Type Check Job**: Valida tipagem TypeScript
- **Build Job**: Compila a aplicação para produção

O workflow é acionado automaticamente em push e pull requests nas branches `main` e `develop`.
