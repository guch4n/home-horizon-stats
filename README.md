# Lead Insights Hub

Crie uma aplicação web responsiva para um painel simples de gestão e análise de leads imobiliários.

1. Objetivo

O sistema será um pequeno CRM/dashboard para visualização dos leads cadastrados em uma tabela do Supabase.

A aplicação NÃO precisa permitir o cadastro de novos leads neste momento.

O principal objetivo é :

Listar os leads existentes;

Buscar os dados diretamente no Supabase;

Permitir filtrar os leads por status;

Exibir informações resumidas sobre os leads;

Apresentar os dados de forma visual, limpa e profissional.

2. Referência visual

Use como referência visual o site da CRI Soluções Imobiliárias:

https://www.imobiliariacri.com.br/

Não copie literalmente o site. Utilize apenas como inspiração para identidade visual, organização, sensação de produto imobiliário premium, espaçamento, tipografia, cards e navegação.

Priorize:

Visual moderno;

Elegante;

Profissional;

Limpo;

Boa utilização de espaço em branco;

Interface intuitiva;

Aparência de sistema profissional utilizado por uma imobiliária.

Evite criar uma interface excessivamente colorida ou com aparência de sistema administrativo genérico.

3. Estrutura da aplicação

Criar uma página principal chamada:

"Dashboard de Leads"

A página deve possuir:

Header

No topo:

Logo/nome "CRI Soluções Imobiliárias";

Texto secundário "Dashboard de Leads";

Um botão/ícone para atualizar os dados.

O botão de atualização deve buscar novamente os dados do Supabase.

Resumo / Cards

Logo abaixo do header, criar cards com indicadores:

Total de Leads

Novos

Em Contato

Qualificados

Perdidos

Esses números devem ser calculados dinamicamente a partir dos dados existentes no Supabase.

NÃO utilizar números fixos/mockados.

Exemplo:

Total de Leads
30

Novos
9

Em Contato
8

Qualificados
9

Perdidos
4

Os números acima são apenas exemplos visuais. A aplicação deve sempre calcular os valores reais existentes no banco.

4. Filtros

Criar uma área chamada:

"Filtrar Leads"

Permitir filtrar por:

Todos

Novo

Em contato

Qualificado

Perdido

O filtro deve utilizar o campo "status" vindo diretamente do Supabase.

Quando o usuário selecionar um status, a tabela deve mostrar somente os leads daquele status.

Também deve existir uma opção "Todos" para remover o filtro.

Adicionar também um campo de busca por nome ou telefone.

A busca deve funcionar de forma simples e intuitiva.

5. Tabela de Leads

Criar uma tabela responsiva com os dados vindos do Supabase.

Tabela:

| Nome | Telefone | Origem | Status | Data de criação | Imóvel de interesse |

Utilizar os seguintes campos da tabela "leads":

nome

telefone

origem_do_lead

status

data_de_criacao

imovel_de_interesse

Não criar campos diferentes desses sem necessidade.

6. Status

Os status existentes no banco são:

novo

em contato

qualificado

perdido

Exibir o status visualmente utilizando badges/chips.

Sugestão:

Novo → badge discreto de destaque

Em contato → badge neutro

Qualificado → badge de sucesso

Perdido → badge de alerta

As cores devem ser suaves e profissionais, evitando cores excessivamente fortes.

IMPORTANTE:

O status NÃO deve ser definido pelo frontend.

O frontend deve simplesmente exibir o valor existente no Supabase.

7. Origem do Lead

Os valores possíveis para "origem_do_lead" são:

site

whatsapp

indicação

Também apresentar a origem através de badges/chips ou texto visualmente destacado.

8. Resumos e indicadores

Além dos cards principais, criar uma seção chamada:

"Resumo dos Leads"

Apresentar algumas informações simples:

Leads por origem

Mostrar a quantidade de leads provenientes de:

Site

WhatsApp

Indicação

Pode ser apresentado através de um gráfico de barras ou cards.

Leads por status

Mostrar visualmente a distribuição:

Novo

Em contato

Qualificado

Perdido

Pode utilizar um gráfico simples, como gráfico de barras ou donut.

Os gráficos devem ser alimentados pelos dados reais do Supabase.

Não utilizar dados estáticos.

9. Indicadores adicionais

Criar uma pequena seção com insights calculados a partir dos dados.

Exemplos:

Total de leads;

Percentual de leads qualificados;

Percentual de leads perdidos;

Origem com maior quantidade de leads;

Origem com maior quantidade de leads qualificados.

Exemplo visual:

"Taxa de qualificação"

30%

"Maior origem"

Site

"Mais qualificados"

Indicação

Esses valores devem ser calculados dinamicamente.

10. Banco de dados / Supabase

A aplicação deve utilizar Supabase como fonte de dados.

Tabela:

leads

Campos:

nome: text
telefone: text
origem_do_lead: text
status: text
data_de_criacao: date
imovel_de_interesse: text

Existe também uma coluna "id" na tabela, que pode ser utilizada como identificador único dos registros.

Criar a integração utilizando o cliente oficial do Supabase.

As credenciais devem ser configuradas através de variáveis de ambiente.

Não colocar chave do Supabase diretamente no código-fonte.

Utilizar:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

11. Consulta inicial

Ao abrir o dashboard, buscar os registros da tabela "leads" no Supabase.

Ordenar os leads pela data_de_criacao, mostrando os mais recentes primeiro.

A aplicação deve possuir estados para:

Carregando;

Dados carregados;

Nenhum lead encontrado;

Erro ao consultar o Supabase.

Exibir mensagens amigáveis nesses estados.

12. Atualização

Adicionar botão "Atualizar".

Ao clicar:

Fazer nova consulta ao Supabase;

Atualizar a tabela;

Recalcular os indicadores;

Atualizar os gráficos.

Adicionar um pequeno feedback visual enquanto os dados estiverem sendo atualizados.

13. Responsividade

A interface deve funcionar bem em:

Desktop;

Tablet;

Celular.

No celular, a tabela pode se transformar em cards ou utilizar rolagem horizontal.

Os cards de indicadores devem se reorganizar automaticamente.

14. Experiência visual

Utilizar:

Cantos levemente arredondados;

Sombras muito sutis;

Tipografia moderna;

Espaçamento consistente;

Cards limpos;

Ícones discretos;

Microinterações suaves.

Não exagerar em animações.

A interface deve parecer um produto real e profissional.

15. Importante sobre os dados

NÃO criar leads fictícios no frontend.

NÃO utilizar arrays mockados como fonte principal dos dados.

NÃO colocar os números dos indicadores manualmente.

Todos os dados da tabela, filtros, indicadores e gráficos devem ser derivados dos registros reais da tabela "leads" no Supabase.

16. Tecnologias

Utilize uma stack moderna e simples, preferencialmente:

React

TypeScript

Tailwind CSS

Supabase

Biblioteca de componentes adequada, caso necessário

Biblioteca de gráficos adequada, caso necessário

Priorize código organizado e fácil de entender.

Separar responsabilidades entre:

componentes de interface;

serviço/cliente do Supabase;

lógica de cálculo dos indicadores;

filtros;

gráficos.

17. Resultado esperado

Ao final, quero uma única página de dashboard onde o usuário consiga:

Visualizar quantos leads existem;

Visualizar quantos estão em cada status;

Filtrar os leads por status;

Pesquisar por nome ou telefone;

Visualizar a origem de cada lead;

Visualizar o imóvel de interesse;

Analisar rapidamente a distribuição dos leads;

Identificar a origem com maior volume;

Identificar a origem com maior quantidade de leads qualificados;

Atualizar os dados diretamente do Supabase.

A prioridade é criar uma interface simples, bonita, profissional e funcional, sem adicionar funcionalidades desnecessárias neste primeiro momento.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d0fa4c29-ab8d-5b4c-be07-1a3babafcac5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
