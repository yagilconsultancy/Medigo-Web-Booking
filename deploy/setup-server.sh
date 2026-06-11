#!/bin/bash
# =============================================================
# EC2 Server Setup Script for Medigo Booking (Next.js)
# Run this ONCE on a fresh Ubuntu EC2 instance
# Usage: chmod +x setup-server.sh && ./setup-server.sh
# =============================================================

set -e

echo "=== Updating system packages ==="
sudo apt update && sudo apt upgrade -y

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== Installing PM2 globally ==="
sudo npm install -g pm2

echo "=== Installing Nginx ==="
sudo apt install -y nginx

echo "=== Installing Certbot for SSL ==="
sudo apt install -y certbot python3-certbot-nginx

echo "=== Creating application directory ==="
mkdir -p /home/ubuntu/medigo-booking

echo "=== Setting up PM2 to start on boot ==="
pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "=== Opening firewall ports ==="
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ""
echo "=== Server setup complete! ==="
echo ""
echo "Next steps:"
echo "1. Point your domain DNS A record to this server's public IP"
echo "2. Copy deploy/nginx.conf to /etc/nginx/sites-available/medigo-booking"
echo "   Replace YOUR_DOMAIN.com with your actual domain"
echo "3. Enable the site:"
echo "   sudo ln -s /etc/nginx/sites-available/medigo-booking /etc/nginx/sites-enabled/"
echo "   sudo rm -f /etc/nginx/sites-enabled/default"
echo "   sudo nginx -t && sudo systemctl restart nginx"
echo "4. Get SSL certificate:"
echo "   sudo certbot --nginx -d YOUR_DOMAIN.com"
echo "5. Add GitHub secrets (see deploy instructions)"
echo "6. Push to main branch to trigger deployment"
