FROM node:18-alpine AS base

# Instalar dependências necessárias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Construir a aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variáveis de ambiente para a build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Configurar a imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configurar permissões adequadas
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar o aplicativo compilado
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expor a porta necessária
EXPOSE 3000

# Definir variáveis de ambiente em tempo de execução
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar o aplicativo
CMD ["node", "server.js"]