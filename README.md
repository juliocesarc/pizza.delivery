# Pizza Delivery

Pizza Delivery é uma aplicação web desenvolvida com **Next.js**, **TypeScript**, **Tailwind CSS** e **Prisma**. Seu objetivo é facilitar o processo de pedidos de pizza online, oferecendo uma interface intuitiva e eficiente tanto para clientes quanto para administradores.

## Objetivo

O principal objetivo do Pizza Delivery é digitalizar e otimizar o processo de pedidos em pizzarias, permitindo que os clientes façam seus pedidos online de forma personalizada e que os administradores gerenciem esses pedidos de maneira eficaz.

## Funcionalidades

- **Cadastro de Pizzas**: Permite que os administradores adicionem, editem e removam pizzas do cardápio.
- **Personalização de Pedidos**: Clientes podem selecionar tamanhos, sabores e adicionais para suas pizzas.
- **Gerenciamento de Pedidos**: Visualização em tempo real dos pedidos realizados, com atualização de status (em preparação, a caminho, entregue).
- **Autenticação de Usuários**: Sistema de login e registro para clientes e administradores.
- **Responsividade**: Interface adaptada para diversos dispositivos, garantindo uma boa experiência tanto em desktops quanto em dispositivos móveis.

## Instalação de Dependências

Para configurar o ambiente de desenvolvimento do Pizza Delivery, siga os passos abaixo:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/juliocesarc/pizza.delivery.git

2. **Acesse o diretório do projeto**:

   ```bash
   cd pizza.delivery

3. **Instale as dependências**:

   ```bash
   npm install

## Passo a Passo para Executar a Aplicação

1. **Configuração das Variáveis de Ambiente:**
   - Crie um arquivo ```.env``` na raiz do projeto com as seguintes variáveis:
     
     ```bash
     DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
     NEXT_PUBLIC_API_URL=http://localhost:3000

   - Substitua ```usuario```, ```senha``` e ```nome_do_banco``` pelos dados correspondentes ao seu banco de dados PostgreSQL.

2. **Configuração do Banco de Dados com Prisma:**
   - Inicialize o Prisma e aplique as migrações para configurar o banco de dados:
     
     ```bash
     npx prisma migrate dev

   - Isso criará as tabelas necessárias no banco de dados conforme definido no esquema do Prisma.

3. **Inicie o Servidor de Desenvolvimento:**
   - Execute o seguinte comando para iniciar a aplicação:
     
     ```bash
     npm run dev

   - O servidor estará disponível em <http://localhost:3000>.

4. **Inicie o Servidor de Desenvolvimento:**
   - Acesse <http://localhost:3000> no navegador.
     
   - Navegue pela aplicação para garantir que todas as funcionalidades, como cadastro de pizzas, personalização de pedidos e gerenciamento de pedidos, estejam operando corretamente.

## Estrutura do Projeto

A estrutura de diretórios do projeto é organizada da seguinte forma:

  ```bash
  /pizza.delivery
  ├── /app
  │   ├── /page.tsx
  │   └── ...
  ├── /components
  │   ├── /Header.tsx
  │   └── ...
  ├── /hooks
  │   └── ...
  ├── /lib
  │   └── ...
  ├── /prisma
  │   ├── schema.prisma
  │   └── ...
  ├── /public
  │   ├── /images
  │   └── ...
  ├── /styles
  │   ├── globals.css
  │   └── ...
  ├── /utils
  │   └── ...
  ├── package.json
  ├── tsconfig.json
  └── ...
```


Essa organização facilita a manutenção e escalabilidade da aplicação, separando claramente as responsabilidades de cada módulo.

## Licença

Este projeto está licenciado sob a licença MIT.


