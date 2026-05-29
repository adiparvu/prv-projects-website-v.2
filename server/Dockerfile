FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
# Catalog from monorepo root when built from repo root:
# docker build -f server/Dockerfile .
COPY data/shop /app/data/shop
ENV CATALOG_PATH=/app/data/shop/catalog.json
ENV DATA_DIR=/app/data/runtime
EXPOSE 8787
CMD ["npm", "start"]
