# -------- Frontend Build Stage (Vite/React) --------
FROM node:18-alpine AS build

WORKDIR /app

# 1️⃣ Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 2️⃣ Copy source code and build
COPY . .
RUN npm run build

# -------- Production Stage (Nginx) --------
FROM nginx:alpine

# Copy built static files into nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
