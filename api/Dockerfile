FROM node:18-slim

WORKDIR /app

ENV NODE_ENV=production

# Install dependencies first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable \
  && corepack prepare pnpm@9.1.2 --activate \
  && pnpm install --prod --frozen-lockfile

# Copy app source
COPY src ./src

EXPOSE 3000

CMD ["pnpm", "start"]
