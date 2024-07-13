# Frontend

Este repositório contém o frontend de uma aplicação para agendamentos de vacinas. A aplicação é construída usando React e TypeScript e fornece várias páginas e componentes para facilitar o agendamento, visualização e gerenciamento de vacinas.

## Índice

- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Páginas](#páginas)
- [Principais Componentes](#principais-componentes)
- [Outros](#outros)
- [Como Executar](#como-executar)
- [Testes](#testes)

## Sobre
A aplicação Pitang Vacina foi desenvolvida como desafio do processo seletivo da empresa Pitang. O objetivo é criar uma solução eficiente e intuitiva para o agendamento de vacinas, permitindo que os usuários gerenciem seus agendamentos de forma prática e organizada.


## Tecnologias Utilizadas
- **React**
- **TypeScript**
- **Chakra UI**
- **Zod**
- **React Testing Library**
- **Jest**

## Funcionalidades

-   **Agendamento de Vacinas:** Permite aos usuários selecionar uma vacina, escolher uma data e horário disponíveis.
-   **Visualização de Agendamentos:** Exibe uma lista de agendamentos atuais e permite gerenciar esses agendamentos.
-   **Atualização de Status:** Os usuários podem atualizar o status dos seus agendamentos (por exemplo, marcar como concluído).
-   **Filtros e Ordenação:** Inclui modais e cabeçalhos de tabelas que permitem filtrar e ordenar os dados apresentados.
-   **Notificações de Sucesso:** Exibe mensagens de sucesso após ações bem-sucedidas, como a confirmação de um agendamento.

## Páginas

### Home.tsx

A página inicial oferece uma visão geral dos agendamentos de vacinas. Nela, os usuários podem ver 

### VaccineAppointment.tsx

Esta página permite que os usuários agendem novas vacinas. Inclui formulários para selecionar a vacina, data e horário desejados.

### History.tsx

A página de histórico exibe a lista de agendamentos feitos. Onde o usuário pode visualizar o nome, status, hora, data e ações. Nela, o usuário pode atualizar o status do agendamento. Filtrar por dia e status. E ordenar por nome, data, hora(quando um dia é selecionado), 

## Principais Componentes

### Modal Components

Os componentes de modal são utilizados para exibir janelas modais na aplicação.

#### FilterModal.tsx

Um modal utilizado para filtrar dados do agendamento, permitindo uma busca mais refinada.

#### SuccessModal.tsx

Um modal para exibição de mensagens de sucesso, utilizado para informar o usuário sobre o sucesso no agendamento.

### Navbar.tsx

A barra de navegação principal que permite aos usuários navegar entre as diferentes páginas da aplicação.

### Footer.tsx

O rodapé da aplicação, que contém informações adicionais.

### SortableHeaders.tsx

Componentes para cabeçalhos de tabelas que podem ser ordenados, facilitando a organização dos dados apresentados.

### StatusUpdateButton.tsx

Um botão para atualizar o status dos agendamentos, permitindo que os usuários modifiquem o estado de suas marcações.

## Outros

### context

Este diretório contém o ModelContext que é utilizado para gerenciar o estado dos modais na aplicação. Ele fornece funcionalidades para abrir e fechar modais, além de definir o título e a mensagem do modal.

### hooks

Aqui estão os custom hooks que encapsulam lógica reutilizável, facilitando a manutenção e a leitura do código.

### services

O serviço para comunicação com o backend está neste diretório. Ele gerencia todas as requisições HTTP necessárias para a aplicação.

### utils

Utilitários gerais usados na aplicação, incluindo funções auxiliares e constantes.

### types

Definições de tipos TypeScript utilizados em toda a aplicação para garantir a tipagem estática e reduzir erros.

### zod

Schemas de validação utilizando a biblioteca Zod para garantir que os dados recebidos e enviados estão no formato correto.

## Como Executar

1. Clone o repositório:

    ```sh
    git clone https://github.com/MaderG/pitang-desafio.git
    ```

2. Instale as dependências:

    ```sh
    cd frontend
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto e adicione a URL do backend:

    ```sh
    VITE_BACKEND_URL=https://sua-url-do-backend.com
    ```

4. Inicie a aplicação:
    ```sh
    npm start
    ```

A aplicação estará disponível em `http://localhost:5173`.

## Testes

Este projeto inclui testes unitários para garantir a qualidade e o funcionamento correto dos componentes. Os testes são escritos utilizando a biblioteca [React Testing Library](https://testing-library.com/) e [Jest](https://jestjs.io/).

### Executando os Testes

Para executar os testes, utilize o comando:
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
npm run test src/components/modal/SuccessModal
```

- Executar testes em modo watch (para desenvolvimento contínuo):
```sh
npm run test:watch
```

### Abrangência dos testes
Os testes abrangem várias partes da aplicação, incluindo:
- **Componentes:** Testes para garantir que os componentes renderizem corretamente e respondam a interações do usuário.
- **Hooks:** Testes para verificar a lógica encapsulada em hooks personalizados.
- **Páginas:** Testes para assegurar que as páginas renderizem e funcionem conforme esperado.
- **Serviços:** Testes para validar as funções de comunicação com o backend.