# Mady Semijoias - Sistema de Estoque

Sistema profissional com:

- Node.js
- Express
- MySQL
- Login real com senha criptografada
- Painel administrativo
- Cadastro de clientes
- Upload de imagem dos produtos direto pelo site
- Controle de estoque
- Cliente pode marcar produto como comprado ou para revenda
- Projeto pronto para GitHub

## Como instalar no VS Code

### 1. Abra a pasta no VS Code

Extraia o ZIP e abra a pasta:

```bash
code .
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco

Crie um arquivo `.env` copiando o `.env.example`.

No Windows CMD:

```cmd
copy .env.example .env
```

Depois edite o `.env` com seu usuário e senha do MySQL.

Exemplo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=mady_semijoias
SESSION_SECRET=uma_chave_bem_forte
```

### 4. Importe o banco MySQL

Pelo CMD, dentro da pasta do projeto:

```cmd
mysql -u root -p < database/schema.sql
```

Digite a senha do MySQL.

### 5. Rode o projeto

```bash
npm run dev
```

Abra no navegador:

```text
http://localhost:3000
```

## Login administrador

```text
E-mail: admin@madysemijoias.com
Senha: 123456
```

## Cadastro de clientes

Clientes podem criar conta em:

```text
http://localhost:3000/cadastro
```

## GitHub

Para subir no GitHub:

```bash
git init
git add .
git commit -m "Sistema de estoque Mady Semijoias"
git branch -M main
git remote add origin LINK_DO_SEU_REPOSITORIO
git push -u origin main
```

## Observação importante

A pasta `uploads` guarda as imagens enviadas pelo administrador.
Em hospedagens como Render/Railway, é recomendado usar armazenamento externo para imagens em produção.
