FROM node:22-slim

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

USER node

EXPOSE 4100

HEALTHCHECK --interval=10s --timeout=2s --retries=3 \
CMD node -e "fetch('http://localhost:4100/health').then(r => {if (!r.ok) process.exit(1)}).catch(() => process.exit(1))"

CMD ["node", "server.js"]
