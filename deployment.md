# Deployment Guide for Hamutea Admin Dashboard

This guide outlines the steps to deploy the Hamutea Admin Dashboard to a production environment.

## Prerequisites

- A server with Ubuntu 20.04 or later
- Domain name pointing to your server
- Node.js 16+ and npm installed
- MySQL 8.0+ installed
- Nginx installed

## Backend Deployment

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd hamutea_fe_v2
```

### 2. Set up environment variables

```bash
cp backend/.env.production backend/.env
```

Edit the `.env` file with your production settings:
- Set a strong JWT secret
- Configure your production database credentials
- Set the CORS origin to your frontend domain

### 3. Install dependencies and build

```bash
cd backend
npm install --production
```

### 4. Set up the database

```bash
mysql -u your_db_user -p < database.sql
```

### 5. Set up PM2 for process management

```bash
npm install -g pm2
pm2 start server.js --name hamutea-backend
pm2 startup
pm2 save
```

## Frontend Deployment

### 1. Set up environment variables

```bash
cp hamutea_fe_v2/.env.production hamutea_fe_v2/.env
```

Edit the `.env` file with your production settings:
- Set the API URL to your backend domain

### 2. Install dependencies and build

```bash
cd hamutea_fe_v2
npm install
npm run build
```

### 3. Copy the build files to your web server directory

```bash
mkdir -p /var/www/hamutea/frontend
cp -r dist/* /var/www/hamutea/frontend/
```

## Nginx Configuration

### 1. Create an Nginx configuration file

```bash
cp backend/nginx.conf.example /etc/nginx/sites-available/hamutea
```

Edit the file with your domain name and SSL certificate paths.

### 2. Enable the site and restart Nginx

```bash
ln -s /etc/nginx/sites-available/hamutea /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3. Set up SSL with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Security Considerations

1. **Firewall**: Configure your firewall to allow only necessary ports (80, 443, SSH)
2. **Database**: Ensure your database is not exposed to the public internet
3. **Regular Updates**: Keep your system and dependencies updated
4. **Backups**: Set up regular backups of your database and files

## Monitoring and Maintenance

1. **Logs**: Check logs regularly with `pm2 logs hamutea-backend`
2. **Updates**: Update dependencies periodically with `npm update`
3. **SSL Renewal**: Let's Encrypt certificates auto-renew, but verify the cron job is working

## Troubleshooting

- Check Nginx error logs: `/var/log/nginx/error.log`
- Check application logs: `pm2 logs hamutea-backend`
- Verify database connection: `mysql -u your_db_user -p -e "USE hamutea_db; SELECT 1;"`