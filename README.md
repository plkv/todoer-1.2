# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7c26757b-8388-489c-b5d0-5b2a98daf7c2

## Быстрый старт через Docker Compose

```sh
# 1. Собери и запусти всё локально:
docker-compose up --build
# Фронт доступен на http://localhost:8080
# Бэк — на http://localhost:3001
```

## Продакшен деплой
- **Frontend**: подключи репозиторий к Vercel (https://vercel.com/import)
- **Backend**: подключи репозиторий к Render (https://dashboard.render.com/)
- Оба сервиса поддерживают zero-config деплой через GitHub интеграцию

## Как можно редактировать этот код?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7c26757b-8388-489c-b5d0-5b2a98daf7c2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7c26757b-8388-489c-b5d0-5b2a98daf7c2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Архитектура

- Frontend: React, Vite, TypeScript, TailwindCSS, shadcn/ui
- Backend: Node.js, Express, PostgreSQL
- State management: React Context, React Query, localStorage
- UI: централизованные компоненты, дизайн-система

## Деплой

1. Настройте .env на основе .env.example
2. Соберите проект: `npm run build`
3. Запустите backend: `cd backend && npm install && npm run dev`
4. Для Docker: `docker build -t todoer . && docker run -p 8080:80 todoer`

## Health-check

GET /health (backend)

## Как отправить баг-репорт

1. Скопируйте шаблон из BUG_REPORT_TEMPLATE.md
2. Заполните и отправьте в Issues или на почту команды

## Как оставить обратную связь

1. Скопируйте шаблон из USER_FEEDBACK_TEMPLATE.md
2. Заполните и отправьте в Issues или на почту команды
