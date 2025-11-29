# RatePro Deployment Guide

This guide provides step-by-step instructions for deploying the RatePro pricing calculator application using Docker Compose.

---

## Prerequisites

Before deploying, ensure you have the following installed on your server:

- **Git** (v2.30+)
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)

### Verify Prerequisites

```bash
# Check Git version
git --version

# Check Docker version
docker --version

# Check Docker Compose version
docker compose version
```

---

## Quick Start Deployment

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/rshewade/rate_pro.git

# Navigate to project directory
cd rate_pro/repo
```

### Step 2: Build and Start Services

```bash
# Build and start all services in detached mode
docker compose up -d --build
```

### Step 3: Verify Deployment

```bash
# Check running containers
docker compose ps

# View logs
docker compose logs -f
```

### Step 4: Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| Frontend (Dev) | http://localhost:3000 | Development server |
| Frontend (Prod) | http://localhost:80 | Production (nginx) |
| API Server | http://localhost:3001 | JSON Server API |

---

## Detailed Deployment Steps

### 1. Clone Repository

```bash
# Clone via HTTPS
git clone https://github.com/rshewade/rate_pro.git

# OR clone via SSH (if configured)
git clone git@github.com:rshewade/rate_pro.git

# Navigate to the project
cd rate_pro/repo
```

### 2. Review Configuration

#### Environment Variables (Optional)

Create a `.env` file for custom configuration:

```bash
# .env
VITE_API_URL=http://localhost:3001
NODE_ENV=production
```

#### Docker Compose Configuration

The `docker-compose.yml` file defines two services:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DOCKER_ENV=true
    depends_on:
      - api
    networks:
      - ratepro-network

  api:
    image: node:20-alpine
    working_dir: /app
    command: npx json-server --watch db.json --port 3001 --host 0.0.0.0
    ports:
      - "3001:3001"
    volumes:
      - ./db.json:/app/db.json
    networks:
      - ratepro-network

networks:
  ratepro-network:
    driver: bridge
```

### 3. Build Docker Images

```bash
# Build all images
docker compose build

# Build specific service
docker compose build frontend
docker compose build api
```

### 4. Start Services

```bash
# Start all services (foreground)
docker compose up

# Start all services (background/detached)
docker compose up -d

# Start specific service
docker compose up -d frontend
```

### 5. Verify Deployment

```bash
# Check container status
docker compose ps

# Expected output:
# NAME                COMMAND             STATUS          PORTS
# ratepro-frontend    "npm run dev"       Up              0.0.0.0:3000->3000/tcp
# ratepro-api         "json-server..."    Up              0.0.0.0:3001->3001/tcp

# Check container health
docker compose logs frontend
docker compose logs api

# Test API endpoint
curl http://localhost:3001/services
```

---

## Docker Configuration Files

### Dockerfile.dev (Development Frontend)

The `Dockerfile.dev` in the project root runs the Vite dev server:

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port for Vite dev server
EXPOSE 3000

# Start Vite dev server (API runs in separate container)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### docker-compose.yml (Development)

The `docker-compose.yml` file runs both frontend and API:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: ratepro-frontend
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DOCKER_ENV=true
      - CHOKIDAR_USEPOLLING=true
    depends_on:
      - api
    networks:
      - ratepro-network

  api:
    image: node:20-alpine
    working_dir: /app
    command: npx json-server --watch db.json --port 3001 --host 0.0.0.0
    container_name: ratepro-api
    ports:
      - "3001:3001"
    volumes:
      - ./db.json:/app/db.json
    networks:
      - ratepro-network

networks:
  ratepro-network:
    driver: bridge
```

---

## Production Deployment

### Option 1: Production Build with Nginx

Create `Dockerfile.prod` for production:

```dockerfile
# Dockerfile.prod
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://api:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Update `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: ratepro-frontend
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - ratepro-network
    restart: always

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: ratepro-api
    ports:
      - "3001:3001"
    volumes:
      - ratepro-data:/app
    networks:
      - ratepro-network
    restart: always

networks:
  ratepro-network:
    driver: bridge

volumes:
  ratepro-data:
```

Deploy production:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Common Operations

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f api

# Last 100 lines
docker compose logs --tail=100
```

### Stop Services

```bash
# Stop all services
docker compose stop

# Stop specific service
docker compose stop frontend
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart api
```

### Remove Services

```bash
# Stop and remove containers
docker compose down

# Stop, remove containers, and remove volumes
docker compose down -v

# Stop, remove containers, and remove images
docker compose down --rmi all
```

### Update Application

```bash
# Pull latest changes
git pull origin master

# Rebuild and restart
docker compose up -d --build
```

### Access Container Shell

```bash
# Frontend container
docker compose exec frontend sh

# API container
docker compose exec api sh
```

### Database Backup

```bash
# Backup db.json
docker compose exec api cat /app/db.json > backup-$(date +%Y%m%d).json

# Restore db.json
docker cp backup.json ratepro-api:/app/db.json
docker compose restart api
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker compose logs frontend
docker compose logs api

# Check container status
docker compose ps -a

# Rebuild without cache
docker compose build --no-cache
docker compose up -d
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process or change port in docker-compose.yml
```

### API Connection Failed

```bash
# Verify API is running
curl http://localhost:3001/services

# Check network connectivity
docker network ls
docker network inspect ratepro-network

# Verify frontend can reach API
docker compose exec frontend ping api
```

### Database Not Persisting

Ensure volume is mounted correctly in `docker-compose.yml`:

```yaml
volumes:
  - ./db.json:/app/db.json
```

### Out of Disk Space

```bash
# Remove unused Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## Health Checks

Add health checks to `docker-compose.yml`:

```yaml
services:
  frontend:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  api:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/services"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

Check health status:

```bash
docker compose ps
# Shows health status in STATUS column
```

---

## Security Considerations

### For Production

1. **Use HTTPS**: Configure SSL/TLS with Let's Encrypt or your certificate
2. **Secure Headers**: Add security headers in nginx configuration
3. **Environment Variables**: Never commit sensitive data; use `.env` files
4. **Network Isolation**: Use Docker networks to isolate services
5. **Resource Limits**: Set memory and CPU limits in docker-compose

Example resource limits:

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Git installed and configured
- [ ] Docker and Docker Compose installed
- [ ] Ports 3000 (dev) or 80 (prod) and 3001 available
- [ ] Sufficient disk space (minimum 2GB)
- [ ] Network access to GitHub

### Deployment
- [ ] Repository cloned successfully
- [ ] Docker images built without errors
- [ ] Containers started and running
- [ ] Frontend accessible at http://localhost:3000 (dev) or http://localhost:80 (prod)
- [ ] API accessible at http://localhost:3001

### Post-Deployment
- [ ] Application loads correctly
- [ ] Calculator functionality works
- [ ] Quotes can be created and saved
- [ ] Admin panel accessible
- [ ] PDF export works
- [ ] Logs show no errors

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/rshewade/rate_pro/issues
- Documentation: See `MANUAL_TESTING_GUIDE.md` for testing procedures

---

**Last Updated:** November 29, 2025
