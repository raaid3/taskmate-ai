FROM node:20-alpine AS base

# Prisma needs libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production

# --- builder ---
FROM base AS builder
# turbo + pnpm
RUN npm i -g pnpm@10.14.0 turbo@^2.5.5
COPY . .
# Create pruned workspace for api
RUN turbo prune api --docker

# --- installer ---
FROM base AS installer
# pnpm again in this stage
RUN npm i -g pnpm@10.14.0
WORKDIR /app

# 1) Install deps from pruned lockfiles
#    avoid prisma postinstall here
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# 2) Bring pruned source files
COPY --from=builder /app/out/full/ .

# 3) Build (also runs prisma generate)
RUN pnpm build

# 4) Keep only production deps for the runtime image
RUN pnpm prune --prod

# --- runner ---
FROM base AS runner
WORKDIR /app

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 tmai
USER tmai

# Copy the built app and production node_modules from installer
COPY --chown=tmai:nodejs --from=installer /app ./

# Set up ports (aligns wtih Spaces)
ENV PORT=7860
EXPOSE 7860

# Start the compiled server
CMD ["node", "apps/api/dist/app.js"]
