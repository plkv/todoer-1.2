# Архитектура Todoer

```mermaid
graph TD
  A[Frontend (React, Vite)] -- REST API --> B[Backend (Node.js, Express)]
  B -- DB --> C[(PostgreSQL)]
  A -- Auth Cookies --> B
```

- Frontend: React, Vite, TypeScript, TailwindCSS, shadcn/ui
- Backend: Node.js, Express, PostgreSQL
- State management: React Context, React Query, localStorage
- UI: централизованные компоненты, дизайн-система 