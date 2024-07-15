# Sistema de Agendamento de Vacinação COVID-19

## Índice

- [Descrição](#descrição)
- [Regras de Uso](#regras-de-uso)
- [Regras de Negócio](#regras-de-negócio)
- [Regras de Execução](#regras-de-execução)
- [Como Executar](#como-executar)
- [Critérios de Avaliação](#critérios-de-avaliação)
- [Critérios de Destaque](#critérios-de-destaque)

## Descrição
Este repositório é parte do desafio proposto pela empresa Pitang como parte do processo seletivo da empresa. A aplicação será um portal para agendamento de vacinação contra COVID-19. A aplicação consiste em um portal onde os pacientes podem agendar seus horários de vacinação e uma página para consulta dos agendamentos realizados.

## Regras de Uso
- O agendamento deve ser feito em uma página por um formulário.
- A disponibilidade das vagas são de 20 por dia.
- Cada horário só tem a disponibilidade de 2 agendamentos para o mesmo horário.
- Deve ser criada uma página para consultar os agendamentos.
- O resultado dos agendamentos deve ser agrupado por dia e hora do agendamento.
- O intervalo de tempo entre um agendamento e outro é de 1 hora.

## Regras de Negócio
- O paciente deve informar seu nome, data de nascimento e dia e horário para o agendamento.
- Deverá ser checado se o formulário foi preenchido.
- Os dados do paciente/agendamentos devem ser armazenados em memória.
- Exibir mensagem de agendamento criado com sucesso dentro de um modal/popup.
- Dentro da página para consultar os agendamentos deve ser possível visualizar a listagem de agendamentos feitos e informar se o agendamento foi realizado ou não, e qual a conclusão do atendimento (se foi realizado).
- Quando o usuário der F5 ou recarregar a página os dados não podem ser perdidos.

## Regras de Execução
- Portal desenvolvido em React.
- Utilização do react-datepicker para gerenciamento de datas.
- API desenvolvida em Node.js para receber os dados do portal.
- FetchAPI utilizado como cliente HTTP.
- Utilização de Formik (com Yup) ou React Hook Forms (com ZOD) para validação de formulário.
- ContextAPI para exibição de modais/popups.

## Como Executar

Para executar o frontend e backend, siga as instruções de configuração que estão nos respectivos readmes das pastas `frontend` e `backend`. 


## Critérios de Avaliação
- Organização do código e boas práticas em Node.js/React (clean code/SOLID).
- Organização dos commits seguindo os princípios do gitflow.
- Estruturação do repositório com separação clara de Front-end e Back-end.
- Implementação de testes no React usando React Testing Library.
- Cumprimento de todas as regras definidas em "Regras de execução".

## Critérios de Destaque
- Utilização de TypeScript.
- Implementação de testes no Back-end.
