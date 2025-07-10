## Visão Geral

Este projeto é uma aplicação de back-end desenvolvida com **Express.js**, projetada para oferecer serviços robustos e escaláveis. A integração com o **Supabase** permite um gerenciamento eficiente de dados, enquanto os dados locais são armazenados em arquivos JSON para acesso rápido e fácil.

---

## Estrutura do Projeto

### API (Express.js)

- **server.js:** O coração da aplicação, responsável por iniciar o servidor e configurar as rotas.
- **auth.js:** Middleware dedicado à autenticação, garantindo que apenas usuários autorizados acessem as rotas protegidas.

### Controllers

- **usuarioController.js:** Administra todas as operações relacionadas aos usuários, desde o registro até a exclusão.
- **climaController.js:** Processa e fornece dados climáticos, essenciais para várias funcionalidades do projeto.
- **alertaController.js:** Gerencia alertas, permitindo notificações eficientes e em tempo real.

### Serviços

- **supabaseClient.js:** Serve como a ponte entre a aplicação e o Supabase, facilitando operações de banco de dados com segurança e rapidez.

### Dados Locais

- **alertas.json & usuarios.json:** Arquivos que armazenam dados de alertas e usuários localmente, permitindo operações offline e rápidas.

---

## Funcionalidades

### Rotas Disponíveis

- **Usuários:**
  - Obtenha e gerencie informações de usuários com endpoints RESTful.

- **Clima:**
  - Acesse dados climáticos atualizados, essenciais para apps de previsão do tempo.

- **Alertas:**
  - Crie e gerencie alertas personalizados para manter os usuários informados.

### Segurança

- Autenticação robusta via middleware, utilizando tokens JWT para proteger dados sensíveis.

---

## Desenvolvimento e Contribuição

### Como Contribuir

- **Fork e Pull Requests:** Incentivamos a colaboração através de forks e pull requests, garantindo que cada contribuição seja revisada e integrada de forma eficaz.

### Diretrizes

- Mantenha o código limpo e bem documentado.
- Siga as melhores práticas de desenvolvimento para garantir a escalabilidade e manutenção do projeto.

---

## Licenciamento e Suporte

### Licença

- Este projeto é licenciado sob a **MIT License**, permitindo ampla liberdade de uso e modificação.

---

## Diagramas C4

### Visão Geral do Sistema

<img width="3250" height="3840" alt="diag" src="https://github.com/user-attachments/assets/c0520353-9176-479a-a07e-1ae8183eaef5" />


Este diagrama ilustra a interação básica entre o usuário, a API back-end desenvolvida em Node.js com Express, e o Supabase para autenticação e gestão de dados.

### Detalhamento da API

<img width="3516" height="3840" alt="diag Container" src="https://github.com/user-attachments/assets/521e55f5-f112-402b-af64-493cadb10295" />


Este diagrama detalha como o usuário interage com a API Express. Mostra a entrada principal no server.js, o uso de middleware para autenticação, e como os controladores processam as requisições, interagindo tanto com armazenamento local quanto com serviços externos.

### Fluxo de Dados

<img width="3840" height="3804" alt="diag componentes" src="https://github.com/user-attachments/assets/d5fd9371-ebbc-4e73-855e-206b17416b59" />

Este diagrama apresenta o fluxo de dados através da API Web, desde o usuário até o armazenamento externo no Supabase e local nos arquivos JSON. Destaca a importância da camada de autenticação e dos controladores na gestão de dados e serviços.
