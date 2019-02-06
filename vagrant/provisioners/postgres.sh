#!/bin/bash

## INSTALL POSTGRES
if ! type -P psql
then
    echo "installing postgres..."
    sudo apt install -y postgresql
else
    echo "postgres already installed."
fi

sudo -i -u postgres psql -c "CREATE USER $PG_USER WITH PASSWORD '$PG_PW';"
sudo -i -u postgres psql -c "CREATE DATABASE $PG_DB;"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $PG_DB TO $PG_USER;"