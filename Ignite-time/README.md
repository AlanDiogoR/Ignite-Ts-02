# Ignite Time — Timer Pomodoro

Timer pomodoro (React Router, styled-components, react-hook-form, zod). Rotas: `/` (timer) e `/history` (histórico). Os dados ficam no `localStorage` do navegador.

Projeto Vite + React + TypeScript (SPA estática). Guia para rodar em Linux (ex.: VM AWS EC2 Ubuntu).

## Requisitos

- Node.js **20 LTS ou 22 LTS** (validado em 20.19) e npm 9+ — `node -v`
- Para servir com nginx (opcional): `sudo apt install nginx`

## Passo a passo

```bash
npm ci               # instala dependências (usa package-lock.json)
npm run build        # gera a pasta dist/ (estática)
npm run dev          # desenvolvimento -> http://<IP>:5173
npm run preview      # serve o dist/ -> http://<IP>:4173
```

- `dev` e `preview` escutam em `0.0.0.0` (acessíveis de fora da VM). Libere a porta no Security Group.
- Porta/host configuráveis por variável de ambiente: `HOST`, `PORT` (dev), `PREVIEW_PORT` (preview). Ex.: `PREVIEW_PORT=8080 npm run preview`.
- `BASE` define o caminho base do build (padrão `/`). Ex.: `BASE=/ignite-time/ npm run build` para servir em subpasta.
- Se a porta já estiver em uso o Vite falha (`strictPort`) em vez de trocar de porta.

## Teste rápido

```bash
curl -I http://127.0.0.1:4173/     # HTTP/1.1 200 OK
```

## nginx (opcional, recomendado em produção)

Copie o build para o servidor e aponte o nginx para ele:

```bash
sudo mkdir -p /var/www/atv-redes/ignite-time
sudo cp -r dist/. /var/www/atv-redes/ignite-time/
```

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/atv-redes/ignite-time;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Depois: `sudo nginx -t && sudo systemctl reload nginx`.

> As rotas (`/history`) exigem o fallback `try_files ... /index.html` no nginx. A fonte (Google Fonts) é carregada da internet pelo navegador do cliente.
