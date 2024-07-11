# Frontend

Este repositório contém o frontend de uma aplicação para agendamentos de vacinas. A aplicação é construída usando React e TypeScript e fornece várias páginas e componentes para facilitar o agendamento, visualização e gerenciamento de vacinas.

## Funcionalidades

-   **Agendamento de Vacinas:** Permite aos usuários selecionar uma vacina, escolher uma data e horário disponíveis.
-   **Visualização de Agendamentos:** Exibe uma lista de agendamentos atuais e permite gerenciar esses agendamentos.
-   **Atualização de Status:** Os usuários podem atualizar o status dos seus agendamentos (por exemplo, marcar como concluído).
-   **Filtros e Ordenação:** Inclui modais e cabeçalhos de tabelas que permitem filtrar e ordenar os dados apresentados.
-   **Notificações de Sucesso:** Exibe mensagens de sucesso após ações bem-sucedidas, como a confirmação de um agendamento.

## Páginas

### Home.tsx

A página inicial oferece uma visão geral dos agendamentos de vacinas. Nela, os usuários podem ver uma lista de seus agendamentos atuais e informações relevantes sobre as vacinas.

### VaccineAppointment.tsx

Esta página permite que os usuários agendem novas vacinas. Inclui formulários para selecionar a vacina, data e horário desejados.

### History.tsx

A página de histórico exibe uma lista de vacinas já administradas ao usuário. Inclui detalhes sobre cada vacinação, como data, tipo de vacina e local de administração.

## Principais Componentes

### Modal Components

Os componentes de modal são utilizados para exibir janelas modais na aplicação, como filtros e mensagens de sucesso.

#### FilterModal.tsx

Um modal utilizado para filtrar dados em tabelas, permitindo uma busca mais refinada.

#### SuccessModal.tsx

Um modal para exibição de mensagens de sucesso, utilizado para informar os usuários sobre ações bem-sucedidas na aplicação.

### Navbar.tsx

A barra de navegação principal que permite aos usuários navegar entre as diferentes páginas da aplicação.

### Footer.tsx

O rodapé da aplicação, que contém informações adicionais e links úteis.

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

Os serviços para comunicação com o backend estão neste diretório. Eles gerenciam todas as requisições HTTP necessárias para a aplicação.

### utils

Utilitários gerais usados na aplicação, incluindo funções auxiliares e constantes.

### types

Definições de tipos TypeScript utilizados em toda a aplicação para garantir a tipagem estática e reduzir erros.

### zod

Schemas de validação utilizando a biblioteca Zod para garantir que os dados recebidos e enviados estão no formato correto.

## Como Executar

1. Clone o repositório:

    ```sh
    git clone https://github.com/MaderG/pitang-desafio/tree/main
    ```

2. Instale as dependências:

    ```sh
    cd pitang-desafio
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
