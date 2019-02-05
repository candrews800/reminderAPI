#!/bin/bash

source ../app.conf

## INSTALL POSTGRES
if ! type -P psql
then
    echo "installing postgres..."
    sudo apt install -y postgresql
else
    echo "postgres already installed."
fi

sudo -i -u postgres psql -c "CREATE USER $PG_USER WITH PASSWORD '$PG_PW';"
sudo -i -u postgres psql -c "CREATE DATABASE important_date_reminder;"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE important_date_reminder TO important_date_reminder;"