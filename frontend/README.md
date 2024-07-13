# Frontend

Este repositório contém o frontend de uma aplicação para agendamentos de vacinas. A aplicação é construída usando React e TypeScript e fornece várias páginas e componentes para facilitar o agendamento, visualização e gerenciamento de vacinas.

## Índice

- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estrutura de Pastas](#estrutura-de-pastas)
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

## Estrutura de Pastas

- **frontend/**
  - **public/**: Contém arquivos svg para estilização das páginas.
  - **src/**: Código-fonte do projeto.
    - **components/**: Contém os componentes reutilizáveis e seus testes.
      - **footer/** Componente Footer.
      - **modal/**  Componentes de modais.
        - **filtermodal/** Contém o componente FilterModal para filtrar dados do agendameto.
        - **successmodal/** Contém o componente SuccessModal para exibição de mensagens de sucesso.
      - **navbar/** Componente Navbar para navegação principal.
      - **sortableHeader/**: Componentes para cabeçalhos ordenáveis.
      - **statusUpdateButton/**: Botão de atualização de status.
    - **context/**
      - **ModalContext.tsx**: Contexto para gerenciar o estado dos modais na aplicação.
    - **env/**
      - **env.ts**: Configurações de variáveis de ambiente.
    - **hooks/**: Hooks customizados e seus testes.
      - **useAvailableDates/** Hook useAvailableDates para gerenciar datas disponíveis.
      - **useAvailableHours/**: Hook useAvailableHours para gerenciar horas disponíveis.
      - **useLocalStorageManager/**: Hook useLocalStorageManager para gerenciar dados no local storage.
      - **useUnavailableDays/**: Hook useUnavailableDays para gerenciar dias indisponíveis.
    - **pages/**: Contém as páginas da aplicação e seus testes.
      - **history/** Página History para visualização de agendamentos feitos.
      - **home/**: Página Home para visão geral dos agendamentos de vacinas.
      - **vaccineAppointment/**: Página VaccineAppointment para agendar novas vacinas.
    - **services/**
      - **api.ts**: Serviço para comunicação com o backend.
    - **types/**: Contém definições de tipos TypeScript como `CreateVaccineAppointment.ts` e `SortableHeaderProps.ts`.
    - **utils/**: Utilitários gerais usados na aplicação.
      - **constants/**
        - **index.ts**: Contém constantes utilizadas na aplicação.
      - **formatDate.ts**: Função para formatar datas.
      - **formatTime.ts**: Função para formatar horas.
      - **statusUtils.ts**: Utilitários para manipulação de status.
    - **zod/**: Contém schemas de validação utilizando Zod.
    - **App.tsx**: Componente principal da aplicação.
    - **main.tsx**: Arquivo de entrada principal.
    - **setupTests.ts**: Configuração para os testes.

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

    Certifique-se de que todas as dependências do Prisma estão listadas no `package.json`.

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

---