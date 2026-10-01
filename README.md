# Case Técnico — Gestão de Leads com IA

## O que eu construí

Desenvolvi uma aplicação para gerenciamento de leads de uma imobiliária, com o objetivo de centralizar as informações dos contatos e facilitar o acompanhamento comercial.

A aplicação permite visualizar os leads cadastrados, filtrar por status, acompanhar indicadores gerais e consultar informações como origem do lead, telefone, data de criação e imóvel de interesse.

Também implementei uma funcionalidade de IA que, a partir do nome do lead e do imóvel de interesse, gera uma sugestão de primeira mensagem personalizada. A mensagem pode ser editada pelo usuário antes de ser salva no banco de dados, permitindo que a IA funcione como apoio ao atendimento, sem substituir a decisão do usuário.

## Ferramentas escolhidas e por quê

Inicialmente utilizei o **Lovable** para acelerar a criação da interface e estruturar a aplicação. A ferramenta gerou de forma autônoma a base utilizando **React + TypeScript** e **Tailwind CSS**, o que permitiu começar rapidamente com uma aplicação funcional e uma interface responsiva.

Aproveitei a estrutura criada pelo Lovable e, principalmente, a organização e tipagem oferecidas pelo **TypeScript** para desenvolver a integração com o agente de IA previamente planejado. Isso facilitou a organização das funções responsáveis pela geração e pelo salvamento das mensagens dos leads.

Para o banco de dados, utilizei o **Supabase**, que oferece PostgreSQL e uma integração simples com aplicações web. Além de armazenar os leads, utilizei o Supabase para salvar as mensagens geradas pela IA.

Na parte de inteligência artificial, utilizei uma **Supabase Edge Function** para manter a comunicação com o modelo no lado do servidor. Para acessar o modelo utilizei o **OpenRouter**, através do SDK da OpenAI, evitando expor a chave da API no frontend.

## Análise dos dados

Além da construção da aplicação, realizei algumas consultas no banco de dados para entender melhor os leads cadastrados.

### Qual origem gerou mais leads?

Utilizei a seguinte consulta:

```sql
SELECT
    origem_do_lead AS origem,
    COUNT(*) AS total_leads
FROM public.leads
GROUP BY origem_do_lead
ORDER BY total_leads DESC;
```

**Resultado:**

| Origem    | Total de leads |
| --------- | -------------: |
| Site      |             11 |
| Indicação |             10 |
| WhatsApp  |              9 |

O **site foi a origem que gerou mais leads**, com 11 registros. A indicação ficou bem próxima, com 10, enquanto o WhatsApp gerou 9 leads.

### Qual o percentual de leads qualificados em cada origem?

Para analisar não apenas a quantidade de leads, mas também quantos chegaram ao status de qualificado, utilizei:

```sql
SELECT
    origem_do_lead AS origem,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE status = 'qualificado') AS leads_qualificados,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'qualificado') * 100.0 / COUNT(*),
        2
    ) AS percentual_qualificados
FROM public.leads
GROUP BY origem_do_lead
ORDER BY percentual_qualificados DESC;
```

**Resultado:**

| Origem    | Total de leads | Leads qualificados | % qualificados |
| --------- | -------------: | -----------------: | -------------: |
| Indicação |             10 |                  5 |         50,00% |
| WhatsApp  |              9 |                  2 |         22,22% |
| Site      |             11 |                  2 |         18,18% |

Um ponto interessante encontrado foi que a origem com maior volume de leads não foi a que apresentou a maior taxa de qualificação.

O **site trouxe 11 leads**, sendo o maior volume, mas apenas 18,18% foram qualificados. Já a **indicação trouxe 10 leads e teve 50% de qualificação**, ou seja, metade dos leads dessa origem chegou ao status de qualificado.

### Outros padrões relevantes observados

**1. Maior volume não significa necessariamente maior qualidade**

O site foi responsável pelo maior número de leads, mas apresentou uma taxa de qualificação menor que a indicação. Isso mostra que analisar apenas a quantidade de contatos pode não ser suficiente para entender o desempenho de cada origem.

**2. Leads por indicação apresentaram uma taxa de qualificação maior**

Dos 10 leads vindos por indicação, 5 foram qualificados. Em comparação, o site teve 11 leads, mas apenas 2 foram qualificados.

Esse resultado mostra como uma análise simples do banco pode revelar diferenças importantes entre os canais de aquisição e ajudar a entender não apenas de onde vêm os leads, mas também quais deles avançam no processo comercial.

## Dificuldades encontradas

Uma das principais dificuldades foi justamente a integração do banco de dados com o projeto dentro do Lovable. Fiz diversas tentativas para conectar e fazer toda a comunicação funcionar corretamente, mas encontrei problemas que acabaram tornando o processo mais demorado do que o desenvolvimento da própria funcionalidade.

Depois de algumas tentativas, optei por salvar o projeto localmente e continuar o desenvolvimento no meu ambiente. Isso me deu mais controle sobre os arquivos, variáveis de ambiente, chamadas para o Supabase e principalmente sobre a Edge Function responsável pela integração com a IA.

Também encontrei uma dificuldade relacionada à utilização da API da OpenAI, pois a conta utilizada não permitia realizar as requisições necessárias. Como alternativa, utilizei o OpenRouter e consegui manter a mesma ideia da solução sem precisar alterar a arquitetura principal do projeto.

Esses problemas acabaram sendo importantes durante o desenvolvimento porque precisei pesquisar, testar alternativas e entender melhor como cada parte da aplicação se comunica.

## O que eu faria diferente com mais tempo

Com mais tempo, eu melhoraria principalmente a estrutura e a experiência de uso da aplicação.

Criaria uma arquitetura ainda mais organizada, adicionaria testes automatizados para as principais funcionalidades e melhoraria o tratamento de erros, principalmente nas chamadas da IA e nas operações com o banco de dados.

Também evoluiria o agente de IA para considerar mais informações do lead, permitindo mensagens ainda mais personalizadas, além de criar um histórico das mensagens geradas e utilizadas.

Por fim, faria uma etapa maior de refinamento visual e usabilidade, incluindo uma experiência melhor para o acompanhamento dos leads no dia a dia.

## Conclusão

O principal objetivo deste projeto foi construir uma solução funcional de ponta a ponta, passando pelo banco de dados, interface e integração com inteligência artificial.

Mais do que chegar ao resultado final, o desenvolvimento me permitiu praticar a integração entre diferentes tecnologias e, principalmente, lidar com problemas reais durante o processo, buscando alternativas quando a primeira abordagem não funcionou.

A análise dos dados também mostrou como a aplicação pode ir além do simples cadastro de leads, permitindo extrair informações que podem apoiar a compreensão dos canais de aquisição e do comportamento dos leads.
