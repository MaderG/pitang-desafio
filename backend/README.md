# Backend

Este repositório contém o backend de uma aplicação para agendamentos de vacinas. A aplicação é construída utilizando Node.js, TypeScript e Prisma ORM, oferecendo diversas funcionalidades para gerenciar agendamentos de vacinas.

## Índice

- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Executar](#como-executar)
- [Testes](#testes)

## Sobre
A aplicação Pitang Vacina foi desenvolvida como desafio do processo seletivo da empresa Pitang. O objetivo é criar uma API robusta e eficiente para o gerenciamento de agendamentos de vacinas.

## Tecnologias Utilizadas
- **Node.js**
- **TypeScript**
- **Prisma ORM**
- **Express**
- **Zod**
- **Jest**

## Estrutura de Pastas

- **prisma/**
  - **migrations/**: Contém as migrações do banco de dados.
  - **schema.prisma**: Esquema do Prisma ORM.

- **src/**
  - **controller/**
    - **appointment.controller.ts**: Controlador para gerenciar agendamentos.
  - **env/**
    - **env.ts**: Configurações de variáveis de ambiente.
  - **errors/**
    - Contém classes de erros personalizados, como `AlreadyBookedError.ts`, `AppointmentNotExistsError.ts`, etc.
  - **lib/**
    - **prisma.ts**: Configuração do Prisma ORM.
  - **routes/**
    - **appointment.routes.ts**: Definição das rotas relacionadas a agendamentos.
  - **services/**
    - **availableAppointment.service.ts**: Serviço para listar agendamentos disponíveis.
    - **createAppointment.service.ts**: Serviço para criar novos agendamentos.
    - **listAppointment.service.ts**: Serviço para listar agendamentos.
    - **updateAppointment.service.ts**: Serviço para atualizar agendamentos.
  - **types/**
    - Contém definições de tipos TypeScript, como `AppointmentInput.ts`, `AppointmentQuery.ts`, etc.
  - **utils/**
    - **constants.ts**: Constantes utilizadas na aplicação.
    - **dateUtils.ts**: Utilitários para manipulação de datas.
    - **handleErrorResponse.ts**: Função para manipular respostas de erro.
    - **statusUtils.ts**: Utilitários para manipulação de status.
  - **zod/**
    - Contém schemas de validação utilizando Zod.
  - **index.ts**: Arquivo principal.
  - **app.ts**: Configuração da aplicação Express.
  - **server.ts**: Inicialização do servidor.

- **test/**
  - Contém os testes da aplicação, como `appointment.controller.spec.ts`, `availableAppointment.service.spec.ts`, etc.

## Como Executar

1. Clone o repositório:

    ```sh
    git clone https://github.com/MaderG/pitang-desafio.git
    ```

2. Instale as dependências:

    ```sh
    cd backend
    npm install
    ```

    Certifique-se de que todas as dependências do Prisma estão listadas no `package.json`.

3. Configure o banco de dados e variáveis de ambiente:
    - Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias, conforme o exemplo fornecido em `.env.example`.
    - Adicione as seguintes variáveis de ambiente, conforme o exemplo fornecido em `.env.example`:
      ```sh
      PORT= <porta em que sua aplicação irá rodar>
      DATABASE_URL= <URL de conexão com seu banco de dados>
      ```

4. Gere o cliente Prisma:

    ```sh
    npm run prisma:generate
    ```

    Este comando gera o cliente Prisma necessário para interagir com o banco de dados a partir do seu esquema Prisma.

5. Execute as migrações do banco de dados:

    ```sh
    npm run prisma:migrate
    ```

    Este comando aplica as migrações ao seu banco de dados, estruturando-o conforme definido em seus arquivos de migração.

6. Inicie a aplicação:
    ```sh
    npm start
    ```
    
    Inicia o servidor na porta especificada no arquivo `.env`.

A API estará disponível em `http://localhost:PORT`.

## Testes

Este projeto inclui testes unitários e de integração para garantir a qualidade e o funcionamento correto dos serviços e controladores. Os testes são escritos utilizando a biblioteca [Jest](https://jestjs.io/).

### Executando os Testes

Para executar todos os testes, utilize o comando:

  ```sh
  npm run test
  ```

### Cobertura de Testes
Para gerar um relatório de cobertura de testes, utilize o comando:
  ```sh
  npm run test:coverage
  ```
Isso irá gerar um relatório detalhado sobre a cobertura dos testes, indicando quais partes do código foram testadas e quais não foram.

### Exemplo de testes
Aqui estão alguns exemplos de comandos para executar testes específicos:

- Executar um teste específico:
    ```sh
    npm run test src/test/appointment.controller
    ```

- Executar testes em modo watch (para desenvolvimento contínuo):
    ```sh
    npm run test:watch
    ```

---
