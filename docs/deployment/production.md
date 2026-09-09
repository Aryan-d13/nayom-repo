# Production Deployment & Infrastructure Topology

This guide details how to deploy the Nayom platform (FastAPI backend, Next.js Operations Console, and Python pipeline workers) into a production Linux server environment.

---

## 1. Production Deployment Topology

```mermaid
graph TD
    User["Operator / Admin Browser"] -->|HTTPS (Port 443)| Nginx["Nginx Reverse Proxy / SSL Termination"]
    
    subgraph HostServer ["Linux Server (Ubuntu 22.04 LTS / 4+ vCPU, 8GB+ RAM)"]
        Nginx -->|Proxy Pass /| NextApp["Next.js Operations Console (Node.js Port 3000)"]
        Nginx -->|Proxy Pass /api & SSE| FastApi["FastAPI Control Plane (Uvicorn Port 8000)"]
        
        FastApi --> ThreadPool["Worker Pool (ThreadPoolExecutor)"]
        ThreadPool --> Scraper["google-maps-scraper Linux Binary"]
        ThreadPool --> MarkCrawl["MarkCrawl HTTP Engine"]
        ThreadPool --> GenDir["generated/<biz_id>/ (Local Codebase Storage)"]
        ThreadPool --> CloudHosts["External Cloud APIs (Vercel, Cloudflare, Resend)"]
    end
```

---

## 2. Infrastructure Requirements

* **Compute**: Minimum 4 vCPUs (Recommended: 8 vCPUs for running 10+ concurrent crawler/Gemini workers).
* **Memory**: Minimum 8 GB RAM (16 GB recommended if enabling Playwright headless Chromium rendering).
* **Disk Storage**: 50 GB+ NVMe SSD (to accommodate crawled DOM dumps, screenshots, and generated Next.js codebases).
* **Operating System**: Ubuntu 22.04 LTS x86_64.
* **Process Supervisor**: `systemd` for managing persistent backend and frontend services.

---

## 3. Step-by-Step Production Deployment

### Step 1: System Provisioning
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-venv python3-pip nodejs npm nginx git certbot python3-certbot-nginx
```

### Step 2: Clone Codebase & Install Dependencies
```bash
sudo useradd -m -s /bin/bash nayom
sudo -u nayom git clone https://github.com/Aryan-d13/nayom-repo.git /home/nayom/app
cd /home/nayom/app

# Python Virtual Environment
sudo -u nayom python3 -m venv venv
sudo -u nayom ./venv/bin/pip install --upgrade pip
sudo -u nayom ./venv/bin/pip install -r requirements.txt

# Download Linux scraper binary
sudo -u nayom ./venv/bin/python scripts/setup_scraper.py
chmod +x google-maps-scraper

# Build Next.js Production Bundle
cd /home/nayom/app/admin
sudo -u nayom npm install
sudo -u nayom npm run build
```

### Step 3: Production Environment File
Create `/home/nayom/app/.env` with strict permissions:
```bash
sudo -u nayom touch /home/nayom/app/.env
chmod 600 /home/nayom/app/.env
```
Populate production API keys (Gemini, Vercel, Resend, etc.).

### Step 4: Systemd Service Configuration

#### 1. FastAPI Control Plane (`/etc/systemd/system/nayom-api.service`):
```ini
[Unit]
Description=Nayom Control Plane FastAPI Service
After=network.target

[Service]
User=nayom
WorkingDirectory=/home/nayom/app
EnvironmentFile=/home/nayom/app/.env
ExecStart=/home/nayom/app/venv/bin/uvicorn api.app:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

#### 2. Next.js Operations Console (`/etc/systemd/system/nayom-admin.service`):
```ini
[Unit]
Description=Nayom Next.js Admin Dashboard
After=network.target

[Service]
User=nayom
WorkingDirectory=/home/nayom/app/admin
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=NEXT_PUBLIC_API_URL=https://nayom.yourdomain.com
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Start and enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nayom-api
sudo systemctl enable --now nayom-admin
```

---

## 4. Nginx Reverse Proxy & SSL Termination

Create `/etc/nginx/sites-available/nayom`:
```nginx
server {
    server_name nayom.yourdomain.com;

    # Operations Console Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Control Plane API & Server-Sent Events (SSE)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Disable buffering for live SSE streaming
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

Enable site and acquire Let's Encrypt SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/nayom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d nayom.yourdomain.com
```
