# --- Backend ---
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend .
EXPOSE 3001
CMD ["node", "index.js"]

# --- Frontend ---
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Final ---
FROM nginx:alpine
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html
COPY --from=backend /app/backend /app/backend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 