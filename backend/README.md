# Backend

Este repositório contém o backend de uma aplicação para agendamentos de vacinas. A aplicação é construída utilizando Node.js, TypeScript e Prisma ORM, oferecendo diversas funcionalidades para gerenciar agendamentos de vacinas.

## Índice

- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Executar](#como-executar)
- [Testes](#testes)
  - [Preparação do Banco de Dados de Testes](#preparação-do-banco-de-dados-de-testes)
  - [Executando os Testes](#executando-os-testes)
  - [Exemplos de Comandos para Executar Testes Específicos](#exemplos-de-comandos-para-executar-testes-específicos)
  - [Rodando Testes Unitários](#rodando-testes-unitários)
  - [Rodando Testes de Integração](#rodando-testes-de-integração)
  - [Rodando Testes End-to-End (E2E)](#rodando-testes-end-to-end-e2e)
  - [Cobertura de Testes](#cobertura-de-testes)
- [Retornando ao Banco de Dados Normal](#retornando-ao-banco-de-dados-normal)
- [Documentação da API](#documentação-da-api)

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
  - Contém os testes unitários, e2e e de integração da aplicação.


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
      PORT=3000
      DATABASE_URL=file:./dev.db
      NODE_ENV=development
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
    npm run dev
    ```
    
    Inicia o servidor na porta especificada no arquivo `.env`.

A API estará disponível em `http://localhost:3000`.

## Testes

Este projeto inclui testes unitários e de integração para garantir a qualidade e o funcionamento correto dos serviços e controladores. Os testes são escritos utilizando a biblioteca [Jest](https://jestjs.io/).

### Preparação do Banco de Dados de Testes

Antes de iniciar os testes e2e, é necessário configurar o ambiente e preparar o banco de dados de testes. Isso inclui aplicar migrações e popular o banco de dados com dados necessários para os testes.

Crie um arquivo `.env.test` na raiz do projeto e adicione as variáveis de ambiente necessárias, conforme o exemplo fornecido em `.env.test.example`.
  ```sh
  DATABASE_URL=file:./test.db
  NODE_ENV=test
  PORT=5000
  ```
  
Execute o seguinte comando para migrar para o banco de dados de testes:

  ```sh
  npm run prisma:migrate:test
  ```

### Executando os Testes

Para executar todos os testes(exceto e2e), utilize o comando:

  ```sh
  npm run test
  ```

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

### Rodando Testes Unitários

Para garantir que a aplicação funcione conforme esperado, execute os testes unitários:

  ```sh
  npm run test:unit
  ```

### Rodando Testes de Integração

Para garantir que a aplicação funcione conforme esperado em um ambiente integrado, execute os testes de integração:

  ```sh
  npm run test:integration
  ```

### Rodando Testes End-to-End (e2e)

Para garantir que a aplicação funcione conforme esperado em um ambiente que simula a produção, é importante executar testes e2e

  ```sh
  npm run test:e2e
  ```

### Cobertura de Testes
Para gerar um relatório de cobertura de testes, utilize o comando:
  ```sh
  npm run test:coverage
  ```
Isso irá gerar um relatório detalhado sobre a cobertura dos testes, indicando quais partes do código foram testadas e quais não foram.

## Retornando ao Banco de Dados Normal
Após os testes e2e, você pode querer retornar ao desenvolvimento normal ou executar outros tipos de testes que utilizam o banco de dados de desenvolvimento. Certifique-se de que suas configurações de ambiente estejam apontando para o banco de dados de desenvolvimento, não para o banco de testes. Se necessário, execute as migrações novamente no banco de dados de desenvolvimento:
  ```sh
  npm run prisma:migrate
  ```

## Documentação da API
A documentação da API foi gerada utilizando Swagger. Você pode visualizar e interagir com a API através da interface Swagger UI.

Para acessar a documentação Swagger, inicie a aplicação e navegue até:

  ```sh
  http://localhost:3000/docs
  ```
  
Substitua `3000` pela porta configurada em seu arquivo `.env` se preciso.

---
