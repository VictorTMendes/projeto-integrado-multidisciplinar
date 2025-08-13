# Projeto Money Flow

Bem-vindos ao repositório do **Money Flow**, nosso gerenciador de finanças pessoais. Este projeto é um [Monorepo](https://monorepo.wiki/) que contém todas as nossas aplicações (Web, Mobile e Desktop) e a lógica compartilhada(Backend).

## Estrutura do Projeto

O código está organizado dentro da pasta `packages/`:

-   `/packages/web`: Contém a aplicação Web (front-end).
-   `/packages/mobile`: Contém a aplicação Mobile (Android).
-   `/packages/desktop`: Contém a aplicação Desktop.
-   `/packages/shared`: Contém a lógica de negócio, tipos e funções compartilhadas entre todas as aplicações, todo o backend.

## Equipe de Desenvolvimento

-   Guilherme da Silva Moreira
-   Matheus Oliveira da Silva
-   Gabriel Ferreira do Amaral
-   Victor Teixeira Mendes

## Primeiros Passos

1.  Baixem o GIT (se não tiver baixado): https://git-scm.com/downloads 
2.  Clone o repositório: `git clone https://github.com/VictorTMendes/projeto-integrado-multidisciplinar`
3.  Seja feliz e trabalhe!

## Dicas
	
🤝 Padrões de Versionamento e Colaboração
Para manter nosso projeto organizado e o histórico de alterações legível, toda a equipe deve seguir os padrões de nomenclatura para branches e mensagens de commits descritos abaixo.

🌿 Nomenclatura de Branches
Toda nova branch deve ser criada a partir de develop (exceto hotfix) e seguir o sistema de prefixos abaixo:

Prefixo	Propósito	Exemplo de Nome de Branch
feature/	Para desenvolver uma nova funcionalidade.	feature/cadastro-despesa
fix/	Para corrigir um bug em desenvolvimento.	fix/soma-incorreta-orcamento
hotfix/	Para corrigir um bug crítico em produção.	hotfix/login-quebrado-v1-2-1
chore/	Para tarefas de manutenção (ex: atualizar dependências).	chore/atualizar-react
docs/	Para adicionar ou alterar apenas a documentação.	docs/atualizar-readme-web
refactor/	Para refatorar código sem mudar seu comportamento.	refactor/componente-de-grafico

Export to Sheets
Padrão: Use nomes curtos, descritivos, em minúsculas e separe as palavras com hífen (kebab-case).

💬 Mensagens de Commits (Conventional Commits)
Seguimos o padrão Conventional Commits. A estrutura de toda mensagem de commit deve ser:

<tipo>(<escopo>): <descrição>

<tipo>: Define a categoria da alteração.
feat: Uma nova funcionalidade para o usuário.

fix: Uma correção de bug.

chore: Tarefas de manutenção, build, configuração, etc.

docs: Mudanças na documentação.

style: Alterações de formatação de código (ponto e vírgula, etc.).

refactor: Reescrita de código que não altera a funcionalidade.

perf: Melhoria de performance.

test: Adição ou correção de testes.

<escopo>: (Opcional) Define a parte do código que foi alterada.
Exemplos para nosso projeto: (web), (mobile), (desktop), (shared), (auth).

<descrição>: Descrição curta, em minúsculas e no imperativo.
Use "adiciona", "corrige", "remove" (e não "adicionado", "corrigido", "removido").

Não use ponto final.

✨ Exemplo de Fluxo na Prática
Cenário: Adicionar um gráfico de despesas na dashboard da aplicação web.

Nome da Branch:

feature/grafico-despesas-dashboard
Exemplos de Commits durante o desenvolvimento:

feat(shared): cria função para processar dados do gráfico
feat(web): adiciona componente do gráfico na dashboard
style(web): estiliza cores e legendas do gráfico
fix(web): corrige bug de renderização em telas menores
docs(web): documenta as propriedades do componente de gráfico