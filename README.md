---
title: ExpressJS Prisma
description: An ExpressJS server that uses Prisma to connect to a PostgreSQL database
tags:
  - express
  - postgresql
  - prisma
  - typescript
---

## ✨ Features

- Prisma
- Express
- Postgres
- TypeScript

## 📝 Notes

This is a simple REST API for todo items. The available routes are

- `GET /todos` gets all todos
- `POST /todos` creates a new using `text` in the JSON body
- `GET /todos/:id` gets a todo by id
- `PUT /todos/:id` updates a todo by id
- `DELETE /todos/:id` deletes a todo by id

## RESPONSABILIDADES

- `index` responsabilidade de fazer...
- `express` responsabilidade de fazer...
- `database` responsabilidade de fazer...
- `routes` responsabilidade de fazer...
- `constroller` responsabilidade de fazer...
- `service` responsabilidade de fazer...
- `middleware` responsabilidade de fazer...
- `lib` bibliotecas extras para utilidades...
- `env` responsabilidade de fazer...
- `package.json` responsabilidade de fazer...

## COMANDOS

npx prisma db push = esquema Prisma -> banco de dados

npx prisma db pull = banco de dados -> modelo esquema Prisma.

npx prisma generate = gera o Prisma Client com base nos schema.
