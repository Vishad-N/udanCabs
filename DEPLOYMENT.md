# Udan Cabs Deployment Guide

This guide covers deploying the Udan Cabs platform on a Hostinger VPS running Ubuntu, using PM2 for process management and Nginx as a reverse proxy.

## Prerequisites
- A Hostinger VPS running Ubuntu 22.04 or later.
- A registered domain (e.g., `udancabs.com`).
- Node.js (v20+) and npm installed.
- PostgreSQL installed and running (or a managed database).
- PM2 and Nginx installed (`sudo npm i -g pm2`, `sudo apt install nginx`).

---

## 1. Prepare Environment Variables
On your VPS, clone your repository. Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
nano .env
```

Ensure `DATABASE_URL`, `JWT_SECRET`, and Meta API keys are configured correctly.

## 2. Database Migration (Production)
For production, **do not** use `prisma db push`. Instead, deploy your migrations safely to avoid data loss:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

## 3. Build the Applications

### Backend
```bash
cd backend
npm install
npm run build
```

### Frontend (Client)
Ensure `NEXT_PUBLIC_API_URL` points to your production backend URL (e.g., `https://api.udancabs.com/api/v1`).
```bash
cd frontend/client
npm install
npm run build
```

### Frontend (Admin)
Ensure `NEXT_PUBLIC_API_URL` points to your production backend URL.
```bash
cd frontend/admin
npm install
npm run build
```

---

## 4. PM2 Ecosystem Setup
Create an `ecosystem.config.js` file in the project root to manage all three applications:

```javascript
module.exports = {
  apps: [
    {
      name: "udan-backend",
      cwd: "./backend",
      script: "dist/main.js",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "udan-client",
      cwd: "./frontend/client",
      script: "npm",
      args: "start -- -p 3000",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "udan-admin",
      cwd: "./frontend/admin",
      script: "npm",
      args: "start -- -p 3001",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
```

Start the ecosystem:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. Nginx Configuration
Set up Nginx reverse proxy blocks for the main site, the admin panel, and the API.

Create a new file in `/etc/nginx/sites-available/udancabs`:

```nginx
# API Server
server {
    server_name api.udancabs.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Client Frontend
server {
    server_name udancabs.com www.udancabs.com;

    location / {
        proxy_pass http://localhost:3000; # Ensure ports don't conflict with backend, adjust client port in PM2 to 3001 if backend is 3000.
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Frontend
server {
    server_name admin.udancabs.com;

    location / {
        proxy_pass http://localhost:3001; # Or whichever port Admin runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and test Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/udancabs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. SSL Configuration
Secure the domains using Let's Encrypt Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d udancabs.com -d www.udancabs.com -d admin.udancabs.com -d api.udancabs.com
```

## 7. Logging and Monitoring
Monitor live logs via PM2:
```bash
pm2 logs
```

For log rotation, install PM2 Logrotate:
```bash
pm2 install pm2-logrotate
```

Verify backend health by visiting `https://api.udancabs.com/api/v1/health`.
