#!/bin/bash

# INSTALL NGINX
if ! type -P nginx
then
    echo "installing nginx..."
    sudo apt-get install -y nginx
else
    echo "nginx already installed."
fi

rm /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/default <<EOF

server {
  listen 80 default_server;
  listen [::]:80 default_server;

  server_name localhost 127.0.0.1;

  root $BASE_PATH/front-end;

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}

EOF

ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

sudo systemctl restart nginx