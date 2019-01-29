#!/usr/bin/env bash

# APT-GET UPDATE
sudo apt-get update

# INSTALL NODE
if ! type -P node
then
    echo "downloading node..."
    curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    echo "installing node..."
    sudo apt-get install -y nodejs
else
    echo "node already installed."
fi

# INSTALL POSTGRES

# API NPM INSTALL
cd /opt/important_date_reminders/api
npm install